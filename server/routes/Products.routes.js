const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CreateProduct, GetAllProducts, GetOnlyHaveProductsWhichIsNotOutStock, GetSingleProduct, ProductByCategories, GetProductsByFilters, deleteAllProducts, deleteProductById, deleteAllProductByCategory, UpdateProductWithImages } = require('../controllers/Products.controller');
const { CreateOfferBanner, UpdateOfferBanner, DeleteOfferBanner, GetAllActiveBanners, DeleteAllBanners, ToggleActiveStatus } = require('../controllers/Banner.controller');
const { getAllVouchers, applyVoucher, createVoucher, activateVoucher, deactivateVoucher, deleteVoucher, toggleVoucher, SingleVoucher, updateVoucher } = require('../controllers/Vouchers.controller');
const { CreateCategory, UpdateCategory, DeleteCategory, GetAllActiveCategory, DeleteAllCategory } = require('../controllers/category.controller');
const { AddItemInCart, getAllItemOfCart, RemoveItemOfCart, UpdateItemQuantityOfCart, RemoveAllItemOfCart } = require('../controllers/Cart.Controller');
const Protect = require('../middlewares/Auth');
const { MakeAppoinment } = require('../controllers/BookingController');
// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

//==================== ProductsRoutes ====================
router.post('/Create-Products', upload.array('images'), CreateProduct);
router.get('/Get-All-Products', GetAllProducts);
router.get('/Get-Products-Not-Out-Stock', GetOnlyHaveProductsWhichIsNotOutStock);
router.get('/Get-Single-Product/:id', GetSingleProduct);
router.get('/Products-By-Categories/:category', ProductByCategories);
router.get('/Get-Products-By-Filters', GetProductsByFilters);
router.delete('/Delete-All-Products', deleteAllProducts);
router.delete('/Delete-Product/:id', deleteProductById);
router.delete('/Delete-Products-By-Category/:category', deleteAllProductByCategory);
router.post('/Update-Product', upload.any(), UpdateProductWithImages);

//====================Routes For Offer Banner====================

router.post('/Create-Offer-Banner', upload.array('images'), CreateOfferBanner);
router.put('/Update-Offer-Banner/:id', upload.array('image'), UpdateOfferBanner);
router.delete('/Delete-Offer-Banner/:id', DeleteOfferBanner);
router.get('/Get-All-Active-Banners', GetAllActiveBanners);
router.delete('/Delete-All-Banners', DeleteAllBanners);
router.patch('/Toggle-Active-Status/:id', ToggleActiveStatus);

// ====================VOUCHERS====================================//
router.get('/vouchers', getAllVouchers)
router.post('/apply-vouchers', applyVoucher)
router.post('/vouchers/create-vouchers', createVoucher)
router.get('/vouchers/toggle/:id', toggleVoucher)
router.get('/vouchers/single', SingleVoucher)
router.post('/vouchers/update/:id', updateVoucher)
router.delete('/vouchers/deleteVoucher/:id', deleteVoucher)

// ====================Category====================================//

router.post('/create-category', upload.array('images'), CreateCategory)
router.post('/update-category/:id', upload.array('images'), UpdateCategory)
router.delete('/Delete-category/:id', DeleteCategory);
router.get('/Get-All-category', GetAllActiveCategory);
router.delete('/Delete-All-category', DeleteAllCategory);


// ====================Cart====================================//
router.post('/Add-Item',Protect, AddItemInCart);
router.get('/Get-Items', Protect, getAllItemOfCart);
router.delete('/Remove-Item', Protect, RemoveItemOfCart);
router.delete('/Remove-All-Item', Protect, RemoveAllItemOfCart);
router.patch('/Update-Quantity', Protect, UpdateItemQuantityOfCart);


// ====================appointment====================================//
router.post('/book-appointment',Protect, MakeAppoinment);



module.exports = router;
