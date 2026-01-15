import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {doc, getDoc, addDoc, collection, updateDoc, serverTimestamp, Timestamp} from 'firebase/firestore';
import {db} from '../firebase';
import {useAuth} from '../hooks/useAuth';
import {BackButton} from '../components/BackButton.jsx';
import Navbar from '../components/Navbar';
import '../css/style.css';

function AddRecord() {
    const {id: restaurantId} = useParams();
    const navigate = useNavigate();
    const {user, loading} = useAuth();
    const [userData, setUserData] = useState();
    const [restaurantName, setRestaurantName] = useState('Restaurant Name');
    const [formData, setFormData] = useState({
        recordDate: '',
        recordTime: '',
        waitingTime: '',
        rating: 0,
        comments: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
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
        }

    }, [user, loading, navigate])

    useEffect(() => {
        const fetchRestaurantName = async () => {
            try {
                const restaurantDoc = await getDoc(doc(db, 'restaurant', restaurantId));
                if (restaurantDoc.exists()) {
                    setRestaurantName(restaurantDoc.data().name);
                } else {
                    setError('Restaurant not found');
                }
            } catch (error) {
                console.error('Error fetching restaurant name:', error);
                setError('Error fetching restaurant data');
            }
        };

        fetchRestaurantName();
    }, [restaurantId]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleStarRating = (rating) => {
        setFormData(prevState => ({
            ...prevState,
            rating
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in to submit a record');
            return;
        }

        const visitDateTime = new Date(`${formData.recordDate}T${formData.recordTime}`);
        const visitTimestamp = Timestamp.fromDate(visitDateTime);
        const recordData = {
            user_id: user.uid,
            wait_time_minutes: Number(formData.waitingTime),
            visit_timestamp: visitTimestamp,
            rating: formData.rating,
            comments: formData.comments,
            submitted_at: serverTimestamp(),
        }

        try {
            // Add record to the restaurant's comments subcollection
            await addDoc(collection(db, 'restaurant', restaurantId, 'time_record'), recordData);

            // Update restaurant's average wait time
            const restaurantRef = doc(db, 'restaurant', restaurantId);
            const restaurantDoc = await getDoc(restaurantRef);
            const currentData = restaurantDoc.data();
            const currentTotalWaitTime = currentData.avg_wait_time * (currentData.total_record_number || 0) + recordData.wait_time_minutes;
            const currentTotalRecords = (currentData.total_record_number || 0) + 1;
            const newAverageWaitTime = Math.round(currentTotalWaitTime / currentTotalRecords);

            await updateDoc(restaurantRef, {
                avg_wait_time: newAverageWaitTime,
                total_record_number: currentTotalRecords
            });

            navigate(`/restaurant/${restaurantId}`);
        } catch (error) {
            console.error('Error submitting record:', error);
            setError('Failed to submit record. Please try again.');
        }
    };

    return (
        <div className="bg-background-main text-nunito">
            {/* Header */}
            <div className="flex justify-between items-center w-full px-4 py-3 bg-[#FEF3E2]">
                <BackButton target={`/restaurant/${restaurantId}`}/>
                <div id="restaurant-name" className="flex-1 text-center text-2xl text-title font-bold">
                    {restaurantName}
                </div>
            </div>

            {/* Welcome message */}
            <div className="text-center mt-10 mb-6 px-2">
                <h2 className="text-3xl md:text-4xl font-extrabold text-green-dark mb-2 leading-snug">
                    How long have you been waiting?
                </h2>
                <p className="text-lg md:text-xl font-medium text-title">
                    Share your experience with us!
                </p>
            </div>

            {/* Form */}
            <div className="card md:mx-auto mt-8 text-base p-6 bg-[#FEF3E2] rounded-2xl shadow-lg w-[80%] mx-auto">
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                    {/* Date */}
                    <div className="form-group flex flex-col md:flex-row items-start md:items-center gap-2">
                        <label htmlFor="recordDate" className="text-green-dark font-semibold w-28">
                            Visited Date:
                        </label>
                        <input
                            type="date"
                            id="recordDate"
                            name="recordDate"
                            value={formData.recordDate}
                            onChange={handleInputChange}
                            className="flex-1 bg-white rounded-xl py-2 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#89AC46]"
                            required
                        />
                    </div>

                    {/* Time */}
                    <div className="form-group flex flex-col md:flex-row items-start md:items-center gap-2">
                        <label htmlFor="recordTime" className="text-green-dark font-semibold w-28 mt-4">
                            Visited Time:
                        </label>
                        <input
                            type="time"
                            id="recordTime"
                            name="recordTime"
                            value={formData.recordTime}
                            onChange={handleInputChange}
                            className="flex-1 bg-white rounded-xl py-2 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#89AC46]"
                            required
                        />
                    </div>

                    {/* Waiting Time */}
                    <div className="form-group flex flex-col md:flex-row items-start md:items-center gap-2">
                        <label htmlFor="waitingTime" className="text-green-dark font-semibold w-40 mt-4">
                            Waiting Time (min):
                        </label>
                        <input
                            type="number"
                            id="waitingTime"
                            name="waitingTime"
                            min="0"
                            value={formData.waitingTime}
                            onChange={handleInputChange}
                            className="flex-1 bg-white rounded-xl py-2 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#89AC46]"
                            required
                        />
                    </div>

                    {/* Wait Time Experience */}
                    <div className="form-group mt-6 p-4 bg-white rounded-2xl shadow">
                        <h3 className="text-green-dark font-bold mb-3 text-md">
                            Wait Time Experience (Optional)
                        </h3>

                        {/* Rating stars */}
                        <div className="flex gap-2 hover:cursor-pointer focus:outline-none">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                    key={star}
                                    onClick={() => handleStarRating(star)}
                                    width="28"
                                    height="28"
                                    viewBox="0 0 24 24"
                                    fill={formData.rating >= star ? "#fa9500" : "none"}
                                    stroke="#fa9500"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="focus:ring-2 focus:ring-amber-400 rounded"
                                >
                                    <polygon points="12 2 15 10 23 10 17 14 19 22 12 18 5 22 7 14 1 10 9 10 12 2"/>
                                </svg>
                            ))}
                        </div>

                        {/* Feedback text area */}
                        <label htmlFor="comments" className="text-green-dark font-semibold block mb-2 mt-6">
                            Your Comments (Optional):
                        </label>
                        <textarea
                            id="comments"
                            name="comments"
                            rows="4"
                            placeholder="Share your experience here..."
                            value={formData.comments}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-xl p-3 text-[#333] bg-[#FEF3E2] focus:outline-none focus:ring-2 focus:ring-[#89AC46] resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-4 pb-8">
                        <button
                            type="submit"
                            className="bg-[#EB6424] hover:bg-[#d3541a] text-[#FEF3E2] font-bold text-lg md:text-xl py-3 px-6 rounded-full shadow-md transition-colors duration-200 w-[70%] md:w-[70%]"
                        >
                            Submit Record
                        </button>
                    </div>
                </form>
            </div>

            <Navbar/>
        </div>
    );
}

export default AddRecord;
