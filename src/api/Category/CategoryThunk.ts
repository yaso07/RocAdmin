import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CategoryList } from "../../types/CategoryList";
import { Category } from "../../types/Category";
import { getUser } from "./user";
import { CATEGORY } from "../constant";

export const fetchCategory = createAsyncThunk(
  "category/fetch",
  async () => {


    const token = JSON.parse(getUser()).token;


    const response = await axios.get<Category[]>(
      import.meta.env.VITE_REACT_APP_API + CATEGORY,
      {
        headers: {
          "x-login-token": token
        },
      }
    );

    return response.data;



  }

);


export const fetchCategoryById = createAsyncThunk('category/fetchById', async (id: string) => {

  if (id) {

    const token = JSON.parse(getUser()).token;

    const response = await axios.get<CategoryList>(
      import.meta.env.VITE_REACT_APP_API + `${CATEGORY}/${id}`,
      {
        headers: {
          "x-login-token": token
        },
      }
    )
    return response.data
  }
  else {
    return {} as CategoryList
  }


})


export const updateStatus = createAsyncThunk('updateStatus', 
  async (status: { id: string, status: string }) => {

  const token = JSON.parse(getUser()).token;

  await axios.put(
    import.meta.env.VITE_REACT_APP_API + `update-status`, status,
    {

      headers: {
        "x-login-token": token
      },
    }
  )

  return status.id

})



