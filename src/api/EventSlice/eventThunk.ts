import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUser } from "../Category/user";
import axios from "axios";
import { CREATE_EVENT, GET_EVENT_LIST, CREATE_ACTIVITY, GET_ACTIVITY_LIST, GET_EVENT_LIST_BY_ID, CREATE_PLACE, CREATE_PLACE_IMPORT } from "../constant";
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
      if (response?.status == 200) {
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

// ==================== CREATE PLACE ===========================================================

export const createActivity = createAsyncThunk(
  "activity/create",
  async (bodyParameter: any) => {
    const token = JSON.parse(getUser()).token;
    try {
      const response = await axios.post<any>(
        import.meta.env.VITE_REACT_APP_API_BASE_URL + CREATE_ACTIVITY, bodyParameter?.finalObject,
        {
          headers: {
            "x-login-token": token
          },
        }
      );
      if (response?.status == 200) {
        bodyParameter?.setIsDrawerOpen(false)
        toast.success(response?.data?.message)
      } else {
        toast.error(response?.data?.message)
      }
      // return [];
      return response.data;

    } catch (error: any) {
      toast.error(error?.response?.data?.message)
      console.log(error?.response?.data?.message, "erroroooror");
    }
  });
// ==================== CREATE PLACE ===========================================================

export const createPlace = createAsyncThunk(
  "place/create",
  async (bodyParameter: any) => {
    const token = JSON.parse(getUser()).token;
    try {
      const response = await axios.post<any>(
        import.meta.env.VITE_REACT_APP_API_BASE_URL + CREATE_PLACE, bodyParameter?.finalObject,
        {
          headers: {
            "x-login-token": token
          },
        }
      );
      if (response?.status == 200) {
        bodyParameter?.setIsDrawerOpen(false)
        toast.success(response?.data?.message)
      } else {
        toast.error(response?.data?.message)
      }
      // return [];
      return response.data;

    } catch (error: any) {
      toast.error(error?.response?.data?.message)
      console.log(error?.response?.data?.message, "erroroooror");
    }
  });
// ==================== CREATE PLACE ===========================================================

export const createBulk = createAsyncThunk(
  "placeBulk/create",
  async (bodyParameter: any) => {
    const token = JSON.parse(getUser()).token;
    try {
      const response = await axios.post<any>(
        import.meta.env.VITE_REACT_APP_API_BASE_URL + CREATE_PLACE_IMPORT, bodyParameter,
        {
          headers: {
            "x-login-token": token
          },
        }
      );
      if (response?.status == 200) {
        toast.success(response?.data?.message)
      } else {
        toast.error(response?.data?.message)
      }
      // return [];
      return response.data;

    } catch (error: any) {
      toast.error(error?.response?.data?.message)
      console.log(error?.response?.data?.message, "erroroooror");
    }
  });

// ============================== GET EVENT LIST ====================================================
export const getEventList = createAsyncThunk(
  "event/fetch",
  async () => {

    const token = JSON.parse(getUser()).token;
    const response = await axios.get<any>(
      import.meta.env.VITE_REACT_APP_API_BASE_URL + GET_EVENT_LIST,
      {
        headers: {
          "x-login-token": token
        },
      }
    );

    return response?.data;
  })

// ============================== GET Activity LIST ====================================================
export const getActivityList = createAsyncThunk(
  "activity/fetch",
  async () => {
    try {
      const token = JSON.parse(getUser()).token;
      const response = await axios.get<any>(
        import.meta.env.VITE_REACT_APP_API_BASE_URL + GET_ACTIVITY_LIST,
        {
          headers: {
            "x-login-token": token
          },
        }
      );

      return response?.data;

    } catch (error) {
      return error
    }
  });
// ============================== GET PLACE LIST ====================================================
export const getPlaceList = createAsyncThunk(
  "place/fetch",
  async () => {
    try {
      const token = JSON.parse(getUser()).token;
      const response = await axios.get<any>(
        import.meta.env.VITE_REACT_APP_API_BASE_URL + CREATE_PLACE,
        {
          headers: {
            "x-login-token": token
          },
        }
      );

      return response?.data;

    } catch (error) {
      return error
    }
  });


// ======================================== GET EVENT BY ID ===========================================
export const fetchEventById = createAsyncThunk('event/fetchById', async (data: any) => {
  const token = JSON.parse(getUser()).token;
  if (data?.api === 'manual-activity') {
    try {
      const res = await axios.get(
        import.meta.env.VITE_REACT_APP_API_BASE_URL + GET_ACTIVITY_LIST + '/' + data?.id,
        {
          headers: {
            "x-login-token": token
          },
        }
      )
      return res?.data
    } catch (error) {
      return error
    }
  } else if (data?.api === 'manual-place/') {
    try {
      const res = await axios.get(
        import.meta.env.VITE_REACT_APP_API_BASE_URL + data?.api + data?.id,
        {
          headers: {
            "x-login-token": token
          },
        }
      )
      return res?.data
    } catch (error) {
      return error
    }
    // return data.id
  } else {
    try {
      const res = await axios.get(
        import.meta.env.VITE_REACT_APP_API_BASE_URL + GET_EVENT_LIST_BY_ID + '/' + data?.id,
        {
          headers: {
            "x-login-token": token
          },
        }
      )
      return res?.data
    } catch (error) {
      return error
    }
    // return data.id
  }
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


// ================================ UPDATE ACTIVITY DATA ====================================================
export const updateActivity = createAsyncThunk('updateActivityStatus',
  async (obj: any) => {
    const token = JSON.parse(getUser()).token;
    const response = await axios.put(
      import.meta.env.VITE_REACT_APP_API_BASE_URL + CREATE_ACTIVITY + obj?.id, obj?.finalObject,
      {
        headers: {
          "x-login-token": token
        },
      }
    )
    if (response?.status == 200) {
      obj?.setIsDrawerOpen(false)
      toast.success(response?.data?.message)
    } else {
      toast.error(response?.data?.message)
    }
    console.log("response of update activity =====", response)
    return response.data
  });
// ================================ UPDATE ACTIVITY DATA ====================================================
export const updatePlace = createAsyncThunk('updatePlaceStatus',
  async (obj: any) => {
    const token = JSON.parse(getUser()).token;
    const response = await axios.put(
      import.meta.env.VITE_REACT_APP_API_BASE_URL + CREATE_PLACE + obj?.id, obj?.finalObject,
      {
        headers: {
          "x-login-token": token
        },
      }
    )
    if (response?.status == 200) {
      obj?.setIsDrawerOpen(false)
      toast.success(response?.data?.message)
    } else {
      toast.error(response?.data?.message)
    }
    console.log("response of update place =====", response)
    return response.data
  });
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


// ================================ DELETE EVENT DATA ====================================================
export const deleteActivity = createAsyncThunk('activity/delete',
  async (param: any) => {

    const token = JSON.parse(getUser()).token;
    const res = await axios.delete(
      import.meta.env.VITE_REACT_APP_API_BASE_URL + param?.api + param?.id,
      {
        headers: {
          "x-login-token": token
        },
      }
    )

    console.log("Delete event", res)
    return param?.id
  })

