import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Navbar from '../components/Navbar';
import {BackButton} from '../components/BackButton.jsx';
import {useAuth} from '../hooks/useAuth';
import '../css/style.css';
import '../css/profile.css';
import {db} from '../firebase';
import {doc, getDoc} from 'firebase/firestore'

function Profile() {
    const navigate = useNavigate();
    const {user, loading, logout} = useAuth();
    const [userData, setUserData] = useState(null);
    // const [profileImage, setProfileImage] = useState('/images/default-avatar.jpg');
    //
    // useEffect(() => {
    //     if (user && user.avatar) {
    //         setProfileImage(user.avatar);
    //     }
    // }, [user]);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/sign-in');
        }
        // Fetch user profile from Firestore
        async function fetchUserData() {
            if (user) {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
            }
        }
        fetchUserData();
    }, [user, loading, navigate]);

    const handleUpdateProfile = () => {
        // TODO: Implement update profile logic
    };

    const handleChangePassword = () => {
        // TODO: Implement change password logic
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/sign-in');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    const toggleAccordion = (id) => {
        const content = document.getElementById(`content-${id}`);
        const icon = document.getElementById(`icon-${id}`);
        content.classList.toggle('hidden');
        icon.classList.toggle('rotate-180');
    };

    return (
        <div className="bg-background-main text-nunito text-[#eb6424]">
            <div className="fixed top-4 left-4 z-30">
                <BackButton/>
            </div>
            <div className="flex flex-col justify-center items-center pt-4 my-10 px-4">
                {/* Profile image container */}
                <div className="relative w-32 h-32 md:w-35 md:h-35">
                    <img
                        id="profileImage"
                        className="w-full h-full rounded-full border-4 md:border-5 border-slate-50 object-cover"
                        src={userData?.avatarUrl || '/images/default-avatar.jpg'}
                        alt="Profile image"
                    />
                    <label
                        htmlFor="profileImageInput"
                        className="absolute bottom-1 right-1 w-8 h-8 md:w-10 md:h-10 bg-white shadow-md rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition"
                    >
                        {/* Camera icon SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                             fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                                  clipRule="evenodd"/>
                        </svg>
                    </label>
                    <input
                        id="profileImageInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                    />
                </div>

                <h1 id="userName" className="text-4xl md:text-5xl font-bold my-4 text-center">
                    {userData?.name || ''}
                </h1>
                <p className="text-lg text-center">
                    Email: {userData?.email || 'No email'}
                </p>

                {/* Account Settings */}
                <div className="flex flex-col w-full max-w-sm md:max-w-md text-left space-y-2">
                    <h2 className="text-xl md:text-2xl font-bold mb-4">Account Settings</h2>

                    <button onClick={handleUpdateProfile} className="profile-btn rounded-t-lg">
                        Update Profile
                    </button>

                    <button onClick={handleChangePassword} className="profile-btn rounded-b-lg border-t-0">
                        Change Password
                    </button>

                    {/* More Information */}
                    <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4">
                        More From MealWave
                    </h2>

                    {/* About Us Accordion */}
                    <button onClick={() => toggleAccordion('about')} className="accordion-btn rounded-t-lg">
                        About Us
                    </button>
                    <div id="content-about" className="accordion-content pb-3 text-black hidden">
                        <p className="text-sm md:text-base">
                            We are dedicated to helping diners plan their restaurant visits more
                            efficiently by sharing and browsing real-time wait times from the
                            community.
                        </p>
                    </div>

                    {/* FAQ Accordion */}
                    <button onClick={() => toggleAccordion('faq')} className="accordion-btn border-t-0">
                        Frequently Asked Questions
                    </button>
                    <div id="content-faq" className="accordion-content pb-3 text-black hidden">
                        <p className="text-sm md:text-base">Question: How do I log out?</p>
                        <p className="text-sm md:text-base">
                            Answer: At the bottom of this page.
                        </p>
                    </div>

                    {/* Contact Information Accordion */}
                    <button onClick={() => toggleAccordion('contact')} className="accordion-btn border-t-0">
                        Contact Information
                    </button>
                    <div id="content-contact" className="accordion-content text-black hidden">
                        {/* Contact information content */}
                    </div>

                    {/* Report an Issue Accordion */}
                    <button onClick={() => toggleAccordion('report')} className="accordion-btn rounded-b-lg border-t-0">
                        Report an Issue
                    </button>
                    <div id="content-report" className="accordion-content hidden">
                        {/* Report an issue content */}
                    </div>

                    {/* Logout Button */}
                    <button onClick={handleLogout} className="logout-btn mt-10">
                        Log out
                    </button>
                </div>

                {/* Copyright */}
                <div
                    className="my-10 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm w-full max-w-sm md:max-w-md">
                    <p>&copy; 2025 MealWave. All rights reserved.</p>
                </div>
            </div>
            <Navbar/>
        </div>
    );
}

export default Profile;
