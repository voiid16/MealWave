import {Link} from "react-router-dom"

export default function Home() {
    return (
        <div
            className="w-screen h-screen flex flex-col justify-center items-center"
            style={{
                backgroundImage: "url(/images/orange-background.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="w-full max-w-screen-md text-center">
                <h1 className="text-6xl text-logo-lobster text-highlight font-bold leading-none mt-3 mb-8">
                    MealWave
                    <br/>
                    <span
                        className="text-2xl text-white text-nunito drop-shadow-2xl inline-block scale-105 hover:scale-110 transition-transform">
                        Know the Wait Before You Go
                    </span>
                </h1>
                <div className="w-2/3 mt-4 mb-4 flex flex-col items-center gap-2 mx-auto">
                    <Link
                        to="/sign-in"
                        className="w-full inline-flex items-center justify-center rounded-full bg-[#eb6424] text-white/90 text-lg px-4 py-2"
                    >
                        Sign in
                    </Link>
                    <Link
                        to="/sign-up"
                        className="w-full inline-flex items-center justify-center rounded-full border bg-white/90 text-[#eb6424] border-white text-lg px-4 py-2"
                    >
                        Create an account
                    </Link>
                    <Link
                        to="/main-page"
                        className="text-gray-700 self-start underline pl-4"
                    >
                        Continue as a guest
                    </Link>
                </div>
            </div>
        </div>
    )
}
