import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getItemOfCart, RemoveItem, updateItemQuantity, RemoveAllItem } from '../redux/slice/cartSlice';
import Layout from '../components/Layout/Layout';
import AddressModel from './Booking_step/AddressModel';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import cartAnimation from './cart.json';
const Cart = () => {
    const navigation = useNavigation();

    const dispatch = useDispatch();
    const { isAuthenticated, pet, token } = useSelector((state) => state.auth);

    const { CartItems, loading, error } = useSelector((state) => state.cart);
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);
    const [isOpenModel, setIsOpenModel] = useState(false);
    const [paymentOption, setPaymentOption] = useState('online');
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    useEffect(() => {
        dispatch(getItemOfCart());
    }, [dispatch]);

    const handleRemoveItem = (itemId, selectedPackId) => {
        dispatch(RemoveItem({ itemId, selectedPackId }));
    };

    const handleUpdateQuantity = (itemId, quantity) => {
        dispatch(updateItemQuantity({ itemId, quantity }));
    };

    const handleClose = () => {
        setIsOpenModel(false);
    };

    const handleSelectAddress = (id) => {
        setSelectedAddressId(id);
    };

    const applyCoupon = () => {
        if (coupon === 'DISCOUNT10') {
            setDiscount(10);
            Alert.alert('Coupon applied successfully!');
        } else {
            Alert.alert('Invalid coupon code.');
        }
    };

    const totalPrice = CartItems.reduce((total, item) => {
        const packSizes = item?.ProductId?.PackSizes || [];
        const selectedPack = packSizes.find(pack => pack?._id === item?.selectedPackId);
        const price = selectedPack?.DiscountPrize || 0;
        return total + price * item?.Quantity;
    }, 0);

    const finalPrice = totalPrice - (totalPrice * (discount / 100));
    console.log(CartItems)
    const CheckOut = async () => {
        const formattedData = {
            BookingType: "ProductPurchase",

            ProductIds: CartItems.map((item) => item?.ProductId?._id),
            PaymentInfo: {
                PaymentMode: paymentOption,
                PaymentAmount: finalPrice,
                PaymentVia: "app",
                PaymentStatus: "pending",
            },
            OrderDetails: {
                OrderType: 'Product-Order',
                OrderDate: new Date().toISOString(),
                OrderStatus: "Order Placed",
            },
            Address: selectedAddressId
        };


        if (!isAuthenticated) {
            Alert.alert("Please log in to proceed with the order.");
            return;
        } else {
            try {
                const { data } = await axios.post(`https://www.doggy.adsdigitalmedia.com/api/v1/auth/Create-Order`, formattedData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (data.success) {
                    Alert.alert("Order successfully placed!", "Your order has been created.", [
                        { text: "OK" }
                    ]);
                    // console.log('Navigating to Payment_Success with details:', data.orderDetails);
                    dispatch(RemoveAllItem())
                    navigation.navigate('Payement_Success', { details: data.orderDetails });
                } else {
                    Alert.alert("Order Failed", "There was an issue with your order. Please try again.");
                }
            } catch (error) {
                Alert.alert("Error", "There was an error processing your order. Please try again.");
                console.error("Order creation failed:", error);
            }
        }
    };

    const handleCheckout = () => {
        if (!selectedAddressId) {
            // Open AddressModel if no address is selected
            setIsOpenModel(true);
        } else {
            // Proceed to checkout
            CheckOut();
        }
    };

    return (
        <Layout>
            <ScrollView className="p-4 bg-green-50">
                {CartItems.length === 0 ? (
                    <View className="flex-1 items-center justify-center bg-gray-100">
                        {/* Lottie Animation */}
                        <LottieView
                            source={cartAnimation}
                            autoPlay
                            loop
                            style={{ width: '100%', height: 500 }}
                        />


                        <Text className="text-lg font-semibold text-gray-800 mt-4">
                            Oops! Your cart is currently empty. Start exploring and add some exciting products!
                        </Text>


                        <TouchableOpacity o className="mt-6 bg-blue-600 py-3 px-8 rounded-full" onPress={() => navigation.navigate('Shop')}>
                            <Text className="text-white text-base font-semibold">Shop Now</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    CartItems.map(item => {
                        const packSizes = item?.ProductId?.PackSizes || [];
                        const selectedPack = packSizes.find(pack => pack?._id === item?.selectedPackId);

                        return (
                            <View key={item?._id} className="mb-4 p-4 bg-white rounded-lg shadow-lg flex flex-row">
                                <Image
                                    source={{ uri: item?.ProductId?.ProductImages?.[0]?.ImageUrl || '' }}
                                    className="w-24 h-24 rounded-md mr-4"
                                />
                                <View className="flex-1">
                                    <Text className="font-semibold text-lg whitespace-nowrap">
                                        {item?.ProductId?.ProductName
                                            ? `${item.ProductId.ProductName.slice(0, 30)}${item.ProductId.ProductName.length > 30 ? '...' : ''}`
                                            : 'No Product Name'}
                                    </Text>
                                    <Text className="text-gray-600">Quantity: {item?.Quantity || 1}</Text>
                                    <View className="flex flex-row justify-between items-center mt-2">
                                        <Text className="text-green-600">
                                            Price: ₹{((selectedPack?.DiscountPrize || 0) * item.Quantity).toFixed(2)}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => handleRemoveItem(item?.ProductId?._id, item?.selectedPackId)}
                                            className="text-red-500"
                                        >
                                            <Text className="text-red-600 font-bold text-sm underline">Remove</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        );
                    })
                )}
                {CartItems && CartItems.length === 0 ? null : (

                    <View className="p-6 bg-white rounded-lg shadow-lg mt-4 border border-gray-300">
                        <Text className="text-2xl font-bold mb-4 text-green-700">Price Details</Text>

                        <View className="flex-row justify-between mb-2">
                            <Text className="text-lg">Total Price:</Text>
                            <Text className="text-lg font-semibold text-green-600">₹{totalPrice.toFixed(2)}</Text>
                        </View>

                        <View className="flex-row justify-between mb-2">
                            <Text className="text-lg">Discount:</Text>
                            <Text className="text-lg font-semibold text-green-600">{discount}%</Text>
                        </View>

                        <View className="flex-row justify-between mb-4 border-t border-gray-300 pt-2">
                            <Text className="text-lg font-bold">Final Price:</Text>
                            <Text className="text-lg font-bold text-green-800">₹{finalPrice.toFixed(2)}</Text>
                        </View>

                        <View className='flex-row items-center gap-1 justify-between'>
                            <TextInput
                                placeholder="Enter Coupon Code"
                                value={coupon}
                                onChangeText={setCoupon}
                                className="border w-[60%] border-green-400 p-2 rounded-md mt-2 bg-gray-50"
                                style={{ height: 45 }}
                            />

                            <TouchableOpacity onPress={applyCoupon} className="bg-green-700 w-[40%] p-3 whitespace-nowrap rounded-md mt-3">
                                <Text className="text-white text-center text-sm font-semibold">Apply Coupon</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={handleCheckout} className="bg-green-800 w-[100%] p-3 rounded-md mt-4 shadow-md">
                            <Text className="text-white text-center text-lg font-semibold">Proceed to Checkout</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
            <AddressModel isOpen={isOpenModel} onSelectAddress={handleSelectAddress} onClose={handleClose} />
        </Layout>
    );
};

export default Cart;
