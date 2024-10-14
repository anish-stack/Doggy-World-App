import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import loginLogo from '../../assets/login.png';
import InputBox from '../../components/Forms/InputBox';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
    const [formdata, setFormData] = useState({
        Contact: '',
        Password: ''
    });

    const handleChange = (value, name) => {
        setFormData(prevdata => ({
            ...prevdata,
            [name]: value
        }));
    };

    const handleOTP = async () => {
        const phoneNumberRegex = /^[0-9]{10}$/;

        if (!formdata.Contact) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Please fill in a 10-digit mobile number.'
            });
            return;
        }

        if (!phoneNumberRegex.test(formdata.Contact)) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Please enter a valid 10-digit contact number.'
            });
            return;
        }

        try {
            const res = await axios.post('https://www.doggy.adsdigitalmedia.com/api/v1/auth/Sign-in', formdata)
            Toast.show({
                type: 'success',
                text1: 'Login Success',
                text2: `${res.data?.message || "Otp Sent Successfuly On registered Number"}`
            });
            console.log(res.data)
            await AsyncStorage.setItem('contactNumber', formdata.Contact);
            navigation.navigate("otp");
            setFormData({
                Contact: '',
                Password: '',
            })

        } catch (error) {
            console.log(error)
            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2: `${error.response?.data?.message || "Internal server Error"}`
            });

        }
    };

    return (
        <View className="justify-center h-[80%]">
            <Image source={loginLogo} className="h-24 w-24 mb-6 mx-auto" resizeMode='contain' />
            <InputBox
                placeholder='Enter Your Contact Number'
                value={formdata.Contact}
                name="Contact"
                setValue={(value) => handleChange(value, 'Contact')}
                keyboardType="phone-pad"
                maxLength={10}
            />
            <InputBox
                placeholder='Enter Your Password'
                value={formdata.Password}
                name="Password"
                setValue={(value) => handleChange(value, 'Password')}
                secureTextEntry={true}
                maxLength={20}
            />
            <TouchableOpacity
                className="bg-black w-10/12 mx-auto items-center py-2 mt-1 rounded-lg"
                onPress={handleOTP}
            >
                <Text className="text-white text-base font-semibold text-widest">Get OTP</Text>
            </TouchableOpacity>
            <View className="flex-row mx-auto mt-7 items-center justify-center">
                <Text className="text-sm tracking-widest font-medium text-gray-600">New User? </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate("register")}
                    className="flex-row mx-auto items-center justify-center"
                >
                    <Text className="text-sm tracking-widest font-medium text-[#ef5030]">Register here</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={() => navigation.navigate("home")}
                className="flex-row mx-auto mt-5 items-center justify-center"
            >
                <Text className="text-sm tracking-widest font-medium text-gray-600">Skip for now </Text>
                <FontAwesome name="arrow-right" size={10} color="#4b5563" />
            </TouchableOpacity>
        </View>
    );
};

export default Login;


