import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userDetails: null,
  loading: false,
  error: null,
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginInStart: (state) => {
      state.loading = true;
      state.error = false;
    },

    loginInSuccess: (state, action) => {
      state.userDetails = action.payload;
      state.error = null;
      state.loading = false;
      state.isLoggedIn = true;
    },

    loginInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    signupStart: (state) => {
      state.loading = true;
      state.error = false;
    },

    signupSuccess: (state, action) => {
      state.userDetails = action.payload; // Update userDetails on signup if needed
      state.error = null;
      state.loading = false;
      state.isLoggedIn = true;
    },

    signupFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    logout: (state) => {
      state.userDetails = null;
      state.error = null;
      state.loading = false;
      state.isLoggedIn = false;
    },

    updateProfile: (state, action) => {
      state.userDetails = action.payload;
    },
  },
});

export const {
  loginInStart,
  loginInSuccess,
  loginInFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  logout,
  updateProfile,
} = userSlice.actions;

export default userSlice.reducer;
