// model for managing the structure of data. 

import mongoose from "mongoose";

// define schema for userSchema
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    address:{
        type:String,
        required: true
    }

})

//export the mongoose model based on the defined schema which is userSchema. First argument ("Users") specifies MongoDB collection name. Second Argument (userSchema) outlines the structure of the database from this file which is userSchema here.
export default mongoose.model("Users", userSchema)