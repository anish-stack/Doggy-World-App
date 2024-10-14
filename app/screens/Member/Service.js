import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Loader from '../../components/Loader/Loader';

export default function ProfileService() {
    const { token } = useSelector((state) => state.auth);
    const [service, setService] = useState(null); // State to hold service information
    const [isModalVisible, setModalVisible] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const [loading,setLoading] = useState(false)
    const handleCancel = (BookingId) => {
        if (BookingId) {
            setBookingId(BookingId);
            setModalVisible(true); // Show the modal
        }
    };
    const cancelCancellation = () => {
        setModalVisible(false); // Just hide the modal
    };
    const confirmCancellation = () => {
        // Logic to handle cancellation goes here
        console.log(`Cancelled booking with ID: ${bookingId}`);
        setModalVisible(false); // Hide the modal after confirming
    };

    const fetchMyServiceRequest = async () => {
        try {
            setLoading(true)
            const response = await axios.get(
                'http://192.168.1.7:7000/api/v1/pet/get-my-bookings?type=Service',
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setLoading(false)
            setService(response.data.data.orders); // Assuming the response data has 'orders' field
        } catch (error) {
            setLoading(false)
            console.error('Error fetching service requests:', error);
        }
    };



    useEffect(() => {
        fetchMyServiceRequest(); // Fetch service data on component mount
    }, []);

    if(loading){
        return <Loader/>
    }
    return (
        <ScrollView className="flex-1 p-4 mb-4 bg-gray-100">
            <Text className="text-2xl font-bold mb-4">My Service Bookings</Text>
            {service && service.length > 0 ? (
                service.map((order, index) => (
                    <View className="bg-white mb-4 ">

                        <View key={index} className="bg-white rounded-lg p-4  flex-row">
                            {/* Service Information Section */}
                            <View className="flex-1 h-32  pr-2">
                                <Image
                                    source={{ uri: order.ServiceId[0]?.Images[0].url }}
                                    className="w-full h-full rounded-lg"
                                    resizeMode="cover"
                                />


                            </View>

                            <View className="flex-1 pl-2 border-l border-gray-300">
                                <Text className="font-semibold mt-4">Clinic Information:</Text>

                                <Text className="text-sm my-1">Clinic Name: {order.ClinicId.RepresentedPersonName}</Text>
                                <Text className="text-sm my-1">Contact Number: {order.ClinicId?.ContactNumber}</Text>



                                <View className="mt-4  border border-gray-300 rounded-lg p-2 flex-row items-center">
                                    <View className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                                        <Text className="text-white font-bold text-lg">🕒</Text>
                                    </View>
                                    <View>
                                        <Text className="text-sm my-1">{order.ServiceAndAppointmentTimeAndDate}</Text>
                                    </View>
                                </View>
                            </View>
                            <Text className="text-sm absolute bg-green-300 px-3 right-0 top-[-12px] rounded-2xl py-1 my-1">{order.OrderDetails.OrderStatus}</Text>



                        </View>
                        <View className="flex-row flex items-center w-full gap-2 justify-around ">
                            <TouchableOpacity onPress={() => handleCancel('12345')} className="bg-red-500 whitespace-nowrap w-[100%]  py-2 px-4 rounded-lg shadow hover:bg-red-600">
                                <Text className="font-semibold text-white text-center">Cancel</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity className="bg-blue-500 whitespace-nowrap w-[40%] text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600">
                                <Text className="font-semibold text-white text-center">Re-Schedule</Text>
                            </TouchableOpacity> */}
                        </View>

                    </View>
                ))
            ) : (
                <Text className="text-center mt-5 text-lg text-gray-500">No service bookings found.</Text>
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={cancelCancellation}
            >
                <View className="flex-1 justify-center items-center   bg-opacity-10">
                    <View style={{ elevation: 4, shadowColor: '#000' }} className="bg-white shadow-sm rounded-lg p-6 w-4/5">
                        <Text className="text-lg font-bold mb-2">Confirm Cancellation</Text>
                        <Text className="text-md mb-4">Are you sure you want to cancel this booking?</Text>
                        <View className="flex-row justify-between">
                            <TouchableOpacity onPress={confirmCancellation} className="bg-green-500 px-4 py-2 rounded">
                                <Text className="text-white font-bold">Yes, Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={cancelCancellation} className="bg-gray-300 px-4 py-2 rounded">
                                <Text className="text-black font-bold">No, Keep</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </ScrollView>
    );
}
