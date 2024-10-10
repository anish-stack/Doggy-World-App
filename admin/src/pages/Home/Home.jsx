import React from 'react'
import Header from '../../components/Header/Header'
import HederSlide from '../../components/Header/HederSlide'
import { Route, Routes } from 'react-router-dom'
import CreateProduct from '../Product/CreateProduct'
import './home.css'
import { Toaster } from 'react-hot-toast'
import GetAllProduct from '../Product/GetAllProduct'
import EditProduct from '../Product/EditProduct'
import ManageCategory from '../Category/ManageCategory'
import CreateCategoryModel from '../Category/CreateCategory'
import EditCategory from '../Category/EditCategory'

import CreateVouchers from '../Vouchers/CreateVouchers'
import ManageVocuhers from '../Vouchers/ManageVocuhers'
import EditVocher from '../Vouchers/EditVocher'
import CreateService from '../Service/CreateService'
import ManagaeService from '../Service/ManagaeService'
import CreateDoctors from '../Doctors/CreateDoctors'
import ManageDoctors from '../Doctors/ManageDoctors'
import CreateLabs from '../Labs/CreateLabs'
import ManageBranch from '../Labs/ManageBranch'
import EditBranch from '../Labs/EditBranch'
const Home = () => {
    return (
        <div class="page-wrapper compact-wrapper" id="pageWrapper">
            <div class="tap-top"><i class="iconly-Arrow-Up icli"></i></div>
            <Header />

            <div class="page-body-wrapper">


                <HederSlide />
                <div class="page-body">
                    <Routes>
                        {/* Routes for managing products */}
                        <Route path='/products/create' element={<CreateProduct />} />
                        <Route path='/products/manage' element={<GetAllProduct />} />
                        <Route path='/products/edit' element={<EditProduct />} />

                        {/* Routes for managing categories */}
                        <Route path='/category/manage' element={<ManageCategory />} />
                        <Route path='/category/create' element={<CreateCategoryModel />} />
                        <Route path='/category/edit' element={<EditCategory />} />

                        {/* Routes for managing vouchers */}
                        <Route path='/vouchers/create' element={<CreateVouchers />} />
                        <Route path='/vouchers/manage' element={<ManageVocuhers />} />
                        <Route path='/Voucher/edit' element={<EditVocher />} />

                        {/* Routes for managing services */}
                        <Route path='/Service/create' element={<CreateService />} />
                        <Route path='/Service/manage' element={<ManagaeService />} />

                        {/* Routes for managing doctors */}
                        <Route path='/doctors/create' element={<CreateDoctors />} />
                        <Route path='/doctors/manage' element={<ManageDoctors />} />

                        {/* Routes for managing Branch */}
                        <Route path='/branches/create' element={<CreateLabs />} />
                        <Route path='/branches/manage' element={<ManageBranch />} />
                        <Route path='/branches/edit' element={<EditBranch />} />



                    </Routes>
                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default Home