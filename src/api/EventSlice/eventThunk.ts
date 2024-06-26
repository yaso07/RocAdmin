import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUser } from "../Category/user";
import axios from "axios";
import { CREATE_EVENT, GET_EVENT_LIST } from "../constant";
import { toast } from "react-toastify";




// ==================== CREATE EVENT ===========================================================
export const createEvent = createAsyncThunk(
  "event/create",
  async (bodyParameter: any) => {
    const token = JSON.parse(getUser()).token;
    try {
      const response = await axios.post<any>(
        import.meta.env.VITE_REACT_APP_API_BASE_URL + CREATE_EVENT, bodyParameter,
        {
          headers: {
            "x-login-token": token
          },
        }
      );
      console.log("event data kya hhhh", response)
      if(response?.data == 200){
          toast.success(response?.data?.message)
        } else {
          toast.error(response?.data?.message)
        }
        return response.data;
        
      } catch (error: any) {
        toast.error(error?.response?.data?.message)
        console.log(error?.response?.data?.message, "erroroooror");
      
    }
  })


// ============================== GET EVENT LIST ====================================================
export const getEventList = createAsyncThunk(
  "event/fetch",
  async () => {

    const token = JSON.parse(getUser()).token;
    const response = await axios.get<any[]>(
      import.meta.env.VITE_REACT_APP_API_BASE_URL + GET_EVENT_LIST,
      {
        headers: {
          "x-login-token": token
        },
      }
    );
    
   
    return response.data;
  })


// ======================================== GET EVENT BY ID ===========================================
export const fetchEventById = createAsyncThunk('event/fetchById', async (data: any) => {
console.log("jflkdsfksjlkjlfsjfksfs", data)
  // const token = JSON.parse(getUser()).token;
  // const response = await axios.get(
  //   import.meta.env.VITE_REACT_APP_API + `${id}`,
  //   {
  //     headers: {
  //       "x-login-token": token
  //     },
  //   }
  // )
  return data
})


// ================================ UPDATE EVENT DATA ====================================================
export const updateEvent = createAsyncThunk('updateEventStatus',
  async (status: any) => {
    const token = JSON.parse(getUser()).token;
    await axios.put(
      import.meta.env.VITE_REACT_APP_API_BASE_URL + CREATE_EVENT + status?.id, status?.finalObject,
      {
        headers: {
          "x-login-token": token
        },
      }
    )
    return status?.id
  })
// ================================ DELETE EVENT DATA ====================================================
export const deleteEvent = createAsyncThunk('event/delete',
  async (id: any) => {
    const token = JSON.parse(getUser()).token;
    const res = await axios.delete(
      import.meta.env.VITE_REACT_APP_API_BASE_URL + CREATE_EVENT + id,
      {
        headers: {
          "x-login-token": token
        },
      }
    )
   
    console.log("Delete event", res)
    return id
  })