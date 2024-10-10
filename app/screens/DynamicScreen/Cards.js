import React, { useEffect, useState } from 'react';
import { View, Animated, StyleSheet, Image, Text, TouchableOpacity, FlatList, Button } from 'react-native';
import Growth from './growth-chart.png';
import food from './food.webp';
import { useNavigation } from '@react-navigation/native';

const Cards = ({ item }) => {
    const [selectedPack, setSelectedPack] = useState(null);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [scaleValue] = useState(new Animated.Value(1));
    const [opacityValue] = useState(new Animated.Value(1));
    const navigation = useNavigation();
    useEffect(() => {

        if (item && item.PackSizes && item.PackSizes.length > 0) {
            setSelectedPack(item.PackSizes[0]);
        }
    }, [item]);

    const handlePressIn = () => {
        Animated.sequence([
            Animated.timing(scaleValue, {
                toValue: 0.9,  // Scale down
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(opacityValue, {
                toValue: 0.7,  // Slightly fade out
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
                toValue: 1,  // Scale back up
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(opacityValue, {
                toValue: 1,  // Fade back in
                duration: 150,
                useNativeDriver: true,
            })
        ]).start();
    };



    const handleSelectPack = (pack) => {
        setSelectedPack(pack);
        setDropdownOpen(false);
    };
    if (!item) {
        return null;
    }



    return (
        <>


            <View style={{ elevation: 4 }} className="w-full shadow-xl bg-white min-h-[130px] px-4 mt-2">
                <View className="flex-row w-full">
                    <View className="w-1/3 relative flex-col px-2 py-3 mt-0">
                        <View className="w-[80%] text-start">
                            <TouchableOpacity style={styles.radius} className="flex absolute ml-3 left-[-22px] z-20 flex-row items-start border border-red-600 px-2 py-1 bg-white shadow-sm">
                                <Text style={{ fontSize: 8 }} className="whitespace-nowrap text-gray-700">Best seller</Text>
                                <Image
                                    source={Growth}
                                    resizeMode="contain"
                                    className="w-3 h-3 border border-black rounded-full object-cover"
                                />
                            </TouchableOpacity>
                        </View>

                        <View className="w-full flex items-center ml-[-8px] justify-center  h-44  py-1">
                            <Image className="w-full object-cover h-full" resizeMode="contain" source={{ uri: item.ProductImages[4]?.ImageUrl }} defaultSource={food} fadeDuration={5} />
                        </View>
                    </View>
                    <View className="w-2/3">
                        <Text style={styles.shadow} className={` fixed w-[95px] text-white rounded-xl right-[-55%] px-2 py-[0.9] whitespace-nowrap text-center top-[-8px] ${item.Flavours === 'Chicken' ? 'bg-[#a52a2f]' : 'bg-[#29a629]'}  `}>
                            {item.Flavours}
                        </Text>
                        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.hide} className=" mt-2 font-bold text-gray-600">
                            {item.ProductName}
                        </Text>

                        <View className="flex-row relative items-center justify-between">
                            {/* Display selected pack or prompt */}
                            <Text className="font-semibold mt-2 text-md">
                                {selectedPack ? (
                                    <>
                                        Rs {selectedPack.DiscountPrize} /
                                        <Text className='text-xs text-red-600' style={{ textDecorationLine: 'line-through' }}>
                                            Rs {selectedPack.MrpPrice}
                                        </Text>
                                    </>
                                ) : 'Select Pack Size'}
                            </Text>


                            {/* Custom Dropdown */}
                            <TouchableOpacity
                                style={styles.dropdownButtonStyle}
                                onPress={() => setDropdownOpen(!isDropdownOpen)}
                            >
                                <Text style={styles.dropdownButtonTxtStyle}>
                                    {selectedPack ? selectedPack.WeightAndPack : 'Select Pack Size'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {isDropdownOpen && (
                            <View style={styles.dropdownContainer}>
                                <FlatList
                                    data={item.PackSizes}
                                    keyExtractor={(pack) => pack._id}
                                    renderItem={({ item: pack }) => (
                                        <TouchableOpacity
                                            style={styles.dropdownItem}
                                            onPress={() => handleSelectPack(pack)}
                                        >
                                            <Text style={styles.dropdownItemText}>{pack.WeightAndPack} - Rs {pack.DiscountPrize}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        )}
                        <Text style={{ textAlign: 'right' }} className='text-xs px-2 py-1 text-gray-500'>{item.PackSizes.length} More Options</Text>
                    </View>
                </View>
                <View className="text-center mb-5 flex  items-end mt-[-62px]  justify-end" style={styles.button}>
                    <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleValue }], opacity: opacityValue }]}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ProductDetailPage', { title: item._id })}
                            onPressIn={handlePressIn}
                            style={styles.buttonTouchable}
                        >
                            <Text className="text-black px-1.5 py-1.5" style={styles.buttonText}>
                                Add To Bag 🛍️
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    radius: {
        borderRadius: 5,
        borderBottomLeftRadius: 10,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
    },
    hide: {
        color: "#333",
        fontSize: 13,
    },
    dropdownButtonStyle: {
        backgroundColor: '#f5e0e0',
        borderRadius: 12,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 12,
        paddingRight: 12,
        marginTop: 10,
        alignItems: 'center',
    },
    dropdownButtonTxtStyle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#000',
        textAlign: 'center',
    },
    dropdownContainer: {

        position: 'relative',
        zIndex: 999,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginTop: 5,
        padding: 10,
        elevation: 5,
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#151E26',
    },
    buttonTouchable: {
        backgroundColor: '#4FAD65',  // Red color

        paddingHorizontal: 24,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Cards;
