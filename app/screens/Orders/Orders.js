import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Button, Image, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Loader from '../../components/Loader/Loader';

export default function Orders() {
  const { token } = useSelector((state) => state.auth);
  const [service, setService] = useState([]); // Initialize as an empty array
  const [isModalVisible, setModalVisible] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const handleCancel = (BookingId) => {
    if (BookingId) {
      setBookingId(BookingId);
      setModalVisible(true);
    }
  };

  const cancelCancellation = () => {
    setModalVisible(false);
  };

  const confirmCancellation = () => {

    console.log(`Cancelled booking with ID: ${bookingId}`);
    setModalVisible(false);
  };

  const fetchMyServiceRequest = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://192.168.1.5:7000/api/v1/pet/get-my-bookings?type=ProductPurchase',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoading(false);
      console.log(response.data.data.orders);
      setService(response.data.data.orders);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching service requests:', error);
    }
  };

  useEffect(() => {
    fetchMyServiceRequest();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <ScrollView className="flex-1 p-4 mb-4 bg-gray-100">
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Orders</Text>

      {service.length === 0 ? (
        <Text>No orders found.</Text>
      ) : (
        service.map((order, index) => (
          <View key={index} className="mb-4 p-4 bg-white relative border border-gray-300 rounded-lg">
            <View className="flex flex-row mt-4 flex-wrap mb-2">
              {order?.ProductIds.slice(0, 2).map((item, index) => (
                <View key={index} className="flex items-center w-1/2 mb-2">
                  <Image
                    className="w-16 h-16 rounded-lg mb-2 shadow-md"
                    source={{ uri: item.ProductImages[0].ImageUrl }}
                    resizeMethod='cover'
                    resizeMode='cover'
                  />
                  <Text className="font-semibold text-center text-lg mb-1">
                    {item?.ProductName.length > 30 ? `${item.ProductName.substring(0, 30)}...` : item.ProductName}
                  </Text>
                  <Text className="text-gray-600 text-center">₹{item?.PackSizes[0]?.DiscountPrize}</Text>
                </View>
              ))}

              {/* Check if more than 2 products exist */}
              {order?.ProductIds.length > 2 && (
                <View className="flex items-center w-full mt-2">
                  <Text className="text-gray-600 text-center">
                    + {order.ProductIds.length - 2} more products
                  </Text>
                </View>
              )}
            </View>


            <Text className="mb-2 text-gray-800">
              <Text className="font-bold text-lg">Order Date:</Text>
              <Text className="text-gray-600">{new Date(order.OrderDetails?.OrderDate).toLocaleString() || 'N/A'}</Text>
            </Text>
            <Text className="mb-2 text-gray-800">
              <Text className="font-bold text-lg">Amount Payed:</Text>
              <Text className="text-gray-600">₹{order.PaymentInfo?.PaymentAmount || 'N/A'}</Text>
            </Text>

            <TouchableOpacity onPress={() => handleCancel(order._id)} className="mt-2 bg-red-500 p-2 rounded">
              <Text className="text-white text-center">Cancel Order</Text>
            </TouchableOpacity>
            <Text className="absolute bg-green-500 text-white py-1 px-3 right-0">{order.OrderDetails?.OrderStatus || 'N/A'}</Text>

          </View>

        ))
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={cancelCancellation}
      >
        <View style={{ elevation: 5, shadowColor: "#000",shadowRadius:4 }} className="flex-1 border border-black justify-center items-center shadow-2xl">
          <View className="w-4/5 p-6 bg-white border  rounded-lg ">
            <Text className="text-xl font-semibold text-center mb-4">
              Are you sure you want to cancel this order?
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-2 py-1 mb-4"
              placeholder="Why do you want to cancel?"
              multiline
              numberOfLines={3}
              value={cancellationReason}
              onChangeText={setCancellationReason}
            />
            <View className="flex flex-row justify-around">
              <TouchableOpacity
                onPress={() => {
                  confirmCancellation(cancellationReason); // Pass the reason to confirmCancellation
                  setCancellationReason(''); // Clear input after confirmation
                }}
                className="bg-blue-500 py-2 px-4 rounded-lg shadow-md"
              >
                <Text className="text-white text-center font-semibold">Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={cancelCancellation}
                className="bg-red-500 py-2 px-4 rounded-lg shadow-md"
              >
                <Text className="text-white text-center font-semibold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
