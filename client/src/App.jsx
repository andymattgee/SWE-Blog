//this page is main entry point for the application.

//Import necessary dependencies and components
import React from 'react';
import {Link,Route,Routes,Navigate,useNavigate} from 'react-router-dom';
import "../public/styles/styles.css";

//importing all the 'pages' (components) from other .JSX files 
import Login from './pages/Login.jsx';
import Home from "./pages/Home.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import Test2 from "./pages/Test2.jsx";
import APITestPage from "./pages/APITestPage.jsx";
import Entries from "./pages/Entries.jsx";
import NewEntry from './pages/NewEntry.jsx';
import Signup from './pages/Signup.jsx';
import SingleEntry from './pages/SingleEntry.jsx';
import EditEntry from './pages/EditEntry.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Todos from './pages/Todos.jsx';
import CreateTodo from './pages/CreateTodo.jsx';
import SingleTodo from './pages/SingleTodo.jsx';

/**
 * Main application component that defines the routing structure.
 * It uses React Router DOM for navigation and route guarding.
 */
const App = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate
  const token = localStorage.getItem('token'); // Retrieve authentication token from local storage

  return (
    <div>
      <Routes>
        {token ? (
          // Routes accessible when the user is authenticated
          <>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<PrivateRoute element={<Home />} />} />
            <Route path="/contactpage" element={<PrivateRoute element={<ContactPage />} />} />
            <Route path="/test2" element={<PrivateRoute element={<Test2 />} />} />
            <Route path="/apitestpage" element={<PrivateRoute element={<APITestPage />} />} />
            <Route path="/entries" element={<PrivateRoute element={<Entries />} />} />
            <Route path="/newentry" element={<PrivateRoute element={<NewEntry />} />} />
            <Route path="/singleentry/:id" element={<PrivateRoute element={<SingleEntry />} />} />
            <Route path="/editentry/:id" element={<PrivateRoute element={<EditEntry />} />} />
            <Route path="/todos" element={<PrivateRoute element={<Todos />} />} />
            <Route path="/createtodo" element={<PrivateRoute element={<CreateTodo />} />} />
            <Route path="/singletodo/:id" element={<PrivateRoute element={<SingleTodo />} />} />
          </>
        ) : (
          // Routes accessible when the user is not authenticated
          <>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default App