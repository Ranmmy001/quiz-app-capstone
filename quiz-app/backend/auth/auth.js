const dotenv = require("dotenv").config()
const mongodb = require("mongodb")
const client = new mongodb.MongoClient(process.env.DB_URL)
const ObjectId = mongodb.ObjectId
const bcrypt = require("bcryptjs")
const DB_NAME = process.env.DB_NAME
const TB_ADMIN = process.env.TB_ADMIN
const TB_QUESTIONS = process.env.TB_QUESTIONS
const jwt = require("jsonwebtoken")
const questions = require('../questions.json')
const auth = (function(){
    const getUserDetailsByEmail = async (email) => {

       try{
            const getUserDetails_feedback = await client.db(process.env.DB_NAME).collection(TB_ADMIN).findOne({"email": email})
            if(getUserDetails_feedback){
                return({
                    message: "user's details retrieved",
                    code: "success",
                    data: getUserDetails_feedback
                })
            }
       }catch(error){
            return({
                message: "user's details could not be retrieved",
                code: "error",
                reason: error
            })
       }
    }

    const register = async(email, password) => {
        //hash the password
        try{
            const hashed_password = await bcrypt.hash(password, 10)
            if(hashed_password){
                //password has been hashed, proceed to store in the database
                const obj = {
                    email: email,
                    password: hashed_password
                }
                const feedback = await client.db(DB_NAME).collection(TB_ADMIN).insertOne(obj)
                if(feedback){
                    return{
                        message: "account successfully created",
                        code: "success",
                    }
                }
            }
            return hashed_password
        }catch(error){
            return {
                message: "try/catch error",
                code: "error",
                reason: error
            }
        }

    }

    const loginAdmin = async(email, password) => {
        try{
            //check if the user exists
            check_if_user_exists = await client.db(DB_NAME).collection(TB_ADMIN).findOne({email: email})
            if(!check_if_user_exists){
                return {
                    message: "inavlid email/password",
                    code: "error"
                }
            }else{
                //the user exists, proceed with password comparison
                const original_password = check_if_user_exists.password
                const password_compare = await bcrypt.compare(password, original_password)
                if(!password_compare){
                    return {
                        message: "inavlid email/password",
                        code: "error"
                    } 
                }else{
                    //the password match, generate a token
                    const payload = email

                    //dynamically generating a secret key by using the user's details and not some hard coded text
                    const secret_key = "jhgdhdhfsdgfhdsgfhdf"

                    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY)
                    if(token){
                        return {
                            message: "token successfully generated",
                            code: "login-success",
                            data: {
                                email: email,
                                token: token
                            }
                        }
                    }
                    
                    

                }
            }
            return check_if_user_exists
        }catch(error){
            console.log(error)
            return {
                message: "try/catch error",
                code: "error",
                reason: error
            }
        }

    }

    const insertQuestionIntoDB = async (question, firstOption, secondOption, thirdOption, fourthOption, rightOption, difficultyLevel) => {
        const options_array = []
        options_array.push(firstOption, secondOption, thirdOption, fourthOption) //insert all options into an array before storing into the database
        const obj = {
            // admin_id: admin_id,
            question: question,
            options: options_array,
            rightOption: rightOption,
            difficultyLevel: difficultyLevel
        }
        try{
            const feedback = await client.db(DB_NAME).collection(TB_QUESTIONS).insertOne(obj)
            return {
                message: "Question successfully inserted into database",
                code: "success",

            }
        }catch(error){
            return {
                message: "Question could not be inserted into database",
                code: "error",
                reason: error
            }
        }
    }
    
 
    const resolveUserId = (mongoObjectId) => {
        const user_id = new mongodb.ObjectId(mongoObjectId).toString()
       // console.log("from resolve user id: ", user_id)

        if(user_id){
            
            return user_id;

        }else{

            return null;

        }
    }
    const get_all_questions = async(admin_id) => {
        try{
            // const get_all_questions_by_admin_id = await client.db(DB_NAME).collection(TB_QUESTIONS).find({admin_id: admin_id}).toArray()
            const get_all_questions_by_admin_id = await client.db(DB_NAME).collection(TB_QUESTIONS).find().toArray()
            console.log("from auth: ", get_all_questions_by_admin_id)
            return{
                message: "all questions were successfully retrieved",
                code: "success",
                data: get_all_questions_by_admin_id
            }
        }catch(error){
            return {
                message: "error in retrieving all questions",
                code: "error",
                reason: error
            }
        }
    }


    // Function to shuffle the options array
    const shuffleArray = (array) => {
        const shuffled = array.slice(); // Create a copy of the array
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
        }
        return shuffled;
    };

    const generate_token_for_gamemode = async(email) => {
        const payload = email
        try{
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY)
            //token ready, now retrieve questions for display
            // const get_questions = await client.db(DB_NAME)
            //                         .collection(TB_QUESTIONS)
            //                         .aggregate([{ $sample: { size: 15 } }])
            //                         .toArray();


        // Check if the collection exists
        const collections = await client.db(DB_NAME).collection(TB_QUESTIONS).find().limit(5).toArray();

        if (collections.length === 0) {
            // Collection does not exist, create it and insert dummy questions
            console.log("Collection not found. Creating collection and inserting dummy questions...");
            const insertQuestions = await insertDummyQuestions();
            if (insertQuestions.code === 'success') {
                console.log("Dummy questions inserted successfully.");
            } else {
                console.error("Failed to insert dummy questions.");
                return {
                    message: `An error occured while retrieving questions for game mode: ${insertQuestions.reason}`,
                    code: "error",
                }
            }
        }

            const get_questions = await client.db(DB_NAME)
                .collection(TB_QUESTIONS)
                .aggregate([
                    {
                        $facet: {
                            easyQuestions: [
                                { $match: { difficultyLevel: "easy" } },
                                { $sample: { size: 4 } }
                            ],
                            hardQuestions: [
                                { $match: { difficultyLevel: "hard" } },
                                { $sample: { size: 6 } }
                            ],
                            difficultQuestions: [
                                { $match: { difficultyLevel: "difficult" } },
                                { $sample: { size: 5 } }
                            ]
                        }
                    },
                    {
                        $project: {
                            questions: {
                                $concatArrays: [
                                    "$easyQuestions",
                                    "$hardQuestions",
                                    "$difficultQuestions"
                                ]
                            }
                        }
                    }
                ])
                .toArray();

            // Extract questions array
            const questions = get_questions.length ? get_questions[0].questions : [];



            const formattedQuestions = questions.map((question, index) => ({
                question: question.question,
                options: shuffleArray(question.options),
                rightOption: question.rightOption,
                index: index
            }));
            return {
                message: "token and questions for gamemeode successfully generated",
                code: "success",
                data: {
                    token: token,
                    questions: formattedQuestions
                }
            }
        }catch(error){
            console.log(error)
            return{
                message: "error generating token",
                code: "error",
                reason: error
            }
        }
    }

    const registerSuperAdmin = async () => {
        try{
            //check if a root admin exists already
            const adminExists = await client.db(DB_NAME).collection(TB_ADMIN).findOne({});
            if(!adminExists){
                //no root admin exists, proceed to create one
                console.log("Creating Super admin...")
                const registerAdmin = auth.register('johndoe@gmail.com', 'password')
                console.log("Super admin with email: 'johndoe@gmail.com' and password: 'password' created successfully")
            }
        }catch(error){
            console.log(error)
            return{
                message: "An error occured while registering a super admin",
                code: "error",
                reason: error.message
            }
        }
    }
    const insertDummyQuestions = async () => {
        //check if questions exists in the database
        try{
            const check_if_questions_exists = await client.db(DB_NAME).collection(TB_QUESTIONS).find().toArray();
            console.log("check_if_questions_exists: ", check_if_questions_exists)
            if(check_if_questions_exists.length == 0){
                //questions does not exist. next insert json question into database
                console.log('inserting default questions into database...')
                questions.map((question)=> {
                    auth.insertQuestionIntoDB(question.question, question.firstOption, question.secondOption, question.thirdOption, question.fourthOption, question.rightOption , question.difficultyLevel)
                })
                console.log('default questions inserted into database successfully')
                return{
                    message: "default questions inserted into database successfully",
                    code: "success",
                }
            }
        }catch(error){
            return{
                message: "An error occured while inserting questions into database",
                code: "error",
                reason: error.message
            }
        }


    }

    return {
        getUserDetailsByEmail: getUserDetailsByEmail,
        register: register,
        loginAdmin: loginAdmin,
        insertQuestionIntoDB: insertQuestionIntoDB,
        resolveUserId: resolveUserId,
        get_all_questions: get_all_questions,
        generate_token_for_gamemode: generate_token_for_gamemode,
        registerSuperAdmin: registerSuperAdmin,
        insertDummyQuestions: insertDummyQuestions
    }
    
}())

module.exports = auth