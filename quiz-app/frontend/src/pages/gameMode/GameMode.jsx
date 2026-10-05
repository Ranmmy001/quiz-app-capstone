import Scoreboard from "../../components/scoreboard/Scoreboard"
import "./gameMode.css"
import { useState, useEffect, useRef } from "react"
import localforage from "localforage"
import Cookie from "js-cookie"
import Error404 from "../../components/error404/Error404"
import { useNavigate } from "react-router-dom"
import bcrypt from "bcryptjs-react";
import mainTheme from "../../audios/mainTheme.mp3"
import correctAnswer from "../../audios/correctAnswer.mp3"
import wrongAnswer from "../../audios/wrongAnswer.mp3"
import Cookies from "js-cookie"
import firstYouAreRight from '../../../public/firstYouAreRight.png'


import FireworksComponent from '../../components/fireworksComponent/FireworksComponent'


const mainThemeAudio = new Audio(mainTheme)
const correctAnswerAudio = new Audio(correctAnswer)
const wrongAnswerAudio = new Audio(wrongAnswer)
const GameMode = () => {
    // const audio = new Audio(main)
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
    const [gameModeActive, setGamemodeActive] = useState(false)
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [isAudioNotificationVisible, setIsAudioNotificationVisible] = useState(true);
    const [finalQuestionModal, setFinalQuestionModal] = useState({
        modal: false,
        option: ""
    })
    const [youAreRightImage, setYouAreRightImage] = useState(false)
    const [youAreWrong, setYouAreWrong] = useState({
        youAreWrongState: false,
        rightOption: ""
    })
    const [isOptionRight, setIsOptionRight] = useState(false)
    const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false)

    const navigate = useNavigate()


    const showModal = (optionPicked, rightOption, remainingOptionsArray) => {
        // console.log(remainingOptionsArray)
        // console.log(optionPicked)
        setFinalQuestionModal({
            modal: true,
            option: optionPicked
        })

        bcrypt.compare(optionPicked, rightOption).then((compareOption) => {
            // console.log(compareOption)
            if(compareOption){
                setIsOptionRight(true)
            }else{
                setIsOptionRight(false)
                // Iterate over each item in remainingOptionsArray
                for (let option of remainingOptionsArray) {
                    // Compare the current option with the rightOption
                    bcrypt.compare(option, rightOption).then((compareResult) => {
                        if (compareResult) {
                            // console.log(compareResult)
                            handleRightOptionFound(option);
                        }
                            
                    })
                }
            }

        })
        
    }

    const handleRightOptionFound = (option) => {
        setYouAreWrong({
            youAreWrongState: false,
            rightOption: option
        });
    }
    // useEffect(() => {
    // }, [youAreWrong]);

    const checkOption = async() => {
        if(isOptionRight){
            setFinalQuestionModal({
                modal: false,
                option: ""
            })
            mainThemeAudio.pause()
            mainThemeAudio.currentTime = 0
            correctAnswerAudio.play()
            setYouAreRightImage(true)
            const questions = await localforage.getItem("questions")
            questions.shift()
            await localforage.setItem("questions", questions)





            setTimeout(() => {
                setYouAreRightImage(false)
                setQuestions(questions)
                correctAnswerAudio.pause()
                correctAnswerAudio.currentTime = 0
                mainThemeAudio.play()
                mainThemeAudio.loop = true
                
            }, 8000);

        }else{
            const obj = {
                gameModeState: "active",
                identity: youAreWrong.rightOption
            }
            await localforage.setItem("gamemode_state", obj);
            setFinalQuestionModal({
                modal: false,
                option: ""
            })

            mainThemeAudio.pause()
            mainThemeAudio.currentTime = 0
            wrongAnswerAudio.play()
            wrongAnswerAudio.loop = true
            setYouAreWrong({
                youAreWrongState: true,
                // rightOption: 
            })
        }

    }
    const handleIsAudioNotificationVisible = () => {
        setIsAudioNotificationVisible(false)
        if (!mainThemeAudio.paused) {
            // Audio is already playing, no need to play it again
            return;
        }
        mainThemeAudio.play();
        mainThemeAudio.loop = true;
    }





    const handleExitGame = async() => {
        try{
            const clear_questions = await localforage.clear()
            const clear_game_token = Cookies.remove("gameModeToken");
            const clear_animation = Cookies.remove("has_animation_happened");

            // if(clear_questions && clear_game_token){
                wrongAnswerAudio.pause()
                wrongAnswerAudio.currentTime = 0
                navigate("/", {
                    replace: true
                })
                location.reload()
            // }
        }catch(error){
            console.log(error)
        }
    }

    

    useEffect(()=> {
        //function to check if the admin is logged in before displaying the page
        localforage.getItem("user_email").then((feedback) => {
            if (feedback && Cookie.get('authToken')){
                setIsAdminLoggedIn(true)
            } else {
                setIsAdminLoggedIn(false)
            }
        })

        //function to check if a user is currently in gamemode before displaying the page
        const get_token = Cookie.get('gameModeToken')
        if(get_token){
            setGamemodeActive(true)
        } else {
            setGamemodeActive(false)
            // navigate("/", {
            //     replace: true
            // })
        }

        // Retrieve questions from localforage
        localforage.getItem("questions").then((storedQuestions) => {
            if (storedQuestions && storedQuestions.length > 0) {
                const get_cookies = Cookies.get("has_animation_happened")
                if(get_cookies){
                    setQuestions(storedQuestions);
                    setCurrentQuestion(storedQuestions[0]);
                }else{
                    if(window.innerWidth > 767){
                        setTimeout(()=> {
                            setQuestions(storedQuestions);
                            setCurrentQuestion(storedQuestions[0]);
                        }, 9000)
                    }else{
                        setQuestions(storedQuestions);
                        setCurrentQuestion(storedQuestions[0]);
                    }
                }
                // Set the questions state
                // Set the currentQuestion state to the first question
            } else if(storedQuestions && storedQuestions.length == 0){
                //user has answered all questions
                setAllQuestionsAnswered(true)
                
            } else {
                // Handle case where no questions are found
                // For example, display an error message or redirect
                handleExitGame()
            }
        });

        //function to check if the user failed a question
        localforage.getItem("gamemode_state").then(feedback => {
            // console.log(feedback)
            if(feedback){
                //display the failed question modal
                mainThemeAudio.pause()
                mainThemeAudio.currentTime = 0
                wrongAnswerAudio.play()
                setYouAreWrong({
                    youAreWrongState: true,
                    rightOption: feedback.identity
                })
            }
        });
    }, [questions])
    const prizeMoneyArray = [
        '$100', '$200', '$300', '$500', '$1,000', '$2,000', '$4,000', '$8,000', 
        '$16,000', '$32,000', '$64,000', '$125,000', '$250,000', '$500,000', '$1,000,000'
    ]
 
    return (
        <div>

            {
                isAdminLoggedIn | !gameModeActive ? (
                    <Error404 />
                ) :  
                (
                    isAudioNotificationVisible ? 
                    <div className="body-wrapper">
                        <div className="game-box">
                            <div className="notification-wrapper">
                                <p>This website uses audio. please adjust your volume accordingly</p>
                                <button className="notification-wrapper-button btn btn-primary" onClick={handleIsAudioNotificationVisible}>Continue</button>
                            </div>
                        </div>

                    </div>
                :
                (<div className="body-wrapper">
                    <div className="game-box">
                        <p className="title">
                            <span className="up">WHO</span>
                            <span className="down">WANTS</span> 
                            <span className="up">TO</span> 
                            <span className="down">BE</span> 
                            <span className="up">A </span>
                            <span>MILLIONAIRE</span>
                        </p>
                      
                        <div className="main-cover">
                            <div className="body">
                                <div className="body-cover">
                                    <div className="question-box" style={{...(youAreRightImage && {background: "#0e093f"})}}>
                                        {youAreRightImage ? <div className="you-are-right-container">
                                                                <img className="you-are-right-image" src={firstYouAreRight} alt="you are right image" />
                                                                <div className="you-are-right-text-wrapper">
                                                                    <h1 style={{ animation: "fadeScale 8s ease-in-out, glow 3s infinite", color: "#4CAF50",}}>You are right</h1>
                                                                    <p style={{ animation: "fadeScale 8s ease-in-out, bounce 2s infinite",color: "#FF9800",}}>Get ready for the next question</p>
                                                                </div>
                                                            </div>
                                        :   (youAreWrong.youAreWrongState ? 
                                                <div className="you-are-wrong-wrapper">
                                                    <p>Sorry, that was not the correct answer. <br />
                                                    The correct answer is <span>{youAreWrong.rightOption}</span></p>
                                                    <div className="you-are-wrong-button-wrapper">
                                                        <button style={{color: "red"}} onClick={handleExitGame}>Exit Game</button>
                                                        <button>Report Question</button>
                                                        <p style={{textAlign: "center"}}>You are leaving with <span style={{color: "orange"}}>{prizeMoneyArray[currentQuestion.index]}</span></p>
                                                    </div>

                                                </div>
                                            :
                                            <div style={{width: "100%", height: "100%", padding: "20px"}}>
                                                <p>{currentQuestion && <span>{Math.abs(currentQuestion.index - 15)}.&nbsp;</span>}{currentQuestion? currentQuestion.question : ""}</p>
                                            </div>
                                        )
                                        }

                                        {finalQuestionModal.modal ? 
                                            <div className="final-answer-modal-wrapper">
                                                <div className="final-answer-modal">
                                                    {finalQuestionModal.option}.
                                                    <p>Is that your final answer?</p>
                                                    <div className="final-answer-button-wrapper">
                                                        <button className="final-answer-button" onClick={checkOption}>Yes</button>
                                                        <button className="final-answer-button" onClick={() => setFinalQuestionModal({modal: false, option: ""})}>No</button>
                                                    </div>
                                                </div> 
                                            </div>
                                        : null}
                                    </div>
                                    <div className="option-box">
                                        <div className="first-option">
                                            {currentQuestion ? currentQuestion.options.slice(0, 2).map((option, index) => {
                                                const remainingOptions = currentQuestion.options.filter((opt, idx) => idx !== index);
                                                return (
                                                    <button key={index} 
                                                        className={finalQuestionModal.modal || youAreRightImage || youAreWrong.youAreWrongState ? " option null" : "option"} 
                                                        disabled={finalQuestionModal.modal || youAreRightImage || youAreWrong.youAreWrongState} 
                                                        onClick={() => {showModal(option, currentQuestion.rightOption, remainingOptions)}} 
                                                        style={!finalQuestionModal.modal && youAreWrong.youAreWrongState && youAreWrong.rightOption == option ? {animationName: "correct-answer-blink", animationDuration: ".8s", animationIterationCount: "infinite"} : (finalQuestionModal.option == option ? {backgroundColor: "orange"} : null)}
                                                    >
                                                        {String.fromCharCode(65 + index)}: {option}
                                                    </button>
                                                );
                                            }) :    <div><button className="option" style={{marginBottom: "10px"}}></button> <button className="option"></button></div>}
                                        </div>

                                        <div className="first-option">
                                            {currentQuestion ? currentQuestion.options.slice(2).map((option, index) => {
                                                const remainingOptions = currentQuestion.options.filter((opt, idx) => idx !== index);
                                                return (
                                                    <button key={index} 
                                                        className={finalQuestionModal.modal || youAreRightImage || youAreWrong.youAreWrongState ? "option null" : "option"}  
                                                        disabled={finalQuestionModal.modal || youAreRightImage || youAreWrong.youAreWrongState} 
                                                        onClick={() => showModal(option, currentQuestion.rightOption, remainingOptions)} 
                                                        style={!finalQuestionModal.modal && youAreWrong.youAreWrongState && youAreWrong.rightOption == option ? {animationName: "correct-answer-blink", animationDuration: ".8s", animationIterationCount: "infinite"} : (finalQuestionModal.option == option ? {backgroundColor: "orange"} : null)}>
                                                        {String.fromCharCode(67 + index)}: {option}
                                                    </button>
                                                );
                                            }) :   <div><button className="option" style={{marginBottom: "10px"}}></button> <button className="option"></button></div>}
                                        </div>
                                    </div>
                                    {/* <div style={{color: "white",    height: "auto", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                    <p>Developed by Henry Okiyi</p>
                                    </div> */}
                                </div>
                                <div className="scoreboard-cover-div">
                                    <Scoreboard currentQuestion={currentQuestion}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)

            )}
        </div>
    );
}

export default GameMode;




































// import Scoreboard from "../../components/scoreboard/Scoreboard"
// import "./gameMode.css"
// import { useState, useEffect } from "react"
// import localforage from "localforage"
// import Cookie from "js-cookie"
// import Error404 from "../../components/error404/Error404"
// import { useNavigate } from "react-router-dom"
// import bcrypt from "bcryptjs-react";
// import mainTheme from "../../audios/mainTheme.mp3"
// import correctAnswer from "../../audios/correctAnswer.mp3"
// import wrongAnswer from "../../audios/wrongAnswer.mp3"
// import Cookies from "js-cookie"

// const mainThemeAudio = new Audio(mainTheme)
// const correctAnswerAudio = new Audio(correctAnswer)
// const wrongAnswerAudio = new Audio(wrongAnswer)
// const GameMode = () => {
//     // const audio = new Audio(main)
//     const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
//     const [gameModeActive, setGamemodeActive] = useState(false)
//     const [questions, setQuestions] = useState([]);
//     const [currentQuestion, setCurrentQuestion] = useState(null);
//     const [isAudioNotificationVisible, setIsAudioNotificationVisible] = useState(true);
//     const [finalQuestionModal, setFinalQuestionModal] = useState({
//         modal: false,
//         option: ""
//     })
//     const [youAreRightImage, setYouAreRightImage] = useState(false)
//     const [youAreWrong, setYouAreWrong] = useState({
//         youAreWrongState: false,
//         rightOption: ""
//     })
//     const [isOptionRight, setIsOptionRight] = useState(false)

//     const navigate = useNavigate()


//     const showModal = (optionPicked, rightOption, remainingOptionsArray) => {
//         // console.log(remainingOptionsArray)
//         // console.log(optionPicked)
//         setFinalQuestionModal({
//             modal: true,
//             option: optionPicked
//         })

//         bcrypt.compare(optionPicked, rightOption).then((compareOption) => {
//             // console.log(compareOption)
//             if(compareOption){
//                 setIsOptionRight(true)
//             }else{
//                 setIsOptionRight(false)
//                 // Iterate over each item in remainingOptionsArray
//                 for (let option of remainingOptionsArray) {
//                     // Compare the current option with the rightOption
//                     bcrypt.compare(option, rightOption).then((compareResult) => {
//                         if (compareResult) {
//                             // console.log(compareResult)
//                             handleRightOptionFound(option);
//                         }
                            
//                     })
//                 }
//             }

//         })
        
//     }

//     const handleRightOptionFound = (option) => {
//         setYouAreWrong({
//             youAreWrongState: false,
//             rightOption: option
//         });
//     }
//     // useEffect(() => {
//     // }, [youAreWrong]);

//     const checkOption = async() => {
//         if(isOptionRight){
//             setFinalQuestionModal({
//                 modal: false,
//                 option: ""
//             })
//             mainThemeAudio.pause()
//             mainThemeAudio.currentTime = 0
//             correctAnswerAudio.play()
//             setYouAreRightImage(true)
//             const questions = await localforage.getItem("questions")
//             questions.shift()
//             await localforage.setItem("questions", questions)





//             setTimeout(() => {
//                 setYouAreRightImage(false)
//                 setQuestions(questions)
//                 correctAnswerAudio.pause()
//                 correctAnswerAudio.currentTime = 0
//                 mainThemeAudio.play()
//                 mainThemeAudio.loop = true
                
//             }, 8000);

//         }else{
//             const obj = {
//                 gameModeState: "active",
//                 identity: youAreWrong.rightOption
//             }
//             await localforage.setItem("gamemode_state", obj);
//             setFinalQuestionModal({
//                 modal: false,
//                 option: ""
//             })

//             mainThemeAudio.pause()
//             mainThemeAudio.currentTime = 0
//             wrongAnswerAudio.play()
//             wrongAnswerAudio.loop = true
//             setYouAreWrong({
//                 youAreWrongState: true
//             })
//         }

//     }
//     const handleIsAudioNotificationVisible = () => {
//         setIsAudioNotificationVisible(false)
//         if (!mainThemeAudio.paused) {
//             // Audio is already playing, no need to play it again
//             return;
//         }
//         mainThemeAudio.play();
//         mainThemeAudio.loop = true;
//     }





//     const handleExitGame = async() => {
//         try{
//             const clear_questions = await localforage.clear()
//             const clear_game_token = Cookies.remove("gamemode_token");
//             const clear_animation = Cookies.remove("has_animation_happened");

//             // if(clear_questions && clear_game_token){
//                 wrongAnswerAudio.pause()
//                 wrongAnswerAudio.currentTime = 0
//                 navigate("/", {
//                     replace: true
//                 })
//             // }
//         }catch(error){
//             console.log(error)
//         }
//     }

    

//     useEffect(()=> {
//         //function to check if the admin is logged in before displaying the page
//         localforage.getItem("user_email").then((feedback) => {
//             if (feedback && Cookie.get(import.meta.env.VITE_TOKEN_NAME)){
//                 setIsAdminLoggedIn(true)
//             } else {
//                 setIsAdminLoggedIn(false)
//             }
//         })

//         //function to check if a user is currently in gamemode before displaying the page
//         const get_token = Cookie.get(import.meta.env.VITE_GAMEMODE_TOKEN)
//         if(get_token){
//             setGamemodeActive(true)
//         } else {
//             setGamemodeActive(false)
//             navigate("/", {
//                 replace: true
//             })
//         }

//         // Retrieve questions from localforage
//         localforage.getItem("questions").then((storedQuestions) => {
//             if (storedQuestions && storedQuestions.length > 0) {
//                 const get_cookies = Cookies.get("has_animation_happened")
//                 if(get_cookies){
//                     setQuestions(storedQuestions);
//                     setCurrentQuestion(storedQuestions[0]);
//                 }else{
//                     setTimeout(()=> {
//                         setQuestions(storedQuestions);
//                         setCurrentQuestion(storedQuestions[0]);
//                     }, 9000)
//                 }
//                 // Set the questions state
//                 // Set the currentQuestion state to the first question
//             } else {
//                 // Handle case where no questions are found
//                 // For example, display an error message or redirect
//             }
//         });

//         //function to check if the user failed a question
//         localforage.getItem("gamemode_state").then(feedback => {
//             // console.log(feedback.identity)
//             if(feedback){
//                 //display the failed question modal
//                 mainThemeAudio.pause()
//                 mainThemeAudio.currentTime = 0
//                 wrongAnswerAudio.play()
//                 setYouAreWrong({
//                     youAreWrongState: true,
//                     rightOption: feedback.identity
//                 })
//             }
//         });





//     }, [questions])

//     return (
//         <div>
//             {isAdminLoggedIn | !gameModeActive ? (
//                 <Error404 />
//             ) : (
//                 isAudioNotificationVisible ? 
//                     <div className="body-wrapper">
//                         <div className="game-box">
//                             <div className="notification-wrapper">
//                                 <p>This website uses audio. please adjust your volume accordingly</p>
//                                 <button className="notification-wrapper-button btn btn-primary" onClick={handleIsAudioNotificationVisible}>Continue</button>
//                             </div>
//                         </div>

//                     </div>
//                 :
//                 (<div className="body-wrapper">
//                     <div className="game-box">
//                         <p className="title">
//                             <span className="up">WHO</span>
//                             <span className="down">WANTS</span> 
//                             <span className="up">TO</span> 
//                             <span className="down">BE</span> 
//                             <span className="up">A </span>
//                             <span>MILLIONAIRE</span>
//                         </p>
//                         <div className="main-cover">
//                             <div className="body">
//                                 <div className="body-cover">
//                                     <div className="question-box">
//                                         {youAreRightImage ? <img width="100%" height="100%" src="data:image/jpeg;base64,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" /> 
//                                         :   (youAreWrong.youAreWrongState ? 
//                                                 <div className="you-are-wrong-wrapper">
//                                                     <p>Sorry, that was not the correct answer. <br />
//                                                     The correct answer is <span>{youAreWrong.rightOption}</span></p>
//                                                     <div className="you-are-wrong-button-wrapper">
//                                                         <button style={{color: "red"}} onClick={handleExitGame}>Exit Game</button>
//                                                         <button>Report Question</button>
//                                                     </div>
//                                                     <p style={{textAlign: "center"}}>You are leaving with <span style={{color: "orange"}}>$300</span></p>

//                                                 </div>
//                                             :
//                                             <div style={{width: "100%", height: "100%", padding: "20px"}}>
//                                                 <p>{currentQuestion? currentQuestion.question : ""}</p>
//                                             </div>
//                                         )
//                                         }

//                                         {finalQuestionModal.modal ? 
//                                             <div className="final-answer-modal-wrapper">
//                                                 <div className="final-answer-modal">
//                                                     {finalQuestionModal.option}.
//                                                     <p>Is that your final answer?</p>
//                                                     <div className="final-answer-button-wrapper">
//                                                         <button className="final-answer-button" onClick={checkOption}>Yes</button>
//                                                         <button className="final-answer-button" onClick={() => setFinalQuestionModal({modal: false, option: ""})}>No</button>
//                                                     </div>
//                                                 </div> 
//                                             </div>
//                                         : null}
//                                     </div>
//                                     <div className="option-box">
//                                         <div className="first-option">
//                                             {currentQuestion ? currentQuestion.options.slice(0, 2).map((option, index) => {
//                                                 const remainingOptions = currentQuestion.options.filter((opt, idx) => idx !== index);
//                                                 return (
//                                                     <button key={index} 
//                                                         className={finalQuestionModal.modal || youAreRightImage || youAreWrong.youAreWrongState ? " option null" : "option"} 
//                                                         disabled={finalQuestionModal.modal || youAreRightImage || youAreWrong.youAreWrongState} 
//                                                         onClick={() => {showModal(option, currentQuestion.rightOption, remainingOptions)}} 
//                                                         style={!finalQuestionModal.modal && youAreWrong.youAreWrongState && youAreWrong.rightOption == option ? {animationName: "correct-answer-blink", animationDuration: ".8s", animationIterationCount: "infinite"} : (finalQuestionModal.option == option ? {backgroundColor: "orange"} : null)}
//                                                     >
//                                                         {String.fromCharCode(65 + index)}: {option}
//                                                     </button>
//                                                 );
//                                             }) :    <div><button className="option" style={{marginBottom: "10px"}}></button> <button className="option"></button></div>}
//                                         </div>

//                                         <div className="first-option">
//                                             {currentQuestion ? currentQuestion.options.slice(2).map((option, index) => {
//                                                 const remainingOptions = currentQuestion.options.filter((opt, idx) => idx !== index);
//                                                 return (
//                                                     <button key={index} 
//                                                         className={finalQuestionModal.modal || youAreRightImage || youAreWrong.youAreWrongState ? "option null" : "option"}  
//                                                         disabled={finalQuestionModal.modal || youAreRightImage || youAreWrong.youAreWrongState} 
//                                                         onClick={() => showModal(option, currentQuestion.rightOption, remainingOptions)} 
//                                                         style={!finalQuestionModal.modal && youAreWrong.youAreWrongState && youAreWrong.rightOption == option ? {animationName: "correct-answer-blink", animationDuration: ".8s", animationIterationCount: "infinite"} : (finalQuestionModal.option == option ? {backgroundColor: "orange"} : null)}>
//                                                         {String.fromCharCode(67 + index)}: {option}
//                                                     </button>
//                                                 );
//                                             }) :   <div><button className="option" style={{marginBottom: "10px"}}></button> <button className="option"></button></div>}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="scoreboard-cover-div">
//                                     <Scoreboard />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>)

//             )}
//         </div>
//     );
// }

// export default GameMode;























// import Scoreboard from "../../components/scoreboard/Scoreboard"
// import "./gameMode.css"
// import { Telephone } from "react-bootstrap-icons"
// import { People } from "react-bootstrap-icons"
// import { useState, useEffect } from "react"
// import localforage from "localforage"
// import Cookie from "js-cookie"
// import Error404 from "../../components/error404/Error404"
// import { useNavigate } from "react-router-dom"


// const GameMode = () => {
//     const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
//     const [gameModeActive, setGamemodeActive] = useState(false)
//     const [questions, setQuestions] = useState([]);
//     const [currentQuestion, setCurrentQuestion] = useState(null);




//     const navigate = useNavigate()




//     const displayQuestionOnPage = () => {
//         console.log(currentQuestion)

//     }

//     useEffect(()=> {
//         //function to check if the admin is logged in before displaying the page
//         localforage.getItem("user_email").then((feedback) => {
//             if (feedback && Cookie.get(import.meta.env.VITE_TOKEN_NAME)){
//                 setIsAdminLoggedIn(true)
//             }else{
//                 setIsAdminLoggedIn(false)
//             }
//         })

//         //function to check if a user is currently in gamemode before displaying the page
//         const get_token = Cookie.get(import.meta.env.VITE_GAMEMODE_TOKEN)
//         if(get_token){
//             setGamemodeActive(true)
//         }else{
//             setGamemodeActive(false)
//             navigate("/", {
//                 replace: true
//             })
//         }


//         // Retrieve questions from localforage
//         localforage.getItem("questions").then((storedQuestions) => {
//             if (storedQuestions && storedQuestions.length > 0) {
//             // Set the questions state
//             setQuestions(storedQuestions);
//             // Set the currentQuestion state to the first question
//             setCurrentQuestion(storedQuestions[0]);
//             displayQuestionOnPage()
//             } else {
//             // Handle case where no questions are found
//             // For example, display an error message or redirect
//             }
//         });

//     }, [])

//     return <div>
//         {isAdminLoggedIn | !gameModeActive ? <Error404 /> : 
// <div className="body-wrapper">
// <div className="game-box">
//     <p className="title">
//         <span className="up">WHO</span>
//         <span className="down">WANTS</span> 
//         <span className="up">TO</span> 
//         <span className="down">BE</span> 
//         <span className="up">A </span>
//         <span>MILLIONAIRE</span>
//     </p>
//     <div className="main-cover">
//         {/* <div className="life-lines-wrapper">
//             <div className="life-line-cover ">
//                 <span>50:50</span>
//             </div>
//             <div className="life-line-cover">
//                 <Telephone size={25} color="white" />

//             </div>
//             <div className="life-line-cover">
//                 <People size={25} color="white" />
//             </div>
//         </div> */}
//         <div className="body">
//             <div className="body-cover">
//                 <div className="question-box">
//                     <p>what king of shoe did cinderella lose while running from the ball at midnight</p>

//                 </div>
//                 <div className="option-box">
//                     <div className="first-option">
//                         <div className="option">
//                             <span>A: </span>&nbsp;
//                             <span>Ballet Slipper</span>
//                         </div>
//                         <div className="option">
//                             <span>B: </span>&nbsp;
//                             <span>Running show</span>
//                         </div>
//                     </div>
//                     <div className="first-option">
//                         <div className="option">
//                             <span>C: </span>&nbsp;
//                             <span>Sandal</span>
//                         </div>
//                         <div className="option">
//                             <span>D: </span>&nbsp;
//                             <span>Glass Slipper</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="scoreboard-cover-div">
//                 <Scoreboard />
//             </div>
//         </div>
//     </div>
// </div>
// </div>}

//     </div>
// }
// export default GameMode


