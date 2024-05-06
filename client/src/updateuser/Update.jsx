import React, { useEffect, useState } from 'react'
import "./update.css"
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from "axios"
import toast from 'react-hot-toast'

// Majoriy of code uses the same code as the AddUser.jsx except the useParams,useEffect,axios.put

const UpdateUser = () => {
    const users = {
        name: "",
        email: "",
        address: "",
    }
    const [user, setUser] = useState(users)
    const navigate = useNavigate;
    const {id} = useParams();

    //inputHandler to handle changes in the input field
    // e = event Object triggered by the input change
    const inputHandler = (e) => {
        // name is the input field and value is the input value so what the client types. e.target refers to the element that triggered the event.
        const {name, value} = e.target;
        // use spread operator to create new object that spreads update the user state with the new value property
        setUser({...user, [name]: value})
        console.log(name, value);
    };

    useEffect (()=> {
        //getting user with specific id. Need backticks for this. The id here is extracted from the parameter that was initialized up top.
        axios.get(`http://localhost:8000/api/user/${id}`)
        // if this "get" is successful set the user with that specific id.
        .then((response) => {
            setUser(response.data)
        })
        // catch if there are any errors
        .catch((error)=> {
            console.log(error)
        });
        // id means effect will run when id variable changes
    },[id])

    const submitForm = async(e) => {
        // cannot type empty values. Prevents the default form submission behavior, which typically causes a page reload.
        e.preventDefault();
        // need backtics to put the id in the url
        await axios.put(`http://localhost:8000/api/update/user/${id}`, user)
        // once its sent to database give a success message.
        .then((response) => {
            toast.success(response.data.message,{position:"top-right"})
            // navigate to homepage
            navigate("/")
        })
        .catch((error) => {
            console.log(error)
        })
    }
  return (
    <div className = "addUser">
        {/* bootstrap button element is replaced with Link */}
        <Link to = "/" type="button" class="btn btn-secondary">
            {/* font awesome */}
        <i class="fa-solid fa-backward"></i> Back
        </Link>
        <h3>Update User</h3>
        <form className = "addUserForm" onSubmit={submitForm}>
            <div className = "inputGroup">
                <label htmlFor='name'>Name:</label>
                <input
                type = "text"
                id = "name"
                value={user.name}
                onChange = {inputHandler}
                name = "name"
                autoComplete = "off"
                placeholder = "Enter your Name"
                />
            </div>
            <div className = "inputGroup">
                <label htmlFor='email'>E-mail:</label>
                <input
                type = "email"
                id = "email"
                value={user.email}
                onChange = {inputHandler}
                name = "email"
                autoComplete = "off"
                placeholder = "Enter your Email"
                />
            </div>
            <div className = "inputGroup">
                <label htmlFor='address'>Address:</label>
                <input
                type = "text"
                id = "address"
                value={user.address}
                onChange = {inputHandler}
                name = "address"
                autoComplete = "off"
                placeholder = "Enter your Address"
                />
            </div>
            <div className = "inputGroup">
                <button type="submit" class="btn btn-primary">
                    Submit
                </button>

            </div>
        </form>
    </div>
  )
}

export default UpdateUser

// How the useEffect is used here?
// 1. Understanding useEffect
// useEffect Hook: This is a React hook that is used for side effects in functional components. Side effects are operations that can affect other components or can't be done during rendering, such as data fetching, subscriptions, timers, logging, and manually changing the DOM.
// Function as First Argument: The first argument to useEffect is a function that React will run after flushing changes to the DOM. This function performs the side effect.
// Dependency Array as Second Argument [id]: The second argument is an array of dependencies. React will only re-run the side effect if the values in this list change. In your case, the effect depends on id, which means if id changes, the effect will re-run. This is typically used when the component needs to react to changes in props or state to re-fetch data based on a new identifier.
// 2. Axios Data Fetching
// axios.get(...): Axios is used here to make an HTTP GET request to a specific URL. The URL includes a variable part, id, which is interpolated into the string. This id is presumably a prop or state variable that identifies which user data to fetch, e.g., from a database.
// .then((response) => {...}): This is a promise handler that runs if the HTTP request is successful. response contains the server's response to the request. setUser(response.data) inside this handler suggests that the response includes user data, and this data is being stored in the state using setUser, which updates the component's state with the new user data.
// .catch((error) => {...}): This catches any errors that occur during the HTTP request. The error is logged to the console in this case, which could be useful for debugging or user notifications in a more developed application.
// 3. Use Case
// The typical use case for this pattern is in a component designed to edit or update a specific user's data. Here's how it might function:

// Initial Load: When the component mounts, or if the id changes, the useEffect will execute, triggering the Axios call to fetch the most recent user data from the server based on the id.
// Data Update: If the server responds with new user data, the component state is updated with setUser(response.data), causing the component to re-render with the latest data.
// Error Handling: If there's an issue with the network request (like a network error or the requested resource doesn't exist), the error is logged. Ideally, you would also handle this in a user-friendly way, such as displaying a message.


// How is useParams() used?
// The line of code const {id} = useParams(); is used within a React component to extract the parameter id from the URL path. This is part of React Router, which is a library used to handle routing in React applications. Here's a breakdown of how it works:

// React Router and useParams
// useParams Hook: This is a hook provided by React Router that returns an object containing all the URL parameters according to the path defined in the <Route> component. For example, if a route is defined as <Route path="/user/:id">, then useParams will allow you to access the id part of the URL when a user visits a URL like /user/123.
// Destructuring id
// Destructuring Assignment: const {id} = useParams(); uses JavaScript's destructuring assignment to extract the id property from the object returned by useParams(). This makes id directly accessible as a variable within your component.
