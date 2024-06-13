import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUser } from "../Category/user";
import axios from "axios";
import { Contact } from "../../types/Contact";



export const getContacts = createAsyncThunk(
  "contact/fetch",
  async () => {
    const token = JSON.parse(getUser()).token;
    const response = await axios.get<Contact[]>(
      import.meta.env.VITE_REACT_APP_API + `contact-us`,
      {
        headers: {
          "x-login-token": token
        },
      }
    );
    return response.data;
  })