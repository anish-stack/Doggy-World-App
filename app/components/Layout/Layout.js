import { View, Text, StatusBar, ScrollView } from 'react-native'
import React from 'react'
import Footer from './Footer'

const Layout = ({ children }) => {
  return (
    <>
      <ScrollView className="mb-20">
        <StatusBar />
        <View>{children}</View>
      </ScrollView>
      <View className="flex-1 justify-end z-50 absolute bottom-0 w-full py-5 bg-white">
        <Footer />
      </View> 
    </>
  )
}

export default Layout