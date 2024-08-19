import Accordion from "../components/Accordion/Accordion";
import { useEffect, useState } from "react";
import {
  createEvent,
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
import { AccessibilityData, BookingData, BusRoutesData, countryCodes, keyfacilityData, locationData, ParishData, SeasonalityData, typesData, WeeklyDaysData } from "../utils/data";
import { useFormik } from "formik";
import { eventsSchema } from "../utils/validation";
import { checkEndData, eventDateValidation } from "../utils/commanFun";

interface Acf {
  title: string;
  short_description: string;
  long_description: string;
  type: { label: any; value: any }[];
  location: { label: any; value: any }[];
  key_facilities: { label: any; value: any }[];
  from_price: string;
  price_to: string;
  url: any;
  daysOfWeek?: any;
  map_location: any;
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
  start_time?: string;
  end_time?: string;
  eventType?: string;
}

interface FinalObject {
  acf: Acf;
  data_type: string;
  type: string;
  manual: boolean;
}

interface Props {
  isOpen?: any;
  setIsDrawerOpen?: any;
  setDrawerType?: any;
  drawerType?: string;
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

// const selectSingleEventData = createSelector(
//   (state: any) => state.event.singleEventData,
//   (singleEventData) => singleEventData || { acf: {} }
// );
const EventDataShow = ({ drawerType }: Props) => {
  const [isDateValid, setIsDateValid] = useState<any>(null);
  const isLoading = useSelector((state: any) => state.event.isLoading)
  const dataById = useSelector((state: any) => state.event.singleEventData)
  const [loading, setLoading] = useState(false)
  // const SingleEventData = useSelector(selectSingleEventData);

  const dispatch = useDispatch();


  const currentTime = moment(new Date()).format("HH:mm");
  const currentDate = new Date();

  const initialFormValues = {
    DescriptionTitle: "",
    introDescription: "",
    moreInformation: "",
    priceFrom: "",
    priceTo: "",
    DisplayName: "",
    EmailAddress: "",
    Prefix: "",
    Telephone: "",
    areaCode:"+1",
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
    file: "",
    Type: [],
    // subTypeActivity: [],
    Location: [],
    KeyFacilities: [],
    Seasonality: [],
    BusRoutes: [],
  }


  const { handleChange, handleSubmit, setFieldValue, handleBlur, resetForm, values, errors, touched } = useFormik({
    initialValues: initialFormValues,
    validationSchema: eventsSchema,
    onSubmit: () => finalEventSubmition(),
  });




  const [selectedOptionEvent, setSelectedOptionEvent] = useState("");
  const [location, setLocation] = useState<{ latitude: string | number, longitude: string | number }>({
    latitude: "",
    longitude: "",
  });
  const [dateState, setDateState] = useState<any>({
    startDateMonth: "",
    endDateMonth: "",
    startDateWeekly: "",
    endDateWeekly: "",
    startDateDaily: "",
    endDateDaily: "",
  });

  const [timeState, setTimeState] = useState({
    startTimeMonth: "",
    endTimeMonth: "",
    startTimeWeekly: "",
    endTimeWeekly: "",
    startTimeDaily: "",
    endTimeDaily: "",
  });
  const [dateTimeComponents, setDateTimeComponents] = useState([
    {
      selectedDate: currentDate,
      customStartTime: currentTime,
      customEndTime: currentTime,
    },
  ]);
  const [show, setShow] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    label: "",
    value: "",
  });
  const [selectedCode, setSelectedCode] = useState("");
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
  const [file, setFile] = useState("");




  useEffect(() => {
    if (drawerType === "Edit") {
      if (JSON.stringify(dataById)) {
        setFieldValue("introDescription", dataById?.acf?.short_description);
        setFieldValue("moreInformation", dataById?.acf?.long_description);
        setFieldValue("priceFrom", dataById?.acf?.from_price); // not getting key from backend
        setFieldValue("priceTo", dataById?.acf?.price_to);
        setFieldValue("DisplayName", dataById?.acf?.display_name); // not getting key from backend
        setFieldValue("EmailAddress", dataById?.acf?.email_address);
        setFieldValue("Prefix", dataById?.acf?.telephone_number?.prefix);
        setFieldValue("areaCode", dataById?.acf?.telephone_number?.area_code);
        setFieldValue("Telephone", dataById?.acf?.telephone_number?.number);
        setFieldValue("Website", dataById?.acf?.website);
        setFieldValue("PlaceName", dataById?.acf?.address?.place_name);
        setFieldValue("AddressLine", dataById?.acf?.address?.address_line_1);
        setFieldValue("AddressLineOptional", dataById?.acf?.address?.address_line_2);
        setFieldValue("Postcode", dataById?.acf?.address?.postcode);
        setFieldValue("Facebook", dataById?.acf?.social_media.facebook);
        setFieldValue("Instagram", dataById?.acf?.social_media.instagram);
        setFieldValue("Twitter", dataById?.acf?.social_media.twitter);
        setFieldValue("AdditionalInfo", dataById?.acf?.accessibility_additional_info); // not getting key from backend
        setFieldValue("AccessibilityURL", dataById?.acf?.accessibility_url); // not getting key from backend
        setFieldValue("DescriptionTitle", dataById?.acf?.title);

        setSelectedItems({
          ...selectedItems,
          Type: dataById?.acf?.type,
          Location: dataById?.acf?.location,
          KeyFacilities: dataById?.acf?.key_facilities,
          Booking: dataById?.acf?.booking_information,
          Accessibility: dataById?.acf?.accessibility,
          BusRoutes: dataById?.acf?.bus_routes,
          Seasonality: dataById?.acf?.seasonality,
        })
        location.latitude = dataById?.acf?.map_location?.lat,
        location.longitude = dataById?.acf?.map_location?.lng
        setLocation({...location})
        const setTYpe = dataById?.acf?.type.map((item: any) => ({
          title: item.label,
          value: item.value,
        }));
        setFieldValue("Type", setTYpe)
        const setLocationData = dataById?.acf?.location.map((item: any) => ({
          title: item.label,
          value: item.value,
        }));
        setFieldValue("Location", setLocationData)
        const setKeyFacilities = dataById?.acf?.key_facilities.map((item: any) => ({
          title: item.label,
          value: item.value,
        }));
        setFieldValue("KeyFacilities", setKeyFacilities)
        const setBusRoutes = dataById?.acf?.bus_routes.map((item: any) => ({
          title: item.label,
          value: item.value,
        }));
        setFieldValue("BusRoutes", setBusRoutes)
        const setSeasonality = dataById?.acf?.seasonality.map((item: any) => ({
          title: item.label,
          value: item.value,
        }));
        setFieldValue("Seasonality", setSeasonality)
        setTimeState({ ...dataById?.acf?.opening_hours })
        setSelectedOption({ label: dataById?.acf?.parish?.label, value: dataById?.acf?.parish?.value });
        const image = dataById?.acf?.header_image_data !== undefined ? JSON.parse(dataById?.acf?.header_image_data) : ""
        setFile(image[0].url)
        setFieldValue("file", image[0]?.url)
        if (dataById?.acf?.eventType === "custom") {
          setSelectedOptionEvent("option4")
          const formatDateData = dataById?.acf?.event_dates.map((item: any) => ({
            selectedDate: formatDate(item.date),
            customStartTime: item.start_time,
            customEndTime: item.end_time
          }))
          setDateTimeComponents([...formatDateData])
        } else if (dataById?.acf?.eventType === "monthly") {
          // setDateState()
          setSelectedOptionEvent("option3")
          timeState.startTimeMonth = dataById?.acf?.start_time;
          timeState.endTimeMonth = dataById?.acf?.end_time;
          setTimeState({ ...timeState })
          dateState.startDateMonth = dataById?.acf?.event_dates_start;
          dateState.endDateMonth = dataById?.acf?.event_dates_end;
          setDateState({ ...dateState })
        } else if (dataById?.acf?.eventType === "weekly") {
          setSelectedOptionEvent("option2")
          timeState.startTimeWeekly = dataById?.acf?.start_time;
          timeState.endTimeWeekly = dataById?.acf?.end_time;
          setTimeState({ ...timeState })
          dateState.startDateWeekly = dataById?.acf?.event_dates_start;
          dateState.endDateWeekly = dataById?.acf?.event_dates_end;
          setDateState({ ...dateState })

        } else if (dataById?.acf?.eventType === "daily") {
          setSelectedOptionEvent("option1")
          timeState.startTimeDaily = dataById?.acf?.start_time;
          timeState.endTimeDaily = dataById?.acf?.end_time;
          setTimeState({ ...timeState })
          dateState.startDateDaily = dataById?.acf?.event_dates_start;
          dateState.endDateDaily = dataById?.acf?.event_dates_end;
          setDateState({ ...dateState })
        }
      }
    } else {
      resetForm()
      setSelectedItems({
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
      // setTimeState({});
      setSelectedCode("");
      setLocation({
        latitude: "",
        longitude: "",
      });
      setFile("");
      setSelectedOption({ label: "", value: "" });
      setSelectedOptionEvent("")
      setDateState({
        startDateMonth: "",
        endDateMonth: "",
        startDateWeekly: "",
        endDateWeekly: "",
        startDateDaily: "",
        endDateDaily: "",
      })
      setTimeState({
        startTimeMonth: "",
        endTimeMonth: "",
        startTimeWeekly: "",
        endTimeWeekly: "",
        startTimeDaily: "",
        endTimeDaily: "",
      })
    }

  }, [JSON.stringify(dataById), drawerType])


  const handleChangeEvent = (event: any) => {
    setSelectedOptionEvent(event.target.value);
  };




  const onchangelocation = (e: any) => {
    const { name, value } = e.target;
    setLocation((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  }



  const handleDateChange = (field: any) => (date: any) => {

    // setDateState((prevState: any) => ({
    //   ...prevState,
    //   [field]: checkEndData(date, field),
    //   // [field]: date,
    // }));
    checkEndData(date, field, setDateState, dateState)

  };


  const handleTimeChange = (field: any) => (date: any) => {
    setTimeState((prevState) => ({
      ...prevState,
      [field]: date,
    }));
  };




  const addDateTimeComponent = () => {
    setDateTimeComponents([
      ...dateTimeComponents,
      {
        selectedDate: currentDate,
        customStartTime: currentTime,
        customEndTime: currentTime,
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




  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);





  const handleChangeRadio = (event: any) => {
    const selectedItem = ParishData.find(
      (item) => item.value === event.target.value
    );
    const selectedLabel = selectedItem ? selectedItem.label : ""; // Default to an empty string if undefined
    setSelectedOption({ label: selectedLabel, value: event.target.value });
  };






  const handleChangeCode = (event: any) => {
    setSelectedCode(event.target.value);
    setFieldValue("areaCode", event.target.value)
  };












  const handleCheckboxChange2 = (
    category: Category,
    value: string,
    checked: boolean,
    label?: any
  ) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedCategory = checked
        ? [
          ...prevSelectedItems[category],
          { label: label, value },
        ]
        : prevSelectedItems[category].filter((item) => item.value !== value);

      return {
        ...prevSelectedItems,
        [category]: updatedCategory,
      };
    });


    if (category === "Type") {
      if (checked) {
        setFieldValue(category, [
          ...values.Type,
          { value, title: label },
        ]);
      } else {
        setFieldValue(
          category,
          values.Type.filter((item: any) => item.value !== value)
        );
      }

    }
    else if (category === "Location") {
      if (checked) {
        setFieldValue(category, [
          ...values.Location,
          { value, title: label },
        ]);
      } else {
        setFieldValue(
          category,
          values.Location.filter((item: any) => item.value !== value)
        );
      }
    } else if (category === "KeyFacilities") {
      if (checked) {
        setFieldValue(category, [
          ...values.KeyFacilities,
          { value, title: label },
        ]);
      } else {
        setFieldValue(
          category,
          values.KeyFacilities.filter((item: any) => item.value !== value)
        );
      }
    } else if (category === "Seasonality") {
      if (checked) {
        setFieldValue(category, [
          ...values.Seasonality,
          { value, title: label },
        ]);
      } else {
        setFieldValue(
          category,
          values.Seasonality.filter((item: any) => item.value !== value)
        );
      }
    } else if (category === "BusRoutes") {
      if (checked) {
        setFieldValue(category, [
          ...values.BusRoutes,
          { value, title: label },
        ]);
      } else {
        setFieldValue(
          category,
          values.BusRoutes.filter((item: any) => item.value !== value)
        );
      }
    }

  };




  async function handleFileChange(e: any) {
    const file = e.target.files?.[0];
    const url = import.meta.env.VITE_REACT_APP_API_UPLOAD_IMAGE;
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        setLoading(true)
        const res = await axios.post(url, formData);
        if (res?.status === 200) {
          setLoading(false)
          setFile(res?.data);
          setFieldValue("file", res?.data)
        } else {
          setLoading(false)
          setFile("");
          setFieldValue("file", "")
        }
      } catch (error) {
        setLoading(false)
      }
      
    }
  }

  useEffect(() => {
    if (file) {
      handleClose()
    }
  }, [file])

  function parseTitle(title: string) {
    const [mainTitle, italicPart] = title.split('<br>');
    const italicText = italicPart?.match(/<i>(.*?)<\/i>/)?.[1];
    return {
      mainTitle,
      italicText
    };
  }




  const submitFormikFunction = (e: any) => {
    e.preventDefault()
    handleSubmit()
  };



  useEffect(() => {
    if (isDateValid !== null && selectedOptionEvent) {
      const MonthDays = selectedItems.MonthDays?.map(day => day.value);
      const WeekDays = selectedItems.WeekDays?.map(day => day.value);

      const formatDateData = dateTimeComponents.map((item: any) => ({
        date: formatDate(item.selectedDate),
        start_time: item.customStartTime,
        end_time: item.customEndTime
      }))
      if (selectedOptionEvent === "option4") {
        eventDateValidation(selectedOptionEvent, formatDateData, setIsDateValid)
      } else if (selectedOptionEvent === "option3") {
        eventDateValidation(selectedOptionEvent, MonthDays, setIsDateValid, dateState, timeState,)
      } else if (selectedOptionEvent === "option2") {
        eventDateValidation(selectedOptionEvent, WeekDays, setIsDateValid, dateState, timeState)
      } else if (selectedOptionEvent === "option1") {
        eventDateValidation(selectedOptionEvent, dateState, setIsDateValid, timeState)
      }
    } 

  }, [selectedOptionEvent,
    selectedItems.MonthDays.length,
    selectedItems.WeekDays.length,
    dateState.startDateDaily,
    dateState.startDateMonth,
    dateState.startDateWeekly,
    dateState.endDateDaily,
    dateState.endDateMonth,
    dateState.endDateWeekly,
    timeState.startTimeDaily,
    timeState.startTimeWeekly,
    timeState.startTimeMonth,
    timeState.endTimeDaily,
    timeState.endTimeWeekly,
    timeState.endTimeMonth,
    isDateValid
  ])



  const finalEventSubmition = () => {

    const MonthDays = selectedItems.MonthDays?.map(day => day.value);
    const WeekDays = selectedItems.WeekDays?.map(day => day.value);

    const formatDateData = dateTimeComponents.map((item: any) => ({
      date: formatDate(item.selectedDate),
      start_time: item.customStartTime,
      end_time: item.customEndTime
    }))

    const finalObject: FinalObject = {
      acf: {
        title: values.DescriptionTitle,
        short_description: values.introDescription,
        long_description: values.moreInformation,
        type: selectedItems.Type,
        location: selectedItems.Location,
        key_facilities: selectedItems.KeyFacilities,
        url: file,
        from_price: values.priceFrom,
        price_to: values.priceTo,
        booking_information: selectedItems.Booking,
        display_name: values.DisplayName,
        email_address: values.EmailAddress,
        map_location: { lat: +location.latitude, lng: +location.longitude },
        telephone_number: {
          area_code: values.areaCode,
          prefix: values.Prefix,
          number: values.Telephone,
        },
        website: values.Website,
        address: {
          place_name: values.PlaceName,
          address_line_1: values.AddressLine,
          address_line_2: values.AddressLineOptional,
          postcode: values.Postcode,
        },
        parish: selectedOption,
        seasonality: selectedItems.Seasonality,
        bus_routes: selectedItems.BusRoutes,
        social_media: {
          facebook: values.Facebook,
          instagram: values.Instagram,
          twitter: values.Twitter,
        },
        accessibility: selectedItems.Accessibility,
        accessibility_additional_info: values.AdditionalInfo,
        accessibility_url: values.AccessibilityURL,
      },
      data_type: "jersey",
      type: "events",
      manual: true,
    };
    if (selectedOptionEvent === "option4") {
      finalObject.acf.customDates = formatDateData;
      finalObject.acf.eventType = "custom";
      eventDateValidation(selectedOptionEvent, formatDateData, setIsDateValid)
    } else if (selectedOptionEvent === "option3") {
      finalObject.acf.event_dates_start = formatDate(dateState.startDateMonth);
      finalObject.acf.event_dates_end = formatDate(dateState.endDateMonth);
      finalObject.acf.start_time = timeState.startTimeMonth;
      finalObject.acf.end_time = timeState.endTimeMonth;
      finalObject.acf.daysOfWeek = MonthDays;
      finalObject.acf.eventType = "monthly"
      eventDateValidation(selectedOptionEvent, MonthDays, setIsDateValid, dateState, timeState,)
    } else if (selectedOptionEvent === "option2") {
      finalObject.acf.event_dates_start = formatDate(dateState.startDateWeekly);
      finalObject.acf.event_dates_end = formatDate(dateState.endDateWeekly);
      finalObject.acf.start_time = timeState.startTimeWeekly;
      finalObject.acf.end_time = timeState.endTimeWeekly;
      finalObject.acf.daysOfWeek = WeekDays;
      finalObject.acf.eventType = "weekly"
      eventDateValidation(selectedOptionEvent, WeekDays, setIsDateValid, dateState, timeState)
    } else if (selectedOptionEvent === "option1") {
      finalObject.acf.event_dates_start = formatDate(dateState.startDateDaily);
      finalObject.acf.event_dates_end = formatDate(dateState.endDateDaily);
      finalObject.acf.start_time = timeState.startTimeDaily;
      finalObject.acf.end_time = timeState.endTimeDaily;
      finalObject.acf.eventType = "daily"
      eventDateValidation(selectedOptionEvent, dateState, setIsDateValid, timeState)
    }
    // console.log(finalObject, "finalObject");
    if (isDateValid === null) {
      setIsDateValid(true)
    }


    // return
    if (drawerType === "Edit") {
      const status = { id: dataById?._id, finalObject }
      dispatch(updateEvent(status) as any)
    } else {
      dispatch(createEvent(finalObject) as any);

    }
    resetForm();
    setSelectedItems({
      Type: [],
      Location: [],
      KeyFacilities: [],
      Booking: [],
      WeekDays: [],
      MonthDays: [],
      Seasonality: [],
      BusRoutes: [],
      Accessibility: [],
    })
    setDateState({
      startDateMonth: "",
      endDateMonth: "",
      startDateWeekly: "",
      endDateWeekly: "",
      startDateDaily: "",
      endDateDaily: "",
    })
    setDateTimeComponents([
      {
        selectedDate: currentDate,
        customStartTime: currentTime,
        customEndTime: currentTime,
      },
    ])
    setSelectedCode("")
    setLocation({
      latitude: "",
      longitude: "",
    })
    setFile("")
    setSelectedOption({ label: "", value: "" });
    setTimeState({
      startTimeMonth: "",
      endTimeMonth: "",
      startTimeWeekly: "",
      endTimeWeekly: "",
      startTimeDaily: "",
      endTimeDaily: "",
    })
  }



  return (
    <div>
      <Accordion
        title="Description"
        content={
          <>
            <div>
              <ReusableInput
                title="Title *"
                name="DescriptionTitle"
                showCouter={true}
                DescriptionTitle={values.DescriptionTitle}
                handleDescriptionTitle={handleChange}
                error={errors.DescriptionTitle}
                touch={touched.DescriptionTitle && errors.DescriptionTitle}
                {...{ handleBlur }}

              />
              <TextField
                title="Introductory Description *"
                description="This will be used for the What’s On printed guide. It will also be used on the website where a short, preview piece of copy may be required to introduce your listing."
                maxLength="350"
                name="introDescription"
                value={values.introDescription}
                onchange={handleChange}
                handleBlur={handleBlur}
                error={errors.introDescription}
                touch={touched.introDescription && errors.introDescription}
              />
              <TextField
                title="More Information *"
                description="This is the main piece of copy within the body of your listing."
                maxLength="750"
                name="moreInformation"
                value={values.moreInformation}
                handleBlur={handleBlur}
                onchange={handleChange}
                error={errors.moreInformation}
                touch={touched.moreInformation && errors.moreInformation}
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
                          isChecked={values.Type.some(
                            (items: any) => items.value === item.value
                          )}
                          onCheckboxChange={(value, checked) =>
                            handleCheckboxChange2("Type", value, checked, item.title)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
                {errors.Type && touched.Type ? (
                  <div style={{ color: 'red' }}>{errors.Type}</div>
                ) : null}
              </div>
              {/* <div style={{ marginTop: 20 }}>
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
                            handleCheckboxChange2("Type", value, checked, item.title)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div> */}
              <div style={{ marginTop: 20 }}>
                <TitleText>Location *</TitleText>
                <div className="checkboxContainer">
                  {locationData.map((item, index) => {
                    return (
                      <div style={{ marginBottom: 10 }} key={index}>
                        <Checkbox
                          title={item.title}
                          value={item.value}
                          isChecked={values.Location.some(
                            (items: any) => items.value === item.value
                          )}
                          onCheckboxChange={(value, checked) =>
                            handleCheckboxChange2("Location", value, checked, item.title)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
                {errors.Location && touched.Location ? (
                  <div style={{ color: 'red' }}>{errors.Location}</div>
                ) : null}
                {/* <div className="checkboxContainer">
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
                            handleCheckboxChange2("Location", value, checked, item.title)
                          }
                        />
                      </div>
                    );
                  })}
                </div> */}
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
                          isChecked={values.KeyFacilities.some(
                            (items: any) => items.value === item.value
                          )}
                          onCheckboxChange={(value, checked) =>
                            handleCheckboxChange2(
                              "KeyFacilities",
                              value,
                              checked,
                              item.title
                            )
                          }
                        />
                      </div>
                    );
                  })}
                </div>
                {errors.KeyFacilities && touched.KeyFacilities ? (
                  <div style={{ color: 'red' }}>{errors.KeyFacilities}</div>
                ) : null}
              </div>
              <div>
                <TitleText>
                  Event dates *
                </TitleText>
                <TitleText style={{ marginTop: 20 }}>How often does this occur?</TitleText>
                <TitleTextMain style={{ marginTop: 20 }}>
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
              {isDateValid ? (
                <div style={{ color: 'red' }}>Please select event date</div>
              ) : null}
              <div>
                <TitleText style={{ margin: "20px 0px" }}>
                  Price from / to
                </TitleText>
                <p style={{ fontSize: 15, fontWeight: "400", marginTop: 20 }}>
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
                      type="number"
                      className="custom-inputPrice"
                      value={values.priceFrom}
                      // onChange={handleTextFieldChange}
                      name="priceFrom"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {(touched.priceFrom && errors.priceFrom) ? (
                    <div style={{ color: 'red' }}>{errors.priceFrom}</div>
                  ) : null}
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
                      type="number"
                      className="custom-inputPrice"
                      name="priceTo"
                      value={values.priceTo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {(touched.priceTo && errors.priceTo) ? (
                    <div style={{ color: 'red' }}>{errors.priceTo}</div>
                  ) : null}
                </div>
              </InputContainer>
              <TitleText style={{ margin: "20px 0px" }}>
                Booking information
              </TitleText>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  marginTop: 20
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
                          handleCheckboxChange2("Booking", value, checked, item.title)
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
                name="DisplayName"
                showCouter={false}
                DescriptionTitle={values.DisplayName}
                handleDescriptionTitle={handleChange}
                error={errors.DisplayName}
                touch={touched.DisplayName && errors.DisplayName}
                {...{ handleBlur }}
              />
              <div style={{ margin: "20px 0px" }}>
                <ReusableInput
                  title="Email address *"
                  name="EmailAddress"
                  showCouter={false}
                  DescriptionTitle={values.EmailAddress}
                  handleDescriptionTitle={handleChange}
                  handleBlur={handleBlur}
                  error={errors.EmailAddress}
                  touch={touched.EmailAddress && errors.EmailAddress}
                />
              </div>
              <TitleText>Telephone number</TitleText>
              <TitleTextMain style={{ marginTop: 20 }}>
                Please provide your full telephone number, including area code.
                For example: +44 (0) 1534 859000.
              </TitleTextMain>
              <div style={{ display: "flex", gap: 24, marginTop: 20 }}>
                <div style={{ width: 140 }}>
                  <h6 style={{ marginBottom: 20, fontWeight: "normal" }}>Area Code</h6>
                  <Select
                    id="country-code"
                    name="country-code"
                    value={values.areaCode}
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
                  <h6 style={{ marginBottom: 20, fontWeight: "normal" }}>Prefix</h6>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      value={values.Prefix}
                      name="Prefix"
                      onChange={handleChange}
                      className="parentheses-input"
                    />
                  </div>
                </div>
                <div style={{ width: "100%" }}>
                  <h6 style={{ marginBottom: 20, fontWeight: "normal" }}>Telephone</h6>
                  <input
                    type="text"
                    className="custom-inputInfo"
                    placeholder="153400000"
                    value={values.Telephone}
                    name="Telephone"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <TitleText>Website *</TitleText>
              <TitleTextMain style={{ marginTop: 20 }}>
                Please provide the full URL to your website. For example
                https://jersey.test.
              </TitleTextMain>
              <InputBoxWithImage
                value={values.Website}
                name="Website"
                onchange={handleChange}
                handleBlur={handleBlur}
                error={errors.Website}
                touch={touched.Website && errors.Website}
              />
              <TitleText style={{ marginTop: 20 }}>Address</TitleText>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                  marginBottom: 30,
                  marginTop: 20
                }}
              >
                <AddressInfo>Place name</AddressInfo>
                <input
                  type="text"
                  className="custom-inputInfo"
                  placeholder="Place name"
                  name="PlaceName"
                  value={values.PlaceName}
                  onBlur={handleBlur}
                  onChange={handleChange}
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
                  name="AddressLine"
                  value={values.AddressLine}
                  // onBlur={handleBlur}
                  onChange={handleChange}
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
                  name="AddressLineOptional"
                  value={values.AddressLineOptional}
                  onChange={handleChange}
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
                  name="Postcode"
                  placeholder="Postcode"
                  value={values.Postcode}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </div>
              <TitleText>Parish</TitleText>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gridGap: 10,
                  marginBottom: 20,
                  marginTop: 20
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
                        checked={selectedOption.value === item.value}
                        style={{ marginRight: 10 }}
                      />
                      <label>{item.label}</label>
                    </div>
                  );
                })}
              </div>
              <div>
                <TitleText>Map location</TitleText>
                <TitleTextMain style={{ marginTop: 20 }}>
                  Search for your address or click on the map to manually place
                  a marker.
                </TitleTextMain>
                <div style={{ display: "flex", gap: 20, marginBottom: 20, marginTop: 20 }}>
                  <input
                    type="number"
                    className="custom-inputInfo"
                    placeholder="Latitude"
                    value={location?.latitude}
                    name="latitude"
                    onChange={onchangelocation}
                  />
                  <input
                    type="number"
                    className="custom-inputInfo"
                    placeholder="Longitude"
                    value={location.longitude}
                    name="longitude"
                    onChange={onchangelocation}
                  />
                </div>
              </div>
              <TitleText>Seasonality *</TitleText>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  marginTop: 20
                }}
              >
                {SeasonalityData.map((item, index) => {
                  return (
                    <div style={{ marginBottom: 10 }} key={index}>
                      <Checkbox
                        title={item.title}
                        value={item.value}
                        isChecked={values.Seasonality.some(
                          (items: any) => items.value === item.value
                        )}
                        onCheckboxChange={(value, checked) =>
                          handleCheckboxChange2("Seasonality", value, checked, item.title)
                        }
                      />
                    </div>
                  );
                })}
              </div>
              {errors.Seasonality && touched.Seasonality ? (
                <div style={{ color: 'red' }}>{errors.Seasonality}</div>
              ) : null}
              <TitleText style={{ marginTop: 20 }}>Bus routes *</TitleText>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  marginTop: 20
                }}
              >
                {BusRoutesData.map((item, index) => {
                  const { mainTitle, italicText } = parseTitle(item.title);
                  return (
                    <div style={{ marginBottom: 10 }} key={index}>
                      {item.title != "" && (
                        <Checkbox
                          title={mainTitle}
                          value={item.value}
                          isChecked={values.BusRoutes.some(
                            (items: any) => items.value === item.value
                          )}
                          onCheckboxChange={(value, checked) =>
                            handleCheckboxChange2("BusRoutes", value, checked, item.title)
                          }
                        />
                      )}

                      <p style={{ marginLeft: 20 }}>{italicText}</p>
                    </div>
                  );
                })}
              </div>
              {errors.BusRoutes && touched.BusRoutes ? (
                <div style={{ color: 'red' }}>{errors.BusRoutes}</div>
              ) : null}
              <TitleText style={{ marginTop: 20 }}>Social media</TitleText>
              <TitleTextMain style={{ marginTop: 20 }}>
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
                  value={values.Facebook}
                  name="Facebook"
                  onchange={handleChange}
                  handleBlur={handleBlur}
                  error={errors.Facebook}
                  touch={touched.Facebook && errors.Facebook}
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
                  value={values.Instagram}
                  name="Instagram"
                  onchange={handleChange}
                  handleBlur={handleBlur}
                  error={errors.Instagram}
                  touch={touched.Instagram && errors.Instagram}
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
                  value={values.Twitter}
                  name="Twitter"
                  onchange={handleChange}
                  handleBlur={handleBlur}
                  error={errors.Twitter}
                  touch={touched.Twitter && errors.Twitter}
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
                  marginTop: 20,
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
                  marginTop: 20
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
                          handleCheckboxChange2("Accessibility", value, checked, item.title)
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
                value={values.AdditionalInfo}
                name="AdditionalInfo"
                onchange={handleChange}
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
                  marginTop: 20,
                }}
              >
                It is recommended that you have an accessibility page on your
                website, include a link here.
              </p>
              <InputBoxWithImage
                value={values.AccessibilityURL}
                name="AccessibilityURL"
                onchange={handleChange}
                handleBlur={handleBlur}
                error={errors.AccessibilityURL}
                touch={touched.AccessibilityURL && errors.AccessibilityURL}
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
                    marginTop: 20
                  }}
                >   <img src={file} style={{ width: 100, marginTop: 20, marginLeft: 20 }} /></div>
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
              {errors.file && touched.file ? (
                <div style={{ color: 'red' }}>{errors.file}</div>
              ) : null}
            </div>
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
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {
                    loading ? <p>Uploading...</p> :
                  <div style={{ textAlign: "center" }}>
                    <DropImage>Drop files to upload</DropImage>
                    <p>or</p>
                    <input
                      type="file"
                      id="imageget"
                      name="file"
                      onChange={handleFileChange}
                      onBlur={handleBlur}
                      accept="image/png, image/jpeg"
                      hidden
                    />
                    <ButtonImage htmlFor="imageget">Select Files</ButtonImage>
                  </div>
                  }
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
      {
        isLoading ?
          <ButtonSubmit type="button" >Loading...</ButtonSubmit> :
          <ButtonSubmit type="button" onClick={submitFormikFunction}>{drawerType === "Edit" ? "Update" : "Submit"}</ButtonSubmit>

      }
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
  margin: 0px;
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

const ButtonSubmit = styled.button`
  // padding: 10px;
  background-color: #2271b1;
  // color: #fff;
  margin-top: 20px;
  // border-radius: 5px;

display: inline-block;
outline: 0;
border: 0;
cursor: pointer;
will-change: box-shadow,transform;
// background: radial-gradient( 100% 100% at 100% 0%, #89E5FF 0%, #5468FF 100% );
box-shadow: 0px 2px 4px rgb(45 35 66 / 40%), 0px 7px 13px -3px rgb(45 35 66 / 30%), inset 0px -3px 0px rgb(58 65 111 / 50%);
padding: 0 32px;
border-radius: 6px;
color: #fff;
height: 48px;
font-size: 18px;
text-shadow: 0 1px 0 rgb(0 0 0 / 40%);
transition: box-shadow 0.15s ease,transform 0.15s ease;
&:hover {
    box-shadow: 0px 4px 8px rgb(45 35 66 / 40%), 0px 7px 13px -3px rgb(45 35 66 / 30%), inset 0px -3px 0px #3c4fe0;
    transform: translateY(-2px);
}
&:active{
    box-shadow: inset 0px 3px 7px #3c4fe0;
    transform: translateY(2px);
}
`
