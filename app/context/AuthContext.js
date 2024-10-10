import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState('');
    const [profile, setProfile] = useState({});
    const [petType, setPetType] = useState('Dog');

    const getData = async () => {
        try {
            const saveData = await AsyncStorage.getItem('AccessToken');
            if (saveData) {
                setToken(saveData);
                await getMyProfile(saveData); // Fetch the profile after setting the token
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getMyProfile = async (token) => {
        await AsyncStorage.removeItem('AccessToken')
        try {
            const { data } = await axios.get('http://.168.1.21:7000/api/v1/pet/pet-profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPetType(data.data.id.PetType)
            setProfile(data); // Assuming the response structure is correct
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <AuthContext.Provider value={{ petType, token, setToken, profile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
