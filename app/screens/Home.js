import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import Topbar from '../components/Topbar/Topbar'
import Header from '../components/Layout/Header'
import Category from '../components/Category/Category'
import TopDoctor from '../components/Topdoctor/TopDoctor'
import Banner from '../components/Banner/Banner'
import OnlineDoctor from '../components/Doctor/OnlineDoctor'
import Blog from '../components/Blog/Blog'
import Notification from './Notification/Notification'
import { useAuth } from '../context/AuthContext'
import ProductsHome from '../components/Product/ProductsHome'

const Home = () => {

  return (
    <Layout>
      <Topbar />
      <Header />
      {/* <Notification/> */}
      <Category />
      <TopDoctor />
      <ProductsHome/>
      <Banner />
      <OnlineDoctor />
      <Blog />
    </Layout>
  )
}

export default Home