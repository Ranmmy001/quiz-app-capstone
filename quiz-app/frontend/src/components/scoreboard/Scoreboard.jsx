


import { useState, useEffect } from "react";
import Cookie from "js-cookie";
import "./scoreboard.css"
import localforage from "localforage";
const Scoreboard = ({currentQuestion}) => {
    const [has_animation_happened, set_has_animation_happened] = useState(null)
    // setTimeout(() => {
    //     // Store the value in browser storage after 7 seconds
    //     Cookie.set("has_animation_happened", new Date().getTime());
    //     set_has_animation_happened(true)
    // }, 7000);
    useEffect(()=> {
        localforage.getItem('questions').then((feedback) => {
            if(feedback.length == 15){
                if (window.innerWidth > 767) {  // Check if the screen width is greater than 767px
                    setTimeout(() => {
                        // Store the value in browser storage after 7 seconds
                        Cookie.set("has_animation_happened", new Date().getTime());
                        set_has_animation_happened(true);
                    }, 7000);
                } else {
                    // Directly set the value for mobile screens without waiting
                    Cookie.set("has_animation_happened", new Date().getTime());
                    set_has_animation_happened(true);
                }
            }else{
                set_has_animation_happened(false)
            }
        })
    }, [])
    useEffect(()=> {
        console.log(currentQuestion)
        const getItem = Cookie.get("has_animation_happened");
            console.log(getItem)
            if(getItem){
                set_has_animation_happened(true)
            }else{
                set_has_animation_happened(false)
            }
    }, [])


    const prizeMoneyArray = [
        '$100', '$200', '$300', '$500', '$1,000', '$2,000', '$4,000', '$8,000', 
        '$16,000', '$32,000', '$64,000', '$125,000', '$250,000', '$500,000', '$1,000,000'
    ]







    // const [has_animation_happened, set_has_animation_happened] = useState(null)
    // // setTimeout(() => {
    // //     // Store the value in browser storage after 7 seconds
    // //     Cookie.set("has_animation_happened", new Date().getTime());
    // //     set_has_animation_happened(true)
    // // }, 7000);
    // useEffect(()=> {
    //     console.log(currentQuestion)
    //     // const getItem = Cookie.get("has_animation_happened");
    //     localforage.getItem('questions').then((feedback) => {
    //         console.log(feedback)
    //         if(feedback.length !== 15){
    //             set_has_animation_happened(true)
    //         }else{
    //             set_has_animation_happened(false)
    //         }
    //     })
    // }, [])
    return <div>
        <div className="score-board-cover">
            {/* <p className="score-board-title">SCORE BOARD</p> */}
            <div className="your-score">Your Score</div>
            <div className="score">{currentQuestion?.index ? prizeMoneyArray[currentQuestion?.index] : prizeMoneyArray[0]}</div>
            <div className="scores-list">
                <ul type="none">
                    <li className={has_animation_happened ? "white-color" : "white-color blink"} style={{...(currentQuestion?.index == 14 && {background: "orange", color: "white"})}}>15 $1 MILLION</li>

                    <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: "2.6s", ...(currentQuestion?.index == 13 && {background: "orange", color: "white"})}}>
                        <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "3.6s"}}>14 $500,000</div>
                    </li>

                    <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: "2.4s", ...(currentQuestion?.index == 12 && {background: "orange", color: "white"})}}>
                        <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "3.8s"}}>13 $250,000</div>
                    </li>

                    <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: "2.2s", ...(currentQuestion?.index == 11 && {background: "orange", color: "white"})}}>
                        <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "4s"}}>12 $125,000</div>
                    </li>

                    <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: "2s", ...(currentQuestion?.index == 10 && {background: "orange", color: "white"})}}>
                        <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "4.2s"}}>11 $64,000</div>
                    </li>

                    <li className={has_animation_happened ? "white-color " : "white-color up-animation"} style={{animationDelay: "1.8s", ...(currentQuestion?.index == 9 && {background: "orange", color: "white"})}}>
                        <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "4.4s"}}>10 $32,000</div>
                    </li>

                    <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: "1.6s", ...(currentQuestion?.index == 8 && {background: "orange", color: "white"})}}>
                        <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "4.6s"}}>9 $16,000</div>
                    </li>

                    <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: "1.4s", ...(currentQuestion?.index == 7 && {background: "orange", color: "white"})}}>
                        <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "4.8s"}}>8 $8,000</div>
                    </li>

                    <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: "1.2s", ...(currentQuestion?.index == 6 && {background: "orange", color: "white"})}}>
                        <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "5s"}}>7 $4,000</div>
                    </li>

                    <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: "1s", ...(currentQuestion?.index == 5 && {background: "orange", color: "white"})}}>
                        <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "5.2s"}}>6 $2,000</div>
                    </li>

                    <li className={has_animation_happened ? "white-color " : "white-color up-animation"} style={{animationDelay: ".8s", ...(currentQuestion?.index == 4 && {background: "orange", color: "white"})}}>
                        <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "5.4s"}}>5 $1,000</div>
                    </li>

                    <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: ".6s", ...(currentQuestion?.index == 3 && {background: "orange", color: "white"})}}>
                        <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "5.6s"}}>4 $500</div>
                    </li>

                    <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: ".4s", ...(currentQuestion?.index == 2 && {background: "orange", color: "white"})}}>
                        <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "5.8s"}}>3 $300</div>
                    </li>

                    <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: ".2s", ...(currentQuestion?.index == 1 && {background: "orange", color: "white"})}}>
                        <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "6s"}}>2 $200</div>
                    </li>

                    <li className={has_animation_happened ? "" : "up-animation"} style={{...(currentQuestion?.index == 0 && {background: "orange", color: "white"})}}>
                        <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "6.2s"}}>1 $100</div>
                    </li>
                </ul>
            </div>

        </div>
    </div>
}

export default Scoreboard


























// import { useState, useEffect } from "react";
// import Cookie from "js-cookie";
// import "./scoreboard.css"
// const Scoreboard = () => {
//     const [has_animation_happened, set_has_animation_happened] = useState(null)
//     setTimeout(() => {
//         // Store the value in browser storage after 7 seconds
//         Cookie.set("has_animation_happened", new Date().getTime());
//         set_has_animation_happened(true)
//     }, 7000);
//     useEffect(()=> {
//         const getItem = Cookie.get("has_animation_happened");
//         if(getItem){
//             set_has_animation_happened(true)
//         }else{
//             set_has_animation_happened(false)
//         }
//     }, [])
//     const prizeMoneyArray = [
//         '15 $1 MILLION'
//     ]
//     return <div>
//         <div className="score-board-cover">
//             {/* <p className="score-board-title">SCORE BOARD</p> */}
//             <div className="your-score">Your Score</div>
//             <div className="score">$ 100</div>
//             <div className="scores-list">
//                 <ul type="none">
//                     <li className={has_animation_happened ? "white-color" : "white-color blink"}>15 $1 MILLION</li>

//                     <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: "2.6s"}}>
//                         <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "3.6s"}}>14 $500,000</div>
//                     </li>

//                     <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: "2.4s"}}>
//                         <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "3.8s"}}>13 $250,000</div>
//                     </li>

//                     <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: "2.2s"}}>
//                         <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "4s"}}>12 $125,000</div>
//                     </li>

//                     <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: "2s"}}>
//                         <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "4.2s"}}>11 $64,000</div>
//                     </li>

//                     <li className={has_animation_happened ? "white-color " : "white-color up-animation"} style={{animationDelay: "1.8s"}}>
//                         <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "4.4s"}}>10 $32,000</div>
//                     </li>

//                     <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: "1.6s"}}>
//                         <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "4.6s"}}>9 $16,000</div>
//                     </li>

//                     <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: "1.4s"}}>
//                         <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "4.8s"}}>8 $8,000</div>
//                     </li>

//                     <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: "1.2s"}}>
//                         <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "5s"}}>7 $4,000</div>
//                     </li>

//                     <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: "1s"}}>
//                         <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "5.2s"}}>6 $2,000</div>
//                     </li>

//                     <li className={has_animation_happened ? "white-color " : "white-color up-animation"} style={{animationDelay: ".8s"}}>
//                         <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "5.4s"}}>5 $1,000</div>
//                     </li>

//                     <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: ".6s"}}>
//                         <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "5.6s"}}>4 $500</div>
//                     </li>

//                     <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: ".4s"}}>
//                         <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "5.8s"}}>3 $300</div>
//                     </li>

//                     <li className={has_animation_happened ? "" : "up-animation"} style={{animationDelay: ".2s"}}>
//                         <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "6s"}}>2 $100</div>
//                     </li>

//                     <li className={has_animation_happened ? "" : "up-animation"}>
//                         <div className={has_animation_happened ? "" : "down-animation"} style={{animationDelay: "6.2s"}}>1 $100</div>
//                     </li>
//                 </ul>
//             </div>

//         </div>
//     </div>
// }

// export default Scoreboard







// import "./score.css"
// const Scoreboard = () => {
//     return <div>
//         <div className="score-board-cover">
//             {/* <p className="score-board-title">SCORE BOARD</p> */}
//             <p className="your-score">Your Score</p>
//             <p className="score">$ 100</p>
//             <div className="scores-list">
//                 <ul type="none">
//                     <li className="white-color blink">15 $1 MILLION</li>

//                     <li className="up-animation down-animation" style={{animationDelay: "2.6s"}}>
//                         <div className="down-animation" style={{animationDelay: "3.6s"}}>14 $500,000</div>
//                     </li>

//                     <li className="up-animation down-animation" style={{animationDelay: "2.4s"}}>
//                         <div className="down-animation" style={{animationDelay: "3.8s"}}>13 $250,000</div>
//                     </li>

//                     <li className="up-animation down-animation" style={{animationDelay: "2.2s"}}>
//                         <div className="down-animation" style={{animationDelay: "4s"}}>12 $125,000</div>
//                     </li>

//                     <li className="up-animation down-animation" style={{animationDelay: "2s"}}>
//                         <div className="down-animation" style={{animationDelay: "4.2s"}}>11 $64,000</div>
//                     </li>

//                     <li className="white-color up-animation down-animation" style={{animationDelay: "1.8s"}}>
//                         <div className="down-animation" style={{animationDelay: "4.4s"}}>10 $32,000</div>
//                     </li>

//                     <li className="up-animation down-animation" style={{animationDelay: "1.6s"}}>
//                         <div className="down-animation" style={{animationDelay: "4.6s"}}>9 $16,000</div>
//                     </li>

//                     <li className="up-animation down-animation" style={{animationDelay: "1.4s"}}>
//                         <div className="down-animation" style={{animationDelay: "4.8s"}}>8 $8,000</div>
//                     </li>

//                     <li className="up-animation down-animation" style={{animationDelay: "1.2s"}}>
//                         <div className="down-animation" style={{animationDelay: "5s"}}>7 $4,000</div>
//                     </li>

//                     <li className="up-animation down-animation" style={{animationDelay: "1s"}}>
//                         <div className="down-animation" style={{animationDelay: "5.2s"}}>6 $2,000</div>
//                     </li>

//                     <li className="white-color up-animation down-animation" style={{animationDelay: ".8s"}}>
//                         <div className="down-animation" style={{animationDelay: "5.4s"}}>5 $1,000</div>
//                     </li>

//                     <li className="up-animation down-animation" style={{animationDelay: ".6s"}}>
//                         <div className="down-animation" style={{animationDelay: "5.6s"}}>4 $500</div>
//                     </li>

//                     {/* <li className="up-animation down-animation" style={{animationDelay: ".4s"}}>
//                         <div className="down-animation" style={{animationDelay: "5.8s"}}>3 $300</div>
//                     </li>

//                     <li className="up-animation down-animation" style={{animationDelay: ".2s"}}>
//                         <div className="down-animation" style={{animationDelay: "6s"}}>2 $100</div>
//                     </li>

//                     <li className="up-animation down-animation">
//                         <div className="down-animation" style={{animationDelay: "6.2s"}}>1 $100</div>
//                     </li> */}
//                 </ul>
//             </div>

//         </div>
//     </div>
// }

// export default Scoreboard