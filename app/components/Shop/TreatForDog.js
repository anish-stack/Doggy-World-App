import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Pressable } from 'react-native';
import catFood from '../../assets/cat-food.png';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const TreatForDog = () => {
    const products = [
        {
            pImage: catFood,
            pTitle: "Royal Canin Mini Puppy - 800Gm",
            pWeight: "800gm",
            pMrp: "₹950",
            pPrice: "₹836",
        },
        {
            pImage: catFood,
            pTitle: "Royal Canin Mini Puppy - 800Gm",
            pWeight: "800gm",
            pMrp: "₹950",
            pPrice: "₹836",
        },
        {
            pImage: catFood,
            pTitle: "Royal Canin Mini Puppy - 800Gm",
            pWeight: "800gm",
            pMrp: "₹950",
            pPrice: "₹836",
        },
        {
            pImage: catFood,
            pTitle: "Royal Canin Mini Puppy - 800Gm",
            pWeight: "800gm",
            pMrp: "₹950",
            pPrice: "₹836",
        },
        {
            pImage: catFood,
            pTitle: "Royal Canin Mini Puppy - 800Gm",
            pWeight: "800gm",
            pMrp: "₹950",
            pPrice: "₹836",
        },
    ];

    const renderItem = ({ item, index }) => (
        <Pressable key={index}>
            <View style={styles.productContainer}>
                <Image
                    source={item.pImage}
                    style={styles.productImg}
                    resizeMode='contain'
                />
                <View style={styles.productDetailBox}>
                    <Text style={styles.productTitle}>{item.pTitle}</Text>
                    <Text style={styles.productWeight}>{item.pWeight}</Text>
                    <View style={styles.productPurchase}>
                        <View>
                            <Text style={styles.productMrp}>{item.pMrp}</Text>
                            <Text style={styles.productPrice}>{item.pPrice}</Text>
                        </View>
                        <Pressable style={styles.productCartButton}>
                            <Text style={styles.buttonText}>Add</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Pressable>
    );

    return (
        <View>
            <View className="flex-row justify-between mx-3 my-3">
                <Text className="font-bold text-lg tracking-wider">Treat For Dog</Text>
                <Text>
                    <FontAwesome name="arrow-right" size={23} color="#EF5030" />
                </Text>
            </View>
            <FlatList
                horizontal
                data={products}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        paddingHorizontal: 11,
        marginBottom: 15,
    },
    productContainer: {
        width: 172,
        height: 280,
        borderWidth: 1,
        borderRadius: 6,
        borderColor: '#999',
        borderStyle: 'solid',
        shadowRadius: 3.84,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        alignItems: 'center',
        backgroundColor: '#fff',
        shadowOffset: { width: 0, height: 2 },
        marginEnd: 10,
    },
    productImg: {
        width: 172,
        height: 140,
    },
    productDetailBox: {
        padding: 8,
    },
    productTitle: {
        fontSize: 14,
        fontWeight: '500',
    },
    productWeight: {
        fontSize: 13,
        color: '#999',
        marginVertical: 8,
    },
    productPurchase: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    productMrp: {
        fontSize: 14,
        color: '#ccc',
        textDecorationLine: 'line-through',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '600',
    },
    productCartButton: {
        backgroundColor: '#EF5030',
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 22,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default TreatForDog;
