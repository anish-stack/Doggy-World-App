import { View, Text } from 'react-native'
import React from 'react'

const PriceTable = ({price, title}) => {
  return (
    <View className="flex-row justify-between px-7 items-center">
      <Text>{title}</Text>
      <Text>{price}</Text>
    </View>
  )
}

export default PriceTable;