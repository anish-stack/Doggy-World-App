import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import LottieView from 'lottie-react-native';
import InputBox from '../../components/Forms/InputBox';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import Loader from '../../components/Loader/Loader';

export default function VerificationStep() {
    const navigation = useNavigation();
    const [contactNumber, setContactNumber] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [dataOnLocal, setDataOnLocal] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [subscribe, setSubscribe] = useState(false);

    const getData = async () => {
        try {
            const saveData = await AsyncStorage.getItem('petData');
            if (saveData) {
                setDataOnLocal(JSON.parse(saveData));
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleSendOtp = async () => {
        setIsLoading(true);
        if (dataOnLocal) {
            const data = {
                ...dataOnLocal,
                ContactNumber: contactNumber,
                Newsletter: subscribe,
            };
            try {
                const response = await axios.post('http://192.168.1.7:7000/api/v1/pet/pet-register', data);
                console.log(response.data.data.message)
                setIsOtpSent(true);
            } catch (error) {
                console.log(error);
                Toast.show({
                    type: 'error',
                    text1: 'Oops! Internal Server Error',
                    text2: 'Please retry; our backend server is too busy.',
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleVerifyOtp = async () => {
        setIsLoading(true);
        const data = { ContactNumber: contactNumber, otp };
        try {
            const response = await axios.post('http://192.168.1.7:7000/api/v1/pet/pet-register-VerifyOtp', data);
            Toast.show({
                type: 'success',
                text1: 'Verified Success !! 🐕‍🦺',
                text2: response?.data?.message,
            });
            await AsyncStorage.setItem('AccessToken', JSON.stringify(response?.data?.token));
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Oops! Internal Server Error',
                text2: 'Please retry; our backend server is too busy.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setIsLoading(true);
        const data = { ContactNumber: contactNumber };
        try {
            const response = await axios.post('http://192.168.1.7:7000/api/v1/pet/pet-register-resendOtp', data);
            console.log(response.data.message)
            Toast.show({
                type: 'success',
                text1: 'Otp Sent !! 🐕‍🦺',
                text2: response?.data?.message,
            });
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Oops! Internal Server Error',
                text2: 'Please retry; our backend server is too busy.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1 p-3">
                <View className="flex-row shadow-lg px-2 py-1 items-center mb-5">
                    <TouchableOpacity onPress={() => navigation.navigate('PetRegister')}>
                        <FontAwesome name="arrow-left" size={16} color="black" />
                    </TouchableOpacity>
                    <Text className="text-sm font-semibold text-gray-900 ml-3">Go Back</Text>
                </View>

                <View className="items-center">
                    <Text className="text-xl font-semibold text-gray-900 mb-2">Almost There! 🥹</Text>
                    <LottieView
                        source={require('./veri.json')}
                        autoPlay
                        loop
                        style={{ width: 200, height: 200 }}
                    />
                </View>

                <View className="mt-5">
                    <Text className="text-lg font-bold text-gray-900">Verification Step</Text>
                    <Text className="text-gray-400 mb-4">
                        Please enter your contact number to verify all details.
                    </Text>
                </View>

                <InputBox
                    value={contactNumber}
                    setValue={setContactNumber}
                    maxLength={10}
                    keyboardType="numeric"
                    placeholder="Enter Your Contact Number"
                    className="mt-4 text-gray-900"
                />

                {isOtpSent && (
                    <View className="mt-3">
                        <InputBox
                            value={otp}
                            setValue={setOtp}
                            maxLength={6}
                            keyboardType="numeric"
                            placeholder="Enter Your OTP"
                            className="mt-4 text-gray-900"
                        />
                    </View>
                )}

                <TouchableOpacity
                    className="bg-green-600 rounded-lg p-3 mt-3 flex-row items-center justify-center"
                    onPress={isLoading ? null : (isOtpSent ? handleVerifyOtp : handleSendOtp)}
                >
                    {isLoading ? <Loader /> : (
                        <>
                            <FontAwesome name="paper-plane" size={20} color="white" />
                            <Text className="text-white text-center ml-2">{isOtpSent ? 'Verify Otp' : 'Send Otp'}</Text>
                        </>
                    )}
                </TouchableOpacity>

                {isOtpSent && !isLoading && (
                    <Text onPress={handleResendOtp} className="text-red-300 text-left mt-2 underline underline-offset-1 ml-2">
                        Resend Otp
                    </Text>
                )}

                <TouchableOpacity
                    className="flex-row items-center mt-3"
                    onPress={() => setSubscribe(!subscribe)}
                >
                    <FontAwesome name={subscribe ? "check-circle" : "circle-thin"} size={20} color={subscribe ? "blue" : "gray"} />
                    <Text className="ml-2 text-gray-400">{subscribe ? "Subscribed!" : "Click to Subscribe"}</Text>
                </TouchableOpacity>

                <Text className="text-gray-400 mt-2">
                    Thank you for your patience! We’re excited to have you join our community.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
