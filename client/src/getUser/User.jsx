import React, { useState, useEffect } from 'react'
import "./user.css"
import axios from "axios"
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const User = () => {
    // fetching data from database or connecting application to backend. Users is the current state value and setUsers is a function that lets you update this state value. useState is a hook that lets you add React state to functional components , in this case, an empty array [], represents the initial state. This is used to initialize the "users" state variable. An empty array is typically used when you expect the state variable to eventually hold a list of items, such as a list of users fetched from an API.
    const [users, setUsers] = useState([])
    // is a hook that tells React that your component needs to do something after render. React will remember the function you passed (the effect), and call it later after performing the DOM updates. The empty array [] as the second argument to useEffect is very important as it acts as a dependency list. It tells React to run the effect only once when the component mounts and not on subsequent renders.
    useEffect(()=>{
        const fetchData = async() => {
            try {
                // fetch data from database
                const response = await axios.get("http://localhost:8000/api/users/")
                // now that data is stored in response now you can set it using setUsers(). This line updates the users state with the data fetched from the API, which likely contains a list of users.
                setUsers(response.data)
            } catch (error) {
                console.log("error while fetching data", error)
            }
        };
        // initiate the data fetching process.
        fetchData()
        // by adding empty array as the second argument in effect it ensures the effect runs only once
    }, [])
//     When you execute setUsers(response.data);, here's what happens:
// Argument to setUsers: The response.data is passed as an argument to setUsers. This response.data should be the new data you want the users state variable to hold. Typically, response.data comes from an external API and contains an array of user objects.
// Updating State: Internally, setUsers takes the new data (response.data) and updates the "users" state variable. This is not a direct mutation of the state; instead, setUsers triggers an update cycle within React.
// Re-render: After updating the state, React schedules a re-render of the component. During this re-render, any part of the component that depends on the users state will now reflect the updated data. 
// Placing setUsers(response.data); within a useEffect hook in a React component is a common and practical pattern, especially when fetching data from an external source like an API. 


    const deleteUser = async (userId) => {
        await axios.delete(`http://localhost:8000/api/delete/user/${userId}`)
        .then((response)=> {
            //once user is deleted filter out the user
            setUsers((prevUser) => prevUser.filter((user)=>user._id !==userId)) 
            // once its deleted there will be a message in the top right saying "User deleted successfuly" which is mentioned in the userController
            toast.success(response.data.message,{position:"top-right"})
        })
        // catch any error
        .catch((error)=>
        console.log(error)
        )
    }
  return (
    // create user table with bootstrap
    <div className = "userTable">
        {/* Link goes to the add path. Replace bootstrap button element with Link*/}
        <Link to="/add" type="button" class="btn btn-primary">Add User <i class="fa-solid fa-user-plus"></i></Link>
        <table className = "table table-bordered">
            <thead>
                <tr>
                    <th scope = "col">S.No.</th>
                    <th scope = "col">Name</th>
                    <th scope = "col">Email</th>
                    <th scope = "col">Address</th>
                    <th scope = "col">Actions</th>
                </tr>
            </thead>
            <tbody>
                {/* // This line uses the map function to iterate over the users array. map is a JavaScript array method that creates a new array with the results of calling a provided function on every element in the array. In JSX, map is commonly used to generate elements dynamically. user: Represents the current item in the users array during each iteration. index: Represents the current index of the item in the array. */}
                {users.map((user, index) => {
                    return (
                        <tr>
                    {/* since index starts with 0 we add a 1 */}
                    <td>{index+1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td className='actionButtons'>
                    {/* Replace bootstrap button element with Link to go to Link update path */}
                    {/* use backticks. Since we pass userId we use _id which is the id of mongo db database you can see in compass */}
                    <Link to = {`update/`+user._id} type="button" class="btn btn-info">
                    {/* font awesome icon  */}
                    <i class="fa-solid fa-pen-to-square"></i></Link>
                    
                    <button
                    onClick={()=>deleteUser(user._id)}
                    
                    type="button" class="btn btn-danger">
                    <i class="fa-solid fa-trash"></i>
                    </button>
                    </td>  
                </tr>
                    )
                } )}
            </tbody>
        </table>
    </div>
  )
}

export default User

// why use useEffect? 
// 1. Handling Side Effects
// useEffect is designed to handle side effects in functional components. Side effects are operations that can affect other components or cannot be done during rendering, such as data fetching, subscriptions, manually changing the DOM, and more. Here are the primary reasons for using useEffect for data fetching:

// Isolation from Rendering: Data fetching and state updating are asynchronous operations that shouldn't block or interfere with the rendering of the component. useEffect ensures that the component is first rendered with the initial UI, and then the data fetching logic is executed. This separation helps in maintaining smooth UI rendering and performance.
// Control Over Execution: The useEffect hook allows you to specify when exactly your side effect runs, using its dependency array. By placing setUsers(response.data); inside useEffect, you can control that the data fetching happens under specific conditions, such as only after initial mount (by providing an empty dependency array []) or in response to changes in certain values.
// 2. Fetching Data on Component Mount
// A typical use case is to fetch data when the component mounts and then set this data into state. Here’s how it works inside useEffect:
// useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("http://example.com/api/users");
//         setUsers(response.data); // Update state with fetched data
//       } catch (error) {
//         console.error("Failed to fetch users", error);
//       }
//     };
  
//     fetchData();
//   }, []); // The empty array means this runs only once on component mount
// Initial Fetch: The empty dependency array [] tells React to run the effect only once after the initial render. This is perfect for fetching data needed to populate the component when it first appears.
// 3. Maintaining Performance and Avoiding Unnecessary Renders
// Without useEffect, if you placed your data fetching logic directly in the component body (outside of useEffect), it would run every time the component re-renders, leading to potentially multiple unnecessary API calls and state updates that could degrade performance and lead to bugs such as infinite loops.

// 4. Clear Intentions and Code Organization
// Using useEffect for fetching data also makes the component’s intent clearer. Other developers working on the code can immediately see that fetching and setting state for users is meant to be done when certain conditions are met (based on the dependency array), rather than as a by-product of rendering. This keeps your data-fetching logically separated from your UI logic, making the component easier to maintain and debug.

// Summary
// Thus, useEffect is used to encapsulate the data fetching logic, ensuring it runs at the right time and in response to the right conditions, without interfering with the main rendering process of the component. This leads to efficient, clean, and easy-to-understand components in React applications.


// 1. The User Component
// const User = () => {...}: This defines a functional component in React using arrow function syntax. User is the name of the component, and it returns JSX (a syntax extension for JavaScript recommended for use with React to describe what the UI should look like).
// 2. JSX Structure
// <div className="userTable">: The entire table is wrapped in a div element. The className attribute assigns a CSS class name userTable to the div. This is similar to the class attribute in HTML but is called className in JSX to avoid confusion with JavaScript's class keyword.
// <table className="table table-bordered">: Inside the div, a table element is defined with two CSS class names, table and table-bordered. These might be Bootstrap class names (assuming Bootstrap is being used), which apply default styling to make the table styled consistently and have bordered cells.
// <thead> and <tbody>: The table is divided into two main sections:
// <thead>: This section is used to define the header row of the table. It typically contains headings that describe each column.
// <tbody>: This section contains the actual data rows of the table.
// Inside <thead>:
// <tr>: Defines a row in the table.
// <th scope="col">: Each th element defines a header cell in the table, and the scope="col" attribute helps accessibility tools understand that these headers apply to columns. Two headers are defined here: "S.No." (serial number) and "Name".
// Inside <tbody>:
// <tr>: Similarly, defines a row in the body of the table.
// <td>: Each td element defines a standard cell in the table. In the provided example, one row is present with two cells: "1" (a serial number) and "John" (a name).
// 3. Purpose and Usage
// This component is static and simple, meant to render a predefined table with just one row of data. It can be used in a React application where you need to display tabular data. The current setup shows only one user as an example, but typically you might want to extend this to render multiple rows dynamically based on data passed to the component via props or fetched from an API.


// deleteUser function explanation?
// 1. Function Definition
// const deleteUser = async (userId) => {...}: This defines an asynchronous function named deleteUser that accepts one parameter, userId. This parameter is expected to be the identifier for the user that needs to be deleted.
// 2. Axios HTTP DELETE Request
// await axios.delete(http://localhost:8000/api/delete/user/${userId}`)`: This line sends an HTTP DELETE request to a specified URL. The URL includes the userId, dynamically inserted into the string to specify which user should be deleted. The await keyword is used to pause execution until the Axios promise resolves or rejects, meaning the function waits here for the HTTP request to complete before moving on.
// 3. Handling the Response
// .then((response) => {...}): This method is called if the Axios request is successful (i.e., the server responds with a 2xx status code). Inside this block:
// setUsers((prevUser) => prevUser.filter((user) => user._id !== userId)): This line updates the state of users. It uses the setUsers function, presumably from a useState hook in a surrounding component. The function filters out the user with the matching userId from the current users array (prevUser). This ensures the UI reflects that the user has been successfully deleted without needing to reload or refetch the entire list.
// toast.success(response.data.message, {position: "top-right"}): This line displays a success message using a toast notification system, likely from a library like react-toastify. The message content (response.data.message) is assumed to be a part of the server's response, providing a user-friendly message indicating the result of the operation. The {position: "top-right"} option positions the toast notification at the top-right of the viewport.
// 4. Error Handling
// .catch((error) => console.log(error)): This catch block is executed if the Axios request fails (e.g., server returns an error status code). It logs the error to the console, which could be useful for debugging. In a production environment, you might want to handle this more gracefully, such as displaying a user-friendly error message using the same toast system or another method of error reporting.

// setUsers((prevUser)) explanation:
// 1. The setUsers Function
// setUsers is likely a function returned from the useState hook in React, which is used to update the state that holds the list of users. This state could have been initialized like this:
// const [users, setUsers] = useState([]);
// The purpose of setUsers here is to update the state by filtering out a specific user.
// 2. Arrow Function and filter Method
// Arrow Functions: => is the syntax for arrow functions in JavaScript, which provide a more concise way to write functions. They are particularly useful for inline functions and when you don't need their own this context.
// First Arrow Function (prevUser => ...): This function receives the current state of the users (prevUser), which represents the array of user objects before the update. The name prevUser might be a bit misleading since it suggests a single user, but in this context, it actually represents the current array of users.
// filter Method:
// filter is a JavaScript array method that creates a new array with all elements that pass the test implemented by the provided function. It does not modify the original array, making it suitable for immutable state updates in React.
// prevUser.filter((user) => user._id !== userId): This expression filters the prevUser array. It includes each user in the new array if the function (user) => user._id !== userId returns true.
// The condition user._id !== userId checks if the _id property of each user does not equal the userId of the user to be removed. Only users whose _id is not equal to userId are included in the new array.
// 3. Complete Line Explanation
// setUsers((prevUser) => prevUser.filter((user) => user._id !== userId)):
// This line updates the users state by setting it to a new array that excludes the user with the specified userId.
// The outer arrow function provides the current state (prevUser) and returns the result of the filter method, which is the new array.
// The inner arrow function defines the condition for filtering the array. It ensures that only users whose _id is not equal to userId are included in the new array.
// 4. Practical Use
// This approach is used in React to handle state updates in an immutable way, which is important for maintaining predictable state changes and optimizing React's re-rendering behavior. By using filter, you ensure that the original state is not directly modified, adhering to React's best practices for state management.


// onClick={()=>deleteUser(user._id)} explained?
// 1. The onClick Event Handler
// onClick: This is a React prop used to handle click events on an element. When the element with this onClick prop is clicked, the provided function is executed.
// 2. The Arrow Function
// () => deleteUser(user._id): This syntax represents an arrow function, which is a concise way to write functions in JavaScript. The arrow function here is used to create a new function that calls deleteUser with a specific argument:
// user._id: Presumably, user is an object that represents a user, and _id is a property of this object, which likely serves as the unique identifier for the user. This is a common pattern when dealing with databases like MongoDB, where each document has an _id field.
// 3. Why Use an Arrow Function?
// Using an arrow function here allows for the inclusion of parameters (user._id) when calling deleteUser. If you were to write onClick={deleteUser(user._id)}, it would call deleteUser immediately when the component renders, not when it is clicked. By wrapping it in an arrow function, you ensure that deleteUser is only called in response to the click event, and not at the time of rendering.

// 4. The deleteUser Function
// deleteUser: This function is likely defined elsewhere in your code. It is responsible for handling the logic to delete a user by their ID, which could involve making an API call to a server to delete the user from a database, and then possibly updating the state of the component to reflect this change.

