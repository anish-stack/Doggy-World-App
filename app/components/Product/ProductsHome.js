import { useRoute } from '@react-navigation/native';
import React, { useCallback, useState, useEffect } from 'react';
import { Text, View, FlatList } from 'react-native'; // Use FlatList instead of ScrollView
import axios from 'axios';

import Loader from '../../components/Loader/Loader';
import Cards from './Cards';

const ProductsHome = () => {
    const [product, setProduct] = useState([]);
    const route = useRoute();

    // Fetch product data
    const getProduct = useCallback(async () => {
        try {
            console.log("I am hit");
            const { data } = await axios.get('http://192.168.1.7:7000/api/v1/Product/Get-All-Products');
            const responseData = data.data;
            setProduct(responseData);
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        getProduct();
    }, [getProduct]); // Dependency on getProduct and title

    // Render a single product card
    const renderProduct = ({ item }) => (
        <View key={item._id} style={{ flex: 1, marginBottom: 16 }}>
            <Cards item={item} />
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <Text className="text-xl font-bold text-gray-800 text-center  mb-2">
                🐾 Our Pet Shop For All Your Pet's Needs 🛒
            </Text>
            {product.length > 0 ? (
                <FlatList
                    data={product}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item._id}
                    numColumns={2} // Set the number of columns to 2
                    columnWrapperStyle={{ justifyContent: 'space-between' }} // Adjusts the spacing between columns
                    contentContainerStyle={{ paddingBottom: 20 }} // Add padding to the bottom for scrolling
                />
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Loader />
                </View>
            )}
        </View>
    );
};

export default ProductsHome;
