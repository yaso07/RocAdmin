import { createSlice } from "@reduxjs/toolkit";
import { createActivity, createBulk, createEvent, createPlace, deleteActivity, deleteEvent, fetchEventById, getActivityList, getEventList, getPlaceList, updateActivity, updateEvent, updatePlace } from "./eventThunk";


interface initialState {
    isLoading: boolean,
    error: string,
    currentEvent: any,
    currentActivity: any,
    updateEvent: any,
    updateActivity: any,
    eventList: string[],
    activitiesList: string[],
    placeList: string[],
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
        // CREATE Activity LIST DATA
        builder.addCase(createActivity.fulfilled, (state, action) => {
            state.currentActivity = action.payload
            state.error = ''
            state.isLoading = false
        })
        builder.addCase(createActivity.pending, (state) => {
            state.isLoading = true
            state.error = ''
        });
        builder.addCase(createActivity.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message ? action.error.message : ''
        });

        // CREATE PLACE LIST DATA
        builder.addCase(createPlace.fulfilled, (state, action) => {
            state.currentActivity = action.payload.message
            state.error = ''
            state.isLoading = false
        })
        builder.addCase(createPlace.pending, (state) => {
            state.isLoading = true
            state.error = ''
            state.currentActivity = ""
        });
        builder.addCase(createPlace.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message ? action.error.message : ''
        });

        // CREATE PLACE LIST IN BULK DATA
        builder.addCase(createBulk.fulfilled, (state, action) => {
            state.currentActivity = action.payload.message
            state.error = ''
            state.isLoading = false
        })
        builder.addCase(createBulk.pending, (state) => {
            state.isLoading = true
            state.error = ''
            state.currentActivity = ""
        });
        builder.addCase(createBulk.rejected, (state, action) => {
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

        // GET ACTIVITY LIST DATA
        builder.addCase(getActivityList.fulfilled, (state, action) => {
            state.activitiesList = action.payload
            state.error = ''
            state.isLoading = false
        });


        // GET PLACE LIST DATA
        builder.addCase(getPlaceList.fulfilled, (state, action) => {
            state.placeList = action.payload
            state.error = ''
            state.isLoading = false
        })
        builder.addCase(getPlaceList.rejected, (state, action) => {
            state.error = action.error.message ? action.error.message : ''
            state.isLoading = false
        })
        builder.addCase(getPlaceList.pending, (state) => {
            state.error = ''
            state.isLoading = true
        })

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
        // UPDATE EVENTL LIST DATA BY ID
        builder.addCase(updateActivity.fulfilled, (state, action) => {
            state.updateActivity = action.payload
            state.error = ''
            state.isLoading = false
        })
        builder.addCase(updateActivity.pending, (state) => {
            state.isLoading = true
            state.error = ''
        });
        builder.addCase(updateActivity.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message ? action.error.message : ''
        });
        // UPDATE PLACE LIST DATA BY ID
        builder.addCase(updatePlace.fulfilled, (state, action) => {
            state.currentActivity = action.payload
            state.error = ''
            state.isLoading = false
        })
        builder.addCase(updatePlace.pending, (state) => {
            state.isLoading = true
            state.error = ''
            state.currentActivity = ''
        });
        builder.addCase(updatePlace.rejected, (state, action) => {
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
        builder.addCase(deleteActivity.fulfilled, (state, action) => {
          state.currentActivity = action.payload;
          state.error = "";
          state.isLoading = false;
        });
        builder.addCase(deleteActivity.pending, (state) => {
          state.isLoading = true;
          state.error = "";
        });
        builder.addCase(deleteActivity.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message ? action.error.message : "";
        });
    }


})


export const { setEvent } = eventSlice.actions