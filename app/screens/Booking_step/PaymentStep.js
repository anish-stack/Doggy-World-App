import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import online from './payment-method.png';
import PayAfterService from './self-checkout.png';
import axios from 'axios'
import Icon from 'react-native-vector-icons/FontAwesome';
import PhonePePaymentSDK from 'react-native-phonepe-pg'
import { useSelector } from 'react-redux';
import AddressModel from './AddressModel';
export default function PaymentStep() {
    const route = useRoute();
    const [isOpenModel, setIsOpenModel] = useState(false)
    const { date, ClinicId, ServiceId, match } = route.params;
    const navigation = useNavigation();
    const [paymentOption, setPaymentOption] = useState('online');
    const [orderType, setOrderType] = useState('Home Visit');
    const { isAuthenticated, pet, token } = useSelector((state) => state.auth);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const {
        ServiceName,
        Price,
        DiscountPercentage,
        DiscountPrice,
        Images,
        Para,
        ServiceSpecilatity
    } = match;

    const redirect = (orderType) => {
        if (orderType === 'Home Visit') {
            navigation.navigate('Address_page')
        }
    }

    const handleClose = () => {
        setIsOpenModel(false)
    }
    const handleSelectAddress = (id) => {
        setSelectedAddressId(id);
        // console.log("Selected Address ID:", id); // For debugging
    };
    const handleOpen = () => {

      
        if (orderType === 'Home Visit') {
            setIsOpenModel(true)
        } else {
            setIsOpenModel(false)
        }
    }
    useEffect(() => {
        if (orderType === 'Home Visit') {
            handleOpen();
        }
    }, [orderType])
    const CheckOut = async () => {
        const formattedData = {
            BookingType: "Service",
            ServiceId: [ServiceId],
            ClinicId: ClinicId,
            ProductIds: [],
            ServiceAndAppointmentTimeAndDate: date,
            PaymentInfo: {
                PaymentMode: paymentOption,
                PaymentAmount: DiscountPrice,
                PaymentVia: "app",
                PaymentStatus: "pending",
            },
            OrderDetails: {
                OrderType: orderType,
                OrderDate: new Date().toISOString(),
                OrderStatus: "Order Placed",
            },
            Address:selectedAddressId

        };

        if (!isAuthenticated) {
            Alert.alert("Please log in to proceed with the order.");
            return;
        } else {

            try {
                const { data } = await axios.post(`http://192.168.1.5:7000/api/v1/auth/Create-Order`, formattedData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (data.success) {
                    Alert.alert("Order successfully placed!", "Your order has been created.", [
                        { text: "OK" }
                    ]);
                    navigation.navigate('Payement_Success', { details: data.orderDetails })
                    // 
                } else {
                    Alert.alert("Order Failed", "There was an issue with your order. Please try again.");
                }
            } catch (error) {
                Alert.alert("Error", "There was an error processing your order. Please try again.");
                console.error("Order creation failed:", error);
            }
        }

    };

    return (
        <ScrollView className="p-4 bg-gray-100">
            {/* Booking Confirmation Section */}
            <View className="mb-8 bg-white rounded-lg shadow-lg p-6">
                <Text className="text-xl font-bold mb-2 text-center text-blue-600">🗓️ Booking Confirmation 🗓️</Text>
                <Text className="text-lg mb-1">✨ Service: <Text className="font-semibold text-green-600">{ServiceName}</Text></Text>
                <Text className="text-lg mb-1">📅 Date: <Text className="font-semibold text-green-600">{date}</Text></Text>
                <Text className="text-lg mb-1">🏥 Clinic ID: <Text className="font-semibold text-green-600">Doggy World ,{ClinicId?.Landmark}</Text></Text>
            </View>

            {/* Show Images */}
            <View className="flex flex-row flex-wrap justify-between mb-8">
                {Images.map((image) => (
                    <Image
                        key={image._id}
                        source={{ uri: image.url }}
                        className="w-1/2 h-36 object-cover rounded-lg shadow-md mb-2"
                    />
                ))}
            </View>
            {/* Service Details */}
            <View className="mb-8 bg-white rounded-lg shadow-lg p-4">
                <Text className="text-lg font-semibold mb-2">Service Details:</Text>
                <Text className="text-lg">Price: <Text className="text-green-600 font-bold">₹{Price}</Text></Text>
                <Text className="text-lg">Discount: <Text className="text-red-600 font-bold">{DiscountPercentage}% (₹{DiscountPrice})</Text></Text>
                <Text className="mt-2 text-gray-700">{Para}</Text>
                <Text className="font-semibold text-xl mt-2">Specialities:</Text>
                {ServiceSpecilatity.map((speciality, index) => (
                    <View
                        key={index}
                        className="flex  whitespace-nowrap flex-row items-center bg-gray-100 rounded-lg p-2 mb-2 mr-3 shadow-md" // Add a background and shadow for better visibility
                    >
                        <Text><Icon name="check-circle" size={20} color="#38a169" className="mr-2" /> </Text>
                        <Text className="text-sm ml-2  text-gray-700">{speciality}</Text>
                    </View>
                ))}
            </View>

            <View className="mb-8 bg-white rounded-lg shadow-lg p-4">
                <Text className="text-lg font-semibold mb-2">How You Want To Take Service</Text>
                <TouchableOpacity
                    onPress={() => {
                        setOrderType('Home Visit'); // Set orderType first
                        handleOpen(); // Then open modal or perform the action
                    }}
                    className={`p-3 rounded-md mb-2 border-2 ${orderType === 'Home Visit' ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-white'}`}
                >
                    <Text className={`text-center ${orderType === 'Home Visit' ? 'text-green-600 font-bold' : 'text-gray-800'}`}>
                        Home Visit
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setOrderType('Clinic Visit')} // This directly updates orderType
                    className={`p-3 rounded-md border-2 ${orderType === 'Clinic Visit' ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-white'}`}
                >
                    <Text className={`text-center ${orderType === 'Clinic Visit' ? 'text-green-600 font-bold' : 'text-gray-800'}`}>
                        You Want to Visit a Clinic
                    </Text>
                </TouchableOpacity>
            </View>


            {/* Payment Options */}
            <View className="mb-8 bg-white rounded-lg shadow-lg p-4">
                <Text className="text-lg font-semibold mb-2">Payment Option:</Text>
                <TouchableOpacity
                    onPress={() => setPaymentOption('online')}
                    className={`p-3 rounded-md mb-2 border-2 ${paymentOption === 'online' ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-white'}`}
                >
                    <Text className={`text-center ${paymentOption === 'online' ? 'text-green-600 font-bold' : 'text-gray-800'}`}>Online Payment</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setPaymentOption('Pay After Service')}
                    className={`p-3 rounded-md border-2 ${paymentOption === 'Pay After Service' ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-white'}`}
                >
                    <Text className={`text-center ${paymentOption === 'Pay After Service' ? 'text-green-600 font-bold' : 'text-gray-800'}`}>Pay After Service</Text>
                </TouchableOpacity>
            </View>

            {/* Next Button */}
            <TouchableOpacity
                onPress={CheckOut}
                className=" bg-blue-500  py-4 mb-5 flex-row items-center justify-center rounded-lg shadow-lg"
            >
                <Text className="text-lg text-white text-center font-semibold flex items-center">
                    Complete Order

                </Text>
                <Text className="ml-2 mt-1"><Icon name="check-circle" size={20} color="#fff" className="ml-2 mt-2 text-white-500" /> </Text>
            </TouchableOpacity>
            <AddressModel isOpen={isOpenModel} onSelectAddress={handleSelectAddress} onClose={handleClose} />
        </ScrollView>
    );
}
