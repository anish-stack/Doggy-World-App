import React from 'react'
import {ScrollView } from 'react-native'
import Layout from '../components/Layout/Layout'
import SearchShop from '../components/Shop/SearchShop'
import Accessories from '../components/Shop/Accessories'
import TreatForCat from '../components/Shop/TreatForCat'
import TreatForDog from '../components/Shop/TreatForDog'
import VeterinaryDiet from '../components/Shop/VeterinaryDiet'
import OfferNotice from '../components/Shop/OfferNotice'
import Brands from '../components/Shop/Brands'
import FoodAccessories from '../components/Shop/FoodAccessories'
import OnlyForYou from '../components/Shop/OnlyForYou'
import CatAccessories from '../components/Shop/CatAccessories'
import DogDryFood from '../components/Shop/DogDryFood'
import CatDryFood from '../components/Shop/CatDryFood'

const Shop = () => {
    return (
        <Layout>
            <ScrollView>
                <SearchShop />
                <OfferNotice />
                <FoodAccessories />
                <Accessories />
                {/* <Brands /> */}
                <OnlyForYou />
                <CatAccessories />
                <DogDryFood />
                <CatDryFood />
                <VeterinaryDiet />
                <TreatForDog />
                <TreatForCat />
            </ScrollView>
        </Layout>
    )
}

export default Shop