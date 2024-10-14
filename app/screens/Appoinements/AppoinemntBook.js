import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import InputBox from '../../components/Forms/InputBox';
import axios from 'axios';
import { checkAuthToken } from '../../redux/slice/Login.slice';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector
import Toast from 'react-native-toast-message';

export default function AppointmentBook() {
    const dispatch = useDispatch();
    const navigation = useNavigation()
    const { isAuthenticated, token } = useSelector((state) => state.auth); // Ensure useSelector is imported
    const route = useRoute();
    const [formData, setFormData] = useState({
        contactNumber: ''
    });

    const { type, doctor, date, time } = route.params;
    const { ProfileImage, displayName, doctorDescription, feeStart, knownLanguages, speciality } = doctor;

    const handleChange = (value, name) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    useEffect(() => {
        const checkAuth = async () => {
            await dispatch(checkAuthToken());
        };
        checkAuth();
    }, [dispatch]); // You might want to include 'token' as a dependency
    // console.log(token)
    const handlePaymentDone = async (paymentType) => { // Changed parameter name to paymentType for clarity
        const submitData = {
            TypeOfAppoinmnet: paymentType,
            doctor_id: doctor._id,
            AppoinmentDate: new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            AppoinemnetTime: time,
            contactNumber: formData.contactNumber,
            paymenttType: paymentType === 'online' ? 'Online' : 'Visit-Pay',
            isPaymentDone: paymentType === 'online',
            payableAmount: feeStart
        };

        try {
            const { data } = await axios.post('http://192.168.1.7:7000/api/v1/Product/book-appointment', submitData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

        
            Toast.show({
                type: 'success',
                text1: 'Yeah Booked !!',
                text2: 'Your appointment is booked with the doctor. Please connect on time.',
            });
            navigation.navigate('success-page', { info: data.appointment });
        } catch (error) {
            console.error("Error booking appointment:", error);
            Toast.show({
                type: 'error',
                text1: 'Oops! Something went wrong',
                text2: error.response?.data?.message,
            });
        }

        // console.log("submitData", submitData); 
    };

    return (
        <ScrollView>


            <View className="flex-1 bg-white p-4">
                {/* Doctor Info Section */}
                <View className="mb-6 items-center p-4 bg-white shadow-lg rounded-lg">
                    <Image
                        source={{ uri: ProfileImage?.url }}
                        style={{ borderWidth: 1, borderColor: "#000" }}
                        className="w-36 h-36  rounded-full mb-4 shadow-md"
                        resizeMode="cover"
                    />
                    <View className="text-center">
                        <Text className="text-xl font-semibold text-gray-800 mb-1">{displayName}</Text>
                        <Text className="text-gray-600 mb-1">{speciality}</Text>
                        <Text className="text-gray-500 text-sm">{doctorDescription}</Text>
                    </View>
                </View>


                {/* Appointment Details Section */}
                <View className="mb-6 p-4 bg-white shadow-lg rounded-lg">
                    <Text className="text-lg font-semibold text-[#003873] mb-2">Appointment Details</Text>
                    <View className="border-b border-gray-300 mb-2 pb-2">
                        <Text className="text-gray-700">Type: <Text className="font-medium text-[#00aaa9]">{type}</Text></Text>
                    </View>
                    <View className="border-b border-gray-300 mb-2 pb-2">
                        <Text className="text-gray-700">
                            Date: <Text className="font-medium text-[#00aaa9]">{new Date(date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</Text>
                        </Text>
                    </View>
                    <View className="border-b border-gray-300 mb-2 pb-2">
                        <Text className="text-gray-700">Time: <Text className="font-medium text-[#00aaa9]">{time}</Text></Text>
                    </View>
                    <Text className="text-gray-700">Duration: <Text className="font-medium text-[#00aaa9]">30 minutes</Text></Text>
                </View>


                <View className="mb-6 p-4 bg-white shadow-lg rounded-lg">
                    <Text className="text-xl font-semibold text-[#003873] mb-2">Fee Information</Text>
                    <Text className="text-lg font-medium text-[#00aaa9]"> Fee: <Text className="font-bold text-gray-800">₹ {feeStart}</Text></Text>
                </View>

                <View className="mb-6 p-4 bg-white shadow-lg rounded-lg">
                    <Text className="text-xl font-semibold text-[#003873] mb-2">Important Points</Text>
                    <Text className="text-gray-700 flex items-center mb-2">
                        <Text className="mr-2 text-[#d64444]">🐾</Text>
                        <Text>Ensure your pet is comfortable.</Text>
                    </Text>
                    <Text className="text-gray-700 flex items-center mb-2">
                        <Text className="mr-2 text-[#d64444]">📁</Text>
                        <Text>Have relevant medical records ready.</Text>
                    </Text>
                    <Text className="text-gray-700 flex items-center mb-2">
                        <Text className="mr-2 text-[#d64444]">📝</Text>
                        <Text>Prepare a list of questions for the doctor.</Text>
                    </Text>
                    <Text className="text-gray-700 flex items-center mb-2">
                        <Text className="mr-2 text-[#d64444]">💖</Text>
                        <Text>Bring your pet’s favorite toy for comfort.</Text>
                    </Text>
                    <Text className="text-gray-700 flex items-center mb-2">
                        <Text className="mr-2 text-[#d64444]">⏰</Text>
                        <Text>Arrive 10 minutes early to complete forms.</Text>
                    </Text>
                </View>
                {type === '📞 Voice Call' && (
                    <View className="mb-6 p-4 bg-white shadow-lg rounded-lg">
                        <Text className="text-lg font-semibold text-[#003873] mb-2">Voice Call Details</Text>
                        <InputBox
                            setValue={(value) => handleChange(value, 'contactNumber')}
                            value={formData.contactNumber}
                            name={'contactNumber'}
                            placeholder="Enter your contact number"
                            keyboardType="phone-pad"
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 8,
                                padding: 10,

                                backgroundColor: '#f9f9f9',
                            }}
                        />
                    </View>
                )}

                <View className="mb-6 p-4 bg-white shadow-lg rounded-lg">
                    <Text className="text-lg font-semibold text-[#003873] mb-2">Payment Method</Text>
                    {type === '🏥 Clinic Visit' ? (
                        <View className="flex flex-row justify-between mt-2">
                            <TouchableOpacity onPress={() => handlePaymentDone('online')} className="bg-[#007bff] rounded-lg p-3 flex-1 mr-2 shadow hover:shadow-lg transition-shadow duration-200">
                                <Text className="text-white text-center font-medium">Online Payment</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handlePaymentDone('visit')} className="bg-[#007bff] rounded-lg p-3 flex-1 shadow hover:shadow-lg transition-shadow duration-200">
                                <Text className="text-white text-center font-medium">Clinic Visit Payment</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={() => handlePaymentDone('online')} className="bg-[#007bff] rounded-lg p-3 mt-2 shadow hover:shadow-lg transition-shadow duration-200">
                            <Text className="text-white text-center font-medium">Online Payment</Text>
                        </TouchableOpacity>
                    )}
                </View>

            </View>
        </ScrollView>
    );
}
