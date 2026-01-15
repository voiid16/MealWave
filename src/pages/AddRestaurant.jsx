import React, {useState, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {collection, addDoc} from 'firebase/firestore';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import {db, storage} from '../firebase';
import {BackButton} from '../components/BackButton.jsx';
import Navbar from '../components/Navbar';
import '../css/style.css';

function AddRestaurant() {
    const navigate = useNavigate();
    const nameInputRef = useRef(null);
    const [formData, setFormData] = useState({
        restaurantName: '',
        address: '',
        cuisineType: '',
        image: null
    });
    const [errors, setErrors] = useState({});
    const [confirmation, setConfirmation] = useState('');
    const [selectedPlace, setSelectedPlace] = useState(null);

    useEffect(() => {
        const initAutocomplete = () => {
            if (window.google && window.google.maps && window.google.maps.places && nameInputRef.current) {
                const autocomplete = new window.google.maps.places.Autocomplete(
                    nameInputRef.current,
                    {
                        types: ['establishment'],
                        componentRestrictions: {country: 'ca'}
                    }
                );
                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    console.log(place)
                    setSelectedPlace(place);

                    if (place && place.name) {
                        setFormData(prev => ({...prev, restaurantName: place.name}));
                    }
                    if (!place || !place.place_id) {
                        setErrors(prev => ({
                            ...prev,
                            restaurantName: 'Please select a restaurant from the suggestions.'
                        }));
                        return;
                    }
                    const isRestaurant = place.types && place.types.includes('restaurant');
                    if (!isRestaurant) {
                        setErrors(prev => ({
                            ...prev,
                            restaurantName: 'Please choose a restaurant, not another type of place.'
                        }));
                    } else {
                        setErrors(prev => ({...prev, restaurantName: undefined}));
                    }
                    if (place.formatted_address) {
                        setFormData(prev => ({...prev, address: place.formatted_address}));
                        setErrors(prev => ({...prev, address: undefined}));
                    }
                });
            } else {
                console.log("Retrying...")
                setTimeout(initAutocomplete, 100);
            }
        };

        initAutocomplete();
    }, []);

    const handleInputChange = (e) => {
        const {name, value, files} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
        // Field-level validation
        if (name === 'restaurantName') {
            setErrors(prev => ({
                ...prev,
                restaurantName: value.trim() ? undefined : 'Please enter the restaurant name.'
            }));
        }
        if (name === 'address') {
            const streetPattern = /^\d+\s?[A-Za-z].*$/;
            setErrors(prev => ({
                ...prev,
                address: streetPattern.test(value.trim())
                    ? undefined
                    : 'Address must include street number and street name.'
            }));
        }
        if (name === 'cuisineType') {
            setErrors(prev => ({
                ...prev,
                cuisineType: /\d/.test(value.trim())
                    ? 'Numbers are not allowed in cuisine types.'
                    : undefined
            }));
        }
        if (name === 'image' && files && files[0]) {
            setErrors(prev => ({
                ...prev,
                image: files[0].size > 2 * 1024 * 1024
                    ? 'Please upload an image smaller than 2MB.'
                    : undefined
            }));
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.restaurantName.trim()) {
            newErrors.restaurantName = 'Please enter the restaurant name.';
        }
        if (!selectedPlace || !selectedPlace.place_id || selectedPlace.name !== formData.restaurantName) {
            newErrors.restaurantName = 'Please select a restaurant from the suggestions.';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address must include street number and city.';
        }
        if (formData.cuisineType.trim() && /\d/.test(formData.cuisineType)) {
            newErrors.cuisineType = 'Numbers are not allowed in cuisine types.';
        }
        if (formData.image && formData.image.size > 2 * 1024 * 1024) {
            newErrors.image = 'Please upload an image smaller than 2MB.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                let imageUrl = null;
                if (formData.image) {
                    const imageRef = ref(storage, `restaurant_images/${formData.restaurantName}_${Date.now()}`);
                    await uploadBytes(imageRef, formData.image);
                    imageUrl = await getDownloadURL(imageRef);
                }

                const restaurantData = {
                    name: formData.restaurantName,
                    address: formData.address,
                    cuisine: formData.cuisineType,
                    imageUrl: imageUrl,
                    averageWaitTime: 'N/A',
                    createdAt: new Date()
                };

                const docRed = await addDoc(collection(db, 'restaurant'), restaurantData);

                setConfirmation('Restaurant added successfully!');
                setTimeout(() => navigate(`/restaurant/${docRed.id}`), 2000);
            } catch (error) {
                console.error('Error adding restaurant:', error);
                setErrors({submit: 'Failed to add restaurant. Please try again.'});
            }
        }
    };

    return (
        <div className="bg-background-main text-nunito">
            <header>
                <div className="flex justify-between items-center w-full px-4 py-3 bg-backgroud-card">
                    <BackButton/>
                    <div className="flex-1 text-center text-2xl text-title font-bold">
                        Add a Restaurant
                    </div>
                    <div className="w-10 h-10"></div>
                </div>
            </header>

            <section className="max-w-lg mx-auto mt-8 mb-20 p-6 bg-backgroud-card rounded-2xl shadow-md text-base">
                <h2 className="text-xl md:text-2xl font-semibold text-[#EB6424] mb-4 text-center">
                    Help us add a new restaurant 🍴
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div>
                        <label htmlFor="restaurantName" className="block text-subtitle mb-1 text-base">
                            Restaurant Name
                        </label>
                        <input
                            type="text"
                            id="restaurantName"
                            name="restaurantName"
                            required
                            placeholder="e.g. Sushi Hana"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#EB6424]"
                            // value={formData.restaurantName}
                            onChange={handleInputChange}
                            ref={nameInputRef}
                        />
                        {errors.restaurantName && (
                            <p className="mt-1 text-sm text-red-500">{errors.restaurantName}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-subtitle text-base mb-1">
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            required
                            placeholder="e.g. 123 Main St, Vancouver, BC"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#EB6424]"
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                        {errors.address && (
                            <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="cuisineType" className="block text-subtitle text-base mb-1">
                            Cuisine Type
                        </label>
                        <input
                            type="text"
                            id="cuisineType"
                            name="cuisineType"
                            placeholder="e.g. Japanese, Italian, Korean BBQ..."
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#EB6424]"
                            value={formData.cuisineType}
                            onChange={handleInputChange}
                        />
                        {errors.cuisineType && (
                            <p className="mt-1 text-sm text-red-500">{errors.cuisineType}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-subtitle text-base mb-1">
                            Restaurant Image (optional)
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            className="w-full text-sm text-gray-700 border rounded-lg cursor-pointer file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-[#EB6424] file:text-[#FEF3E2] hover:file:bg-[#d3541a]"
                            onChange={handleInputChange}
                        />
                        {errors.image && (
                            <p className="mt-1 text-sm text-red-500">{errors.image}</p>
                        )}
                    </div>

                    {confirmation && (
                        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-center">
                            {confirmation}
                        </div>
                    )}

                    {errors.submit && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                            {errors.submit}
                        </div>
                    )}

                    <div className="text-center mt-8">
                        <button
                            type="submit"
                            className="bg-primary text-lightest font-semibold rounded-full shadow text-lg md:text-xl py-3 px-6 w-[70%] md:w-[70%]"
                        >
                            Submit Restaurant
                        </button>
                    </div>
                </form>
            </section>

            <Navbar/>
        </div>
    );
}

export default AddRestaurant;
