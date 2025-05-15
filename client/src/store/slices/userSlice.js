import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  allUsers:null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAllUser:(state,action)=>{
     state.allUsers=action.payload
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logout, setAllUser } = userSlice.actions;
export default userSlice.reducer;
