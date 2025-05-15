import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tickets: [],
};

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setTicket: (state, action) => {
      state.tickets = action.payload;
    },
    addTicket: (state, action) => {
      state.tickets.push(action.payload);
    },
    removeTicket: (state, action) => {
      state.tickets = state.tickets.filter(ticket => ticket._id !== action.payload);
    },
   updateTicket: (state, action) => {
  const updatedTicket = action.payload;
  const ticketId = updatedTicket._id || updatedTicket.id; // Use either _id or id
  const index = state.tickets.findIndex(t => t._id === ticketId);

  if (index !== -1) {
    state.tickets[index] = {
      ...state.tickets[index],
      ...updatedTicket,
      _id: state.tickets[index]._id // preserve _id if it's missing in updatedTicket
    };
  }
}

  },
});

export const { addTicket, removeTicket, setTicket, updateTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
