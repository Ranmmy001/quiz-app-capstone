import "./adminCreate.css";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminCreate = () => {
    const navigate = useNavigate()
    const [createState, setCreateState] = useState({
        question: "",
        firstOption: "",
        secondOption: "",
        thirdOption: "",
        fourthOption: "",
        rightOption: "",
        is_there_error: false,
        is_loading: false,
        server_response: ""
    });

    const [isFormValid, setIsFormValid] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCreateState((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        const { question, firstOption, secondOption, thirdOption, fourthOption, rightOption } = createState;
        const isRightOptionValid = [firstOption, secondOption, thirdOption, fourthOption].includes(rightOption);
        
        setIsFormValid(
            question.length > 0 &&
            firstOption.length > 0 &&
            secondOption.length > 0 &&
            thirdOption.length > 0 &&
            fourthOption.length > 0 &&
            rightOption.length > 0 &&
            isRightOptionValid
        );
    }, [createState]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            setCreateState((prevState) => ({
                ...prevState,
                is_there_error: true
            }));
        } else {
            // Proceed with form submission logic
            setCreateState({
                question: "",
                firstOption: "",
                secondOption: "",
                thirdOption: "",
                fourthOption: "",
                rightOption: "",
                is_there_error: false,
                is_loading: true,
                server_response: ""
            })
            const token = Cookies.get(import.meta.env.VITE_TOKEN_NAME)
            // console.log(createState, token)
            const feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/insert-content`, {
                question: createState.question,
                firstOption: createState.firstOption,
                secondOption: createState.secondOption,
                thirdOption: createState.thirdOption,
                fourthOption: createState.fourthOption,
                rightOption: createState.rightOption,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(feedback.data.code === "invalid-token"){
                navigate("/", {
                    replace: true
                })
            }else if(feedback.data.code == "success"){
                setCreateState({
                    question: "",
                    firstOption: "",
                    secondOption: "",
                    thirdOption: "",
                    fourthOption: "",
                    rightOption: "",
                    is_there_error: false,
                    is_loading: false,
                    server_response: <div className="alert alert-success">Question successfully created</div>
                })

            }
            
            
        }
    };

    return (
        <div>
            <div className="create-content-blur">
                <form
                    className="create-content-form form card px-4 mt-5"
                    onClick={(e) => e.stopPropagation()}
                    onSubmit={handleSubmit}
                >
                    <h3>Create content</h3>
                    {createState.server_response}
                    <div className="form-group pt-2">
                        <label style={{ fontWeight: "600" }}>Question:</label>
                        <textarea
                            name="question"
                            placeholder="enter question..."
                            className="form-control"
                            value={createState.question}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label style={{ fontWeight: "600" }}>Options:</label>
                        <div className="options-wrapper">
                            <div className="option-box">
                                <input
                                    type="text"
                                    name="firstOption"
                                    placeholder="option"
                                    className="form-control"
                                    value={createState.firstOption}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="secondOption"
                                    placeholder="option"
                                    className="form-control"
                                    value={createState.secondOption}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="option-box">
                                <input
                                    type="text"
                                    name="thirdOption"
                                    placeholder="option"
                                    className="form-control"
                                    value={createState.thirdOption}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="fourthOption"
                                    placeholder="option"
                                    className="form-control"
                                    value={createState.fourthOption}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label style={{ fontWeight: "600" }}>Right option:</label>
                                <input
                                    type="text"
                                    name="rightOption"
                                    placeholder="option"
                                    className="form-control"
                                    value={createState.rightOption}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <button className="btn btn-block" style={{ backgroundColor: isFormValid ? 'black' : 'grey', color: "white" }} disabled={!isFormValid | createState.is_loading}>
                            {createState.is_loading ? 
                            <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                            </div> : "create content"}
                        </button>
                    </div>

                    {createState.is_there_error && (
                        <div className="alert alert-danger" role="alert">
                            Please fill out all fields correctly and ensure the right option is one of the provided options.
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AdminCreate;













// import "./adminCreate.css"
// import { useState } from "react";
// const AdminCreate = () => {
//     const [createState, setCreateState] = useState({
//         question: "",
//         firstOption: "",
//         secondOption: "",
//         thirdOption: "",
//         fourthOption: "",
//         rightOption: "",
//         is_there_error: false,
//         is_loading: false,
//         server_response: ""
//     });

//     const handleQuestionChange = (e) => {
//         const { name, value } = e.target;
//         setCreateState(prevState => ({
//             ...prevState,
//             [name]: value
//         }));
//     };
//     const handleFirstOptionChange = (e) => {
//         const { name, value } = e.target;
//         setCreateState(prevState => ({
//             ...prevState,
//             [name]: value
//         }));
//     };
//     const handleSecondOptionChange = (e) => {
//         const { name, value } = e.target;
//         setCreateState(prevState => ({
//             ...prevState,
//             [name]: value
//         }));
//     };
//     const handleThirdOptionChange = (e) => {
//         const { name, value } = e.target;
//         setCreateState(prevState => ({
//             ...prevState,
//             [name]: value
//         }));
//     };
//     const handleFourthOptionChange = (e) => {
//         const { name, value } = e.target;
//         setCreateState(prevState => ({
//             ...prevState,
//             [name]: value
//         }));
//     };
//     const handleRightOptionChange = (e) => {
//         const { name, value } = e.target;
//         setCreateState(prevState => ({
//             ...prevState,
//             [name]: value
//         }));
//     };
    
//     const handleSubmit = async(e) => {
//         console.log(createState.question)
//         // e.preventDefault();

//         // // Validation
//         // const errors = {};
//         // if (!login.email.trim()) {
//         //     errors.email = "Email required";
//         // }
//         // if (!login.password.trim()) {
//         //     errors.password = "Password required";
//         // }

//         // // Update form_errors in state with validation errors
//         // setLogin(prevState => ({
//         //     ...prevState,
//         //     form_errors: errors
//         // }));

//         // if (Object.keys(errors).length === 0) {
//         //     setLogin({
//         //         email: "",
//         //         password: "",
//         //         form_errors: {},
//         //         is_loading: true,
//         //         server_response: ""
//         //     })
//         //     // Form is valid, make api request to server
//         //     const login_feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin-login`, {
//         //         email: login.email,
//         //         password: login.password
//         //     })
//         //     // console.log(login_feedback)
//         //     if(login_feedback.data.code == "login-success"){
//         //         Cookie.set("token", login_feedback.data.data.token)
//         //         await localforage.setItem("user_email", login_feedback.data.data.email)
//         //         setLogin({
//         //             email: "",
//         //             password: "",
//         //             form_errors: {},
//         //             is_loading: true,
//         //             server_response: <div className="alert alert-success">{login_feedback.data.message}</div>
//         //         })
//         //         const adminDashboardRoute = `/dashboard/${login_feedback.data.data.token}`
//         //         navigate(adminDashboardRoute, {
//         //             replace: true
//         //         })

//         //     }else{
//         //         setLogin({
//         //             email: "",
//         //             password: "",
//         //             form_errors: {},
//         //             is_loading: true,
//         //             server_response: <div className="alert alert-danger">{login_feedback.data.message}</div>
//         //         })
//         //     }
            
//         // }
//     };
//     return <div>
//         <div className="create-content-blur">


//         <form className="create-content-form form card px-4  mt-5" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
//                     <h3>Create content</h3>
//                     <div className="form-group mt-4" >
//                         <label style={{fontWeight: "600"}}>Question:</label>
//                         <textarea placeholder="enter question..."className="form-control" value={createState.question} onChange={handleQuestionChange}></textarea>
//                     </div>

//                     <div className="form-group">
//                         <label style={{fontWeight: "600"}}>Options:</label>
//                         <div className="options-wrapper">
//                             <div className="option-box">
//                                 <input type="text" placeholder="option" className="form-control" value={createState.firstOption} onChange={handleFirstOptionChange} />
//                                 <input type="text" placeholder="option" className="form-control" value={createState.secondOption} onChange={handleSecondOptionChange} />
//                             </div>
//                             <div className="option-box">
//                                 <input type="text" placeholder="option" className="form-control" value={createState.thirdOption} onChange={handleThirdOptionChange} />
//                                 <input type="text" placeholder="option" className="form-control" value={createState.fourthOption} onChange={handleFourthOptionChange} />
//                             </div>
//                             <div>
//                                 <label style={{fontWeight: "600"}}>Right option:</label>
//                                 <input type="text" placeholder="option" className="form-control" value={createState.rightOption} onChange={handleRightOptionChange} />
//                             </div>
                   
//                         </div>
//                     </div>

//                     <div className="form-group">
//                         <button className="btn btn-block btn-dark">create content</button>
//                     </div>

//                 </form>
//             </div>

//     </div>
// }
// export default AdminCreate