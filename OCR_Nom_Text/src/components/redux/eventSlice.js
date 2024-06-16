import { createSlice } from '@reduxjs/toolkit';

const eventSlice = createSlice({
    name: 'event',
    initialState: {
        isUploadModal: false,
        isOpenDescript: false,
    },
    reducers: {
        isUploadTrue: (state, action) => {
            state.isUploadModal = action.payload;
        },
        isOpenDescript: (state, action) => {
            state.isOpenDescript = action.payload;
        },
    },
});

export const { isUploadTrue, isOpenDescript } = eventSlice.actions;
export default eventSlice.reducer;
