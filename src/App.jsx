import React from 'react'
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom'
import Navbar from './components/Navbar'
import MainPage from './pages/MainPage'
import AddRecord from './pages/AddRecord'
import AddRestaurant from './pages/AddRestaurant'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import RestaurantInfo from './pages/RestaurantInfo'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Home from './pages/Home'

function AppContent() {
    const location = useLocation();
    const hideNavbar = location.pathname === '/';
    return (
        <div className="App">
            {!hideNavbar && <Navbar/>}
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/main-page" element={<MainPage/>}/>
                <Route path="/add-record/:id" element={<AddRecord/>}/>
                <Route path="/add-restaurant" element={<AddRestaurant/>}/>
                <Route path="/favorites" element={<Favorites/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/restaurant/:id" element={<RestaurantInfo/>}/>
                <Route path="/sign-in" element={<SignIn/>}/>
                <Route path="/sign-up" element={<SignUp/>}/>
            </Routes>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App
