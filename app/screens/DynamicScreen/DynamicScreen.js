import { useRoute } from '@react-navigation/native';
import React, { useCallback, useState, useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native'; // Ensure you're importing ScrollView from 'react-native'
import axios from 'axios';
import CatSlider from '../../components/Category/CatSlider';
import Topbar from '../../components/Topbar/Topbar';
import ProductTopBar from '../../components/Topbar/ProductTopBar';
import Cards from './Cards';
import Loader from '../../components/Loader/Loader';

const DynamicScreen = () => {
    const [product, setProduct] = useState([]);
    const route = useRoute();
    const { title } = route.params;

    // Fetch product data
    const getProduct = useCallback(async () => {
        try {
            console.log("I am hit")
            const { data } = await axios.get('http://192.168.1.5:7000/api/v1/Product/Get-All-Products');
            const responseData = data.data;
            const findOnlyTitleIdProducts = responseData.filter((item) => item.Category._id === title._id);
            setProduct(findOnlyTitleIdProducts);
        } catch (error) {
            console.log(error);
        }
    }, [title]);

    useEffect(() => {
        getProduct();
    }, [getProduct, title]); // Dependency on getProduct and title

    return (
        <View className="w-full h-full">
            {/* Static top sections */}
            <ProductTopBar isShow={true} />
            <CatSlider />

            {/* Scrollable section for product cards */}
            <ScrollView className="flex-1 mt-4" contentContainerStyle={{ paddingBottom: 20 }}>
                {product.length > 0 ? (
                    product.map((item) => (
                        <View key={item._id} className="mb-4">
                            <Cards item={item} />
                        </View>
                    ))
                ) : (
                    <Text className="text-center mt-4"><Loader/></Text>
                )}
            </ScrollView>
        </View>
    );
};

export default DynamicScreen;
