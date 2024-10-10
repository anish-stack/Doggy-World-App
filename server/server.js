const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
// i have this
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDb = require('./config/db');
const ApiRouter = require('./routes/Auth.routes');
const ProductsRouter = require('./routes/Products.routes');
const DoctorRouter = require('./routes/Doctor.routes');
const PetRoutes = require('./routes/Pet.routes');
const router = require('./routes/google');
const session = require('cookie-session');

app.use(
    session({
        name: 'session',
        keys: ['key1', 'key2'],
        maxAge: 30 * 24 * 60 * 60 * 1000,
    })
);


const PORT = process.env.PORT || 4000;


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());

// Database connection
connectDb();

// Routes
app.get('/', (req, res) => {
    res.send('Hello From Doggy World 🐶🐶');
});

// Dynamic Routes for User
app.use('/api/v1/auth', ApiRouter);
app.use('/api/v1/Product', ProductsRouter);
app.use('/api/v1/Doctors', DoctorRouter);
app.use('/api/v1/pet', PetRoutes);
app.use('/api', router);



// Start the server (both HTTP and WebSocket)
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    // Close the server and exit process
    app.close(() => process.exit(1));
});
