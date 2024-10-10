import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/Login.slice';
import CartReducer from './slice/cartSlice'

import ServiceReducer from './slice/Service';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: CartReducer,
        service: ServiceReducer
    },
});
