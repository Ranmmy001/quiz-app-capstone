import { useState, useEffect } from "react";
import "./login.css";
import axios from "axios";
import Cookie from "js-cookie"
import localforage from "localforage";
import { useNavigate } from "react-router-dom";
import Error404 from "../../components/error404/Error404";

const Login = () => {
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
    const [gamemodeActive, setGamemodeActive] = useState(false)
    const navigate = useNavigate()
    const [login, setLogin] = useState({
        email: "",
        password: "",
        form_errors: {},
        is_loading: false,
        server_response: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLogin(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        // Validation
        const errors = {};
        if (!login.email.trim()) {
            errors.email = "Email required";
        }
        if (!login.password.trim()) {
            errors.password = "Password required";
        }

        // Update form_errors in state with validation errors
        setLogin(prevState => ({
            ...prevState,
            form_errors: errors
        }));

        if (Object.keys(errors).length === 0) {
            setLogin({
                email: "",
                password: "",
                form_errors: {},
                is_loading: true,
                server_response: ""
            })
            // Form is valid, make api request to server
            const login_feedback = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin-login`, {
                email: login.email,
                password: login.password
            })
            console.log(login_feedback)
            if(login_feedback.data.code == "login-success"){
                Cookie.set("loginToken", login_feedback.data.data.token)
                await localforage.setItem("user_email", login_feedback.data.data.email)
                setLogin({
                    email: "",
                    password: "",
                    form_errors: {},
                    is_loading: false,
                    server_response: <div className="alert alert-success">{login_feedback.data.message}</div>
                })
                // const adminDashboardRoute = `/dashboard/${login_feedback.data.data.token}`
                const adminDashboardRoute = `/app/private-route/admin/dashboard`
                
                navigate(adminDashboardRoute, {
                    replace: true
                })

            }else{
                setLogin({
                    email: "",
                    password: "",
                    form_errors: {},
                    is_loading: false,
                    server_response: <div className="alert alert-danger">{login_feedback.data.message}</div>
                })
            }
            
        }
    };




    useEffect(()=> {
        //function to check if the admin is logged in before displaying the page
        localforage.getItem("user_email").then((feedback) => {
            if (feedback && Cookie.get('loginToken')){
                setIsAdminLoggedIn(true)
            }else{
                setIsAdminLoggedIn(false)
            }
        })

        //function to check if a user is currently in gamemode before displaying the page
        const get_token = Cookie.get('gameModeToken')
        if(get_token){
            setGamemodeActive(true)
        }else{
            setGamemodeActive(false)
        }

    }, [])

    return (
        <div>
            {isAdminLoggedIn | gamemodeActive ? <Error404 /> :
            <div>
            <div className="login-page-container">
                <h4 style={{textAlign: "center"}}>WHO WANTS TO BE A MILLIONAIRE</h4>
                <div>
                    <form className="form" onSubmit={handleSubmit}>
                        <h4>Login</h4>
                        <hr style={{ border: "1px solid rgba(255, 255, 255, 0.356)" }} />
                        {login.server_response}
                        <div className="form-group">
                            <label>Email</label><br />
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="form-control"
                                name="email"
                                value={login.email}
                                onChange={handleChange}
                            />
                            {login.form_errors.email && <div className="text-danger">{login.form_errors.email}</div>}
                        </div>
                        <div className="form-group">
                            <label>Password</label><br />
                            <input
                                type="password"
                                placeholder="Enter password"
                                className="form-control"
                                name="password"
                                value={login.password}
                                onChange={handleChange}
                            />
                            {login.form_errors.password && <div className="text-danger">{login.form_errors.password}</div>}
                        </div>
                        <button type="submit" className="btn btn-block btn-primary" disabled={login.is_loading}>{login.is_loading ? 
                            <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                            </div> : "login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>}
        </div>
    );
};

export default Login;