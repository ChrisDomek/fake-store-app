import { createSlice } from '@reduxjs/toolkit';

const intialState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: intialState,
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;

            const existingItem = state.items.find((item) => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...product, quantity: 1 });
            }
        },
        increaseQuantity: (state, action) => {
            const item = state.items.find((item) => item.id === action.payload);
            if (item) {
                item.quantity += 1;
            }
        },
        decreaseQuantity: (state, action) => {
            const item = state.items.find((item) => item.id === action.payload);
            if (item) {
                item.quantity -= 1;
                if (item.quantity === 0) {
                    state.items = state.items.filter((item) => item.id !== action.payload);
                }
            }
        },
        setCart: (state, action) => {
            state.items = action.payload;
        },
        clearCart: (state) => {
            state.items = [];
        }
    },
});

export const { addToCart, increaseQuantity, decreaseQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;