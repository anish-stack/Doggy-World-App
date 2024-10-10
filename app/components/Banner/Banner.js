import React from 'react'
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, } from 'react-native'
import Carousel, { PaginationLight } from 'react-native-x-carousel';
const { width } = Dimensions.get('window');
import { BannerData } from '../../data/bannerData';
import { useNavigation } from '@react-navigation/native'

const Banner = () => {

    const navigation = useNavigation();

    const renderItem = (item) => (
        <View
            key={item._id}
            style={styles.cardContainer}
        >
            <TouchableOpacity onPress={() => alert(item._id)}>
                <View style={styles.cardWrapper}>
                    <Image style={styles.card}
                        source={ item.coverImageUri }
                    />
                    <View
                        style={[
                            styles.cornerLabel,
                            // { backgroundColor: item.cornerLabelColor },
                        ]}
                    >
                        <TouchableOpacity onPress={() => navigation.navigate("booknow")}>
                            <Text style={styles.cornerLabelText}>
                                BOOK NOW
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View className="flex-row mx-3 mb-1 justify-between align-middle">
                <Text className="text-lg font-semibold">Available Doctor</Text>
                <TouchableOpacity onPress={() => navigation.navigate("clinic")}>
                    <Text className="text-xs font-medium tracking-wide text-gray-600">View All</Text>
                </TouchableOpacity>
            </View>
            <Carousel
                pagination={PaginationLight}
                renderItem={renderItem}
                data={BannerData}
                loop
                autoplay
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    cardContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width,
    },
    cardWrapper: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    card: {
        width: width * 0.95,
        height: width * 0.5,
    },
    cornerLabel: {
        position: 'absolute',
        bottom: 30,
        left: 11,
        borderRadius: 5,
        backgroundColor: '#0080ff',
    },
    
    cornerLabelText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
        padding: 10,
    },
});

export default Banner