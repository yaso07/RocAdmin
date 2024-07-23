import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { contactSlice } from "./Contacts/ContactSlice";
import { eventSlice } from "./EventSlice/eventSlice";
import CategorySlice from "./Category/CategorySlice";



const store = configureStore({
  reducer: {
    category: CategorySlice.reducer,
    contact: contactSlice.reducer,
    event: eventSlice.reducer
  },
});

export default store;

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
export const appSelector: TypedUseSelectorHook<IRootState> = useSelector;
