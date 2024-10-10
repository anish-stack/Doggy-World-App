import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useSelector } from 'react-redux';

export const selectToken = (state) => state.auth.token;

const initialState = {
    CartItems: [],
    CartCount: 0,
    loading: false,
    error: null,
};

const CartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        AddingStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        AddingSuccess: (state, action) => {
            state.loading = false;
            state.CartItems = action.payload.Cart;
            state.CartCount = action.payload.Cart.length;

        },
        AddingFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            Toast.show({
                type: 'error',
                text1: action.payload,
            });
        },
        RemoveCartItem: (state, action) => {
            state.CartItems = state.CartItems.filter(item => item.ProductId !== action.payload);
            state.CartCount = state.CartItems.length;
            Toast.show({
                type: 'success',
                text1: 'Item removed from cart!',
            });
        },
        UpdateCartItem: (state, action) => {
            const { ProductId, Quantity } = action.payload;
            const itemIndex = state.CartItems.findIndex(item => item.ProductId === ProductId);
            if (itemIndex !== -1) {
                state.CartItems[itemIndex].Quantity = Quantity;
                Toast.show({
                    type: 'success',
                    text1: 'Item quantity updated!',
                });
            }
        },
        AllItemRemove: (state, action) => {
            state.CartItems = action.payload;
            state.CartCount = action.payload.length;
        },
        SetCartItems: (state, action) => {
            state.CartItems = action.payload;
            state.CartCount = action.payload.length;
        },
    },
});

export const { AddingStart, AddingSuccess, AddingFailure, RemoveCartItem, UpdateCartItem, SetCartItems, AllItemRemove } = CartSlice.actions;

// Add an item to the cart
export const AddItemInCart = (CartItems) => async (dispatch, getState) => {
    const token = selectToken(getState()); // Get the token from the state
    try {
        dispatch(AddingStart());
        console.log('Adding process started');

        const response = await axios.post(
            'http://192.168.1.5:7000/api/v1/Product/Add-Item',
            CartItems,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.data.status === 'success') {
            Toast.show({
                type: 'success',
                text1: 'Yay! Your item has been added to the cart! 🛒✨',
                text2: 'Check out your cart for more awesome products!',
            });
        }

        dispatch(AddingSuccess({ Cart: response.data.data.cart.items }));
    } catch (error) {
        console.error('Add item error:', error);
        dispatch(AddingFailure(error.response?.data?.message || 'Something went wrong'));
    }
};

// Get all items in the cart
export const getItemOfCart = () => async (dispatch, getState) => {
    const token = selectToken(getState());
    try {
        const response = await axios.get('http://192.168.1.5:7000/api/v1/Product/Get-Items', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // console.log(response.data.data.items)
        dispatch(SetCartItems(response.data?.data?.items));
    } catch (error) {
        console.error('Get cart items error:', error);
        dispatch(AddingFailure(error.response?.data?.message || 'Something went wrong'));
    }
};

// Remove an item from the cart
export const RemoveItem = (ProductId, selectedPackId) => async (dispatch, getState) => {
    const token = selectToken(getState());
    try {
        await axios.delete('http://192.168.1.5:7000/api/v1/Product/Remove-Item', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                ProductId,
                selectedPackId,
            },
        });
        dispatch(getItemOfCart())
    } catch (error) {
        console.error('Remove item error:', error);
        dispatch(AddingFailure(error.response?.data?.message || 'Something went wrong'));
    }
};

export const RemoveAllItem = () => async (dispatch, getState) => {
    const token = selectToken(getState());
    try {
      const res =   await axios.delete('http://192.168.1.5:7000/api/v1/Product/Remove-All-Item', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(res.data)
        dispatch(AllItemRemove([]));

        dispatch(getItemOfCart());
    } catch (error) {
        console.error('Remove item error:', error);
        dispatch(AddingFailure(error.response?.data?.message || 'Something went wrong'));
    }
};

// Update the quantity of an item in the cart
export const UpdateItemQuantityOfCart = (ProductId, Quantity) => async (dispatch, getState) => {
    const token = selectToken(getState());
    try {
        await axios.patch('http://192.168.1.5:7000/api/v1/Product/Update-Quantity', {
            ProductId,
            Quantity,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch(UpdateCartItem({ ProductId, Quantity }));
    } catch (error) {
        console.error('Update item quantity error:', error);
        dispatch(AddingFailure(error.response?.data?.message || 'Something went wrong'));
    }
};

export default CartSlice.reducer;
