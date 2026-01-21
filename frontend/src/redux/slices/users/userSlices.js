import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const INITIAL_STATE = {
    loading: false,
    error: null,
    success: false,
    users: [],
    user: null,
    isUpdated: false,
    isDeleted: false,
    isEmailSent: false,
    isPasswordReset: false,
    profile: {},
    userAuth: {
        error: null,
        userInfo: localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo'))
            : null,
    }
};

//! Login Action
export const LoginAction = createAsyncThunk(
    'users/login',
    async (payload, { rejectWithValue, getState, dispatch }) => {
        // MAKE REQUEST
        try {
            console.log('started communication in login')
            const { data } = await axios.post(
                'http://localhost:3000/api/v1/users/login',
                payload
            );
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data;
        }
        catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState: INITIAL_STATE,
    extraReducers: (builder) => {
        // LOGIN
        builder.addCase(LoginAction.pending, (state, action) => {
            console.log('pending login');
            state.loading = true;
        });
        builder.addCase(LoginAction.fulfilled, (state, action) => {
            console.log('login successful');
            state.loading = false;
            state.success = true;
            state.error = null;
            state.userAuth.userInfo = action.payload;
        });
        builder.addCase(LoginAction.rejected, (state, action) => {
            console.log('login failed');
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        })
    }
});

const usersReducer = usersSlice.reducer;
export default usersReducer;