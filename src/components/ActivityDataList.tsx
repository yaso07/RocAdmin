import { useFormik } from "formik";
import { eventSchema } from "../utils/validation";
import { formDataType } from "../types/event";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  createEvent,
  getEventList,
  updateEvent,
} from "../api/EventSlice/eventThunk";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import "../App.css";
import EventDataShow from "./EventDataShow";
import ActivityDataShow from "./ActivityDataShow";
import ActivityDataCreate from "./ActivityDataShow";

interface Props {
  isOpen: any;
  setIsDrawerOpen: any;
  setDrawerType: any;
  drawerType: string;
}

type TransformedType = {
  label: string;
  value: string;
};

interface DateTime {
  id: number;
  date: any;
  start_time: string;
  end_time: string;
}

interface SelectedItems {
  Type: { label: string; value: string }[];
  Location: { label: string; value: string }[];
  KeyFacilities: { label: string; value: string }[];
  Booking: { label: string; value: string }[];
  WeekDays: { label: string; value: string }[];
  MonthDays: { label: string; value: string }[];
  Seasonality: { label: string; value: string }[];
  BusRoutes: { label: string; value: string }[];
  Accessibility: { label: string; value: string }[];
}



const initialFormValues: formDataType = {
  title: "",
  email_address: "",
  lat: "",
  lng: "",
  short_description: "",
  website: "",
  place_name: "",
  address_line_1: "",
  address_line_2: "",
  postcode: "",
  from_price: "0",
  price_to: "0",
  header_image_data: "",
  phoneNumber: "",
};

const Drawer = ({
  isOpen,
  setIsDrawerOpen,
  drawerType,
  setDrawerType,
}: Props) => {
  const dispatch = useDispatch();
  const SingleEventData = useSelector(
    (state: any) => state.event.singleEventData
  );
  const currentEvent = useSelector((state: any) => state.event.currentEvent);
  const updateEventValue = useSelector((state: any) => state.event.updateEvent);
  const loading = useSelector((state: any) => state.event.isLoading);
  const error = useSelector((state: any) => state.event.error);
  const [eventType, setEventType] = useState<Array<any>>([]);
  const [feature, setFeature] = useState<Array<any>>([]);
  const [busRoute, setBusRoute] = useState<Array<any>>([]);
  const [opningTime, setOpningTime] = useState<Array<any>>([]);
  const [accessibility, setAccessibility] = useState<Array<any>>([]);
  const [parishName, setParishName] = useState<{
    value: string;
    label: string;
  }>({ value: "", label: "" });
  const [dateTimes, setDateTimes] = useState<DateTime[]>([]);
  const [showDateTime, setShowDateTime] = useState<DateTime[]>([]);
  const [loader, setLoder] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);
  
  const {
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: initialFormValues,
    validationSchema: eventSchema,
    onSubmit: () => submitFormikFunction(),
  });



  // ==================================== POST FINAL EVENT DATA ====================================================
  const submitFormikFunction = () => {


    const finalObject = {
      
      data_type: "jersey",
      type: "events",
      manual: true,
    };
    if (drawerType === "add") {
      dispatch(createEvent(finalObject) as any);
    } else {
      const id: string = SingleEventData?._id;
      const status = { id, finalObject };
      dispatch(updateEvent(status) as any);
    }
  };

  useEffect(() => {
    if (!loading && error === "") {
      resetForm();
      setIsDrawerOpen(false);
      setFeature([]);
      setBusRoute([]);
      setDateTimes([]);
      setShowDateTime([]);
      setAccessibility([]);
      setOpningTime([]);
      setEventType([]);
      setSelectedImage(null);
      // Reset the input field
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the input element
      }
      // const data = {};
      // dispatch(fetchEventById(data) as any)
      // dispatch(getEventList() as any);
    }
  }, [currentEvent, updateEventValue]);

  // ================================== USEFORMIK HANDLE SUBMIT FUNCTION ===================================

  const submitData = (e: any) => {
    e.preventDefault();
    handleSubmit();
    
    // // Combine existing data with the new data
    // const combinedData = [...existingData, finalObject];
    // localStorage.setItem("ela", JSON.stringify(combinedData))
    // setIsDrawerOpen(false)
    // setFeature([])
    // setBusRoute([])
    // setDateTimes([])
    // setAccessibility([])
    // setOpningTime([])
    // setTitle('')
    // setSubTitle('')
    // setEmail_Address('')
    // setWebsite('')
    // setPlace_Name('')
    // setAddress_line_1('')
    // setAddress_line_2('')
    // setPostcode('')
    // setLat('')
    // setLng('')
    // setShortDescription('')
  };
  



  const toggleDrawer = (name: string) => {
    setIsDrawerOpen(false);
    setFeature([]);
    setBusRoute([]);
    setDateTimes([]);
    setShowDateTime([]);
    setAccessibility([]);
    setOpningTime([]);
    setEventType([]);
    setDrawerType(name);
    setSelectedImage(null);
    // Reset the input field
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the input element
    }
    resetForm();
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-3/5 bg-white shadow-lg transform transition-transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } duration-1000 overflow-y-auto max-h-[100dvh] hide-scrollbar`}
    >
      <div className="p-4">
        <div className="flex gap-10 flex-wrap w-full justify-between mb-2">
          <button onClick={() => toggleDrawer("close")} className="text-black">
            Close
          </button>
          {/* <button
            type="button"
            onClick={submitData}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md transform transition-transform duration-150 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:bg-blue-700 active:scale-95"
          >
            {loading ? "loading..." : drawerType === "add" ? "Save" : "Update"}
          </button> */}
        </div>
        <hr />
        <ActivityDataCreate {...{setIsDrawerOpen, drawerType}} />
      </div>
    </div>
  );
};

export default Drawer;
