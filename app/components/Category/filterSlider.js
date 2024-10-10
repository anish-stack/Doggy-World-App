import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const FilterSlider = ({ isOpen, OnClose, item }) => {

    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [selectedFilter, setSelectedFilter] = useState(1);
    const [checkedOptions, setCheckedOptions] = useState({});



    const filterOption = [
        {
            id: 1,
            title: 'Pet Type',
            subMenu: [
                { id: 2, title: 'All' },
                { id: 3, title: 'Dog' },
                { id: 4, title: 'Cat' },
            ]
        },
        {
            id: 5,
            title: 'Category',
            subMenu: [
                { id: 6, title: 'All' },
                { id: 7, title: 'Dog Food' },
                { id: 8, title: 'Cat Food' },
            ]
        },
        {
            id: 9,
            title: 'Price'
        },
        {
            id: 10,
            title: 'Breed Size',
            subMenu: [
                { id: 11, title: 'All' },
                { id: 12, title: 'Maxi Breed' },
                { id: 13, title: 'Mini Breed' },
                { id: 14, title: 'Large Breed' },
                { id: 15, title: 'Adult' },
                { id: 16, title: 'Puppy' },
            ]
        },
        {
            id: 17,
            title: 'Item Form',
            subMenu: [
                { id: 18, title: 'All' },
                { id: 19, title: 'Soft' },
                { id: 20, title: 'Sticks' },
                { id: 21, title: 'Biscuits' },
                { id: 22, title: 'Jerky' },
            ]
        },
        {
            id: 23,
            title: 'Flavor',
            subMenu: [
                { id: 24, title: 'All' },
                { id: 25, title: 'Chicken' },
                { id: 26, title: 'Beef' },
                { id: 27, title: 'Fish' },
                { id: 28, title: 'Lamb' },
            ]
        },
        {
            id: 29,
            title: 'Type',
            subMenu: [
                { id: 30, title: 'All' },
                { id: 31, title: 'Dry' },
                { id: 32, title: 'Wet' },
                { id: 33, title: 'Treats' },
            ]
        },
        {
            id: 34,
            title: 'Brand',
            subMenu: [
                { id: 35, title: 'All' },
                { id: 36, title: 'Brand A' },
                { id: 37, title: 'Brand B' },
                { id: 38, title: 'Brand C' },
                { id: 39, title: 'Brand D' },
            ]
        },
        {
            id: 40,
            title: 'Pet Age'
        },
        {
            id: 41,
            title: 'Discount'
        }
    ];

    useEffect(() => {
        // Load checked options from AsyncStorage on component mount
        const loadCheckedOptions = async () => {
            try {
                const savedOptions = await AsyncStorage.getItem('checkedOption');
                console.log("savedOptions",savedOptions)
                if (savedOptions) {
                    setCheckedOptions(JSON.parse(savedOptions));
                }
            } catch (error) {
                console.error('Failed to load checked options', error);
            }
        };
        loadCheckedOptions();
    }, []);

    const handleCheck = async (filterId, subId) => {
        setCheckedOptions(prev => {
            const updatedOptions = { ...prev, [subId]: !prev[subId] };
            AsyncStorage.setItem('checkedOptions', JSON.stringify(updatedOptions)).catch(error => {
                console.error('Failed to save checked options', error);
            });
            return updatedOptions;
        });
    };
    //   Make a range in price min max and one

    if (!isOpen) {
        return null; // If not open, render nothing
    }

    return (
        <SafeAreaView className="fixed top-[-25%] right-0 w-full min-h-screen z-[999] bg-white shadow-lg">
            <ScrollView >
                <View className="flex-row px-5 py-5 items-center justify-between mb-4">
                    <Text className="text-lg font-semibold">Filter Options</Text>
                    <TouchableOpacity onPress={OnClose}>
                        <Text className="text-xl">❌</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row">
                    {/* Sidebar with filter categories */}
                    <View className="w-1/3 bg-gray-200 p-2">
                        {filterOption.map(option => (
                            <TouchableOpacity onPress={() => setSelectedFilter(option.id)} key={option.id} className="p-2 border-b border-gray-300">
                                <Text className="text-base font-medium">{option.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Content area for sub-menu details */}

                    <View className="w-2/3 p-2">
                        {selectedFilter && (
                            <ScrollView>
                                {filterOption
                                    .find(option => option.id === selectedFilter)
                                    ?.subMenu?.map(sub => (
                                        <TouchableOpacity   onPress={() => handleCheck(selectedFilter, sub.id)} key={sub.id} className=" border-b mb-2 border-gray-300">
                                            <View className='flex-row text-center'>
                                                <Text className='border border-red-300 w-6 h-6 px-1 py-1 mb-2 mr-2 text-xs text-center flex items-center justify-center'>{checkedOptions[sub.id] ? '✔️' : ' '}</Text>
                                                <Text className="text-base">{sub.title}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                            </ScrollView>
                        )}
                        {!selectedFilter && (
                            <Text className="text-center text-gray-600">Select a filter to view options</Text>
                        )}
                    </View>
                </View>

                {/* Price Filter */}
                <View className="mt-4  px-5 py-5">
                    <Text className="text-lg font-semibold mb-2">Price Range</Text>
                    <View className="flex-row  justify-between mb-4">
                        <TextInput
                            className="border border-gray-300  mr-2 p-2 w-1/2"
                            placeholder="Min"
                            keyboardType="numeric"
                            value={priceMin}
                            onChangeText={setPriceMin}
                        />
                        <TextInput
                            className="border border-gray-300 p-2 w-1/2"
                            placeholder="Max"
                            keyboardType="numeric"
                            value={priceMax}
                            onChangeText={setPriceMax}
                        />
                    </View>
                    <View className="flex-row justify-between">
                        <TouchableOpacity className="bg-red-500 p-2 rounded">
                            <Text className="text-white text-center">Apply Filter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-gray-500 p-2 rounded">
                            <Text className="text-white text-center">Reset Filter</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};



export default FilterSlider;
