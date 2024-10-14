import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { doctorData } from '../../data/doctorData';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TopDoctor = () => {
    const navigation = useNavigation();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');



    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://192.168.1.7:7000/api/v1/Doctors/get-doctor');
                if (response.data.success) {
                    setDoctors(response.data.data);
                } else {
                    setErrorMsg('Failed to fetch doctors');
                }
            } catch (error) {
                console.log(error)
                setErrorMsg('An error occurred while fetching doctors.');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const colors = ['#5EB07C', '#A3D9A5'];
    const NameColors = ['#f8f8ff', '#fffafa'];
    return (
        <View style={{ marginTop: 10 }}>
            <View style={{ marginHorizontal: 10, marginBottom: 10, paddingLeft: 5 }}>
                <Text style={styles.titleText}>
                    Find the Perfect Doctor for Your Furry Friend 🐾🐶🐱
                </Text>
            </View>
            <ScrollView horizontal={true} style={{ marginLeft: 10 }} showsHorizontalScrollIndicator={false}>
                {doctors?.map((item, index) => (


                    <View style={styles.container} key={index}>
                        <View style={[styles.greenBox, { backgroundColor: colors[index % colors.length] }]}>
                            <Image
                                source={{ uri: item.ProfileImage?.url }}
                                style={styles.vetImage}
                            />
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Doctor Profile', { id: item._id })} style={[styles.pinkBox, { backgroundColor: NameColors[index % NameColors.length] }]}>
                            <Text style={styles.nameText}>{item.displayName}</Text>
                            <Text style={styles.specialistText}>{item.speciality} / {item.HigherEduction}</Text>
                            <Text style={styles.specialistText}>{item.OverAllExperince} + Years Experience</Text>
                        </TouchableOpacity>
                    </View>

                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    titleText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#28a745',
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0', // Light gray background
    },
    greenBox: {
        width: SCREEN_WIDTH - 50,
        height: 200,
        marginRight: 15,
        zIndex: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    vetImage: {
        width: 200,
        height: 200,
        zIndex: 2,
        resizeMode: 'contain',
        position: 'absolute',
    },
    pinkBox: {
        width: '85%',
        height: 60,
        position: 'relative',
        top: -50,
        transform: [{ translateX: -12 }],
        zIndex: 3,
        backgroundColor: '#f7c2c2', // Custom pink
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameText: {
        fontSize: 14,
        color: '#333', // Darker text for readability
        fontWeight: 'bold',
    },
    specialistText: {
        fontSize: 12,
        color: '#333', // Darker text for readability
    },
});

export default TopDoctor;
