import React from 'react';
import {Link,Route,Routes,Navigate,useNavigate} from 'react-router-dom';
import "../public/styles/styles.css";

import Login from './pages/Login.jsx';
import Home from "./pages/Home.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import Test2 from "./pages/Test2.jsx";
import APITestPage from "./pages/APITestPage.jsx";
import Entries from "./pages/Entries.jsx";
import NewEntry from './pages/NewEntry.jsx';
import Signup from './pages/Signup.jsx';
import SingleEntry from './pages/SingleEntry.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

const App = () => {
    const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/Home');
  };
  const newEntry = () => {
    navigate("/NewEntry")
  }

  return (
    <div>

   
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/ContactPage" element={<PrivateRoute element={<ContactPage />} />} />
        <Route path="/test2" element={<PrivateRoute element={<Test2 />} />} />
        <Route path="/APITestPage" element={<PrivateRoute element={<APITestPage />} />} />
        <Route path="/Entries" element={<PrivateRoute element={<Entries />} />} />
        <Route path="/NewEntry" element={<PrivateRoute element={<NewEntry />} />} />
        <Route path="/SingleEntry/:id" element={<PrivateRoute element={<SingleEntry />} />} />
      </Routes>
   
    </div>
  )
}

export default App