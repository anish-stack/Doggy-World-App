import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Pressable } from 'react-native';
import blog1 from '../../assets/blog1.png';
import blog2 from '../../assets/blog2.png';
import blog3 from '../../assets/blog3.png';
import blog4 from '../../assets/blog4.png';

const Blog = () => {
    const products = [
        {
            blogImage : blog1,
            blogTitle: "Understanding the Traits and Average Life...",
            
        },
        {
            blogImage : blog2,
            blogTitle: "Blood Tests for Dogs and Cats: The Complete Gu...",
        },
        {
            blogImage : blog3,
            blogTitle: "Dandruff in Dogs: Types of Dandruff, their Cause...",
        },
        {
            blogImage : blog4,
            blogTitle: "Here is Why Your Cat Doesn't Drink W...",
        },
        {
            blogImage : blog2,
            blogTitle: "Itching, Crusty Skin, Hair Loss and Skin Problems...",
        },
    ];

    const renderItem = ({ item, index }) => (
        <Pressable key={index}>
            <View style={styles.productContainer}>
                <Image
                    source={item.blogImage}
                    style={styles.blogImg}
                    resizeMode='contain'
                />
                <View style={styles.blogDetailBox}>
                    <Text  style={styles.blogTitle}>{item.blogTitle}</Text>
                </View>
            </View>
        </Pressable>
    );

    return (
        <View>
            <Text className="text-base px-4 mb-2 font-semibold tracking-wider">Blog</Text>
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
        width: 225,
        height: 212,
        marginEnd: 10,
        borderWidth: 1,
        borderRadius: 6,
        shadowRadius: 3.84,
        shadowColor: '#000',
        borderColor: '#999',
        shadowOpacity: 0.25,
        alignItems: 'center',
        borderStyle: 'solid',
        backgroundColor: '#fff',
        shadowOffset: { width: 0, height: 2 },
    },
    blogImg: {
        width: 225,
        height: 150,
    },
    blogDetailBox: {
        padding: 5,
    },
    blogTitle: {
        fontSize: 14,
        fontWeight: '500',
    },
});

export default Blog;
