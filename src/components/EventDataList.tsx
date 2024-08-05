import { useFormik } from "formik";
import { eventSchema } from "../utils/validation";
import { formDataType } from "../types/event";
import Accordion from "../components/Accordion/Accordion";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  createEvent,
  getEventList,
  updateEvent,
} from "../api/EventSlice/eventThunk";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import ReusableInput from "./InputBox/ReusableInput";
import TextField from "./InputBox/TextField";
import Checkbox from "./InputBox/Checkbox";
import "../App.css";
import InputBoxWithImage from "./InputBox/InputBoxWithImage";
import styled from "styled-components";
import MenuSelect from "./DropdownList/MenuSelect";
import { formatDate } from "../types/date";
import EventDataShow from "./EventDataShow";
import ActivityDataShow from "./ActivityDataShow";

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

type Category =
  | "Type"
  | "Location"
  | "KeyFacilities"
  | "Booking"
  | "WeekDays"
  | "MonthDays"
  | "Seasonality"
  | "BusRoutes"
  | "Accessibility";

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
    handleChange,
    handleSubmit,
    setFieldValue,
    handleBlur,
    resetForm,
    values,
    errors,
    touched,
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
    const keyFeature = selectedItems.KeyFacilities.map((item) => ({
      label: item.label,
      value: item.value,
    }));
    const BookingEvent = selectedItems.Booking.map((item) => ({
      label: item.label,
      value: item.value,
    }));
    const eventTypeArray = selectedItems.Type.map((item) => ({
      label: item.label,
      value: item.value,
    }));
    const eventLocationArray = selectedItems.Location.map((item) => ({
      label: item.label,
      value: item.value,
    }));
    const seasonalityArray = selectedItems.Seasonality.map((item) => ({
      label: item.label,
      value: item.value,
    }));
    const busRouteArray = selectedItems.BusRoutes.map((item) => ({
      label: item.label,
      value: item.value,
    }));
    const accessibilityArray = selectedItems.Accessibility.map((item: any) => ({
      label: item.label,
      value: item.value,
    }));

    const eventType = () => {
      if (selectedOptionEvent == "option4") {
        return "custom";
      } else {
        return "weekly";
      }
    };

    const dateTimeArray: any[] = dateTimes.map((item) => ({
      date: moment(item.date).format("YYYYMMDD"),
      start_time: item.start_time,
      end_time: item.end_time,
    }));

    const finalObject = {
      acf: {
        title: formData.DescriptionTitle,
        short_description: formData.introDescription,
        long_description: formData.moreInformation,
        type: eventTypeArray,
        location: eventLocationArray,
        key_facilities: keyFeature,
        eventType: eventType(),
        customDates: dateTimeComponents,
        event_dates_start: "",
        event_dates_end: "",
        daysOfWeek: "",
        startTime: "",
        endTime: "",
        from_price: formData.priceFrom,
        price_to: formData.priceTo,
        booking_information: BookingEvent,
        display_name: formData.DisplayName,
        email_address: formData.DisplayName,
        telephone_number: {
          area_code: selectedCode,
          prefix: formData.Prefix,
          number: formData.Telephone,
        },
        website: formData.Website,
        address: {
          place_name: formData.PlaceName,
          address_line_1: formData.AddressLine,
          address_line_2: formData.AddressLineOptional,
          postcode: formData.Postcode,
        },
        parish: selectedOpt,
        seasonality: seasonalityArray,
        bus_routes: busRouteArray,
        social_media: {
          facebook: formData.Facebook,
          instagram: formData.Instagram,
          twitter: formData.Twitter,
        },
        accessibility: accessibilityArray,
        accessibility_additional_info: formData.AdditionalInfo,
        accessibility_url: formData.AccessibilityURL,
        header_image_data: values.header_image_data,
        // header_image_data: "[{\"url\":\"https://cdn.jersey.com/image/upload/v1715339820/Listings/8645486459_seaside-treasure.jpg\",\"public_id\":\"Listings/8645486459_seaside-treasure\",\"alt_text\":\"\",\"original_filename\":\"Seaside-Treasure\"}]",
        event_dates: dateTimeArray,
        map_location_lat: values.lat,
        map_location_lng: values.lng,
      },
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

  const [formData, setFormData] = useState({
    DescriptionTitle: "",
    introDescription: "",
    moreInformation: "",
    priceFrom: "",
    priceTo: "",
    DisplayName: "",
    EmailAddress: "",
    Prefix: "",
    Telephone: "",
    Website: "",
    PlaceName: "",
    AddressLine: "",
    AddressLineOptional: "",
    Postcode: "",
    Facebook: "",
    Instagram: "",
    Twitter: "",
    AdditionalInfo: "",
    AccessibilityURL: "",
  });

  const [selectedOptionEvent, setSelectedOptionEvent] = useState("");

  const handleChangeEvent = (event: any) => {
    setSelectedOptionEvent(event.target.value);
  };

  const [dateState, setDateState] = useState({
    startDateMonth: "",
    endDateMonth: "",
    startDateWeekly: "",
    endDateWeekly: "",
    startDateDaily: "",
    endDateDaily: "",
  });

  const handleDateChange = (field: any) => (date: any) => {
    setDateState((prevState) => ({
      ...prevState,
      [field]: date,
    }));
  };

  const [timeState, setTimeState] = useState({
    startTimeMonth: "",
    endTimeMonth: "",
    startTimeWeekly: "",
    endTimeWeekly: "",
    startTimeDaily: "",
    endTimeDaily: "",
  });

  const handleTimeChange = (field: any) => (date: any) => {
    setTimeState((prevState) => ({
      ...prevState,
      [field]: date,
    }));
  };

  const [dateTimeComponents, setDateTimeComponents] = useState([
    {
      selectedDate: undefined,
      customStartTime: undefined,
      customEndTime: undefined,
    },
  ]);

  const addDateTimeComponent = () => {
    setDateTimeComponents([
      ...dateTimeComponents,
      {
        selectedDate: undefined,
        customStartTime: undefined,
        customEndTime: undefined,
      },
    ]);
  };

  const setSelectedDate = (index: any, date: any) => {
    const newComponents = [...dateTimeComponents];
    newComponents[index].selectedDate = date;
    setDateTimeComponents(newComponents);
  };

  const setCustomTime = (index: any, time: any) => {
    const newComponents = [...dateTimeComponents];
    newComponents[index].customStartTime = time;
    setDateTimeComponents(newComponents);
  };

  const setCustomEndTime = (index: any, time: any) => {
    const newComponents = [...dateTimeComponents];
    newComponents[index].customEndTime = time;
    setDateTimeComponents(newComponents);
  };

  const handleTextFieldChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const typesData = [
    { title: "Arts & cultural", value: "Arts & cultural" },
    { title: "Music", value: "Music" },
    { title: "Family friendly", value: "Family friendly" },
    { title: "Seasonal", value: "Seasonal" },
    { title: "Festivals", value: "Festivals" },
    { title: "Sports", value: "Sports" },
    { title: "Food & drink", value: "Food & drink" },
    { title: "Outdoor", value: "Outdoor" },
    { title: "Health & wellbeing", value: "Health & wellbeing" },
    { title: "Spectator", value: "Spectator" },
    { title: "History & Heritage", value: "History & Heritage" },
    { title: "Participant", value: "Participant" },
  ];

  const locationData = [
    { title: "Coastal", value: "Coastal" },
    { title: "Town", value: "Town" },
    { title: "Countryside", value: "Countryside" },
  ];

  const keyfacilityData = [
    { title: "Indoor", value: "Indoor" },
    { title: "Catering", value: "Catering" },
    { title: "Outdoor", value: "Outdoor" },
    { title: "Wheelchair access", value: "Wheelchair access" },
    { title: "Family friendly", value: "Family friendly" },
    { title: "Parking", value: "Parking" },
    { title: "Couples", value: "Couples" },
    { title: "Hearing loop", value: "Hearing loop" },
    { title: "Pet friendly", value: "Pet friendly" },
  ];

  const BookingData = [
    { title: "Free entry", value: "Free entry" },
    { title: "Free for children", value: "Free for children" },
    { title: "Booking needed", value: "Booking needed" },
  ];

  const SeasonalityData = [
    { title: "January", value: "January" },
    { title: "July", value: "July" },
    { title: "February", value: "February" },
    { title: "August", value: "August" },
    { title: "March", value: "March" },
    { title: "September", value: "September" },
    { title: "April", value: "April" },
    { title: "October", value: "October" },
    { title: "May", value: "May" },
    { title: "November", value: "November" },
    { title: "June", value: "June" },
    { title: "December", value: "December" },
  ];

  const WeeklyDaysData = [
    { title: "Monday", value: "Monday" },
    { title: "Tuesday", value: "Tuesday" },
    { title: "Wednesday", value: "Wednesday" },
    { title: "Thursday", value: "Thursday" },
    { title: "Friday", value: "Friday" },
    { title: "Saturday", value: "Saturday" },
    { title: "Sunday", value: "Sunday" },
  ];

  const BusRoutesData = [
    {
      title: "Route 1",
      value: "Route 1",
      RouteInfo: "Liberation Station - Gorey Pier)",
    },
    {
      title: "Route 14",
      value: "July",
      RouteInfo: "(Liberation Station - St. Brelade's Bay)",
    },
    {
      title: "Route 1A",
      value: "Route 1A",
      RouteInfo: "(Liberation Station - Gorey Pier)",
    },
    {
      title: "Route 15",
      value: "Route 15",
      RouteInfo: "(Liberation Station - Jersey Airport)",
    },
    {
      title: "Route 2",
      value: "Route 2",
      RouteInfo: "(Liberation Station - St. Catherine)",
    },
    {
      title: "Route 16",
      value: "Route 16",
      RouteInfo: "(Liberation Station - Liberation Station)",
    },
    {
      title: "Route 2A",
      value: "Route 2A",
      RouteInfo: "(Liberation Station - St. Catherine)",
    },
    {
      title: "Route 19",
      value: "Route 19",
      RouteInfo: "(Liberation Station - La Pouquelaye)",
    },
    {
      title: "Route 3",
      value: "Route 3",
      RouteInfo: "(Liberation Station - Jersey Zoo)",
    },
    {
      title: "Route 20",
      value: "Route 20",
      RouteInfo: "Town Link (Liberation Station - Halkett Place)",
    },
    {
      title: "Route 4",
      value: "Route 4",
      RouteInfo: "(Liberation Station - Bonne Nuit Bay)",
    },
    {
      title: "Route 21",
      value: "Route 21",
      RouteInfo: "(Liberation Station - Liberation Station)",
    },
    {
      title: "Route 5",
      value: "Route 5",
      RouteInfo: "(Liberation Station - St. John's Church)",
    },
    {
      title: "Route 22",
      value: "Route 22",
      RouteInfo: "(Liberation Station - L'Etacq)",
    },
    {
      title: "Route 7",
      value: "Route 7",
      RouteInfo: "(Liberation Station - St. John's Church)",
    },
    {
      title: "Route X22",
      value: "Route X22",
      RouteInfo: "(Liberation Station - L'Etacq)",
    },
    {
      title: "Route 8",
      value: "Route 8",
      RouteInfo: "(Liberation Station - Plémont)",
    },
    {
      title: "Route 23",
      value: "Route 23",
      RouteInfo: "(Liberation Station - Jersey Zoo)",
    },
    {
      title: "Route 9",
      value: "Route 9",
      RouteInfo: "(Liberation Station - Grève De Lecq)",
    },
    {
      title: "Route 23A",
      value: "Route 23A",
      RouteInfo: "(Liberation Station - St Martin's Hall)",
    },
    {
      title: "Route 12A",
      value: "Route 12A",
      RouteInfo: "(Liberation Station - Corbière)",
    },
    {
      title: "Route 24",
      value: "Route 24",
      RouteInfo: "Town Link (Liberation Station - Halkett Place)",
    },
    {
      title: "Route 13",
      value: "Route 13",
      RouteInfo: "(Liberation Station - Jersey Zoo)",
    },
    {
      title: "Route 28",
      value: "Route 28",
      RouteInfo: "(Liberation Station - La Mare Wine Estate)",
    },
    { title: "", value: "", RouteInfo: "" },
    { title: "Not applicable", value: "Not applicable", RouteInfo: "" },
  ];

  const AccessibilityData = [
    { title: "Access guide", value: "Access guide" },
    {
      title: "Accessible parking or drop-off point",
      value: "Accessible parking or drop-off point",
    },
    { title: "Accessible toilets", value: "Accessible toilets" },
    { title: "American sign language", value: "American sign language" },
    { title: "British sign language", value: "British sign language" },
    { title: "Hearing loop", value: "Hearing loop" },
    {
      title: "Large print, braille or audio",
      value: "Large print, braille or audio",
    },
    { title: "Level access", value: "Level access" },
    {
      title: "Level access from entrance to reception",
      value: "Level access from entrance to reception",
    },
    {
      title: "Level access to all public areas",
      value: "Level access to all public areas",
    },
    { title: "Level access to bar", value: "Level access to bar" },
    {
      title: "Level access to dining room, cafe or restaurant",
      value: "Level access to dining room, cafe or restaurant",
    },
    {
      title: "Level access to leisure facilities",
      value: "Level access to leisure facilities",
    },
    {
      title: "Level access to main entrance",
      value: "Level access to main entrance",
    },
    {
      title: "Level access to one or more bedrooms",
      value: "Level access to one or more bedrooms",
    },
    { title: "Lift or stairlift", value: "Lift or stairlift" },
    {
      title: "Partial wheelchair access",
      value: "Partially suitable for visitors with limited mobility",
    },
    { title: "Ramp to main entrance", value: "Ramp to main entrance" },
    {
      title: "Suitable for visitors with limited mobility",
      value: "Suitable for visitors with limited mobility",
    },
    {
      title: "Tactile route for visitors with visual impairments",
      value: "Tactile route for visitors with visual impairments",
    },
    {
      title: "Wet room or level entry shower",
      value: "Wet room or level entry shower",
    },
    {
      title: "Wheelchair access throughout",
      value: "Wheelchair access throughout",
    },
    {
      title: "Wheelchairs or mobility aids provided",
      value: "Wheelchairs or mobility aids provided",
    },
  ];

  const [selectedCode, setSelectedCode] = useState("");

  const handleChangeCode = (event: any) => {
    setSelectedCode(event.target.value);
  };

  const countryCodes = [
    { code: "+1", country: "United States" },
    { code: "+44", country: "United Kingdom" },
    { code: "+33", country: "France" },
    { code: "+49", country: "Germany" },
    // Add more country codes as needed
  ];

  const ParishData = [
    { label: "Grouville", value: "Grouville" },
    { label: "St. Mary", value: "St. Mary" },
    { label: "St. Clement", value: "St. Clement" },
    { label: "St. Ouen", value: "St. Ouen" },
    { label: "St. Helier", value: "St. Helier" },
    { label: "St. Peter", value: "St. Peter" },
    { label: "St. John", value: "St. John" },
    { label: "St. Saviour", value: "St. Saviour" },
    { label: "St. Lawrence", value: "St. Lawrence" },
    { label: "St. Brelade", value: "St. Brelade" },
    { label: "St. Martin", value: "St. Martin" },
    { label: "Trinity", value: "Trinity" },
  ];

  const [selectedOpt, setSelectedOpt] = useState<{
    label: string;
    value: string;
  } | null>(null);

  console.log(selectedOpt, "aasas");

  const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    const selected = ParishData.find(
      (option) => option.value === selectedValue
    );
    setSelectedOpt(selected || null);
  };

  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    Type: [],
    Location: [],
    KeyFacilities: [],
    Booking: [],
    WeekDays: [],
    MonthDays: [],
    Seasonality: [],
    BusRoutes: [],
    Accessibility: [],
  });

  console.log(selectedItems, "sdssdsdsd");

  const handleCheckboxChange2 = (
    category: Category,
    value: string,
    checked: boolean
  ) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedCategory = checked
        ? [
            ...prevSelectedItems[category],
            { label: value.split("-")[0], value },
          ]
        : prevSelectedItems[category].filter((item) => item.value !== value);

      return {
        ...prevSelectedItems,
        [category]: updatedCategory,
      };
    });
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
          <button
            type="button"
            onClick={submitData}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md transform transition-transform duration-150 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:bg-blue-700 active:scale-95"
          >
            {loading ? "loading..." : drawerType === "add" ? "Save" : "Update"}
          </button>
        </div>
        <hr />
        <div style={{ display: "flex",alignItems:"center",gap:10,marginTop:10,marginBottom:20 }}>
          <div>
            <label style={{display:"flex",gap:5}}>
              <input
                type="radio"
                value="option1"
                checked={selectedOption === "option1"}
                onChange={handleChange2}
              />
              Event
            </label>
          </div>
          <div>
            <label style={{display:"flex",gap:5}}>
              <input
                type="radio"
                value="option2"
                checked={selectedOption === "option2"}
                onChange={handleChange2}
              />
              Activity
            </label>
          </div>
        </div>
        {selectedOption === "option1" && <EventDataShow />}
        {selectedOption === "option2" && <ActivityDataShow />}
      </div>
    </div>
  );
};

export default Drawer;

const ImageInfoText = styled.div`
  font-size: 14px;
  margin-top: 20px;
`;

const ButtonText = styled.div`
  font-size: 13px;
  font-weight: 600;
  border: 2px solid #4965a7;
  color: #4965a7;
  padding: 5px 20px;
  cursor: pointer;
`;

const MaximumImageValue = styled.p`
  font-size: 13px;
  font-weight: 400;
  color: #807b7b;
`;

const TitleText = styled.p`
  display: block;
  line-height: 1;
  margin-bottom: 0.625rem;
  font-size: 1rem;
  font-weight: 700;
  color: #333;
`;

const TitleTextMain = styled.p`
  font-size: 0.875rem;
  color: #757575;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  margin-top: 20px;
`;

const PriceInputText = styled.p`
  padding: 5px 10px;
  border-width: 1px;
  background: #eee;
`;

const AddressInfo = styled.p`
  width: 120px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.625rem;
  margin-bottom: 1.5rem;
  border-width: 1px;
  color: var(--grey-dark);
  border-color: #ccc;
  border-radius: 2px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNCAxNCI+PHBvbHlsaW5lIHBvaW50cz0iNCA2IDcgOSAxMCA2IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMDAwO3N0cm9rZS13aWR0aDowLjVweDsiIC8+PC9zdmc+")
    no-repeat right 10px center;
  background-size: 28px;
  /* padding-right: 35px; */
  accent-color: var(--brand-primary);
`;
