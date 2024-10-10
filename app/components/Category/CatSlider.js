import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FilterSlider from './filterSlider';
import { SafeAreaView } from 'react-native-safe-area-context';
const CatSlider = () => {

    const [data, setData] = useState([]);
    const navigation = useNavigation();
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get('http://192.168.1.5:7000/api/v1/Product/Get-All-category');
            setData(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);


    const openFilter = () => setIsFilterOpen(true);

    const closeFilter = () => {
        console.log("I am Close")
        setIsFilterOpen(false)
    };

    useEffect(() => {
        fetchData();

    }, [fetchData]);


    // Render each category item
    const renderItem = ({ item }) => (
        <TouchableOpacity
            className="mr-4 bg-white rounded-lg p-3 text-center shadow-lg"
            onPress={() => navigation.navigate('CategoryDetails', { id: item._id })}
        >
            <Image
                source={{ uri: item.Image.url }}
                className="rounded-full flex items-center justify-center text-center w-12 h-12 object-cover"
                resizeMode="cover"
            />
            <Text className="mt-2 text-center text-gray-700">{item.CategoryTitle}</Text>
        </TouchableOpacity>

    );

    return (
        <SafeAreaView>
        
  
            <View className="flex-row relative py-3 px-3 z-10 justify-between">
                <Text className="text-sm font-bold mb-4">348 Items</Text>
                <TouchableOpacity
                    onPress={openFilter}
                    className="flex-row items-center mb-2 bg-[#4FAD65] px-3  rounded-lg shadow-md"
                >
                    <FontAwesome name="filter" size={14} color="#ffffff" className="mr-2" />
                    <Text className="text-white text-sm ml-2 font-bold">Filter</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                horizontal

                showsHorizontalScrollIndicator={false}
                className="flex-row px-2"
            />


   
         <FilterSlider item={data} isOpen={isFilterOpen} OnClose={closeFilter} />
         </SafeAreaView>

    );
};

export default CatSlider;
