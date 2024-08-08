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

// type Category =
//   | "Type"
//   | "Location"
//   | "KeyFacilities"
//   | "Booking"
//   | "WeekDays"
//   | "MonthDays"
//   | "Seasonality"
//   | "BusRoutes"
//   | "Accessibility";

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

  // ============================ GET DATA BY ID ==========================================================
  useEffect(() => {
    if (drawerType !== "add") {
      if (SingleEventData) {
        setFieldValue("title", SingleEventData?.acf?.title);
        setFieldValue("email_address", SingleEventData?.acf?.email_address);
        setFieldValue("lat", SingleEventData?.acf?.map_location_lat);
        setFieldValue("lng", SingleEventData?.acf?.map_location_lng);
        setFieldValue(
          "short_description",
          SingleEventData?.acf?.short_description
        );
        setFieldValue("website", SingleEventData?.acf?.website);
        setFieldValue("place_name", SingleEventData?.acf?.address?.place_name);
        setFieldValue(
          "address_line_1",
          SingleEventData?.acf?.address?.address_line_1
        );
        setFieldValue(
          "address_line_2",
          SingleEventData?.acf?.address?.address_line_2
        );
        setFieldValue("postcode", SingleEventData?.acf?.address?.postcode);
        setFieldValue(
          "phoneNumber",
          SingleEventData?.acf?.telephone_number?.formatted
        );
        setFieldValue("from_price", SingleEventData?.acf?.from_price);
        setFieldValue("price_to", SingleEventData?.acf?.price_to);
        if (SingleEventData?.acf?.header_image_data) {
          const imgArray = JSON.parse(SingleEventData?.acf?.header_image_data);
          setSelectedImage(imgArray[0].url);
        } else {
          setSelectedImage("");
        }
        setFieldValue(
          "header_image_data",
          SingleEventData?.acf?.header_image_data
        );
        setParishName({ ...SingleEventData?.acf?.parish });
        const eventTypeArray: TransformedType[] =
          SingleEventData?.acf?.type.map((item: any) => ({
            id: item.value,
            text: item.label,
          }));
        setEventType([...eventTypeArray]);
        const accessibilityArray: TransformedType[] =
          SingleEventData?.acf?.accessibility.map((item: any) => ({
            id: item.value,
            text: item.label,
          }));
        setAccessibility([...accessibilityArray]);
        const featureArray: TransformedType[] =
          SingleEventData?.acf?.key_facilities.map((item: any) => ({
            id: item.value,
            text: item.label,
          }));
        setFeature([...featureArray]);
        const busRouteArray: TransformedType[] =
          SingleEventData?.acf?.bus_routes.map((item: any) => ({
            id: item.value,
            text: item.label,
          }));
        setBusRoute([...busRouteArray]);
        const opningTimeArray: TransformedType[] =
          SingleEventData?.acf?.seasonality.map((item: any) => ({
            id: item.value,
            text: item.label,
          }));
        setOpningTime([...opningTimeArray]);
        // event_dates
        const newData = SingleEventData?.acf?.event_dates.map(
          (item: any, index: number) => ({
            id: index + 1,
            date: moment(item.date).format("YYYY/MM/DD"),
            start_time: item.start_time,
            end_time: item.end_time,
          })
        );
        setDateTimes([...newData]);
        setShowDateTime([...newData]);
      }
    } else {
      resetForm();
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
    }
  }, [SingleEventData, drawerType]);

  // ====================================== Image upload URL =====================================================
  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const url = import.meta.env.VITE_REACT_APP_API_UPLOAD_IMAGE;
    if (file) {
      try {
        setLoder(true);
        const formData = new FormData();
        formData.append("image", file);
        const res = await axios.post(url, formData);
        if (res.status == 200) {
          const imageArray = [
            {
              alt_text: "",
              original_filename: file.name,
              public_id: "",
              url: res?.data,
            },
          ];
          setFieldValue("header_image_data", JSON.stringify(imageArray));
          const reader = new FileReader();
          reader.onloadend = () => {
            setSelectedImage(reader.result);
          };
          reader.readAsDataURL(file);
          setLoder(false);
        } else {
          setLoder(false);
        }
      } catch (error) {
        setLoder(false);
      }
    }
  };

  // ==================================== POST FINAL EVENT DATA ====================================================
  const submitFormikFunction = () => {


    const finalObject = {
      // acf: {
      //   title: formData.DescriptionTitle,
      //   short_description: formData.introDescription,
      //   long_description: formData.moreInformation,
      //   type: eventTypeArray,
      //   location: eventLocationArray,
      //   key_facilities: keyFeature,
      //   eventType: eventType(),
      //   customDates: dateTimeComponents,
      //   event_dates_start: "",
      //   event_dates_end: "",
      //   daysOfWeek: "",
      //   startTime: "",
      //   endTime: "",
      //   from_price: formData.priceFrom,
      //   price_to: formData.priceTo,
      //   booking_information: BookingEvent,
      //   display_name: formData.DisplayName,
      //   email_address: formData.DisplayName,
      //   telephone_number: {
      //     area_code: selectedCode,
      //     prefix: formData.Prefix,
      //     number: formData.Telephone,
      //   },
      //   website: formData.Website,
      //   address: {
      //     place_name: formData.PlaceName,
      //     address_line_1: formData.AddressLine,
      //     address_line_2: formData.AddressLineOptional,
      //     postcode: formData.Postcode,
      //   },
      //   parish: selectedOpt,
      //   seasonality: seasonalityArray,
      //   bus_routes: busRouteArray,
      //   social_media: {
      //     facebook: formData.Facebook,
      //     instagram: formData.Instagram,
      //     twitter: formData.Twitter,
      //   },
      //   accessibility: accessibilityArray,
      //   accessibility_additional_info: formData.AdditionalInfo,
      //   accessibility_url: formData.AccessibilityURL,
      //   header_image_data: values.header_image_data,
      //   // header_image_data: "[{\"url\":\"https://cdn.jersey.com/image/upload/v1715339820/Listings/8645486459_seaside-treasure.jpg\",\"public_id\":\"Listings/8645486459_seaside-treasure\",\"alt_text\":\"\",\"original_filename\":\"Seaside-Treasure\"}]",
      //   event_dates: dateTimeArray,
      //   map_location_lat: values.lat,
      //   map_location_lng: values.lng,
      // },
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
      dispatch(getEventList() as any);
    }
  }, [currentEvent, updateEventValue]);

  // ================================== USEFORMIK HANDLE SUBMIT FUNCTION ===================================

  const submitData = (e: any) => {
    e.preventDefault();
    handleSubmit();
    // const existingData: any[] = JSON.parse(localStorage.getItem("ela") || "[]");
    // const keyFeature: TransformedType[] = feature.map(item => ({
    //     label: item.id,
    //     value: item.text,
    // }));
    // const busRouteArray: TransformedType[] = busRoute.map(item => ({
    //     label: item.id,
    //     value: item.text,
    // }));
    // const accessibilityArray: TransformedType[] = accessibility.map(item => ({
    //     label: item.id,
    //     value: item.text,
    // }));
    // const seasonalityArray: TransformedType[] = opningTime.map(item => ({
    //     label: item.id,
    //     value: item.text,
    // }));
    // const finalObject = {
    //     acf: {
    //         title: title,
    //         type: [{ value: subTitle, label: subTitle }],
    //         header_image_data: "[{\"url\":\"https://cdn.jersey.com/image/upload/v1715339820/Listings/8645486459_seaside-treasure.jpg\",\"public_id\":\"Listings/8645486459_seaside-treasure\",\"alt_text\":\"\",\"original_filename\":\"Seaside-Treasure\"}]",
    //         event_dates: dateTimes,
    //         email_address,
    //         website,
    //         address: {
    //             place_name,
    //             address_line_1,
    //             address_line_2,
    //             postcode
    //         },
    //         map_location_lat: lat,
    //         map_location_lng: lng,
    //         short_description,
    //         key_facilities: keyFeature,
    //         accessibility: accessibilityArray,
    //         bus_routes: busRouteArray,
    //         seasonality: seasonalityArray,
    //         from_price: "String",
    //         price_to:
    //     },
    //     data_type: "jersey",
    //     type: "events",
    // }

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
  
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange2 = (event: any) => {
    setSelectedOption(event.target.value);
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
        <ActivityDataCreate {...{setIsDrawerOpen}} />
      </div>
    </div>
  );
};

export default Drawer;
