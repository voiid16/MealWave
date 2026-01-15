import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BackButton } from "../components/BackButton"
import { useAuth } from "../hooks/useAuth"

function SignIn() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        try {
            await login(email, password)
            navigate("/main-page")
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="min-h-screen flex justify-center p-4 bg-background-main text-nunito">
            <main className="w-full max-w-md bg-background-main px-4 pb-8 pt-4 flex flex-col">

                {error && (
                    <div className="mb-4 w-full rounded-md border border-red-400 bg-red-100 text-red-700 text-sm px-3 py-2">
                        {error}
                    </div>
                )}

                <BackButton/>

                <section className="mt-8">
                    <h1 className="text-center font-semibold text-[2rem] sm:text-[2.5rem] md:text-[3rem] text-[#eb5c2b] leading-snug tracking-tight">
                        Welcome back to
                        <span className="text-logo-lobster text-[#f3723b] block mt-1">
              MealWave
            </span>
                    </h1>

                    <form onSubmit={handleSubmit} className="mt-16 flex flex-col gap-4">

                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <label className="text-base font-semibold text-[#eb5c2b]">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full rounded-md border border-gray-400 bg-white px-3 py-2 text-base focus:outline focus:outline-2 focus:outline-[#eb5c2b]"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1">
                            <label className="text-base font-semibold text-[#eb5c2b]">
                                Password
                            </label>
                            <div className="flex items-center rounded-md border border-gray-400 bg-white px-3 py-2 focus-within:outline focus-within:outline-2 focus-within:outline-[#eb5c2b]">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="flex-1 outline-none bg-transparent"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-800 text-lg px-2"
                                >
                                    <i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-8 rounded-md bg-primary text-white text-lg font-semibold py-3 border border-gray-400 shadow"
                        >
                            Log in
                        </button>
                    </form>

                    <div className="mt-4 flex justify-between text-[13px] text-black underline">
                        <Link to="/sign-up">Create an account</Link>
                    </div>
                </section>

            </main>
        </div>
    )
}

export default SignIn
