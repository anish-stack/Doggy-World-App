import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { productData } from '../data/doctorData';
import Layout from '../components/Layout/Layout';

const ProductDetails = ({route}) => {
  // console.log(route)
  const [pDetails, setpDetails] = useState({});
  const [qty, setQty] = useState(1);

  //Get Product Details
  useEffect(() => {
    //find product details
    const getProduct = productData.find((p) => {
      return(
        p?._id === params?._id
      )
    })
    setpDetails(getProduct);
  }, [params?._id]);

  //Increase Qty
  const addQty = () => {
    setQty((prev) => prev+1);
  }
  //Decrease Qty
  const decrQty = () => {
    if(qty>1){
      setQty((prev) => prev-1);
    }
  }

  const {params} = route;

  return (
    <Layout>
      <Image source={{uri:pDetails?.imageUrl}} className="h-80 w-full"/>
      <View className="my-4">
        <Text className="text-lg text-center">{pDetails?.name}</Text>
        <Text className="text-lg text-center">{pDetails?.price}</Text>
        <Text className="text-sm text-justify capitalize my-2.5 mx-2">{pDetails?.description}</Text>
        <View className="flex-row justify-center items-center my-5 mx-2.5">
          <TouchableOpacity className="px-4 py-2 bg-black rounded text-white justify-center"
            onPress={() => alert(`${qty} items added to cart`)}
            disabled={pDetails?.quantity <= 0}
          >
            <Text className="text-white font-semibold text-base">
              {
                pDetails?.quantity > 0 ? "ADD TO CART" : "OUT OF STOCK"
              }
            </Text>
          </TouchableOpacity>
          <View className="flex-row">
            <TouchableOpacity className="bg-gray-300 py-2 px-3 text-[32px] mx-2.5" onPress={decrQty}>
              <Text>-</Text>
            </TouchableOpacity>
            <Text className="py-2 text-[20px] ">{qty}</Text>
            <TouchableOpacity className="bg-gray-300 py-2 px-3 text-[32px] mx-2.5" onPress={addQty}>
              <Text>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Layout>
  )
}

export default ProductDetails