const BookingModel = require('../models/Booking.model')
const Razorpay = require('razorpay')
const axios = require('axios')
const crypto = require('crypto');
const merchantId = "M2257T8PKCFTS"
const apiKey = "382a6ef0-8a78-4abd-bc79-5fd4afca18e6"
const Pet = require('../models/Pet.model')
const CatchAsync = require('../middlewares/CatchAsync')
const Appoinements = require('../models/Appoinment.model')
const Doctors = require('../models/Doctor.model')
const moment = require('moment')

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


exports.MakeAppoinment = CatchAsync(async (req, res) => {
    try {
        const petId = req.user.id._id;

        if (!petId) {
            return res.status(401).json({
                success: false,
                message: "Please login to access this"
            });
        }


        const checkPet = await Pet.findById(petId);
        if (!checkPet) {
            return res.status(404).json({
                success: false,
                message: "Pet Not Found"
            });
        }

        const { AppoinemnetTime, AppoinmentDate, TypeOfAppoinmnet, contactNumber, doctor_id, isPaymentDone, payableAmount, paymentType } = req.body;

        const checkDoctor = await Doctors.findById(doctor_id);
        if (!checkDoctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor Not Found"
            });
        }


        const checkTime = await Appoinements.findOne({
            doctor_id: doctor_id,
            date: AppoinmentDate,
            time: AppoinemnetTime
        });

        if (checkTime) {
            return res.status(409).json({
                success: false,
                message: "Appointment time is already booked for this doctor on the selected date"
            });
        }

        // Proceed to create the appointment
        const newAppointment = new Appoinements({
            petId,
            date: AppoinmentDate,
            time: AppoinemnetTime,
            typeOfAppointment: TypeOfAppoinmnet,
            contactNumber,
            doctor_id,
            isPaymentDone,
            fee: payableAmount,
            paymentType
        });
        checkDoctor.appointments.push(newAppointment._id)
        await newAppointment.save();
        await checkDoctor.save()
        return res.status(201).json({
            success: true,
            message: "Appointment created successfully",
            appointment: newAppointment
        });

    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

exports.GetMyAppoinment = CatchAsync(async (req, res) => {
    try {
        const petId = req.user.id;
        if (!petId) {
            return res.status(401).json({
                success: false,
                message: "Please login to access this"
            });
        }

        const checkPet = await Pet.findById(petId);
        if (!checkPet) {
            return res.status(404).json({
                success: false,
                message: "Pet Not Found"
            });
        }

        const appointments = await Appoinements.find({ petId: checkPet._id })
            .sort({ createdAt: -1 })
            .populate('doctor_id');

        return res.status(200).json({
            success: true,
            appointments,
            totalAppointments: appointments.length
        });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching appointments.",
            error: error.message
        });
    }
});

exports.CancelAppoinment = CatchAsync(async (req, res) => {
    try {
        const petId = req.user.id._id; // Extract pet ID from the user object
        if (!petId) {
            return res.status(401).json({
                success: false,
                message: "Please login to access this"
            });
        }

        // Check if the pet exists
        const checkPet = await Pet.findById(petId);
        if (!checkPet) {
            return res.status(404).json({
                success: false,
                message: "Pet Not Found"
            });
        }

        const { appointmentId, notes } = req.body;

        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID is required"
            });
        }

        const appointment = await Appoinements.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        if (appointment.petId.toString() !== petId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to cancel this appointment"
            });
        }

        const appointmentTime = moment(`${appointment.date} ${appointment.time}`);
        const currentTime = moment();

        const isCancellationAllowed = appointmentTime.diff(currentTime, 'minutes') > 15;
        if (!isCancellationAllowed) {
            return res.status(403).json({
                success: false,
                message: "Cancellation is only allowed 15 minutes before the appointment"
            });
        }


        appointment.status = "Cancelled";
        appointment.notes = notes;
        await appointment.save();

        return res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while cancelling the appointment"
        });
    }
});