import React, {useState, useEffect} from "react";
import {db} from "../firebase";
import {collection, doc, getDocs, getDoc, deleteDoc} from "firebase/firestore";
import {ConfirmModal} from "../components/ConfirmModal.jsx";
import Navbar from "../components/Navbar";
import {useAuth} from "../hooks/useAuth.js";
import {useNavigate} from "react-router-dom";
import {BackButton} from "../components/BackButton.jsx";

function Favorites() {
    const navigate = useNavigate();
    const {user, loading} = useAuth()
    const [favorites, setFavorites] = useState([]);
    const [userData, setUserData] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [toDelete, setToDelete] = useState(null);

    useEffect(() => {
        if (loading) return;
        if (!user) {
            navigate("/sign-in")
            return;
        }
        //
        // if (user) {
        //     async function fetchUserData() {
        //         if (user) {
        //             const docRef = doc(db, 'users', user.uid);
        //             const docSnap = await getDoc(docRef);
        //             if (docSnap.exists()) {
        //                 setUserData(docSnap.data());
        //             }
        //         }
        //     }
        //     fetchUserData();
        // }
        loadFavoritesForUser(user.uid);
    }, [user, loading]);

    async function loadFavoritesForUser(uid) {
        const favoritesRef = collection(db, "users", uid, "favorite_list");
        const favoriteDocs = await getDocs(favoritesRef);
        if (favoriteDocs.empty) {
            setFavorites([]);
            return;
        }
        const favs = [];
        for (let favDoc of favoriteDocs.docs) {
            const favData = favDoc.data();
            const restaurantId = favData.restaurant_id;
            const restaurantRef = doc(db, "restaurant", restaurantId);
            const restaurantSnap = await getDoc(restaurantRef);
            const restaurant = restaurantSnap.data();
            if (restaurant) {
                favs.push({
                    favoriteId: favDoc.id,
                    restaurantId,
                    name: restaurant.name,
                    address: restaurant.address,
                    image_url: restaurant.image_url,
                    avg_wait_time: restaurant.avg_wait_time,
                });
            }
        }
        setFavorites(favs);
    }

    function handleRestaurantClick(restaurantId) {
        navigate(`/restaurant/${restaurantId}`);
    }

    function handleRemoveClick(e, favorite) {
        e.stopPropagation();
        setToDelete(favorite);
        setModalOpen(true);
    }

    async function handleConfirmRemove() {
        if (!user || !toDelete) return;
        const favDocRef = doc(db, "users", user.uid, "favorite_list", toDelete.favoriteId);
        await deleteDoc(favDocRef);
        setModalOpen(false);
        setToDelete(null);
        await loadFavoritesForUser(user.uid);
    }

    return (
        <div className="bg-background-main text-nunito min-h-screen">
            <div
                className="bg-[#fa9500] text-[#FEF3E2] text-5xl font-extrabold text-center p-3 mb-5 fixed top-0 w-full text-logo-lobster z-20">
                MealWave
            </div>
            <div className="fixed top-4 left-4 z-30">
                <BackButton/>
            </div>
            <main className="flex flex-col items-center mt-24 mb-10 space-y-6 w-full mx-auto px-4">
                <header className="w-full max-w-4xl mx-auto px-4 mb-0">
                    <h1 className="text-2xl font-bold text-title">Favorites</h1>
                    <p className="text-title">Your saved restaurants in one place.</p>
                </header>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 mb-20 w-full max-w-4xl mx-auto">
                    {favorites.length === 0 ? (
                        <div className="max-w-2xl w-9/12 mx-auto my-20 p-4 bg-backgroud-card rounded-2xl shadow-md">
                            <p className="text-gray-500 text-center">You don't have any favorites yet.</p>
                        </div>
                    ) : (
                        favorites.map((restaurant) => (
                            <div
                                key={restaurant.favoriteId}
                                className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => handleRestaurantClick(restaurant.restaurantId)}
                            >
                                <img
                                    src={restaurant.image_url || "/images/MealWaveLogo.png"}
                                    alt={restaurant.name || "Restaurant"}
                                    className="w-full h-32 object-cover rounded-t-lg mb-2"
                                />
                                <div className="flex flex-col min-h-fit">
                                    <div className="flex flex-row justify-between">
                                        <div>
                                            <span className="font-bold sm:text-lg text-md text-title">{restaurant.name || "Restaurant"}</span>
                                            <p className="text-secondary text-sm text-gray-900">{restaurant.address || "No address available"}</p>
                                        </div>
                                        <button
                                            type="button"
                                            className="delete-btn text-[#fa9500] hover:text-[#eb6424] hover:cursor-pointer"
                                            onClick={(e) => handleRemoveClick(e, restaurant)}
                                        >
                                            <i className="fa-solid fa-trash text-lg"></i>
                                        </button>
                                    </div>
                                    <span className="text-green-dark mt-1">
                                        Avg Wait: {restaurant.avg_wait_time >= 0 ? `${restaurant.avg_wait_time.toFixed(1)} min` : "—"}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </main>
            <ConfirmModal
                open={modalOpen}
                buttonLabel="Remove"
                message={toDelete ? `Remove ${toDelete.name} from your favorites?` : ""}
                onConfirm={handleConfirmRemove}
                onClose={() => setModalOpen(false)}
            />
            <Navbar/>
        </div>
    );
}

export default Favorites;