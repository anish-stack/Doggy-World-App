const BookingModel = require('../models/Booking.model')
const Razorpay = require('razorpay')
const axios = require('axios')
const CatchAsync = require('../middlewares/CatchAsync')
const crypto = require('crypto');
const merchantId = "M2257T8PKCFTS"
const apiKey = "382a6ef0-8a78-4abd-bc79-5fd4afca18e6"


exports.CreateOrder = CatchAsync(async (req, res) => {
    try {
        const pet = req.user?.id?._id;
        console.log('User ID:', req.body);

        if (!pet) {
            return res.status(400).json({
                success: false,
                message: 'Pet ID is required. Please login to create an order.'
            });
        }

        const { BookingType, Address, ServiceId, ClinicId, DoctorId, ProductIds, ServiceAndAppointmentTimeAndDate, PaymentInfo, OrderDetails, Notes } = req.body;

        // Validate BookingType
        const preBookingTypes = ['Service', 'ProductPurchase', 'Appointment', 'Other'];
        if (!preBookingTypes.includes(BookingType)) {
            return res.status(403).json({
                success: false,
                message: `Invalid BookingType: ${BookingType}. Accepted values are: ${preBookingTypes.join(', ')}`
            });
        }

        const receiptMessage =
            BookingType === "Service" ? "This is an Order for Service" :
                BookingType === "ProductPurchase" ? "This is an Order for Product Purchase" :
                    BookingType === "Appointment" ? "This is an Appointment Confirmation" :
                        "Order Details";

        // Payment options
        // const options = {
        //     amount: (PaymentInfo?.PaymentAmount * 100) || 50000,
        //     currency: "INR",
        //     receipt: receiptMessage,
        //     merchantId: merchantId,
        //     merchantTransactionId: "sbhdshadsaidiusd",
        //     merchantUserId: "jhsdsdh64644",
        //     name:  "User",
        //     redirectUrl: `${process.env.BACKEND_URL}/api/status/"sbhdshadsaidiusd"`,
        //     redirectMode: 'POST',
        //     paymentInstrument: {
        //         type: 'PAY_PAGE'
        //     }
        // };

        // Create order in your database
        const OrderCreate = await BookingModel.create({
            BookingType, Address, ServiceId, ClinicId, DoctorId, ProductIds, ServiceAndAppointmentTimeAndDate, PaymentInfo, OrderDetails, Notes, CustomerId: pet
        });

        // const payload = JSON.stringify(options); // Assuming you want to stringify options
        // const payloadMain = Buffer.from(payload).toString('base64');
        // const keyIndex = 1;
        // const string = payloadMain + '/pg/v1/pay' + apiKey;
        // const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        // const checksum = sha256 + '###' + keyIndex;

        // const prod_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
        // const axiosOptions = {
        //     method: 'POST',
        //     url: prod_URL,
        //     headers: {
        //         accept: 'application/json',
        //         'Content-Type': 'application/json',
        //         'X-VERIFY': checksum
        //     },
        //     data: {
        //         request: payloadMain
        //     }
        // };

        // const response = await axios.request(axiosOptions);
        // console.log('Response from payment API:', response.data);

        res.status(200).json({
            success: true,
            message: 'Order created successfully.',
            orderDetails: OrderCreate
        });

    } catch (error) {
        console.error('Error creating order:', error);
        if (error.response) {
            console.error('Error response data:', error.response.data);
        }
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the order.',
            error: error.message // Optional: include the error message for debugging
        });
    }
});


exports.getMyBookings = CatchAsync(async (req, res) => {
    try {
        const { type } = req.query;
        const petId = req.user.id._id;

        if (!type) {
            return res.status(400).json({
                status: 'error',
                message: 'Booking type is required.'
            });
        }
        const orders = await BookingModel.find({
            CustomerId: petId, // No need for $or when there’s only one condition
            BookingType: type,
        })
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .populate(['CustomerId', 'Address', 'ProductIds', 'DoctorId', 'ClinicId', 'ServiceId']);; // Populating related models

        res.status(200).json({
            status: 'success',
            data: {
                orders
            }
        });

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching bookings.'
        });
    }
});
