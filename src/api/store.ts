import { configureStore } from "@reduxjs/toolkit";
import CategorySlice from "./Category/CategorySlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { contactSlice } from "./Contacts/ContactSlice";

const store = configureStore({
  reducer: {
    category:CategorySlice.reducer,
    contact:contactSlice.reducer
  },
});

export default store;

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch
export const appSelector: TypedUseSelectorHook<IRootState> = useSelector;
