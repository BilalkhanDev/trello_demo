import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  boards: [],
  boardUsers:[]
};

const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    setBoard:(state,action) =>{
        state.boards=action.payload
    },
    addBoard: (state, action) => {
      state.boards.push(action.payload);
    },
    removeBoard: (state, action) => {
      state.boards = state.boards.filter(board => board.id !== action.payload);
    },
      setBoardUser:(state,action) =>{
        state.boardUsers=action.payload
    },

  },
});

export const { addBoard, removeBoard ,setBoard,setBoardUser} = boardSlice.actions;
export default boardSlice.reducer;
