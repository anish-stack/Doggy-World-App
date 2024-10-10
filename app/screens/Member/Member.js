import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, DevSettings } from 'react-native';
import Layout from '../../components/Layout/Layout';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../../context/AuthContext';
import dog from './dog.png'
import cat from './cat.png'
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/slice/Login.slice';
const Member = ({ navigation }) => {
    const loginPageNavigate = useNavigation()
    const [petProfile, setPetProfile] = useState(null);
    const { pet } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const options = {

        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    const handleLogout = async () => {
        await AsyncStorage.removeItem('AccessToken')
        dispatch(logoutUser())
        loginPageNavigate.navigate('petLogin')
    }
    useEffect(() => {
        if (pet) {

            setPetProfile(pet);
        } else {
            setPetProfile(null);
        }
    }, [pet]);

    return (
        <Layout>
            <View className="w-full">
                <View>

                    <View className='flex items-center justify-center ' style={styles.header}>
                        <View className='flex items-center px-2 py-2 justify-center' style={styles.imageContainer}>
                            <Image
                                style={styles.image}
                                source={dog}

                            />
                        </View>
                    </View>
                    <View className='flex items-center px-2 bg-[#fffafa] mt-4  justify-center' >

                        <View className='flex-row items-center bg-gray-100  px-3 py-3 w-full justify-between'>
                            <Text>{petProfile?.PetName}'s Information</Text>
                            <Text className='text-gray-500 font-semibold'>Edit</Text>

                        </View>

                        <View className='flex-row items-center px-3 py-3 w-full justify-between'>
                            <Text>Breed</Text>
                            <Text>{petProfile?.PetBreed}</Text>

                        </View>
                        <View className='flex-row bg-gray-100 items-center px-3 py-3 w-full justify-between'>
                            <Text>Pet Type</Text>
                            <Text>{petProfile?.PetType}</Text>

                        </View>
                        <View className='flex-row items-center px-3 py-3 w-full justify-between'>
                            <Text>Date Of Birth</Text>
                            <Text>{new Date(petProfile?.PetDob).toLocaleDateString('de-DE', options)}</Text>

                        </View>
                    </View>


                    <View className='flex items-center px-2 bg-[#fffafa] mt-4  justify-center' >

                        <View className='flex-row items-center bg-gray-100  px-3 py-3 w-full justify-between'>
                            <Text>🩺 Medical Records</Text>
                            <Text className='text-gray-500 font-semibold'> <FontAwesome name='angle-right' size={25} color={'#000'} /></Text>

                        </View>

                        <View className='flex-row items-center px-3 py-3 w-full justify-between'>
                            <Text>⌚ Appointment</Text>
                            <Text className='text-gray-500 font-semibold'> <FontAwesome name='angle-right' size={25} color={'#000'} /></Text>

                        </View>

                        <View className='flex-row bg-gray-100 items-center px-3 py-3 w-full justify-between'>

                            <TouchableOpacity onPress={() => loginPageNavigate.navigate('Orders')} className='flex-row items-center px-3 py-3 w-full justify-between'>
                                <Text>🛍️ Orders</Text>
                                <Text className='text-gray-500 font-semibold'> <FontAwesome name='angle-right' size={25} color={'#000'} /></Text>
                            </TouchableOpacity>
                        </View>
                        <View  >
                            <TouchableOpacity onPress={() => loginPageNavigate.navigate('ProfileService')} className='flex-row items-center px-3 py-3 w-full justify-between'>
                                <Text>🧼 Services</Text>
                                <Text className='text-gray-500 font-semibold'> <FontAwesome name='angle-right' size={25} color={'#000'} /></Text>
                            </TouchableOpacity>

                        </View>
                        <View >

                            <TouchableOpacity onPress={() => loginPageNavigate.navigate('policy')} className='flex-row items-center px-3 py-3 w-full justify-between'>
                                <Text>🚨 Privacy Policy</Text>
                                <Text className='text-gray-500 font-semibold'> <FontAwesome name='angle-right' size={25} color={'#000'} /></Text>
                            </TouchableOpacity>
                        </View>
                        <View className='flex-row  items-center px-3 py-3 w-full justify-between'>
                            <Text onPress={handleLogout}>👋 Logout</Text>
                            <Text className='text-gray-500 font-semibold'> <FontAwesome name='angle-right' size={25} color={'#000'} /></Text>

                        </View>
                    </View>
                </View>
            </View>
        </Layout>
    );
};

export default Member;

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#BBE4AC",
        height: 120,
        borderColor: '#000',
        borderBottomEndRadius: 65,
        borderBottomLeftRadius: 65,

    },
    imageContainer: {

        width: 100,
        zIndex: 99,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        backgroundColor: '#f8f8ff'
    },
    image: {
        width: 80,
        height: 80,
        objectFit: 'contain',
        borderRadius: 50,
        backgroundColor: '#fffafa',
        borderColor: '#000'
    }

})
