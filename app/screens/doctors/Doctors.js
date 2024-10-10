import { View, Text, ActivityIndicator, FlatList, Dimensions, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import axios from 'axios'; // Make sure Axios is imported
import { useNavigation } from '@react-navigation/native';
import Layout from '../../components/Layout/Layout';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Doctors() {
    const route = useRoute();
    const { title } = route.params; 
    const navigation = useNavigation();

    const [doctors, setDoctors] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [errorMsg, setErrorMsg] = useState(''); 
    const colors = ['#5EB07C', '#A3D9A5']; 
    const NameColors = ['#f8f8ff', '#fffafa'];


    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://192.168.1.5:7000/api/v1/Doctors/get-doctor');
                if (response.data.success) {
                    // console.log(response.data)
                    setDoctors(response.data.data); // Store fetched doctors in state
                } else {
                    setErrorMsg('Failed to fetch doctors');
                }
            } catch (error) {
                console.log(error)
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

    // Render doctors list
    return (
        <Layout>
            <View className="flex-1 p-4">
                <ScrollView horizontal={false} style={{ marginLeft: 10 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                    <View style={styles.doctorsRow}>
                        {doctors?.map((item, index) => (
                            <View style={styles.doctorCard} key={index}>
                                <View style={[styles.greenBox, { backgroundColor: colors[index % colors.length] }]}>
                                    <Image
                                        source={{ uri: item.ProfileImage?.url }}
                                        style={styles.vetImage}
                                    />
                                </View>
                                <View style={[styles.pinkBox, { backgroundColor: NameColors[index % NameColors.length] }]}>
                                    <Text onPress={() => navigation.navigate('Doctor Profile', { id: item._id })} style={styles.nameText}>{item.displayName}</Text>
                                    <Text style={styles.specialistText}>{item.speciality} / {item.HigherEduction}</Text>
                                    <Text style={styles.specialistText}>{item.OverAllExperince} + Years Experience</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    doctorsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    doctorCard: {
        width: SCREEN_WIDTH * 0.43,
        // marginBottom: 20, 
        alignItems: 'center',
    },
    greenBox: {
        width: '100%',
        height: 150,
        marginBottom: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    vetImage: {
        width: '80%',
        height: '80%',
        resizeMode: 'cover',
        borderRadius: 10,
    },
    pinkBox: {
        width: '95%',
        height: 60,
        position: 'relative',
        top: -30,
        left: '8%',
        elevation: 4,
        shadowColor: 'black',
        transform: [{ translateX: -12 }],
        zIndex: 3,
        backgroundColor: '#f7c2c2',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameText: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
    },
    specialistText: {
        fontSize: 12,
        color: '#333',
    },
});
