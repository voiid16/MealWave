import React from "react";
import { useNavigate } from "react-router-dom";

export function BackButton() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(-1);
    };

    return (
        <button
            className="fixed top-3 left-4 md:left-8 lg:left-12 w-10 h-10 flex items-center justify-center
        rounded-full bg-[#FEF3E2] text-[#EB6424] text-lg md:text-xl
        shadow border border-black/10 transition-colors duration-200
        hover:cursor-pointer hover:bg-[#EB6424] hover:text-[#FEF3E2]"
            onClick={handleClick}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </button>
    );
}
