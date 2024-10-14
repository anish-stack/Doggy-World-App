import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import InputBox from '../../components/Forms/InputBox';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import Loader from '../../components/Loader/Loader';
import login from './login.png'; // Ensure your image is imported correctly
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slice/Login.slice';

export default function PetLogin() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [contactNumber, setContactNumber] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { status } = useSelector((state) => state.auth)


    const handleSendOtp = async () => {
        setIsLoading(true);

        try {
            const response = await axios.post('http://192.168.1.7:7000/api/v1/pet/pet-login', {
                ContactNumber: contactNumber
            });
            console.log(response.data)
            setIsOtpSent(true);
            setIsLoading(false);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Oops! Something went wrong',
                text2: 'Unable to send OTP, please try again.',
            });
        } finally {
            setIsLoading(false);

        }

    };

    const handleVerifyOtp = () => {


        dispatch(loginUser(contactNumber, otp, navigation));

    };

    const handleResendOtp = async () => {
        setIsLoading(true);

        try {
            const response = await axios.post('http://192.168.1.7:7000/api/v1/pet/pet-register-resendOtp', {
                ContactNumber: contactNumber
            });
            Toast.show({
                type: 'success',
                text1: 'OTP Resent!',
                text2: 'A new OTP has been sent to your contact number.',
            });
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Unable to resend OTP. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1 p-4">
                <View className="flex-row items-center mb-5">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <FontAwesome name="arrow-left" size={16} color="black" />
                    </TouchableOpacity>
                    <Text className="text-sm font-semibold text-gray-900 ml-3">Go Back</Text>
                </View>

                <View className="items-center">
                    <Text className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back! 🐾</Text>
                    <Image source={login} className="w-48 h-48" resizeMode="contain" />
                    <Text className="text-center text-gray-500 mt-2">
                        Log in to access your pet's profile and manage all their information easily.
                    </Text>
                </View>

                <View className="mt-5">
                    <Text className="text-lg font-bold text-gray-900">Login</Text>
                    <Text className="text-gray-400 mt-4 mb-4">
                        Enter your contact number
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
                    className="bg-blue-600 rounded-lg p-3 mt-4 flex-row items-center justify-center"
                    onPress={isLoading ? null : (isOtpSent ? handleVerifyOtp : handleSendOtp)}
                >
                    {isLoading ? <Loader /> : (
                        <>
                            <FontAwesome name="sign-in" size={20} color="white" />
                            <Text className="text-white text-center ml-2">
                                {isOtpSent ? 'Verify OTP' : 'Send OTP'}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                {isOtpSent && !isLoading && (
                    <Text onPress={handleResendOtp} className="text-red-400 text-left mt-3 underline underline-offset-1">
                        Resend OTP
                    </Text>
                )}


                <Text className="text-gray-400 mt-2">
                    By logging in, you agree to our terms of service and privacy policy.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
