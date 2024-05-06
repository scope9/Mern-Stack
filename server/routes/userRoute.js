//routes is defining the endpoint of the application and mapping them to specific controller method.

import express from "express"

// the use of curly braces {} around identifiers in an import statement indicates that you are performing a named import. This is different from the default import.amed Export: Modules can export multiple named exports. This is useful when a module contains multiple functions, classes, or variables that need to be exported. When importing these, you must use curly braces to specify which exports you are importing. 
import { create, deleteUser, getAllUsers, getUserById, update } from "../controller/userController.js"

// Once import create import we need to create an express router instance.
const route = express.Router();

//HTTP method for posting data in database. /user is route. 
route.post("/user", create)
route.get("/users", getAllUsers)
// :id is a placeholder for a specific user ID that will be passed in the URL
route.get("/user/:id", getUserById)
route.put("/update/user/:id", update)
route.delete("/delete/user/:id", deleteUser)

// export route
export default route;