import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import Growth from './growth-chart.png';
import food from './food.webp';
import { useNavigation } from '@react-navigation/native';
const { width: SCREEN_WIDTH } = Dimensions.get('window')
const Cards = ({ item }) => {
    const [selectedPack, setSelectedPack] = useState(null);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        if (item && item.PackSizes && item.PackSizes.length > 0) {
            setSelectedPack(item.PackSizes[0]);
        }
    }, [item]);

    const handleSelectPack = (pack) => {
        setSelectedPack(pack);
        setDropdownOpen(false);
    };

    if (!item) {
        return null;
    }

    return (
        <View style={styles.cardContainer}>
            <View style={styles.card}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity style={styles.bestSellerTag}>
                        <Text style={styles.bestSellerText}>Best seller</Text>
                        <Image source={Growth} resizeMode="contain" style={styles.growthIcon} />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: item.ProductImages[4]?.ImageUrl }}
                        style={styles.productImage}
                        defaultSource={food}
                    />
                </View>
                <View style={styles.detailsContainer}>
                    <Text style={[styles.flavourTag, item.Flavours === 'Chicken' ? styles.chickenFlavour : styles.vegFlavour]}>
                        {item.Flavours}
                    </Text>
                    <Text numberOfLines={2} style={styles.productName}>
                        {item.ProductName}
                    </Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>
                            {selectedPack ? (
                                <>
                                    Rs {selectedPack.DiscountPrize} /
                                    <Text style={styles.strikethroughPrice}>
                                        Rs {selectedPack.MrpPrice}
                                    </Text>
                                </>
                            ) : 'Select Pack Size'}
                        </Text>

                    </View>
                    <TouchableOpacity
                        style={styles.dropdownButtonStyle}
                        onPress={() => setDropdownOpen(!isDropdownOpen)}
                    >
                        <Text style={styles.dropdownButtonTxtStyle}>
                            {selectedPack ? selectedPack.WeightAndPack : 'Select Pack Size'}
                        </Text>
                    </TouchableOpacity>
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
                                        <Text style={styles.dropdownItemText}>
                                            {pack.WeightAndPack} - Rs {pack.DiscountPrize}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}
                    <Text style={styles.moreOptionsText}>
                        {item.PackSizes.length} More Options
                    </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ProductDetailPage', { title: item._id })}
                            style={styles.buttonTouchable}
                        >
                            <Text style={styles.buttonText}>Add To Bag 🛍️</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        position: 'relative',
    },
    card: {
        width: SCREEN_WIDTH / 2.1,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',

        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginVertical: 10,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
    },
    bestSellerTag: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1,
    },
    bestSellerText: {
        fontSize: 10,
        color: '#FF0000',
    },
    growthIcon: {
        width: 15,
        height: 15,
        marginLeft: 5,
    },
    productImage: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    detailsContainer: {
        padding: 10,
    },
    flavourTag: {
        position: 'absolute',
        fontSize: 12,
        top: "-98%",

        right: 0,
        padding: 5,
        borderRadius: 20,
        textAlign: 'center',
        marginBottom: 5,
    },
    chickenFlavour: {
        backgroundColor: '#a52a2f',
        color: 'white',
    },
    vegFlavour: {
        backgroundColor: '#29a629',
        color: 'white',
    },
    productName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceText: {
        fontSize: 14,
        color: '#000',
    },
    strikethroughPrice: {
        textDecorationLine: 'line-through',
        color: 'red',
        fontSize: 12,
    },
    dropdownButtonStyle: {
        marginTop:8,
        backgroundColor: '#f5e0e0',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    dropdownButtonTxtStyle: {
        fontSize: 12,
        color: '#000',
    },
    dropdownContainer: {
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
    moreOptionsText: {
        fontSize: 12,
        color: '#888',
        textAlign: 'right',
        marginTop: 5,
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    buttonTouchable: {
        backgroundColor: '#4FAD65',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default Cards;
