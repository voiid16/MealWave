// src/pages/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../components/BackButton.jsx';
import { useAuth } from '../hooks/useAuth';
import '../css/style.css';


function SignUp() {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup(formData.email, formData.password, formData.name);
            navigate('/main-page');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen flex justify-center p-4 bg-background-main text-nunito">
            <main className="w-full max-w-md bg-background-main px-4 pb-8 pt-4 flex flex-col">
                {error && (
                    <div className="w-full rounded-md border border-red-400 bg-red-100 text-red-700 text-sm px-3 py-2" role="alert">
                        {error}
                    </div>
                )}
                <BackButton/>
                <section className="mt-8 flex flex-col">
                    <h1 className="text-center text-4xl font-bold text-[#eb5c2b]">
                        Create your<br />MealWave account!
                    </h1>
                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="signupName" className="text-base font-semibold text-[#eb5c2b]">Username</label>
                            <input
                                id="signupName"
                                name="name"
                                type="text"
                                className="w-full rounded-md border border-gray-400 bg-white px-3 py-2 text-base focus:outline focus:outline-2 focus:outline-[#eb5c2b] focus:border-[#eb5c2b]"
                                placeholder="your Username"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="signupEmail" className="text-base font-semibold text-[#eb5c2b]">Email</label>
                            <input
                                id="signupEmail"
                                name="email"
                                type="email"
                                className="w-full rounded-md border border-gray-400 bg-white px-3 py-2 text-base focus:outline focus:outline-2 focus:outline-[#eb5c2b] focus:border-[#eb5c2b]"
                                placeholder="you@example.com"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="signupPassword" className="text-base font-semibold text-[#eb5c2b]">Password</label>
                            <div className="w-full flex items-center rounded-md border border-gray-400 bg-white px-3 py-2 focus-within:outline focus-within:outline-2 focus-within:outline-[#eb5c2b] focus-within:border-[#eb5c2b]">
                                <input
                                    id="signupPassword"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    className="flex-1 outline-none text-base bg-transparent"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                                <button type="button" onClick={() => setShowPassword(v => !v)} className="text-gray-800 text-lg px-2">
                                    <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                            <ul className="mt-3 space-y-1 text-black">
                                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-black text-sm"></i><span>At least 8 characters</span></li>
                                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-black text-sm"></i><span>Contains a letter or symbol</span></li>
                                <li className="flex items-center gap-2"><i className="fa-solid fa-check text-black text-sm"></i><span>Contains a number</span></li>
                            </ul>
                        </div>
                        <button
                            type="submit"
                            className="w-full mt-8 rounded-md bg-gray-300 text-[#eb5c2b] text-lg font-semibold py-3 border border-gray-400 shadow hover:bg-[#eb5c2b] hover:cursor-pointer hover:text-white"
                        >
                            Create Account
                        </button>
                    </form>
                    <div className="mt-4 flex flex-col text-center text-[13px] text-black">
                        <p>
                            Already have an account?
                            <a href="/sign-in" className="underline text-[#eb5c2b] hover:opacity-80 hover:cursor-pointer ml-1">
                                Log in
                            </a>
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default SignUp;
