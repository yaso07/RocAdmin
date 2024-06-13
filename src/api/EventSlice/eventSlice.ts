import { createSlice } from "@reduxjs/toolkit";
import { createEvent, deleteEvent, fetchEventById, getEventList, updateEvent } from "./eventThunk";


interface initialState {
    isLoading: boolean,
    error: string,
    currentEvent: any,
    updateEvent: any,
    eventList: string[] | null,
    singleEventData: {},
}

export const eventSlice = createSlice({
    name: "event",
    initialState: {} as initialState,
    reducers: {
        setEvent(state, action) {
            state.currentEvent = action.payload
        },


    },
    extraReducers(builder) {
        // CREATE EVENTL LIST DATA
        builder.addCase(createEvent.fulfilled, (state, action) => {
            state.currentEvent = action.payload
            state.error = ''
            state.isLoading = false
        })
        builder.addCase(createEvent.pending, (state) => {
            state.isLoading = true
            state.error = ''
        });
        builder.addCase(createEvent.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message ? action.error.message : ''
        });

        // GET EVENTL LIST DATA
        builder.addCase(getEventList.fulfilled, (state, action) => {
            state.eventList = action.payload
            // state.error = ''
            // state.isLoading = false
        })
        // builder.addCase(getEventList.pending, (state) => {
        //     state.isLoading = true
        //     state.error = ''
        // });
        // builder.addCase(getEventList.rejected, (state, action) => {
        //     state.isLoading = false
        //     state.error = action.error.message ? action.error.message : ''
        // });

        // GET EVENTL LIST DATA BY ID
        builder.addCase(fetchEventById.fulfilled, (state, action) => {
            state.singleEventData = action.payload
            state.error = ''
            state.isLoading = false
        })
        builder.addCase(fetchEventById.pending, (state) => {
            state.isLoading = true
            state.error = ''
        });
        builder.addCase(fetchEventById.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message ? action.error.message : ''
        });

        // UPDATE EVENTL LIST DATA BY ID
        builder.addCase(updateEvent.fulfilled, (state, action) => {
            state.updateEvent = action.payload
            state.error = ''
            state.isLoading = false
        })
        builder.addCase(updateEvent.pending, (state) => {
            state.isLoading = true
            state.error = ''
        });
        builder.addCase(updateEvent.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message ? action.error.message : ''
        });


        // DELETE EVENTL DATA BY ID
        builder.addCase(deleteEvent.fulfilled, (state, action) => {
            state.currentEvent = action.payload
            state.error = ''
            state.isLoading = false
        })
        builder.addCase(deleteEvent.pending, (state) => {
            state.isLoading = true
            state.error = ''
        });
        builder.addCase(deleteEvent.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message ? action.error.message : ''
        });
    }


})


export const { setEvent } = eventSlice.actions