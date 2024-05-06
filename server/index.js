// Express is a node js web application framework that provides broad features for building web and mobile applications. It is used to build a single page, multipage, and hybrid web application. It's a layer built on the top of the Node js that helps manage servers and routes.
import express from "express"
// mongoose used for connecting to mongodbdatabase. Mongoose acts as a front end to MongoDB, an open source NoSQL database that uses a document-oriented data model. Mongoose allows developers to define a schema that defines the data structure, data types, and validation rules for each field. 
import mongoose from "mongoose"
// middleware for express applicaiton. Express body-parser is an npm module used to process data sent in an HTTP request body. It provides four express middleware for parsing JSON, Text, URL-encoded, and raw data sets over an HTTP request body. Before the target controller receives an incoming request, these middleware routines handle it. 
import bodyParser from "body-parser"
// dotenv is loading the environment variable from dotenv file. The dotenv package is a great way to keep passwords, API keys, and other sensitive data out of your code. It allows you to create environment variables in a . env file instead of putting them in your code.
import dotvenv from "dotenv"
import route from "./routes/userRoute.js"
// fix cors error
import cors from "cors"
// NODEMONused for running node.js application and reload automatically whenever you save application.

// create instance of express application
const app = express();
// fix cors error
app.use(cors())
// apply json middleware
app.use(bodyParser.json());
// load environment variable from dotenv file. This will load the configuration created in .env file
dotvenv.config();

// Now we can use the port and mongo db url. process.env.port loads the environment. || 7000 is the default port
const PORT = process.env.PORT || 7000;
// write mongoDBURL to load it
const MONGOURL = process.env.MONGO_URL;

// write code to connect to mongodb databse
mongoose
    .connect(MONGOURL)
    // once the connection is successful it will print DB connected Successfully
    .then(() => {
        console.log("DB connected successfully.")
        app.listen(PORT, ()=> {
            // ${PORT} is a variable interpolation. 
            // Thus, ${PORT} in the console.log() statement is a placeholder that gets replaced by the actual value of the PORT variable at runtime, providing a dynamic way to generate output strings based on the current state or configuration of the application.
            console.log(`Server is running on port :${PORT}`)
        })
    })
    // catch error and print the error
    .catch((error) => console.log(error));

    // Mount the middleware
    app.use("/api", route);