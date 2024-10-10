import React from 'react'
import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import consultationImg from '../../assets/consultation.png';
import groomingImg from '../../assets/grooming.png';
import prescriptionImg from '../../assets/prescription.png';
import medicineImg from '../../assets/medicine.png';

const categoriesData = [
    { id: 1, image: consultationImg, label: 'Consultation' },
    { id: 2, image: groomingImg, label: 'Grooming' },
    { id: 3, image: prescriptionImg, label: 'Vaccination' },
    { id: 4, image: medicineImg, label: 'Dog Food' },
    { id: 5, image: medicineImg, label: 'Cat Food' },
    { id: 6, image: medicineImg, label: 'Pet Shop' },
    { id: 7, image: medicineImg, label: 'Pet Shop' },
    { id: 8, image: medicineImg, label: 'Pet Shop' },
    { id: 9, image: medicineImg, label: 'Pet Shop' },
];

const FoodAccessories = () => {
    return (
        <View>
            <View className="flex-row justify-between mx-3 mt-5">
                <Text className="font-bold text-lg tracking-wider">Food & Accessories</Text>
                <Text>
                    <FontAwesome name="arrow-right" size={23} color="#EF5030" />
                </Text>
            </View>
            <View style={styles.categories}>
                {categoriesData.map(category => (
                    <Pressable key={category.id} style={styles.pressable}>
                        <View style={styles.categoriesBox}>
                            <Image source={category.image} style={styles.image} />
                            <Text style={styles.categoriesText}>{category.label}</Text>
                        </View>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    categories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
        paddingBottom: 0,
    },
    categoriesBox: {
        padding: 5,
        elevation: 5,
        borderRadius: 5,
        marginBottom: 14,
        shadowRadius: 3.84,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 2 },
    },
    categoriesText: {
        fontSize: 12,
        marginTop: 8,
    },
    image: {
        width: 60,
        height: 60,
    },
    pressable: {
        width: '31%',
        padding: 3,
    },
});

export default FoodAccessories;
