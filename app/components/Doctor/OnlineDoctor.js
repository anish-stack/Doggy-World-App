import { View, } from 'react-native'
import React from 'react'
import DoctorCard from './DoctorCard'
import { doctorData } from '../../data/doctorData'


const OnlineDoctor = () => {
  return (
    <View className="flex-row justify-between mt-4 flex-wrap mx-3 items-center">
        {doctorData.map((p) => (
            <DoctorCard key={p._id} d={p}/>
        ))}
    </View>
  )
}

export default OnlineDoctor