import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
    isLoggedIn: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        signInUser: (state, action) => {
            state.user = {
                id: action.payload.id,
                name: action.payload.name,
                email: action.payload.email,
            };
            state.token = action.payload.token;
            state.isLoggedIn = true;
        },
        signOutUser: (state) => {
            state.user = null;
            state.token
            state.isLoggedIn = false;
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        }
    },
});

export const { signInUser, signOutUser, updateUser } = authSlice.actions;
export default authSlice.reducer;