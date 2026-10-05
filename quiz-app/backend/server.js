//require all modules needed
const express = require("express")
const server = express()
const dotenv = require("dotenv").config()
const cors = require("cors")
const jwt = require("jsonwebtoken")

const PORT = process.env.PORT
const auth = require("./auth/auth")
const question = require("./question/question")




//use all modules required
server.use(express.json())
server.use(cors())



// const path = require('path');
// // Serve static files from the React app
// server.use(express.static(path.join(__dirname, 'dist')));
// server.use((req, res, next) => {
//     if (req.headers['x-forwarded-proto'] !== 'https') {
//       return res.redirect(`https://${req.headers.host}${req.url}`);
//     }
//     next();
//   });
  

// // Catch-all route to serve React's index.html
// server.get('*', (request, response) => {
//     response.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });








const verifyToken = async (request, response, next) => {
    try{
        const authorization = request.headers.authorization
        console.log("from authorization: ", request.headers)
        const token = authorization.split(" ")[1]
        const email = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const get_user_details = await auth.getUserDetailsByEmail(email)
        const _id = get_user_details.data._id
        const resolveUserId = await auth.resolveUserId(_id)
        request.user_id = resolveUserId

        console.log(resolveUserId)

        next()
    }catch(error){
        console.log("from try/catch: ", error)
        response.send({
            message: "user token is invalid",
            code: "invalid-token"
        })
    }



    // next()

}
// const verifyTokenExample = async (request, response, next) => {
    
//     const authorization = request.headers.authorization
//     // console.log("from server: ")
//     let token = authorization.split(" ")[1]
//     // try{
//     // console.log("from verify token: ", token)
//         const jwt_verification = jwt.verify(token, process.env.JWT_SECRETE_KEY)
//         // console.log("from verify token: ", jwt_verification)

//         request.username = jwt_verification.username

//         const get_user_feedback = await User.getUserDetailsByUsername(request.username)
//         // console.log(get_user_feedback)
//         if(get_user_feedback.code === "success"){
//             const mongoObjectId = get_user_feedback.data._id
//             let user_id = User.resolveUserId(mongoObjectId)
//             request.user_id = user_id;
//             // console.log(user_id)

//         // next()

            
//         }else{
//             return response.send({
//                 message: "Invalid token",
//                 code: "authentication-error"

//             })
//         }
//     // }catch(error){
//     //     response.send({
//     //         message: "Invalid token",
//     //         reason: error.mesage,
//     //         code: "authentication-error"

//     //     })
//     // }


//     next()
// }



// server.post("/register", async(request, response) => {
//     const email = request.body.email.trim()
//     const password = request.body.password.trim()
    
//     if(!email || !password){
//         response.send({
//             message: "email and password required",
//             code: "error"
//         })
//     }else{
//         const feedback = await auth.register(email, password)
//         response.send (feedback)
//     }

// })


server.post("/admin-login", async(request, response) => {
    const { email, password } = request.body
    if(!email || !password){
        response.send({
            message: "inavlid email/password",
            code: "error"
        })
    }else{
        try{
            const feedback = await auth.loginAdmin(email, password)
            // console.log(feedback)
            if(feedback.code === "token-generated"){
                // const maxAge = 100 * 365 * 24 * 60 * 60 * 1000; // 100 years in milliseconds
                // response.cookie("token", feedback.data.token, {
                //     httpOnly: true,
                //     secure: true,
                //     maxAge: maxAge
                // })
                response.send({
                    message: "login successful",
                    code: "login-success",
                    data: feedback.data
                })
            }else{
                response.send(feedback)
            }
        }catch(error){
            response.send({
                message: "try/catch error",
                code: "error",
                reason: error
            })
        }
    }
})




server.post("/insert-content", verifyToken, async (request, response) => {
    const {question, firstOption, secondOption, thirdOption, fourthOption, rightOption} = request.body
    const admin_id = request.user_id;
    console.log(admin_id)
    // console.log({question, firstOption, secondOption, thirdOption, fourthOption, rightOption})
    if({question, firstOption, secondOption, thirdOption, fourthOption, rightOption}.length == 0){
        response.send({
            message: "ivalid question and options",
            code: "error"
        })
    }else{
        //store the question into the database
        try{
            const feedback = await auth.insertQuestionIntoDB(question, firstOption, secondOption, thirdOption, fourthOption, rightOption)
            response.send(feedback)
            console.log(feedback)
        }catch(error){
            response.send({
                message: "Question could not be inserted into database",
                code: "error",
                reason: error
            })
        }
    }

})

server.get("/get-all-questions", verifyToken, async (request, response) => {
    const admin_id = request.user_id
    // console.log(admin_id)
    try{
        const feedback = await auth.get_all_questions(admin_id)
        response.send(feedback)
    }catch(error){
        return {
            message: "error in retrieving all questions",
            code: "error",
            reason: error
        }
    }
})


server.post("/generate_token_for_gamemode", async (request, response) => {
    const user_email = request.body.user_email
    if(!user_email){
        response.send({
            message: "invalid email",
            code: "error"
        })
    }else{
        const feedback = await auth.generate_token_for_gamemode(user_email)
        response.send(feedback)
    }
})



// server.listen(PORT, () =>
//     console.log(`Server is listening on port ${PORT}`)
// );
{(async () => {
    // Initialize default admin
    console.log("hello")

    await auth.registerSuperAdmin()
    await auth.insertDummyQuestions()
    console.log("hi")

    // Start the server
    server.listen(PORT, () =>
        console.log(`Server is listening on port ${PORT}`)
    );
})();}
