import React, { useState } from 'react'
import "./adduser.css"
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import toast from 'react-hot-toast'

const AddUser = () => {
    const users = {
        name: "",
        email: "",
        address: "",
    }
    const [user, setUser] = useState(users)
    const navigate = useNavigate;

    //inputHandler to handle changes in the input field
    // e = event Object triggered by the input change
    const inputHandler = (e) => {
        // name is the input field and value is the input value so what the client types. e.target refers to the element that triggered the event.
        const {name, value} = e.target;
        // use spread operator to create new object that spreads update the user state with the new value property
        setUser({...user, [name]: value})
        console.log(name, value);
    };

    const submitForm = async(e) => {
        // cannot type empty values. Prevents the default form submission behavior, which typically causes a page reload.
        e.preventDefault();
        // if theres no empty value post into the database with axios.post
        await axios.post("http://localhost:8000/api/user/", user)
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
        <h3>Add New User</h3>
        <form className = "addUserForm" onSubmit={submitForm}>
            <div className = "inputGroup">
                <label htmlFor='name'>Name:</label>
                <input
                type = "text"
                id = "name"
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

export default AddUser

// what does the AddUser component do?
// 1. Component Setup and State Management
// Initial State Setup with useState
// const users = { name: "", email: "", address: "" }: Defines an initial state object for the form, where name, email, and address are initialized as empty strings.
// const [user, setUser] = useState(users): Initializes a state variable user with the state object users. The setUser function is used to update this state as the form fields are modified.
// 2. Navigation Hook
// Navigation with useNavigate
// const navigate = useNavigate;: It seems like there's a small mistake here. useNavigate should be invoked as a function to get the navigate function from React Router: const navigate = useNavigate();
// This navigate function is used to programmatically navigate to different routes. Here, it's intended to redirect the user to the home route ("/") after successfully creating a user.
// 3. Event Handlers
// Handling Input Changes
// const inputHandler = (e) => {...}: This function handles changes to any of the input fields in the form.
// const {name, value} = e.target;: Destructures name and value from e.target, which represents the HTML input element that triggered the change event. name will match the name attribute of the input element, and value will be its current value.
// setUser({...user, [name]: value}): Updates the user state by creating a new object that spreads in the current user object and updates the property corresponding to the input field's name with the new value. This is a dynamic way to handle multiple inputs with one function.
// console.log(name, value);: Logs the name of the input field and the value it has been changed to.
// 4. Submitting the Form
// const submitForm = async(e) => {...}: Defines an asynchronous function to handle form submission.
// e.preventDefault();: Prevents the default form submission behavior, which typically causes a page reload.
// await axios.post("http://localhost:8000/api/user/", user): Uses axios to send a POST request to the server with the user state object as the payload. This is an asynchronous operation, and await is used to wait for the Promise returned by axios.post to settle.
// .then((response) => {...}): This block is executed if the POST request is successful. It logs a success message to the console and then uses navigate("/") to redirect the user to the home page.
// .catch((error) => {...}): Catches and logs any errors that occur during the POST request. This is crucial for error handling in asynchronous operations.
// Summary
// This component demonstrates a typical pattern in React for handling form inputs and submissions, including state management with useState, handling side effects with hooks like useNavigate, and performing asynchronous operations with axios. The dynamic handling of input fields makes the form scalable and easy to maintain, as adding new fields would only require updating the initial users object and adding corresponding inputs in the JSX. The error in useNavigate usage should be fixed to ensure the intended functionality works correctly.


// Why is setUser not used in useEffect this time?
// Here  setUser is used in two different contexts: handling form input changes and submitting the form. The choice to use setUser directly in these functions, rather than within a useEffect, is based on different considerations compared to data fetching scenarios. Let's explore why setUser is used outside of useEffect in this specific case:
// 1. Real-time State Updates for Form Inputs
// In the inputHandler function, setUser is used to update the state every time an input field's value changes. This approach is crucial for forms because it ensures that the component's state (user) is synchronized with the user's inputs in real time. Here's why it's outside useEffect:

// Immediate Feedback: Using setUser directly inside the event handler allows the state to update immediately after the input changes. This is necessary for interactive forms where the state must always reflect the current input values for validation, displaying input errors, or enabling form buttons.
// Controlled Components: This pattern is typical for "controlled components" in React, where the input forms are controlled by the state. The value of each input is tied directly to the component's state, making the React state the "single source of truth."
// 2. State Updates on Form Submission
// In the submitForm function, setUser could theoretically be used if there were a need to reset the form or update the state in some way upon submission. However, in the code code, setUser isn't used for submission; instead, the form data is sent via axios.post, and navigation occurs afterward. Here's why you might use setUser outside of useEffect in a submission context:

// Post-Submission Actions: If you needed to reset the form or update the user interface based on the submission result, you would call setUser directly within submitForm. For example, after a successful form submission, you might reset the state to clear the form fields.
// 3. Why Not in useEffect?
// Event-Driven Updates vs. Side Effects: The use of setUser in these handlers is driven by specific events (input changes and form submission) rather than by the side effects of data fetching or external data changes, which are typically handled in useEffect.
// Direct Response to User Interaction: These updates need to happen as a direct immediate response to user interactions. Encapsulating these state updates in useEffect would add unnecessary complexity and delay, as useEffect is designed to react to changes in specified dependencies, not to handle immediate, event-driven state updates.
// Summary
// In summary, setUser is used outside useEffect in these cases because it needs to respond immediately and directly to user input and actions in the UI. useEffect, on the other hand, is better suited for handling updates that depend on changes to data fetched from external sources or similar side effects that should be separated from the direct rendering cycle. This distinction helps in managing state updates efficiently and in a way that is predictable and easy to understand in the context of React's rendering and state management paradigms.



// what is onChange = (inputHandler)?
// onChange={inputHandler} is a React event handler attribute used in an <input> element. It specifies a function (inputHandler) that should be called every time the value of the input changes. This is key to implementing controlled components in React forms. Here’s how it works and why it's used:
// 1. Functionality of onChange
// Event Trigger: The onChange attribute assigns an event listener to the input field. Every time a user types into the input, the onChange event is triggered.
// Handling Changes: When the onChange event fires, it executes the function specified by onChange, in this case, inputHandler.
// Event Object: The event handler function (inputHandler) receives an event object as its argument. This object contains various properties, including target, which represents the DOM element that initiated the event. From target, you can access both the name of the input (target.name) and the current value (target.value).

// 2. Role of inputHandler
// Based on the description of the inputHandler, here’s how it interacts with onChange:
// const inputHandler = (e) => {
//     const {name, value} = e.target; // Destructures the name and value from the event's target.
//     setUser({...user, [name]: value}); // Updates the user state with the new value for the given field.
//     console.log(name, value); // Optional: logs the field name and its new value to the console.
// };
// Dynamic State Updates: The handler updates the component's state dynamically based on the name of the input field. This allows the same handler to be used for multiple fields, making the code more efficient and easier to manage.
// Spread Syntax: The {...user, [name]: value} syntax in setUser creates a new object that includes all the properties of the current user state, but with the value of the input field specified by [name] updated to value. This ensures that only the relevant field in the state is updated, preserving the other field values.

// 3.Usage in Controlled Components
// Controlled Component: In React, a controlled component is one where the React state drives the input value. This means the displayed value in the input box is always synchronized with the component's state.
// Value Binding: To fully implement a controlled component, you would also bind the input’s value attribute to a state variable:
        // <input
        // type="text"
        // id="name"
        // name="name"
        // value={user.name}
        // onChange={inputHandler}
        // autoComplete="off"
        // placeholder="Enter your Name"
        // />
// Benefits: This setup gives you complete control over the form's behavior, allowing for things like instant input validation, conditional input disabling, and more complex behaviors like form auto-saving.
// Summary: In summary, onChange={inputHandler} in the input field is crucial for ensuring the form data in the state is up-to-date with what the user inputs. This pattern facilitates effective state management for forms in React applications.

// why does useState not have empty array in this file const [user, setUser] = useState(users) but it does have it in User.jsx file const [users, setUsers] = useState([])?
// The useState hook in React is used to declare state variables in functional components. The initial value you pass to useState determines the starting state for that variable. It does not accept a second argument like the useEffect hook does, which is where you might see an empty array or other values used as dependencies. Here's a clarification on how useState is used in different scenarios:

// Usage of useState
// 1.const [user, setUser] = useState(users):
// In this instance, useState(users) is used to initialize the user state variable with the value of users, which is presumably an object { name: "", email: "", address: "" } as mentioned earlier. This sets up the user variable to hold the form data, which can be updated as a user types into a form.
// No Dependency Array: useState does not use a dependency array or any other second argument. The function call useState(initialValue) only accepts one argument, which is the initial state.
// 2. const [users, setUsers] = useState([]):
// Here, useState([]) initializes the users state variable with an empty array. This is typically used when you expect the state variable to eventually hold a list of items, such as users fetched from an API.
// Singular Argument: Just like the first example, useState here is also called with a single argument, which is the initial value of the state ([] in this case).

// Difference from useEffect
// Dependency Array in useEffect: The confusion might arise because useEffect uses a second argument — a dependency array — that dictates when the effect should rerun. For example, useEffect(() => {...}, []) means the effect runs only once after the initial render, similar to componentDidMount in class components.
// No Dependencies in useState: useState, however, does not concern itself with when state updates should occur. It simply sets the initial state and provides a function (setUser, setUsers) to update that state whenever needed.
// Summary
// To summarize, the syntax and usage of useState you've provided in both cases are correct and typical. The difference in initial values (users object vs. empty array []) reflects what each state variable is intended to hold based on your component's functionality. The useState hook is straightforward in that it only takes the initial state as an argument and doesn't deal with dependencies or conditions for state updates, unlike useEffect.


