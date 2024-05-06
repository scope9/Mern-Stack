// controller is for handling the request, processing data, and generating the response. 

// statement imports the default export from userModel.js into userController.js. This was the export export default mongoose.model("Users", userSchema). There isn’t a direct mention of "User" in the userModel.js. The model is exported as the default export, and when it is imported in userController.js, it is given the name "User" as an identifier for this file
import User from "../model/userModel.js"

// Why is there an export?
// In Node.js modules, export is used to allow functions, objects, or primitives to be used in other files. For instance, in an Express.js application, controller functions need to be accessible to the router file, which delegates requests to these functions based on the incoming route.

//What does asynnc (req, res) mean?
// In the context of Express.js, each controller function typically handles HTTP requests and responses. The parameters req (request) and res (response) are objects provided by Express that contain all the information about the request and response, respectively. Here’s what they represent:
// req: The request object contains data such as request parameters, headers, body, and URL.
// res: The response object is used to send back the desired HTTP response to the client, including setting response headers, status code, and body.
// The async keyword is used to declare that a function can perform asynchronous operations and allows you to use await within the function. This is particularly useful when dealing with database operations that are inherently asynchronous, like querying a database or accessing external resources.

// Where does new User(req.body) come from?
// This line typically appears in a function where a new user is being created. Assuming that User is a Mongoose model imported from a model file (userModel.js), new User(req.body) is used to create a new instance of the User model using data passed in the request body. This is common in POST requests where form data or JSON is sent by the client to the server to create a new resource. Here's a breakdown:
// req.body: This part of the request object contains data submitted in the POST request. In Express, to access req.body, body-parsing middleware such as express.json() or express.urlencoded() must be used, which parse incoming request bodies in a middleware before your handlers, available under the req.body property.
// new User(): This constructs a new instance of the User model, mapping the properties of req.body to the model's schema.


export const create = async(req, res) => {
    try {
        // create a newUser object
        const newUser = new User(req.body);
        //  so once you create a new user object extract the email from newUser. There are brackets around email because its destructuring which is accessing speicifc property in this case "email" from the object newUser from the model file schema.
        const {email} = newUser;
        
        // if user with same email address already exist display error message. findOne method fins email
        // 1. User.findOne({email}):
        // User is likely a Mongoose model that represents a collection in your MongoDB database.
        // findOne is a Mongoose method that returns a Promise resolving to either the first document that matches the given query ({email} in this case) or null if no match is found.
        // The {email} syntax is shorthand for {email: email}, where email is a variable that contains the email address you're searching for in the database. This is an example of an ES6 feature called property shorthand in object literals.
        // 2. await:
        // The await keyword is used to wait for the Promise returned by User.findOne({email}) to settle. What this means:
        // If the Promise resolves, await will return the resolved value, which in this case would be the user document found in the database or null.
        // While await pauses the function’s execution at this line, it does not block the entire thread or other operations; other asynchronous tasks can continue running in the background.
        // 3. const userExist:
        // This variable is then assigned the value returned by await User.findOne({email}), which will be the user object if a matching document is found or null if no such document exists.
        const userExist = await User.findOne({email})
        if(userExist) {
            // if user email exist return 400 bad request code with the "User already exist" message
            return res.status(400).json({message: "User already exists."})
        }
        // if the user doesnt exist we save the new user into the savedData
        const savedData = await newUser.save();
        // return the response
        // res.status(200).json(savedData);
        res.status(200).json({message:"User created successfully"});
    } catch (error) {
        res.status(500).json({errorMessage:error.message})
        
    }
};

// Code for getting all the users from the database
export const getAllUsers = async(req, res) => {
    try {
        // find() retrieves all users from database.
        const userData = await User.find()
        // if there is no userData return status 400 with "User data not found" but if there is userData return 200 status.
        if(!userData || userData.length === 0) {
            return res.status(404).json({message: "User data not found."})
        }
        res.status(200).json(userData)
        
    } catch (error) {
        res.status(500).json({errorMessage:error.message})
        
    }
};

// Code for getting user by specific id
export const getUserById = async(req, res) => {
    try {
        // This line retrieves the id parameter from the URL of the request. 
        const id = req.params.id;
        const userExist = await User.findById(id);
        if(!userExist) {
            return res.status(404).json({message: "User not found."})
        }
        return res.status(200).json(userExist)
        
    } catch (error) {
        res.status(500).json({errorMessage:error.message})
    }
}

// Code for updating user information from database
export const update = async (req, res) => {
    try {
        const id = req.params.id;
        const userExist = await User.findById(id);
        if(!userExist) {
            return res.status(404).json({message: "User not found."})
        }
        // if there are any users we update the user. findByIdAndUpdate() is a mongoose method. There are 3 parameters for it. 1. id from the parameter is the identifier of the document you want to update. 2. req.body  represents the update operation to be applied to the document. It typically contains the new values for the document fields, which are sent by the client in the request body. 3. new:true will specify the function should return the updated document rather than original.
        const updatedData = await User.findByIdAndUpdate(id, req.body, {new:true})
        // res.status(200).json(updatedData)
        res.status(200).json({message:"User Updated Successfully"});
    } catch (error) {
        res.status(500).json({errorMessage:error.message})
    }
}

// Code for deleting user from database
export const deleteUser = async(req, res) => {
    try {
        const id = req.params.id;
        const userExist = await User.findById(id);
        if(!userExist) {
            return res.status(404).json({message: "User not found."})
        }
        await User.findByIdAndDelete(id) 
        res.status(200).json({message:"User deleted successfully"})  
    } catch (error) {
        res.status(500).json({errorMessage:error.message})
    }
}