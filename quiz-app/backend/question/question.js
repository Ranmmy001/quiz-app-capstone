const dotenv = require("dotenv").config()
const mongodb = require("mongodb")
const client = new mongodb.MongoClient(process.env.DB_URL)
const DB_NAME = process.env.DB_NAME
const TB_QUESTIONS = process.env.TB_QUESTIONS





const question = (function(){

    const insertQuestionIntoDB = async (question, firstOption, secondOption, thirdOption, fourthOption, rightOption) => {
        console.log("from question:", question)
        // const options_array = []
        // options_array.push(firstOption, secondOption, thirdOption, fourthOption) //insert all options into an array before storing into the database
        // const obj = {
        //     question: question,
        //     options: options_array,
        //     rightOption: rightOption
        // }
        // try{
        //     const feedback = await client.db(DB_NAME).collection(TB_QUESTIONS).insertOne(obj)
        //     return {
        //         message: "Question successfully inserted into database",
        //         code: "success",

        //     }
        // }catch(error){
        //     return {
        //         message: "Question could not be inserted into database",
        //         code: "error",
        //         reason: error
        //     }
        // }
    }
    const insert = async(question) => {
        console.log(question)
    }


    return {
        insertQuestionIntoDB: insertQuestionIntoDB,
        insert: insert
    }






}());

module.exports = question
