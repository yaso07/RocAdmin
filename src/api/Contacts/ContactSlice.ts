import { createSlice } from "@reduxjs/toolkit";
import { getContacts } from "./ContactsThunk";
import { Contact } from "../../types/Contact";


interface initialState {
      contactList: Contact[],
      isLoading: boolean,
      error: string,
      currentContact: Contact
}

export const contactSlice = createSlice({
      name: "contact",
      initialState: {} as initialState,
      reducers: {
            setContact(state, action) {
                  state.currentContact = action.payload
            }
      },
      extraReducers(builder) {
            builder.addCase(getContacts.fulfilled, (state, action) => {

                  state.contactList = action.payload
                  state.error = ''
                  state.isLoading = false
            })
            builder.addCase(getContacts.pending, (state) => {
                  state.isLoading = true
                  state.error = ''
            });
            builder.addCase(getContacts.rejected, (state, action) => {
                  state.isLoading = false
                  state.error = action.error.message ? action.error.message : ''
            });
      }


})


export const { setContact } = contactSlice.actions