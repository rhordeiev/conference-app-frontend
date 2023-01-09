/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  login: '',
  password: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.login = action.payload.login;
      state.password = action.payload.password;
    },
    clearUserInfo: (state) => {
      state.login = initialState.login;
      state.password = initialState.password;
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;
