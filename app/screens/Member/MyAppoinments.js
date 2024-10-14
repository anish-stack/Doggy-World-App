import { View, Text, Image, ScrollView, Button, ActivityIndicator, Modal, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native';
import cancel from './cancel.png';
import Toast from 'react-native-toast-message';

export default function MyAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const { data } = await axios.get('https://www.doggy.adsdigitalmedia.com/api/v1/pet/get-my-Appoinment', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAppointments(data.appointments);
                setFilteredAppointments(data.appointments);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching appointments', error);
                setLoading(false);
            }
        };
        fetchAppointments();
    }, [token]);

    const handleCancelAppointment = async (id) => {
        try {
            const { data } = await axios.post('https://www.doggy.adsdigitalmedia.com/api/v1/pet/cancel-my-Appoinment', {
                appointmentId: id,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAppointments((prev) => prev.filter(appointment => appointment._id !== id));
            setFilteredAppointments((prev) => prev.filter(appointment => appointment._id !== id));

            console.log(data);
            Toast.show({
                text1: 'Success',
                text2: 'Appointment canceled successfully!',
                type: 'success',
            });
        } catch (error) {
            console.log(error);
            Toast.show({
                text1: 'Error',
                text2: 'Failed to cancel appointment.',
                type: 'error',
            });
        }
    };

    const applyFilters = () => {
        let filtered = appointments;
        if (statusFilter) {
            filtered = filtered.filter((appointment) => appointment.status === statusFilter);
        }
        if (typeFilter) {
            filtered = filtered.filter((appointment) => appointment.typeOfAppointment === typeFilter);
        }
        setFilteredAppointments(filtered);
    };

    const handleRate = async (doctorId, appointmentId, rating, feedback) => {
        const typeOfRating = 'appointment';
        try {
            const { data } = await axios.post('https://www.doggy.adsdigitalmedia.com/api/v1/Doctors/CreateRating', {
                rating: rating,
                feedback,
                typeOfRating,
                doctorId,
                appointmentId: appointmentId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            Toast.show({
                text1: 'Success',
                text2: 'Rating submitted successfully!',
                type: 'success',
            });

            // Optionally, close the modal and reset the state
            setIsModalVisible(false);
            setSelectedRating(0);
            setFeedbackText('');
        } catch (error) {
            console.log(error);
            Toast.show({
                text1: 'Error',
                text2: 'Failed to submit rating.',
                type: 'error',
            });
        }
    }

    useEffect(() => {
        applyFilters();
    }, [statusFilter, typeFilter]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView className="p-4 bg-gray-50">
            {/* Appointment List */}
            {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment, index) => (
                    <View key={appointment._id || index} className="p-4 bg-white rounded-lg shadow-md mb-4 relative">
                        {appointment.status === 'Cancelled' && (
                            <Image
                                source={cancel}
                                resizeMethod='contain'
                                resizeMode='contain'
                                className="w-[280] h-[280] absolute top-2 right-[15%] z-10"
                            />
                        )}
                        {/* Doctor Info */}
                        <View className="flex-row justify-between items-center mb-4">
                            <Image
                                source={{ uri: appointment.doctor_id.ProfileImage.url }}
                                className="w-20 h-20 rounded-full"
                            />
                            <View className="ml-4">
                                <Text className="text-xl font-semibold text-blue-600">
                                    {appointment.doctor_id.displayName}
                                </Text>
                                <Text className="text-sm text-gray-500">
                                    {appointment.doctor_id.speciality} - {appointment.doctor_id.designation}
                                </Text>
                                <Text className="text-sm text-gray-400">
                                    Experience: {appointment.doctor_id.OverAllExperince} years
                                </Text>
                            </View>
                        </View>

                        {/* Appointment Details */}
                        <View className="mt-2">
                            <Text className="text-gray-700 font-medium">
                                📅 Appointment Date: <Text className="text-blue-600 font-semibold">{appointment.date}</Text> at <Text className="text-blue-600 font-semibold">{appointment.time}</Text>
                            </Text>
                            <Text className="text-gray-700 font-medium">
                                📋 Appointment Type: <Text className="text-blue-600 font-semibold">{appointment.typeOfAppointment}</Text>
                            </Text>
                            <Text className="text-gray-700 font-medium">
                                💰 Fee: <Text className="text-green-600 font-semibold">₹{appointment.fee}</Text>
                            </Text>
                        </View>

                        {/* Status */}
                        <Text className={`mt-4 text-sm font-bold ${appointment.status === 'Scheduled' ? 'text-green-600' : 'text-red-600'}`}>
                            Status: {appointment.status}
                        </Text>

                        {/* Action Buttons */}
                        <View className="flex-row justify-between mt-4">
                            {appointment.status === 'Scheduled' && (
                                <TouchableOpacity
                                    className="px-8 py-2 bg-red-600 rounded-full"
                                    onPress={() => handleCancelAppointment(appointment._id)}
                                >
                                    <Text className="text-white font-semibold">Cancel</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                className={`px-8 py-2 rounded-full ${appointment.status === 'Cancelled' ? 'bg-gray-400' : 'bg-green-500'}`}
                                onPress={() => {
                                    if (appointment.status !== 'Cancelled') {
                                        setSelectedAppointmentId(appointment);
                                        setIsModalVisible(true);
                                    }
                                }}
                                disabled={appointment.status === 'Cancelled'}
                            >
                                <Text className={`text-white font-semibold ${appointment.status === 'Cancelled' ? 'opacity-50' : ''}`}>
                                    Rate
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            ) : (
                <Text className="text-center text-gray-500">No appointments found.</Text>
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(false);
                }}
            >
                <View className="flex-1 justify-center items-center bg-opacity-50">
                    <View className="bg-white border shadow-lg border-gray-300 p-6 rounded-lg w-80">
                        <Text className="text-lg font-semibold mb-4 text-center">Rate Appointment</Text>
                        <Text className="mb-2 text-center">Select a rating:</Text>

                        {/* Emoji Selection with Border */}
                        <View className="border border-gray-300 rounded-lg p-2 mb-4 bg-gray-50">
                            <View className="flex-row justify-between">
                                {[1, 2, 3, 4, 5].map((emojiIndex) => (
                                    <TouchableOpacity key={emojiIndex} onPress={() => setSelectedRating(emojiIndex)}>
                                        <Text className={`text-3xl ${selectedRating === emojiIndex ? 'border-b-2 border-blue-600' : ''}`}>
                                            {emojiIndex === 1 ? '😤' : emojiIndex === 2 ? '😣' : emojiIndex === 3 ? '🙂' : emojiIndex === 4 ? '😊' : '🥰'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <TextInput
                            multiline
                            placeholder="Leave your feedback..."
                            value={feedbackText}
                            onChangeText={setFeedbackText}
                            className="border border-gray-300 rounded-lg p-2 mb-4"
                            style={{ minHeight: 60 }} // Add some height for better user experience
                        />

                        <View className="flex-row justify-between mt-4">
                            <Button
                                title="Submit Rating"
                                onPress={() => {
                                    handleRate(selectedAppointmentId?.doctor_id?._id, selectedAppointmentId?._id, selectedRating, feedbackText);
                                }}
                                color="#0d6efd"
                                className="flex-1 mr-2" // Flex to make buttons equal width and margin to the right
                            />

                            <Button
                                title="Close"
                                onPress={() => setIsModalVisible(false)}
                                color="#6c757d"
                                className="flex-1 ml-2" // Flex to make buttons equal width and margin to the left
                            />
                        </View>
                    </View>
                </View>

            </Modal>


        </ScrollView>
    );
}
