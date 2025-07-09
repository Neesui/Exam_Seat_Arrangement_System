import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rooms: [],
  selectedRoom: null,
  isLoading: false,
  error: null,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
    addRoom: (state, action) => {
      state.rooms.push(action.payload);
    },
    updateRoom: (state, action) => {
      const updatedRoom = action.payload;
      state.rooms = state.rooms.map((room) =>
        room.id === updatedRoom.id ? updatedRoom : room
      );
    },
    deleteRoom: (state, action) => {
      const roomId = action.payload;
      state.rooms = state.rooms.filter((room) => room.id !== roomId);
    },
    selectRoom: (state, action) => {
      state.selectedRoom = action.payload;
    },
    clearSelectedRoom: (state) => {
      state.selectedRoom = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setRooms,
  addRoom,
  updateRoom,
  deleteRoom,
  selectRoom,
  clearSelectedRoom,
  setLoading,
  setError,
} = roomSlice.actions;

export default roomSlice.reducer;
