import { View, Text, ScrollView, FlatList, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import ServiceCard from './ServiceCard';
import Layout from '../../components/Layout/Layout';
const SCREEN_HEIGHT = Dimensions.get('window').height

export default function Service() {
    const route = useRoute();
    const { title } = route.params;
    const [loading, setLoading] = useState(true);
    const [service, setService] = useState([]);
    const [error, setError] = useState('');

    const handleFetch = async () => {
        try {
            const { data } = await axios.get('http://192.168.1.5:7000/api/v1/Doctors/Get-Services');

            const findOnlyTitleIdProducts = data.data.filter((item) => item.ServiceCategorey._id === title._id);

            if (findOnlyTitleIdProducts) {
                setService(findOnlyTitleIdProducts);
            } else {
                setService([])
                setError('No Product Found');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFetch();
    }, []);

    const renderServiceItem = ({ item }) => (
        <ServiceCard item={item} />
    );

    return (
        <Layout>

            <View style={styles.container}>
                <Text style={styles.categoryTitle}>{title.CategoryTitle}</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : (
                    <FlatList
                        data={service}
                        renderItem={renderServiceItem}
                        keyExtractor={(item) => item._id.toString()}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
            </View>
        </Layout>
    );
}

// Styles for the component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        height: SCREEN_HEIGHT,
        backgroundColor: '#fff',
    },
    categoryTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    listContainer: {
        paddingBottom: 8,
    }

});
