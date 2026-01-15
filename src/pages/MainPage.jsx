import React, {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import {collection, getDocs, query, where, orderBy, limit} from 'firebase/firestore';
import {db} from '../firebase';
import '../css/style.css';

function MainPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    const fetchRestaurants = async () => {
        try {
            const restaurantsRef = collection(db, 'restaurant');
            const q = query(restaurantsRef, orderBy('name'), limit(20));
            const querySnapshot = await getDocs(q);
            const fetchedRestaurants = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            const randomRestaurants = shuffle(fetchedRestaurants).slice(0, 6);
            setRestaurants(randomRestaurants);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    };

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (value.length > 2) {
            const filtered = restaurants.filter(restaurant =>
                restaurant.name.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    return (
        <div className="bg-background-main text-nunit min-h-screen">
            <div
                className="bg-[#fa9500] text-[#FEF3E2] text-center p-1 fixed top-0 w-full text-logo-lobster z-20 h-12 flex items-center justify-center">
                MealWave
            </div>
            <div className="pt-14">


                {/* Search bar */}
                <div className="relative w-full max-w-md mx-auto mt-25 z-10 md:w-[70%] md:max-w-2xl">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                        />
                    </svg>

                    <input
                        type="search"
                        placeholder="Search restaurants here..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="border-[#eb6424] border-2 rounded-full p-2 pl-10 pr-10 w-full max-w-md sm:max-w-lg md:max-w-2xl focus:outline-none"
                    />

                    {suggestions.length > 0 && (
                        <div
                            className="absolute left-0 right-0 mt-2 bg-background-main text-[#eb6424] border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                            {suggestions.map(restaurant => (
                                <Link
                                    key={restaurant.id}
                                    to={`/restaurant/${restaurant.id}`}
                                    className="block px-4 py-2 hover:bg-gray-100"
                                >
                                    {restaurant.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Welcome Banner */}
                <div className="max-w-md mt-6 mx-4 md:mx-auto md:max-w-lg">
                    <h1 className="text-xl font-bold leading-none mt-3 mb-3 text-title">
                        Welcome to MealWave
                    </h1>
                    <p className="text-title">
                        Check the current wait times and plan your next meal smarter.
                    </p>
                </div>

                {/* Add Restaurant Button */}
                <div className="max-w-4xl mx-auto mt-5 flex justify-end px-4">
                    <Link
                        to="/add-restaurant"
                        className="bg-primary text-white font-semibold py-2 px-4 rounded-full shadow-md transition"
                    >
                        + Add a Restaurant
                    </Link>
                </div>

                {/* Restaurant grid */}
                <div
                    className="max-w-6xl mx-auto mt-6 mb-32 p-24 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 justify-center place-items-center text-green-dark bg-background-main rounded-lg overflow-y-auto max-h-[585px] md:max-h-[750px]">
                    {restaurants.map(restaurant => (
                        <Link
                            key={restaurant.id}
                            to={`/restaurant/${restaurant.id}`}
                            className="bg-white rounded-lg shadow-md p-4 w-full"
                        >
                            <img
                                src={restaurant.image_url || '/images/MealWaveLogo.png'}
                                alt={restaurant.name}
                                className="w-full h-32 object-cover rounded-t-lg mb-2"
                            />
                            <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                            <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                            <p className="text-sm text-gray-600">Avg. Wait: {Math.round(Number(restaurant.avg_wait_time)) || 'N/A'} minutes</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MainPage;
