import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import boardReducer from './slices/boardSlice';
import ticketReducer from './slices/ticketSlice';

// Set up Redux store with slices
const store = configureStore({
  reducer: {
    user: userReducer,
    boards: boardReducer,
    tickets: ticketReducer,
  },
});

export default store;
