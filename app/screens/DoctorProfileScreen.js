import { View, Text, StyleSheet, Linking, ImageBackground, ScrollView, Image, Dimensions, ActivityIndicator, Modal, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import bg from './bg.jpg';
import doc from './doc.png';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker } from 'react-native-maps';
import { TouchableOpacity } from 'react-native';
import axios from 'axios';
import time from './time.gif';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DoctorProfileScreen() {
    const naviagte = useNavigation();
    const region = {
        latitude: 28.6909226,
        longitude: 77.1517825,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };
    const route = useRoute();
    const { id } = route.params;
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
    const colors = ['#5EB07C', '#A3D9A5'];
    const NameColors = ['#f8f8ff', '#fffafa'];

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`http://192.168.1.5:7000/api/v1/Doctors/get-doctor/${id}`);
                if (response.data.success) {
                    setDoctor(response.data.data);
                } else {
                    setErrorMsg('Failed to fetch doctors');
                }
            } catch (error) {
                console.log(error);
                setErrorMsg('An error occurred while fetching doctors.');
            } finally {
                setLoading(false); // End loading state
            }
        };

        fetchDoctors();
    }, []);

    // If loading, show activity indicator
    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (errorMsg) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-red-500">{errorMsg}</Text>
            </View>
        );
    }

    const VideoCallSelected = async (type) => {
        try {
            const response = await axios.get('http://192.168.1.5:7000/api/google')
            if (response.data && response.data.url) {
                //    console.log(response.data.url)
                Linking.openURL(response.data.url).catch(err =>
                    console.error("Failed to open URL: ", err)
                );
            } else {
                Alert.alert('Error', 'Could not initiate Google OAuth.');
            }
        } catch (error) {
            console.log(error)
        }
    }


    const reviews = [
        {
            id: 1,
            name: "Alice Johnson",
            rating: 5,
            comment: "Dr. Maria is fantastic! She took great care of my dog and explained everything clearly. Highly recommend!",
        },
        {
            id: 2,
            name: "Brian Smith",
            rating: 4,
            comment: "Very professional and caring. The consultation fee is worth it for the quality of care.",
        },
        {
            id: 3,
            name: "Catherine Lee",
            rating: 5,
            comment: "Absolutely the best veterinarian I've ever visited. My cat was in great hands!",
        },
        {
            id: 4,
            name: "David Kim",
            rating: 3,
            comment: "Good service, but the wait time was a bit long. Overall, I am satisfied with the care.",
        },
        {
            id: 5,
            name: "Eva Green",
            rating: 4,
            comment: "Dr. Maria is knowledgeable and gentle with my pets. I trust her with their health.",
        },
        {
            id: 6,
            name: "Frank Wright",
            rating: 5,
            comment: "I can't thank Dr. Maria enough for her help! My dog is back to his normal self.",
        },
    ];

    const handleBookAppointment = () => {
        setModalVisible(true); // Open the modal
    };

    const consultationOptions = ['📞 Voice Call', '💬 Chat', '📸 Video Call', '🏥 Clinic Visit'];

    return (
        <View className="border relative" style={{ width: '100%', height: '100%' }}>
            {doctor ? (
                <ScrollView>
                    <ImageBackground
                        source={bg}
                        resizeMode='cover'
                        className="h-72 w-full"
                    >
                        <View className='h-[15rem] flex flex-row items-start px-2 mt-2 justify-between'>
                            <Text className='w-6 rounded-xl text-center flex items-center justify-center h-6 bg-white'>
                                <FontAwesome onPress={() => naviagte.navigate('home')} name="angle-left" size={20} color="red" />
                            </Text>

                            <Image
                                source={{ uri: doctor.ProfileImage?.url }}
                                style={{ width: 300, height: 300 }}
                            />
                            <Text className='w-6 rounded-xl text-center flex items-center justify-center h-6 bg-white'>
                                {/* <FontAwesome name="pets" size={20} color="red" /> */}
                            </Text>
                        </View>
                    </ImageBackground>

                    <View className='px-3 py-5' style={styles.Details}>
                        <View className='px-5'>
                            <View className="flex-row justify-between">
                                <Text className='text-2xl text-gray-900 font-bold'>{doctor?.displayName || 'Dr. Maria Nai'}</Text>
                                <Text className='text-sm px-2 rounded-2xl py-2 bg-green-500 text-white font-bold'>Best Doctor</Text>
                            </View>
                            <Text className='text-base text-gray-400 font-bold'>{doctor?.speciality || 'Veterinary Neurosurgery'}</Text>
                        </View>

                        <View className="flex-row flex-wrap mb-2 space-x-1 items-center justify-center bg-[#f8f8ff] mt-5">
                            <View style={{ width: SCREEN_WIDTH / 3.5 }} className="bg-gray-200 rounded-2xl py-2 px-1.5 flex items-center justify-center">
                                <Text className='text-sm'> Fee</Text>
                                <Text><FontAwesome name='rupee' color={'green'} size={20} /> {doctor?.feeStart || "N/A"} -Rs</Text>
                            </View>
                            <View style={{ width: SCREEN_WIDTH / 3.5 }} className="bg-gray-200 rounded-2xl py-2 px-1.5 flex items-center justify-center">
                                <Text className='text-sm'>Experience</Text>
                                <Text>{doctor?.OverAllExperince} Years</Text>
                            </View>
                            <View style={{ width: SCREEN_WIDTH / 3.5 }} className="bg-gray-200 rounded-2xl py-2 px-1.5 flex items-center justify-center">
                                <Text className='text-sm'>Rating ⭐</Text>
                                <Text><Text className='text-sm text-red-400'>4.5/</Text>5</Text>
                            </View>
                        </View>
                        <Text className='text-2xl mb-3 mt-2 font-extrabold text-slate-800 px-3'>About</Text>
                        <Text className='text-sm font-medium text-slate-600 px-3'>
                            {doctor?.doctorDescription}
                        </Text>

                        <View style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                initialRegion={region}
                            >
                                <Marker
                                    coordinate={{ latitude: 28.6909226, longitude: 77.1517825 }}
                                    title="My Location"
                                    description="This is my marker"
                                />
                            </MapView>
                        </View>
                        <Text className='text-2xl mt-2 mb-3 font-extrabold text-slate-800 px-3'>Reviews</Text>
                        <View className='flex-row flex-wrap justify-between'>
                            {reviews.map((review) => (
                                <View key={review.id} className="bg-gray-100 p-3 mb-2 rounded-lg w-[48%]">
                                    <Text className='font-bold text-slate-900'>{review.name}</Text>
                                    <Text className='text-yellow-500'>{"⭐".repeat(review.rating)}</Text>
                                    <Text className='text-sm text-slate-600'>{review.comment}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            ) : null}


            <View className="flex bottom-0 fixed items-center m-2">
                <TouchableOpacity
                    className="flex flex-row w-full justify-center items-center bg-green-500 px-4 py-2 rounded-full shadow-md"
                    onPress={handleBookAppointment} // Open modal on press
                >
                    <Image source={time} className="w-5 h-5 mr-2" />
                    <Text className="text-white text-xl font-bold">Book Appointment</Text>
                </TouchableOpacity>
            </View>

            {/* Modal for Booking Consultation */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Choose Consultation Type</Text>
                        {consultationOptions.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                className="bg-gray-50 py-2 border rounded-md mb-2 w-full"
                                onPress={VideoCallSelected}
                            >
                                <Text className="text-black text-center text-lg">{option}</Text>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)} // Close modal
                        >
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    Details: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: -30,
        zIndex: 1,
        elevation: 3,
    },
    mapContainer: {
        width: '100%',
        height: 300,
        borderRadius: 15,
        overflow: 'hidden',
        marginTop: 20,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },

    closeButton: {
        marginTop: 20,
        backgroundColor: '#FF5733',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    closeText: {
        color: 'white',
        fontSize: 16,
    },
});
