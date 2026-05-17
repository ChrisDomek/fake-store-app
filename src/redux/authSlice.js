import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isLoggedIn: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        signInUser: (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
        },
        signOutUser: (state) => {
            state.user = null;
            state.isLoggedIn = false;
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        }
    },
});

export const { signInUser, signOutUser, updateUser } = authSlice.actions;
export default authSlice.reducer;