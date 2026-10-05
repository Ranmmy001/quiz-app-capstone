

import "./adminDashboard.css"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import AdminCreate from "../../components/adminCreate/AdminCreate"
import AllQuestions from "../../components/AllQuestions/AllQuestions"
import { PencilSquare } from "react-bootstrap-icons"
import Cookie from "js-cookie"
import localforage from "localforage"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Error404 from "../../components/error404/Error404"
const AdminDashboard = () => {
    // const {token} = useParams()
    const navigate = useNavigate()
    // console.log("from admin dashboard", token)
    const [createContent, setCreateContent] = useState(false)
    const [allQuestions, setAllQuestions] = useState(false)
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [email, setEmail] = useState('')
    useEffect(()=> {
        // function to check if the admin is logged in before displaying the page
        localforage.getItem("user_email").then((feedback) => {
            if (feedback && Cookie.get('loginToken')){
                setEmail(feedback)
                setIsAdminLoggedIn(true)
                setIsLoading(false)
            }else{
                setIsAdminLoggedIn(false)
                navigate('/page-not-found', {replace: true})
            }
        })

    }, [])

    const handleDelete = async() => {
        Cookie.remove('loginToken')
        const clearStorage = await localforage.clear()
        navigate("/",{
            replace: true
        })
    }

    if(isLoading){
        return null
    }



    return <div>
        {isAdminLoggedIn && !isLoading ? 
        <div>
            <header>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{height: "100px"}}>
                    {/* <a className="navbar-brand" href="#">Navbar</a> */}
                    <img width="70px" style={{borderRadius: "50%"}} src="data:image/jpeg;base64,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" alt="" />
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <button className="nav-link btn">Home<span className="sr-only">(current)</span></button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn" onClick={()=> setCreateContent(true)}>create <PencilSquare /></button>
                        </li>
                        
                        <li className="nav-item">
                            <button className="nav-link btn" onClick={() => setAllQuestions(true)}>all questions</button>
                        </li>
                        {/* <li className="nav-item active">
                            <button className="nav-link btn">Edit ui<span className="sr-only">(current)</span></button>
                        </li> */}
                        </ul>
                        
                        
                        <button className="btn btn-outline-success my-2 my-sm-0 text-danger" type="button" onClick={handleDelete}>Logout</button>
                       
                    </div>
                </nav>
            </header>
            <div>
                <div className="admin-page-container">
                    <div>
                        <h1 style={{color: "white"}}>WELCOME BACK, ROOT ADMIN</h1>
                        <div className="admin-page-body">
                            <img src="data:image/png;base64,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" alt="" />
                            <div className="info">
                                <span>{email}</span>
                                <span>super admin</span>
                                <span>create question</span>
                                <span>view all question</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>







            {/* all single page declaration */}

            {/* create content page */}
            <div>
                {createContent ? 
                <div onClick={()=> setCreateContent(false)}>
                    <AdminCreate />
                </div>
                : null}

            </div>

            {/* view all questions page */}
            <div>
                {allQuestions ? 
                <div onClick={()=> setAllQuestions(false)}>
                    <AllQuestions />
                </div>
                : null}

            </div>
        </div>
        : <Error404 />}
    </div>
}
export default AdminDashboard