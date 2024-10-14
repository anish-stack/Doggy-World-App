import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../../components/Loader/Loader';
const SCREEN_WIDTH = Dimensions.get('window').width;
export default function Details() {
    const route = useRoute();
    const { itemId, serviceId } = route.params;
    const navigation = useNavigation();
    const [clinic, setClinic] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchClinic = async () => {
        try {
            const { data } = await axios.get(`https://www.doggy.adsdigitalmedia.com/api/v1/Doctors/Get-Single-Branch/${itemId}`);
            if (data.data) {
                console.log(data.data)
                setClinic(data.data);
            } else {
                setClinic({});
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClinic();
    }, [itemId]);
    const matchedService = clinic.Services?.find(service => service._id === serviceId);
    const otherServices = clinic.Services?.filter(service => service._id !== serviceId);
    if (loading) {
        return <Loader /> // Replace with your Loader component
    }

    return (
        <Layout>
            <ScrollView className="px-4  py-2">
                {/* Clinic Details */}
                {/* Image Slider */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                    {clinic.Images && clinic.Images.map((image, idx) => (
                        <Image
                            key={idx}
                            source={{ uri: image.url }}
                            style={{ height: 150, width: SCREEN_WIDTH / 1.2 }}
                            className="rounded-lg object-cover mr-2"
                        />
                    ))}
                </ScrollView>

                <View className="bg-white rounded-lg shadow-lg mb-5 p-4 transition-transform transform hover:scale-105 hover:shadow-2xl">
                    <Text className="text-3xl font-extrabold text-gray-800 mb-3 text-start">{clinic?.Landmark || "N/A"}</Text>

                    <View className="flex flex-row items-center mb-2">
                        <Icon name="clock" size={20} color="#4A5568" />
                        <Text className="text-sm text-gray-600 ml-2">
                            Opens At: {clinic?.OpensTime || "N/A"} AM - {clinic?.CloseTime || "N/A"}
                        </Text>
                    </View>

                    <View className="flex flex-row items-center mb-2">
                        <Icon name="phone" size={20} color="#4A5568" />
                        <Text className="text-md text-gray-600 ml-2">
                            Contact: {clinic?.ContactNumber || "N/A"}
                        </Text>
                    </View>

                    <View className="flex flex-row items-center mb-2">
                        <Icon name="envelope" size={20} color="#4A5568" />
                        <Text className="text-md text-gray-600 ml-2">
                            Email: {clinic?.RepresentedEmail || "N/A"}
                        </Text>
                    </View>

                    <View className="flex flex-row items-center mb-4">
                        <Icon name="map-marker" size={20} color="#4A5568" />
                        <Text className="text-md text-gray-600 ml-2">
                            Address: {clinic?.streetAddress || "N/A"}
                        </Text>
                    </View>

                    <View className="bg-green-500 py-2 px-3 rounded-full shadow-md mt-4">
                        <Text className="text-white font-bold text-center">Rating: {clinic?.Ratings || "No rating"}</Text>
                    </View>
                </View>





                {/* Doctors Profiles */}
                <Text className="text-xl font-semibold text-gray-800 mb-2">Doctors</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                    {clinic.Doctors && clinic.Doctors.map((doctor) => (
                        <View key={doctor._id} className="bg-white rounded-lg shadow-lg p-2 mr-2">
                            <Image source={{ uri: doctor.ProfileImage.url }} className="w-20 h-20 rounded-full mb-2" />
                            <Text className="text-lg font-semibold">{doctor.displayName}</Text>
                            <Text className="text-sm text-gray-500">{doctor.designation}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Services Section */}
                <Text className="text-xl font-semibold text-gray-800 mb-2">Services Offered</Text>
                <View>

                    {matchedService && (
                        <View
                            key={matchedService._id}
                            className="bg-white relative rounded-lg shadow-lg p-6 mb-6 transition-transform transform hover:scale-105 hover:shadow-2xl"
                        >
                            <Text className="bg-green-400 z-20 right-0 absolute text-gray-100 font-semibold text-xs rounded-full px-3 py-2 mb-3 text-center">
                                You Searched For This
                            </Text>

                            <Image
                                style={{ width: '100%', height: 150, borderRadius: 10 }}
                                source={{ uri: matchedService.Images[0]?.url }}
                                resizeMode="cover"
                            />

                            <Text className="text-2xl font-bold text-gray-800 mb-2 mt-2">{matchedService.ServiceName}</Text>

                            <Text className="text-lg text-gray-800 font-semibold mb-1">
                                Price:
                                <Text className="text-blue-600 font-bold"> ₹{matchedService.DiscountPrice} </Text>
                                <Text className="text-gray-500 line-through ml-2">₹{matchedService.Price}</Text>
                            </Text>


                            <Text className="text-sm text-gray-500 mb-3">
                                Discount: <Text className="text-red-500">{matchedService.DiscountPercentage}%</Text>
                            </Text>


                            <View className="mt-4">
                                <Text className="text-lg font-semibold text-gray-800 mb-3">Service Specialties:</Text>
                                <View className="flex ">
                                    {matchedService.ServiceSpecilatity.map((item, index) => (
                                        <View
                                            key={index}
                                            className="flex  whitespace-nowrap flex-row items-center bg-gray-100 rounded-lg p-2 mb-2 mr-3 shadow-md" // Add a background and shadow for better visibility
                                        >
                                            <Text><Icon name="check-circle" size={20} color="#38a169" className="mr-2" /> </Text>
                                            <Text className="text-sm   text-gray-700">{item}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            {/* Book Now Button */}
                            <TouchableOpacity
                                onPress={() => navigation.navigate('further-step', { serviceId: matchedService._id, ClinicId: clinic._id })}
                                className="mt-4 bg-blue-600 rounded-lg px-4 py-2 transition-colors duration-300 hover:bg-blue-700"
                            >
                                <Text className="text-white text-center text-lg font-semibold">Book Now</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Render other services */}
                    {otherServices?.map((service) => (
                        <View key={service._id} className="bg-white rounded-lg shadow-lg p-4 mb-4 transition-transform transform hover:scale-105 hover:shadow-2xl">
                            <Image width={'100%'} height={120} source={{ uri: service.Images[0]?.url }} />

                            <Text className="text-xl font-bold text-gray-800 mb-1">{service.ServiceName}</Text>
                            <Text className="text-lg text-gray-800 font-semibold">
                                <Text className="text-lg text-gray-800 font-semibold mb-1">
                                    Price:
                                    <Text className="text-blue-600 font-bold"> ₹{service.DiscountPrice} </Text>
                                    <Text className="text-gray-500 line-through ml-2">₹{service.Price}</Text>
                                </Text>


                            </Text>
                            <Text className="text-sm text-gray-500">
                                Discount: <Text className="text-red-500">{service.DiscountPercentage}%</Text>
                            </Text>

                            <View className="mt-4">
                                <Text className="text-lg font-semibold text-gray-800 mb-3">Service Specialties:</Text>
                                <View className="flex ">
                                    {service.ServiceSpecilatity.map((item, index) => (
                                        <View
                                            key={index}
                                            className="flex  whitespace-nowrap flex-row items-center bg-gray-100 rounded-lg p-2 mb-2 mr-3 shadow-md" // Add a background and shadow for better visibility
                                        >
                                            <Text><Icon name="check-circle" size={20} color="#38a169" className="mr-2" /> </Text>{/* Using a check-circle icon */}
                                            <Text className="text-sm   text-gray-700">{item}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            <TouchableOpacity
                                  onPress={() => navigation.navigate('further-step', { serviceId: service._id, ClinicId: clinic._id })}
                                className="mt-4 bg-blue-600 rounded-lg p-3 transition-colors duration-300 hover:bg-blue-700"
                            >
                                <Text className="text-white text-center text-lg font-semibold">Book Now</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </Layout>
    );
}
