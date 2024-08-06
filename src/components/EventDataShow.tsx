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
// import Modal from "@mui/material/Modal";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

interface Acf {
  title: string;
  short_description: string;
  long_description: string;
  type: { label: any; value: any }[];
  location: { label: any; value: any }[];
  key_facilities: { label: any; value: any }[];
  eventType: string;
  from_price: string;
  price_to: string;
  url:any;
  booking_information: { label: any; value: any }[];
  display_name: string;
  email_address: string;
  telephone_number: {
    area_code: string;
    prefix: string;
    number: string;
  };
  website: string;
  address: {
    place_name: string;
    address_line_1: string;
    address_line_2?: string;
    postcode: string;
  };
  parish: any;
  seasonality: { label: any; value: any }[];
  bus_routes: { label: any; value: any }[];
  social_media: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  accessibility: { label: any; value: any }[];
  accessibility_additional_info: string;
  accessibility_url: string;
  customDates?: any; // Optional property
  event_dates_start?: string;
  event_dates_end?: string;
  startTime?: string;
  endTime?: string;
}

interface FinalObject {
  acf: Acf;
  data_type: string;
  type: string;
  manual: boolean;
}

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

const EventDataShow = () => {
  const dispatch = useDispatch();

  const submitFormikFunction = () => {
    const keyFeature = selectedItems.KeyFacilities.map((item: any) => ({
      label: item.label,
      value: item.value,
    }));
    const BookingEvent = selectedItems.Booking.map((item: any) => ({
      label: item.label,
      value: item.value,
    }));
    const eventTypeArray = selectedItems.Type.map((item: any) => ({
      label: item.label,
      value: item.value,
    }));
    const eventLocationArray = selectedItems.Location.map((item: any) => ({
      label: item.label,
      value: item.value,
    }));
    const seasonalityArray = selectedItems.Seasonality.map((item: any) => ({
      label: item.label,
      value: item.value,
    }));
    const busRouteArray = selectedItems.BusRoutes.map((item: any) => ({
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

    const finalObject: FinalObject = {
      acf: {
        title: formData.DescriptionTitle,
        short_description: formData.introDescription,
        long_description: formData.moreInformation,
        type: eventTypeArray,
        location: eventLocationArray,
        key_facilities: keyFeature,
        eventType: eventType(),
        url:file,
        from_price: formData.priceFrom,
        price_to: formData.priceTo,
        booking_information: BookingEvent,
        display_name: formData.DisplayName,
        email_address: formData.EmailAddress,
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
      },
      data_type: "jersey",
      type: "events",
      manual: true,
    };
    if (selectedOptionEvent === "option4") {
      finalObject.acf.customDates = dateTimeComponents;
    } else if (selectedOptionEvent === "option3") {
      finalObject.acf.event_dates_start = dateState.startDateMonth;
      finalObject.acf.event_dates_end = dateState.endDateMonth;
      finalObject.acf.startTime = timeState.startTimeMonth;
      finalObject.acf.endTime = timeState.endTimeMonth;
    } else if (selectedOptionEvent === "option2") {
      finalObject.acf.event_dates_start = dateState.startDateWeekly;
      finalObject.acf.event_dates_end = dateState.endDateWeekly;
      finalObject.acf.startTime = timeState.startTimeWeekly;
      finalObject.acf.endTime = timeState.endTimeWeekly;
    } else if (selectedOptionEvent === "option1") {
      finalObject.acf.event_dates_start = dateState.startDateDaily;
      finalObject.acf.event_dates_end = dateState.endDateDaily;
      finalObject.acf.startTime = timeState.startTimeDaily;
      finalObject.acf.endTime = timeState.endTimeDaily;
    }
    console.log(finalObject, "finalObject");
    dispatch(createEvent(finalObject) as any);
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

  //   const { isOpen, toggle } = useModal();

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

  const removeDateTimeComponent = (index: any) => {
    const newComponents = dateTimeComponents.filter((_, i) => i !== index);
    setDateTimeComponents(newComponents);
  };

  const handleTextFieldChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const typesData = [
    { title: "Arts & cultural", value: "arts-cultural" },
    { title: "Music", value: "music" },
    { title: "Family friendly", value: "family-friendly" },
    { title: "Seasonal", value: "seasonal" },
    { title: "Festivals", value: "festivals" },
    { title: "Sports", value: "sports" },
    { title: "Food & drink", value: "food-drink" },
    { title: "Outdoor", value: "outdoor" },
    { title: "Health & wellbeing", value: "health-wellbeing" },
    { title: "Spectator", value: "spectator" },
    { title: "History & Heritage", value: "history-Heritage" },
    { title: "Participant", value: "participant" },
  ];

  const locationData = [
    { title: "Coastal", value: "coastal" },
    { title: "Town", value: "town" },
    { title: "Countryside", value: "countryside" },
  ];

  const keyfacilityData = [
    { title: "Indoor", value: "indoor" },
    { title: "Catering", value: "catering" },
    { title: "Outdoor", value: "outdoor" },
    { title: "Wheelchair access", value: "wheelchair-access" },
    { title: "Family friendly", value: "family-friendly" },
    { title: "Parking", value: "parking" },
    { title: "Couples", value: "couples" },
    { title: "Hearing loop", value: "hearing-loop" },
    { title: "Pet friendly", value: "pet-friendly" },
  ];

  const BookingData = [
    { title: "Free entry", value: "free-entry" },
    { title: "Free for children", value: "free-for-children" },
    { title: "Booking needed", value: "booking-needed" },
  ];

  const SeasonalityData = [
    { title: "January", value: "january" },
    { title: "July", value: "july" },
    { title: "February", value: "february" },
    { title: "August", value: "august" },
    { title: "March", value: "march" },
    { title: "September", value: "september" },
    { title: "April", value: "april" },
    { title: "October", value: "october" },
    { title: "May", value: "may" },
    { title: "November", value: "november" },
    { title: "June", value: "june" },
    { title: "December", value: "december" },
  ];

  const WeeklyDaysData = [
    { title: "Monday", value: "monday" },
    { title: "Tuesday", value: "tuesday" },
    { title: "Wednesday", value: "wednesday" },
    { title: "Thursday", value: "thursday" },
    { title: "Friday", value: "friday" },
    { title: "Saturday", value: "saturday" },
    { title: "Sunday", value: "sunday" },
  ];

  const BusRoutesData = [
    {
      title: "Route 1",
      value: "Route 1",
      RouteInfo: "Liberation Station - Gorey Pier)",
    },
    {
      title: "Route 14",
      value: "Route 14",
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
    { label: "Grouville", value: "grouville" },
    { label: "St. Mary", value: "st-mary" },
    { label: "St. Clement", value: "st-clement" },
    { label: "St. Ouen", value: "st-ouen" },
    { label: "St. Helier", value: "st-helier" },
    { label: "St. Peter", value: "st-peter" },
    { label: "St. John", value: "st-john" },
    { label: "St. Saviour", value: "st-saviour" },
    { label: "St. Lawrence", value: "st-lawrence" },
    { label: "St. Brelade", value: "st-brelade" },
    { label: "St. Martin", value: "st-martin" },
    { label: "Trinity", value: "trinity" },
    { label: "Jersey", value: "jersey" },
  ];

  const [selectedOpt, setSelectedOpt] = useState<{
    label: string;
    value: string;
  } | null>(null);

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

  //   const [loader, setLoader] = useState(false);
  //   const [selectedImage, setSelectedImage] = useState(null);

  //   const handleImageUpload = async (event:any) => {
  //     const file = event.target.files?.[0];
  //     const url = import.meta.env.VITE_REACT_APP_API_UPLOAD_IMAGE;
  //     if (file) {
  //       try {
  //         setLoader(true);
  //         const formData = new FormData();
  //         formData.append("image", file);
  //         const res = await axios.post(url, formData);
  //         if (res.status === 200) {
  //           const imageArray = [
  //             {
  //               alt_text: "",
  //               original_filename: file.name,
  //               public_id: "",
  //               url: res?.data,
  //             },
  //           ];
  //           // Assume `setFieldValue` is a prop or available in your context
  //           setFieldValue("header_image_data", JSON.stringify(imageArray));
  //           const reader = new FileReader();
  //           reader.onloadend = () => {
  //             setSelectedImage(reader.result);
  //           };
  //           reader.readAsDataURL(file);
  //         }
  //         setLoader(false);
  //       } catch (error) {
  //         setLoader(false);
  //         console.error("Error uploading image:", error);
  //       }
  //     }
  //   };

  const [file, setFile] = useState();
 async function handleChange(e: any) {
   
   const file = e.target.files?.[0];
   const url = import.meta.env.VITE_REACT_APP_API_UPLOAD_IMAGE;
   if (file) {
     const formData = new FormData();
     formData.append("image", file);
     const res = await axios.post(url, formData);
     
     setFile(res?.data);    
    //  setFile(URL.createObjectURL(e.target.files[0]) as any);    
      console.log("dresponse", res)
    }
  }


    
    
      // try {
      //   setLoder(true);
      //   const formData = new FormData();
      //   formData.append("image", file);
        
      //   if (res.status == 200) {
      //     const imageArray = [
      //       {
      //         alt_text: "",
      //         original_filename: file.name,
      //         public_id: "",
      //         url: res?.data,
      //       },
      //     ];
      //     setFieldValue("header_image_data", JSON.stringify(imageArray));
      //     const reader = new FileReader();
      //     reader.onloadend = () => {
      //       setSelectedImage(reader.result);
      //     };
      //     reader.readAsDataURL(file);
      //     setLoder(false);
      //   } else {
      //     setLoder(false);
      //   }
      // } catch (error) {
      //   setLoder(false);
      // }

  return (
    <div>
      <Accordion
        title="Description"
        content={
          <>
            <div>
              <ReusableInput
                title="Title*"
                DescriptionTitle={formData.DescriptionTitle}
                handleDescriptionTitle={handleTextFieldChange}
                name="DescriptionTitle"
              />
              <TextField
                title="Introductory Description *"
                description="This will be used for the What’s On printed guide. It will also be used on the website where a short, preview piece of copy may be required to introduce your listing."
                maxLength="350"
                value={formData.introDescription}
                name="introDescription"
                onchange={handleTextFieldChange}
              />
              <TextField
                title="More Information *"
                description="This is the main piece of copy within the body of your listing."
                maxLength="750"
                value={formData.moreInformation}
                name="moreInformation"
                onchange={handleTextFieldChange}
              />
              <div style={{ marginTop: 20 }}>
                <TitleText>Type *</TitleText>
                <div className="checkboxContainer">
                  {typesData.map((item, index) => {
                    return (
                      <div style={{ marginBottom: 10 }} key={index}>
                        <Checkbox
                          title={item.title}
                          value={item.value}
                          isChecked={selectedItems.Type.some(
                            (items) => items.value === item.value
                          )}
                          onCheckboxChange={(value, checked) =>
                            handleCheckboxChange2("Type", value, checked)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                <TitleText>Location *</TitleText>
                <div className="checkboxContainer">
                  {locationData.map((item, index) => {
                    return (
                      <div style={{ marginBottom: 10 }} key={index}>
                        <Checkbox
                          title={item.title}
                          value={item.value}
                          isChecked={selectedItems.Location.some(
                            (items) => items.value === item.value
                          )}
                          onCheckboxChange={(value, checked) =>
                            handleCheckboxChange2("Location", value, checked)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ marginTop: 20, marginBottom: 20 }}>
                <TitleText>Key facilities *</TitleText>
                <div className="checkboxContainer">
                  {keyfacilityData.map((item, index) => {
                    return (
                      <div style={{ marginBottom: 10 }} key={index}>
                        <Checkbox
                          title={item.title}
                          value={item.value}
                          isChecked={selectedItems.KeyFacilities.some(
                            (items) => items.value === item.value
                          )}
                          onCheckboxChange={(value, checked) =>
                            handleCheckboxChange2(
                              "KeyFacilities",
                              value,
                              checked
                            )
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <TitleText style={{ marginBottom: 30 }}>
                  Event dates *
                </TitleText>
                <TitleText>How often does this occur?</TitleText>
                <TitleTextMain style={{ marginBottom: 20 }}>
                  You can manually add, remove and amend dates once they've been
                  generated via the below.
                </TitleTextMain>
                {/* {dateTimeComponents.map((component, index) => (
                <MenuSelect
                  key={index}
                  selectedDate={component.selectedDate}
                  setSelectedDate={(date: any) =>
                    setSelectedDate(index, date)
                  }
                  customTime={component.customTime}
                  customOnchange={(time: any) =>
                    setCustomTime(index, time)
                  }
                  addDate={addDateTimeComponent}
                />
              ))} */}
                <MenuSelect
                  dateTimeComponents={dateTimeComponents}
                  WeeklyDaysData={WeeklyDaysData}
                  setSelectedDate={setSelectedDate}
                  setCustomTime={setCustomTime}
                  setCustomEndTime={setCustomEndTime}
                  removeDateTimeComponent={removeDateTimeComponent}
                  addDate={addDateTimeComponent}
                  dateState={dateState}
                  setDateState={handleDateChange}
                  timeState={timeState}
                  setTimeState={handleTimeChange}
                  selectedItems={selectedItems}
                  handleCheckboxChange={handleCheckboxChange2}
                  handleChange={handleChangeEvent}
                  selectedOption={selectedOptionEvent}
                />
              </div>
              <div>
                <TitleText style={{ margin: "20px 0px" }}>
                  Price from / to
                </TitleText>
                <p style={{ fontSize: 15, fontWeight: "400" }}>
                  When entering costs, please don’t use any decimal places
                  unless the cost includes pence.
                </p>
              </div>
              <InputContainer>
                <div>
                  <TitleText>Price from *</TitleText>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: 20,
                    }}
                  >
                    <PriceInputText>£</PriceInputText>
                    <input
                      type="text"
                      className="custom-inputPrice"
                      value={formData.priceFrom}
                      onChange={handleTextFieldChange}
                      name="priceFrom"
                    />
                  </div>
                </div>
                <div>
                  <TitleText>Price to</TitleText>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: 20,
                    }}
                  >
                    <PriceInputText>£</PriceInputText>
                    <input
                      type="text"
                      className="custom-inputPrice"
                      value={formData.priceTo}
                      onChange={handleTextFieldChange}
                      name="priceTo"
                    />
                  </div>
                </div>
              </InputContainer>
              <TitleText style={{ margin: "20px 0px" }}>
                Booking information
              </TitleText>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                }}
              >
                {BookingData.map((item, index) => {
                  return (
                    <div style={{ marginBottom: 10 }} key={index}>
                      <Checkbox
                        title={item.title}
                        value={item.value}
                        isChecked={selectedItems.Booking.some(
                          (items) => items.value === item.value
                        )}
                        onCheckboxChange={(value, checked) =>
                          handleCheckboxChange2("Booking", value, checked)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        }
      />

      <Accordion
        title="Contact"
        content={
          <>
            <div>
              <ReusableInput
                title="Display name*"
                showCouter={false}
                DescriptionTitle={formData.DisplayName}
                handleDescriptionTitle={handleTextFieldChange}
                name="DisplayName"
              />
              <div style={{ margin: "20px 0px" }}>
                <ReusableInput
                  title="Email address *"
                  showCouter={false}
                  DescriptionTitle={formData.EmailAddress}
                  handleDescriptionTitle={handleTextFieldChange}
                  name="EmailAddress"
                />
              </div>
              <TitleText>Telephone number</TitleText>
              <TitleTextMain>
                Please provide your full telephone number, including area code.
                For example: +44 (0) 1534 859000.
              </TitleTextMain>
              <div style={{ display: "flex", gap: 24 }}>
                <div style={{ width: 140 }}>
                  <p>Area Code</p>
                  <Select
                    id="country-code"
                    name="country-code"
                    value={selectedCode}
                    onChange={handleChangeCode}
                  >
                    {countryCodes.map((item, index) => (
                      <option key={index} value={item.code}>
                        {item.code}
                      </option>
                    ))}
                  </Select>
                </div>
                <div style={{ width: 120 }}>
                  <p>Prefix</p>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      value={formData.Prefix}
                      name="Prefix"
                      onChange={handleTextFieldChange}
                      className="parentheses-input"
                    />
                  </div>
                </div>
                <div style={{ width: "100%" }}>
                  <p>Telephone</p>
                  <input
                    type="text"
                    className="custom-inputInfo"
                    placeholder="153400000"
                    value={formData.Telephone}
                    name="Telephone"
                    onChange={handleTextFieldChange}
                  />
                </div>
              </div>
              <TitleText>Website *</TitleText>
              <TitleTextMain>
                Please provide the full URL to your website. For example
                https://jersey.test.
              </TitleTextMain>
              <InputBoxWithImage
                value={formData.Website}
                name="Website"
                onchange={handleTextFieldChange}
              />
              <TitleText style={{ marginTop: 20 }}>Address</TitleText>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                  marginBottom: 30,
                }}
              >
                <AddressInfo>Place name</AddressInfo>
                <input
                  type="text"
                  className="custom-inputInfo"
                  placeholder="Place name"
                  value={formData.PlaceName}
                  name="PlaceName"
                  onChange={handleTextFieldChange}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                  marginBottom: 30,
                }}
              >
                <AddressInfo>Address line 1</AddressInfo>
                <input
                  type="text"
                  className="custom-inputInfo"
                  placeholder="Address line 1"
                  value={formData.AddressLine}
                  name="AddressLine"
                  onChange={handleTextFieldChange}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                  marginBottom: 30,
                }}
              >
                <AddressInfo>Address line 2</AddressInfo>
                <input
                  type="text"
                  className="custom-inputInfo"
                  placeholder="Address line 2"
                  value={formData.AddressLineOptional}
                  name="AddressLineOptional"
                  onChange={handleTextFieldChange}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                  marginBottom: 30,
                }}
              >
                <AddressInfo>Postcode</AddressInfo>
                <input
                  type="text"
                  className="custom-inputInfo"
                  placeholder="Postcode"
                  value={formData.Postcode}
                  name="Postcode"
                  onChange={handleTextFieldChange}
                />
              </div>
              <TitleText>Parish</TitleText>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gridGap: 10,
                  marginBottom: 20,
                }}
              >
                {ParishData.map((item, index) => {
                  return (
                    <div key={index}>
                      <input
                        type="radio"
                        id={item.value}
                        name="location"
                        value={item.value}
                        onChange={handleChangeRadio}
                        style={{ marginRight: 10 }}
                      />
                      <label>{item.label}</label>
                    </div>
                  );
                })}
              </div>
              <div>
                <TitleText>Map location</TitleText>
                <TitleTextMain>
                  Search for your address or click on the map to manually place
                  a marker.
                </TitleTextMain>
              </div>
              <TitleText>Seasonality *</TitleText>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                }}
              >
                {SeasonalityData.map((item, index) => {
                  return (
                    <div style={{ marginBottom: 10 }} key={index}>
                      <Checkbox
                        title={item.title}
                        value={item.value}
                        isChecked={selectedItems.Seasonality.some(
                          (items) => items.value === item.value
                        )}
                        onCheckboxChange={(value, checked) =>
                          handleCheckboxChange2("Seasonality", value, checked)
                        }
                      />
                    </div>
                  );
                })}
              </div>
              <TitleText style={{ marginTop: 20 }}>Bus routes *</TitleText>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                }}
              >
                {BusRoutesData.map((item, index) => {
                  return (
                    <div style={{ marginBottom: 10 }} key={index}>
                      {item.title != "" && (
                        <Checkbox
                          title={item.title}
                          value={item.value}
                          isChecked={selectedItems.BusRoutes.some(
                            (items) => items.value === item.value
                          )}
                          onCheckboxChange={(value, checked) =>
                            handleCheckboxChange2("BusRoutes", value, checked)
                          }
                        />
                      )}

                      <p style={{ marginLeft: 20 }}>{item.RouteInfo}</p>
                    </div>
                  );
                })}
              </div>
              <TitleText style={{ marginTop: 20 }}>Social media</TitleText>
              <TitleTextMain>
                Please provide the full URL for your social media platforms. For
                example: https://www.facebook.com/VisitJersey.
              </TitleTextMain>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                  marginBottom: 30,
                }}
              >
                <AddressInfo>Facebook</AddressInfo>
                <InputBoxWithImage
                  value={formData.Facebook}
                  name="Facebook"
                  onchange={handleTextFieldChange}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                  marginBottom: 30,
                }}
              >
                <AddressInfo>Instagram</AddressInfo>
                <InputBoxWithImage
                  value={formData.Instagram}
                  name="Instagram"
                  onchange={handleTextFieldChange}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                  marginBottom: 30,
                }}
              >
                <AddressInfo>Twitter</AddressInfo>
                <InputBoxWithImage
                  value={formData.Twitter}
                  name="Twitter"
                  onchange={handleTextFieldChange}
                />
              </div>
              {/* <TitleText>Tripadvisor</TitleText>
            <TitleTextMain>
              Please provide your Tripadvisor ID. This is the second
              sequence of numbers found in your Tripadvisor URL
              following the 'd'. For example: 1083180
            </TitleTextMain>
            <input
              type="text"
              className="custom-inputInfo"
              value={inputValue}
              onChange={handleInputChange}
            /> */}
            </div>
          </>
        }
      />
      <Accordion
        title="Accessibility"
        content={
          <>
            <div>
              <p
                style={{
                  fontSize: "1em",
                  fontWeight: 500,
                  marginBottom: 10,
                }}
              >
                Accessibility
              </p>
              <p
                style={{
                  fontSize: ".875em",
                  color: "#757575",
                  marginBottom: 20,
                }}
              >
                To help users of jersey.com find the information they need,
                select the most accurate filters from the list below.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                {AccessibilityData.map((item, index) => {
                  return (
                    <div key={index}>
                      <Checkbox
                        title={item.title}
                        value={item.value}
                        isChecked={selectedItems.Accessibility.some(
                          (items) => items.value === item.value
                        )}
                        onCheckboxChange={(value, checked) =>
                          handleCheckboxChange2("Accessibility", value, checked)
                        }
                      />
                    </div>
                  );
                })}
              </div>
              <TextField
                title="Additional information"
                description="Explain a little more about the accessibility of your business and encourage users to contact you directly for further assistance."
                letterValueShow={false}
                value={formData.AdditionalInfo}
                name="AdditionalInfo"
                onchange={handleTextFieldChange}
              />
              <p
                style={{
                  fontSize: "1em",
                  fontWeight: 500,
                  marginBottom: 10,
                }}
              >
                Accessibility URL
              </p>
              <p
                style={{
                  fontSize: ".875em",
                  color: "#757575",
                  marginBottom: 20,
                }}
              >
                It is recommended that you have an accessibility page on your
                website, include a link here.
              </p>
              <InputBoxWithImage
                value={formData.AccessibilityURL}
                name="AccessibilityURL"
                onchange={handleTextFieldChange}
              />
            </div>
          </>
        }
      />
      <Accordion
        title="Media"
        content={
          <>
            <div>
              <p
                style={{
                  fontSize: 17,
                  fontWeight: "600",
                  margin: "20px 0px",
                }}
              >
                Images
              </p>
              <ImageInfoText>
                Images play a key role in inspiring visitors. Where possible,
                listings should show the visitor experience and include people.
              </ImageInfoText>
              <ImageInfoText>
                For your images to be approved, ensure they are high quality /
                professionally shot and showcase the relevant subject matter.
                Find out more about selecting high-quality images{" "}
                <span>here</span>.
              </ImageInfoText>
              <ImageInfoText>
                Image resolution should be at least 1024px x 683px but we
                recommend uploading a higher resolution image where possible.
                When in doubt, a bigger photo is better.
              </ImageInfoText>
              <ImageInfoText>
                If your images are too large to upload (greater than 8MB) then
                you can reduce the filesize <span>here</span>.
              </ImageInfoText>
              <ImageInfoText>
                Images uploaded to the Portal may be used to promote your
                business via Visit Jersey’s wider channels.
              </ImageInfoText>
              <div>
                <p
                  style={{
                    fontSize: 17,
                    fontWeight: "600",
                    margin: "20px 0px",
                  }}
                >
                  Header image *
                </p>
                <div
                  style={{
                    borderTop: "1px solid #ccc",
                    borderLeft: "1px solid #ccc",
                    borderRight: "1px solid #ccc",
                    height: 300,
                  }}
                >   <img src={file} style={{ width: 100, marginTop: 20,marginLeft:20 }} /></div>
                <div
                  style={{
                    border: "1px solid #ccc",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 10,
                  }}
                >
                  <ButtonText onClick={handleShow}>Add Image</ButtonText>
                  <MaximumImageValue>
                    Maximum number of images:{" "}
                    <span style={{ fontWeight: "bold", color: "#000" }}>1</span>
                  </MaximumImageValue>
                </div>
              </div>
            </div>
            <button onClick={submitFormikFunction}>submit</button>
            <Modal
              show={show}
              onHide={handleClose}
              animation={false}
              size="xl"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Add Image to Gallery</Modal.Title>
              </Modal.Header>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50vh",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection:"column",
                    justifyContent:"center",
                    alignItems:"center"
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <DropImage>Drop files to upload</DropImage>
                    <p>or</p>
                    <input
                      type="file"
                      id="imageget"
                      onChange={handleChange}
                      hidden
                    />
                    <ButtonImage htmlFor="imageget">Select Files</ButtonImage>
                  </div>
                  <img src={file} style={{ width: 100, marginTop: 20 }} />
                </div>
              </div>
              <Modal.Footer>
                <SelectImage
                  disabled={file != undefined ? false : true}
                  style={{
                    cursor: file != undefined ? "pointer" : "not-allowed",
                  }}
                  onClick={handleClose}
                >
                  Select
                </SelectImage>
              </Modal.Footer>
            </Modal>
          </>
        }
      />
    </div>
  );
};

export default EventDataShow;

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

const ModalWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ModalMainContainer = styled.div`
  display: block;
  background: white;
  width: 462px;
  height: 421px;
  overflow: auto;
  border-radius: 1rem;
  ::-webkit-scrollbar {
    display: none;
  }
  @media screen and (max-width: 500px) {
    width: 100%;
  }
`;

const TokenModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 40px;
  flex-direction: column;
  outline: none;
  box-shadow: none;
  border-radius: 10px;

  /* @media screen and (max-width: 877px) {
    width: 95%;
  } */

  img {
    height: 118px;
  }

  h1 {
    font-size: ${({ theme }) => theme.fontSize.largeText};
    margin-bottom: 16px;
    margin-top: 34px;
  }

  p {
    font-size: ${({ theme }) => theme.fontSize.normal};
    color: ${({ theme }) => theme.colors.lightGrey};
    margin-bottom: 34px;
  }

  @media screen and (max-width: 350px) {
    padding: 40px 30px 50px 30px;
  }
`;

const DropImage = styled.p`
  font-size: 20px;
  line-height: 1.4;
  font-weight: 400;
  color: #333;
`;

const ButtonImage = styled.label`
  font-size: 14px;
  min-height: 46px;
  line-height: 3.14285714;
  padding: 0 36px;
  color: #2271b1;
  border-color: #2271b1;
  background: #f6f7f7;
  vertical-align: top;
  border-width: 1px;
  border-style: solid;
  -webkit-appearance: none;
  border-radius: 3px;
  white-space: nowrap;
  box-sizing: border-box;
`;

const SelectImage = styled.button`
  color: #a7aaad;
  background: #f6f7f7;
  border-color: #dcdcde;
  box-shadow: none;
  text-shadow: none;
  cursor: default;
  padding: 6px 12px;
  font-size: 12px;
`;