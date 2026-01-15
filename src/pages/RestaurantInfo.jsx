import React, {useState, useEffect} from 'react';
import {Link, useParams, useNavigate} from 'react-router-dom';
import {
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    collection,
    query,
    orderBy,
    limit,
    getDocs,
    where
} from 'firebase/firestore';
import {db} from '../firebase';
import {useAuth} from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import {BackButton} from '../components/BackButton.jsx';
import {ConfirmModal} from "../components/ConfirmModal.jsx";
import '../css/style.css';

function RestaurantInfo() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {user, loading} = useAuth();
    const [restaurant, setRestaurant] = useState({
        name: 'Restaurant Name',
        image: '',
        cuisine: '—',
        address: '—',
        avgWaitTime: '—'
    });
    const [isFavorite, setIsFavorite] = useState(false);
    const [records, setRecords] = useState([]);
    const [warning, setWarning] = useState('');

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const restaurantDoc = await getDoc(doc(db, 'restaurant', id));
                if (restaurantDoc.exists()) {
                    setRestaurant({id, ...restaurantDoc.data()});
                } else {
                    console.log('No such restaurant!');
                }

                // Fetch records
                const recordsQuery = query(
                    collection(db, 'restaurant', id, 'time_record'),
                    orderBy('submitted_at', 'desc'),
                    limit(5)
                );
                const recordsSnapshot = await getDocs(recordsQuery);
                const fetchedRecords = await Promise.all(
                    recordsSnapshot.docs.map(async (recordDoc) => {
                        const recordData = recordDoc.data();
                        let userData = null;

                        if (recordData.user_id) {
                            const userDoc = await getDoc(doc(db, 'users', recordData.user_id));
                            if (userDoc.exists()) {
                                userData = userDoc.data();
                            }
                        }

                        return {
                            id: recordDoc.id,
                            ...recordData,
                            user: userData,
                        };
                    })
                );

                setRecords(fetchedRecords);

                // Check if restaurant is in user's favorites
                if (user) {
                    const favListRef = collection(db, 'users', user.uid, 'favorite_list');
                    const q = query(favListRef, where('restaurant_id', '==', id));
                    const snapshot = await getDocs(q);
                    setIsFavorite(!snapshot.empty);
                }
            } catch (error) {
                console.error('Error fetching restaurant data:', error);
            }
        };

        fetchRestaurantData();
    }, [id, user]);

    const handleFavoriteToggle = async () => {
        if (!user) {
            navigate('/sign-in');
            return;
        }

        const favListRef = collection(db, 'users', user.uid, 'favorite_list');
        // Find if this restaurant is already in favorites
        const q = query(favListRef, where('restaurant_id', '==', id));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            // Add to favorites
            const newFavRef = doc(favListRef);
            await setDoc(newFavRef, {restaurant_id: id});
            setIsFavorite(true);
        } else {
            // Remove from favorites
            const favDocId = snapshot.docs[0].id;
            await deleteDoc(doc(favListRef, favDocId));
            setIsFavorite(false);
        }
    };

    const handleAddRecord = () => {
        if (!loading && !user) {
            setWarning('You must be signed in to add a record.');
            // Redirect after 2 seconds
            const timer = setTimeout(() => {
                navigate('/sign-in');
            }, 3000);

            // Cleanup
            return () => clearTimeout(timer);
        }
        navigate(`/add-record/${id}`);
    };

    return (
        <div className="bg-background-main text-nunito mx-auto">
            {warning && (
                <div className="w-full bg-yellow-200 text-yellow-900 text-center py-3 font-semibold">
                    {warning}
                </div>
            )}
            {/* Header */}
            <header>
                <div className="flex justify-between w-full px-4 py-3 bg-[#FEF3E2]">
                    <BackButton/>
                    <div id="restaurant-name" className="flex-1 self-center text-center text-2xl text-title font-bold">
                        {restaurant.name}
                    </div>
                    <button
                        onClick={handleFavoriteToggle}
                        className="w-10 h-10 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-[#FEF3E2] text-[#EB6424] text-lg shadow border border-black/10 transition-all duration-200 hover:cursor-pointer hover:bg-[#EB6424] group"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 md:w-6 md:h-6 transition-all duration-200"
                            viewBox="0 0 24 24"
                            fill={isFavorite ? "#FEF3E2" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                className={`group-hover:fill-[#FEF3E2] group-hover:stroke-[#FEF3E2] ${
                                    isFavorite ? "fill-[#EB6424] stroke-[#EB6424]" : ""
                                }`}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 12.572l-7.5 7.428l-7.5-7.428a5 5 0 1 1 7.5-6.566a5 5 0 1 1 7.5 6.572"
                            />
                        </svg>
                    </button>
                </div>

                {/* Restaurant image */}
                <div className="flex flex-col sm:flex-row gap-4 my-6 justify-center items-center w-[80%] mx-auto">
                    <img
                        src={restaurant.image_url || '/images/MealWaveLogo.png'}
                        alt="Restaurant Image"
                        className="w-full sm:w-1/2 max-w-[400px] rounded-2xl shadow-lg object-cover"
                    />
                </div>

                {/* Overview */}
                <div className="m-4 md:m-8 mt-8 p-4 bg-backgroud-card rounded-2xl shadow-md">
                    <h2 className="text-xl md:text-2xl font-semibold text-[#EB6424] mb-2">
                        Overview
                    </h2>
                    <section className="rounded-2xl border border-gray-200 bg-background-main p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 justify-between">
                            <h3 className="text-md md:text-lg font-bold text-title w-[60%] md:w-fit">
                                {restaurant.name}
                            </h3>
                            <span
                                className="inline-flex items-center rounded-full bg-backgroud-card px-3 py-1 text-sm font-medium text-[#EB6424] outline-1 outline-[#89AC46]">
                {restaurant.cuisine}
              </span>
                        </div>
                        <div className="flex items-start gap-3">
                            <svg
                                className="mt-0.5 h-5 w-5 text-[#89AC46]"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M12 21s-7-5.33-7-11a7 7 0 1 1 14 0c0 5.67-7 11-7 11Z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            <div className="flex flex-col gap-1">
                                <p className="text-title">{restaurant.address}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 mt-4">
                            <svg
                                className="h-5 w-5 text-[#89AC46]"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 6v6l3 3"></path>
                            </svg>
                            <p className="text-title font-medium">
                                Average wait time:
                                <span className="text-[#89AC46] font-semibold">
                  {Math.round(Number(restaurant.avg_wait_time)) || 'N/A'} minutes
                </span>
                            </p>
                        </div>
                    </section>
                </div>
            </header>

            {/* Past records + Add Record button */}
            <section className="m-4 md:m-8 mt-8 text-nunito">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                    <h2 className="text-xl md:text-2xl font-semibold text-[#EB6424] self-start sm:self-auto w-full sm:w-auto text-left sm:text-left">
                        Past Waiting Times
                    </h2>
                    <button
                        onClick={handleAddRecord}
                        className="mt-2 sm:mt-0 flex items-center gap-2 px-3 py-1.5 bg-[#FEF3E2] text-[#EB6424] rounded-full border border-[#EB6424]/30 transition-all duration-200 group hover:bg-[#EB6424] hover:text-[#FEF3E2] hover:shadow-md hover:-translate-y-[1px] self-center sm:self-auto"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"/>
                            <path d="M13.5 6.5l4 4"/>
                            <path d="M16 19h6"/>
                            <path d="M19 16v6"/>
                        </svg>
                        <span className="text-sm font-medium">Add a record</span>
                    </button>
                </div>
            </section>

            {/* User feedback */}
            <section className="m-4 md:m-8 mt-4 mb-20 text-nunito">
                <div className="max-w-2xl mx-auto p-4 bg-backgroud-card rounded-2xl shadow-md">
                    <div id="records-container">
                        {records.map((record) => (
                            <div key={record.id} className="mb-4 p-3 bg-white rounded-lg shadow">
                                <div className="flex items-center gap-2 mb-1">
                                    <img src={record.user?.avatar || '/images/default-avatar.jpg'} alt="User Avatar"
                                         className="w-6 h-6 rounded-full"/>
                                    <span className="font-semibold">{record.user?.name || "Anonymous"}</span>
                                    {/* Rating stars */}
                                    <span className="flex items-center ml-2">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-4 h-4 ${i < record.rating ? "text-yellow-400" : "text-gray-300"}`}
                                                fill={i < record.rating ? "#FBBF24" : "none"}
                                                stroke="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <polygon
                                                    points="10,1 12.59,7.36 19.51,7.36 13.96,11.64 16.55,18 10,13.72 3.45,18 6.04,11.64 0.49,7.36 7.41,7.36"/>
                                            </svg>
                                        ))}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">{record.submitted_at.toDate().toLocaleString()}</p>
                                <p className="mt-1">{record.text}</p>
                                <p className="mt-1 text-sm font-bold">Wait Time: {record.wait_time_minutes} minutes</p>
                                <p className="mt-1 text-sm font-bold">Comment: {record?.comments || 'User does not leave a comment'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <ConfirmModal/>
            <Navbar/>
        </div>
    );
}

export default RestaurantInfo;
