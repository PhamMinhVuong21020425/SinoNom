import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LabelImg from './components';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import HomePage from './pages/Home/HomePage/HomePage';
import ImportPage from './pages/Import/Import';
import Yourmodel from './pages/Yourmodel/Yourmodel';
import Contact from './pages/Contact/Contact';
import RequestPage from './pages/Requests/Request';
import ForgotPass from './pages/ForgotPass/ForgotPass';
import AboutUs from './pages/Aboutus/Aboutus';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" Component={HomePage}></Route>
                    <Route path="/annotation-tool" Component={LabelImg} />
                    <Route path="/login" Component={Login} />
                    <Route path="/sign-up" Component={SignUp} />
                    <Route path="/import" Component={ImportPage}></Route>
                    <Route path="/your-model" Component={Yourmodel}></Route>
                    <Route path="/contact" Component={Contact}></Route>
                    <Route path="/request" Component={RequestPage}></Route>
                    <Route path="/forgot-pass" Component={ForgotPass}></Route>
                    <Route path="/about-us" Component={AboutUs}></Route>
                    {/* Add other routes as needed */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
