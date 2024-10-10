import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Animated, FlatList, useWindowDimensions, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Loader from '../../components/Loader/Loader';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RenderHTML from 'react-native-render-html';
import ProductTopBar from '../../components/Topbar/ProductTopBar';
import { useDispatch } from 'react-redux';
import { AddItemInCart } from '../../redux/slice/cartSlice';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SingleProduct = () => {
    const dispatch = useDispatch()
    const [product, setProduct] = useState({});
    const [relatedProduct, setRelatedProduct] = useState([]);
    const [selectedPack, setSelectedPack] = useState(null);
    const { width } = useWindowDimensions();
    const [mainImage, setMainImage] = useState('');
    const [childImage, setChildImage] = useState([]);
    const [loader, setLoader] = useState(false);
    const [imageTranslateX] = useState(new Animated.Value(0));
    const [prevImageTranslateX] = useState(new Animated.Value(0));
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);



    const route = useRoute();
    const { title } = route.params;

    useEffect(() => {

        if (product && product.PackSizes && product.PackSizes.length > 0) {
            setSelectedPack(product.PackSizes[0]);
        }
    }, [product]);



    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleIncrease = () => {
        setQuantity(prev => prev + 1);
    };
    const handleAddToCart = async () => {
        const CartItems = {
            ProductId: product._id,
            Quantity:quantity,
            selectedPackId: selectedPack ? selectedPack._id : null // Make sure selectedPackId is defined
        };    
        dispatch(AddItemInCart(CartItems)); // Pass CartItems to dispatch
    };

    const handleSelectPack = (pack) => {
        setSelectedPack(pack);
        setDropdownOpen(false);
    };

    const handleFetchDataById = async () => {
        try {
            setLoader(true);
            const response = await axios.get(`http://192.168.1.5:7000/api/v1/Product/Get-Single-Product/${title}`);
            if (response.data) {
                setProduct(response.data.data);
                setRelatedProduct(response.data.relatedProducts);
            }
            // console.log(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        handleFetchDataById();
    }, [title]);

    useEffect(() => {
        if (product.ProductImages && product.ProductImages.length > 0) {
            setMainImage(product.ProductImages[0].ImageUrl);
            setChildImage(product.ProductImages);
        }
    }, [product]);

    const handleChangeMainImage = (index) => {
        // Slide out the previous image
        Animated.timing(prevImageTranslateX, {
            toValue: -300, // Adjust according to your layout
            duration: 300,
            useNativeDriver: true,
        }).start();

        // Slide in the new image
        Animated.timing(imageTranslateX, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setMainImage(product.ProductImages[index].ImageUrl);
            Animated.timing(imageTranslateX, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
            }).start();
        });
    };


    const source = {
        html: `${product?.DetailsData}`
    }

    if (loader) {
        return <Loader />;
    }

    const renderThumbnail = ({ item, index }) => (
        <TouchableOpacity onPress={() => handleChangeMainImage(index)}>
            <Image source={{ uri: item.ImageUrl }} style={styles.thumbnail} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ProductTopBar isShow={true} />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                <View className='relative'>
                    {/* Image Slider */}
                    <View style={styles.sliderContainer}>
                        <Animated.Image
                            source={{ uri: mainImage }}
                            style={[styles.mainImage, { transform: [{ translateX: imageTranslateX }] }]}
                        />
                        <View style={styles.thumbnailWrapper}>
                            <FlatList
                                data={childImage}
                                horizontal
                                keyExtractor={(item) => item.ImageUrl}
                                renderItem={renderThumbnail}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.thumbnailContainer}
                            />
                        </View>
                    </View>

                    {/* Product Information */}

                    <View className='border-t-[0.4px] relative border-gray-300'>
                        <Text numberOfLines={2} className="text-lg font-bold text-balance text-pretty text-gray-700 px-5 " ellipsizeMode="tail">{product?.ProductName}...</Text>
                        <View className="flex-row w-[90%] mx-auto justify-between mt-2 bg-white py-2 px-5 items-center">
                            <TouchableOpacity onPress={handleDecrease} className="bg-green-700 p-2 rounded-full">
                                <FontAwesome name="minus" size={12} color="#fff" />
                            </TouchableOpacity>
                            <Text className="mx-4 text-lg font-semibold">{quantity}</Text>
                            <TouchableOpacity onPress={handleIncrease} className="bg-green-700 p-2 rounded-full">
                                <FontAwesome name="plus" size={12} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row relative px-2  mt-2 items-center justify-between">
                            {/* Display selected pack or prompt */}
                            <Text className="font-semibold   px-1 py-3">
                                {selectedPack ? (
                                    <>
                                        <Text className='text-xl' >  Rs {selectedPack.DiscountPrize}</Text>
                                        /
                                        <Text className=' text-red-600 text-xs' style={{ textDecorationLine: 'line-through' }}>
                                            Rs {selectedPack.MrpPrice}
                                        </Text>

                                    </>
                                ) : 'Select Pack Size'}

                            </Text>
                            <TouchableOpacity onPress={handleAddToCart}>
                                <Text className="text-sm bg-[#4FAD65] text-white rounded-3xl font-bold px-6 py-2">Add To Bag  <FontAwesome name="shopping-bag" size={14} color="#ffffff" className="mr-2" /></Text>
                            </TouchableOpacity>

                        </View>


                        <Text className='px-5 mt-[-9px]'>{selectedPack ? (
                            <Text className='text-gray-700 underline '>Stock Available : {selectedPack.SizeStock}</Text>
                        ) : 'Stock Not Available'}</Text>




                        <View className="px-5 mt-[9px]">
                            {selectedPack ? (
                                selectedPack.SizeAvailable ? (
                                    <View className="relative">
                                        {/* Hurry Up Button */}
                                        <Text className="px-4 py-2 text-gray-900 bg-[#f8f8f5] text-center font-bold text-xl uppercase rounded-lg shadow-lg transition-all transform hover:bg-red-700 hover:scale-105 hover:shadow-2xl">
                                            Hurry Up
                                        </Text>

                                    </View>
                                ) : (
                                    <Text className="text-red-600">Not Available</Text>
                                )
                            ) : (
                                <Text className="text-red-600">Stock Not Available</Text>
                            )}
                        </View>




                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="px-5 mt-4"
                        >
                            <View className="gap-1 flex-row">
                                {/* Iterate over PackSizes and render as buttons */}
                                {product.PackSizes && product.PackSizes.map((pack) => (
                                    <TouchableOpacity
                                        key={pack._id}
                                        className={`py-2 px-3 mb-2 text-base whitespace-nowrap rounded-lg ${selectedPack && selectedPack._id === pack._id ? 'bg-[#4FAD65]' : 'bg-gray-900'
                                            }`}
                                        onPress={() => handleSelectPack(pack)}
                                    >
                                        <Text className="font-bold text-white">
                                            {pack.WeightAndPack} - Rs {pack.DiscountPrize}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                    </View>


                    <Text style={styles.shadow} className={` fixed w-[95px] text-white rounded-xl right-[-70%]  px-2 py-[0.9] whitespace-nowrap text-center top-[-92%] ${product.Flavours === 'Chicken' ? 'bg-[#a52a2f]' : 'bg-[#29a629]'}  `}>
                        {product.Flavours}
                    </Text>

                    <View style={{ width: '200px', overflow: 'hidden' }} className="px-5  text-sm mt-4">
                        <RenderHTML

                            contentWidth={SCREEN_WIDTH}
                            source={source}
                        />
                    </View>
                    {/* Related Products Section (Add more UI here) */}
                </View>

                {/* <View className="p-5 bg-white rounded-lg shadow-md">
                    <Text className="text-lg font-bold mb-3 text-gray-800">Premium Dog Food</Text>
                    <Text className="text-base text-gray-600 mb-2">
                        At Doggy Delights, we believe that every dog deserves the best nutrition. Our premium dog food is crafted with the highest quality ingredients to ensure your furry friend stays healthy and happy. Each recipe is thoughtfully formulated to meet the unique dietary needs of dogs of all breeds and sizes.
                    </Text>
                    <Text className="text-base text-gray-600 mb-2">
                        Our dog food contains real meat as the first ingredient, providing essential protein for strong muscles and a healthy heart. We also include a blend of wholesome grains and vegetables, packed with vitamins and minerals to support overall well-being. Plus, our recipes are free from artificial flavors and preservatives, ensuring a natural and delicious meal for your pet.
                    </Text>
                    <Text className="text-base text-gray-600 mb-2">
                        Choose from a variety of flavors, including Chicken, Beef, and Salmon, to cater to your dog’s preferences. Whether your dog is a playful puppy or a seasoned senior, our dog food is designed to promote vitality and longevity.
                    </Text>
                    <Text className="text-base text-gray-600 mb-2">
                        We understand that every dog is unique, which is why we offer customizable feeding plans tailored to your dog's specific needs. Join the Doggy Delights family today and give your pet the gift of health and happiness with our premium dog food!
                    </Text>
                </View> */}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    sliderContainer: {
        marginTop: 10,
        padding: 20,
    },
    mainImage: {
        width: '100%',
        height: 300,

        padding: 20,
        resizeMode: 'cover',
    },
    thumbnailWrapper: {
        marginTop: 10,
    },
    thumbnailContainer: {
        paddingHorizontal: 2,
    },
    thumbnail: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
});

export default SingleProduct;
