import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    authToken: localStorage.getItem('authToken') || '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAuthToken: (state, action) => {
            state.authToken = action.payload;
            localStorage.setItem('authToken', action.payload);
        },
        clearAuthToken: (state) => {
            state.authToken = '';
            localStorage.removeItem('authToken');
        },
    },
});

export const { setAuthToken, clearAuthToken } = userSlice.actions;

export default userSlice.reducer;
