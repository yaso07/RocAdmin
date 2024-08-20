import Accordion from "../components/Accordion/Accordion";
import { useState, useEffect } from "react";
import { createActivity, getActivityList, updateActivity } from "../api/EventSlice/eventThunk";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ReusableInput from "./InputBox/ReusableInput";
import TextField from "./InputBox/TextField";
import Checkbox from "./InputBox/Checkbox";
import "../App.css";
import InputBoxWithImage from "./InputBox/InputBoxWithImage";
import styled from "styled-components";
import TimePicker from "./DateAndTimePicker/TimePicker";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  AccessibilityData,
  BookingData,
  BusRoutesData,
  countryCodes,
  IndoretypesData,
  keyfacilityData,
  locationData,
  ParishData,
  SeasonalityData,
  TypeActivityData,
  typesData,
  WeeklyDaysData,
} from "../utils/data";
import { updateOpenHours } from "../utils/commanFun";
import { Category, FinalObject, Props, SelectedItems, TimeState } from "../utils/interface";
import { useFormik } from "formik";
import { activitySchema } from "../utils/validation";
import moment from "moment";
// import { formDataType } from "../types/event";



const ActivityDataCreate = ({ setIsDrawerOpen, drawerType }: Props) => {

  const dataById = useSelector((state: any) => state.event.singleEventData)
  const isLoading = useSelector((state: any) => state.event.isLoading)
  const dispatch = useDispatch();

  const currentTime = moment(new Date()).format("HH:mm");
  const newTime = moment(currentTime, "HH:mm").add(2, 'hours').format("HH:mm");
  const [timeState, setTimeState] = useState<TimeState>({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false)

  const [selectedCode, setSelectedCode] = useState("");
  const [selectedActivity, setSelectedActivity] = useState({
    label: "Indoor activities",
    value: "indoor-activities",
  });
  const [selectedOption, setSelectedOption] = useState({
    label: "",
    value: "",
  });
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    Type: [],
    subTypeOutdoor: [],
    subTypeIutdoor: [],
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
  const [location, setLocation] = useState<any>({
    latitude: "",
    longitude: "",
  });

  const initialFormValues = {
    DescriptionTitle: "",
    introDescription: "",
    moreInformation: "",
    priceFrom: "",
    priceTo: "",
    DisplayName: "",
    EmailAddress: "",
    Prefix: "",
    areaCode: "+1",
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
    file: "",
    activityType: "indoor-activities",
    subTypeActivity: [],
    Location: [],
    KeyFacilities: [],
    Seasonality: [],
    BusRoutes: [],
    Booking: [],
    Accessibility: [],
    WeekDays: [],
    Parish: "",
    latitude: "",
    longitude: "",
  }

  const { handleChange, handleSubmit, setFieldValue, handleBlur, resetForm, values, errors, touched } = useFormik({
    initialValues: initialFormValues,
    validationSchema: activitySchema,
    onSubmit: () => finalActivitySubmition(),
  });




  useEffect(() => {
    if (drawerType === "Edit") {
      if (JSON.stringify(dataById)) {
        setFieldValue("introDescription", dataById?.acf?.short_description);
        setFieldValue("moreInformation", dataById?.acf?.long_description);
        setFieldValue("priceFrom", dataById?.acf?.price_from); // not getting key from backend
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
        setSelectedActivity({ label: dataById?.acf?.type?.label, value: dataById?.acf?.type?.value });
        setFieldValue("activityType", dataById?.acf?.type?.value)
        const weekDay: any = []
        for (const key in dataById?.acf?.opening_hours) {
          if (dataById?.acf?.opening_hours.hasOwnProperty(key)) {
            if (dataById?.acf?.opening_hours[key].is_open == 1) {
              weekDay.push({ value: key })
            }
          }
        }
        setFieldValue("WeekDays", weekDay)
        setSelectedItems({
          ...selectedItems,
          subTypeOutdoor: dataById?.acf?.sub_type,
          subTypeIutdoor: dataById?.acf?.sub_type,
          Location: dataById?.acf?.location,
          KeyFacilities: dataById?.acf?.key_facilities,
          Booking: dataById?.acf?.booking_information,
          Accessibility: dataById?.acf?.accessibility,
          BusRoutes: dataById?.acf?.bus_routes,
          Seasonality: dataById?.acf?.seasonality,
          WeekDays: weekDay,
        })
        location.latitude = dataById?.acf?.map_location?.lat,
          location.longitude = dataById?.acf?.map_location?.lng
        setLocation({ ...location })
          setFieldValue("latitude", dataById?.acf?.map_location?.lat)
          setFieldValue("longitude", dataById?.acf?.map_location?.lng)
        const setTYpe = dataById?.acf?.sub_type.map((item: any) => ({
          title: item.label,
          value: item.value,
        }));
        setFieldValue("subTypeActivity", setTYpe)
        const setLocations = dataById?.acf?.location.map((item: any) => ({
          title: item.label,
          value: item.value,
        }));
        setFieldValue("Location", setLocations)
        const setKeyFacilities = dataById?.acf?.key_facilities.map((item: any) => ({
          title: item.label,
          value: item.value,
        }));
        setFieldValue("KeyFacilities", setKeyFacilities)
        const setBookings = dataById?.acf?.booking_information.map((item: any) => ({
          title: item.label,
          value: item.value,
        }));
        setFieldValue("Booking", setBookings)
        const setAccessibilitys = dataById?.acf?.accessibility.map((item: any) => ({
          title: item.label,
          value: item.value,
        }));
        setFieldValue("Accessibility", setAccessibilitys)
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
        setFieldValue("Parish", dataById?.acf?.parish?.value)
        const image = dataById?.acf?.header_image_data !== undefined ? JSON.parse(dataById?.acf?.header_image_data) : ""
        setFile(image[0].url)
        setFieldValue("file", image[0]?.url)
      }
    } else {
      resetForm()
      setSelectedItems({
        Type: [],
        subTypeOutdoor: [],
        subTypeIutdoor: [],
        Location: [],
        KeyFacilities: [],
        Booking: [],
        WeekDays: [],
        MonthDays: [],
        Seasonality: [],
        BusRoutes: [],
        Accessibility: [],
      });
      setTimeState({});
      setSelectedCode("");
      // setSelectedActivity({ label: "", value: "" });
      setLocation({
        latitude: "",
        longitude: "",
      });
      setFile("");
      setSelectedOption({ label: "", value: "" });
    }

  }, [JSON.stringify(dataById), drawerType])




  const handleCheckboxChange = (
    category: string,
    value: string,
    checked: boolean
  ) => {
    setSelectedItems((prevState: any) => {
      const newWeekDays = checked
      ? [...prevState.WeekDays, { value }]
      : prevState.WeekDays.filter((item: any) => item.value !== value);
      return { ...prevState, WeekDays: newWeekDays };
    });
    if(checked){
      setFieldValue(category, [{value}])
    } else {
      setFieldValue(category, values.WeekDays.filter((item: any) => item.value !== value))
    }
    setTimeState((prevState: any) => {
      return {
        ...prevState,
        [value]: {
          is_open: checked ? "1" : "0",
          opens: currentTime,
          closes: newTime
        },
      };
    });
  };
  
  console.log(values.WeekDays)
  const handleTimeChangehour = (day: string, type: "opens" | "closes") => (time: string) => {
    setTimeState((prevState) => ({
      ...prevState,
      [day]: {
        ...prevState[day],
        [type]: time,
      },
    }));
  };





  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);





  const onchangelocation = (e: any) => {
    const { name, value } = e.target;
    setLocation((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
    setFieldValue(name, value)
  };



  const handleChangeCode = (event: any) => {
    setSelectedCode(event.target.value);
    setFieldValue("areaCode", event.target.value)
  };





  const handleChangeRadioActivity = (event: any) => {
    const selectedItem = TypeActivityData.find(
      (item) => item.value === event.target.value
    );
    const selectedLabel = selectedItem ? selectedItem.label : ""; // Default to an empty string if undefined
    setSelectedActivity({ label: selectedLabel, value: event.target.value });
    setFieldValue("activityType", event.target.value)
  };


  const subTypeActivity =
    selectedActivity?.label == "Outdoor activities"
      ? typesData
      : IndoretypesData;

  const subTypeAct =
    selectedActivity?.label == "Outdoor activities"
      ? "subTypeOutdoor"
      : "subTypeIutdoor";


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
      //  setFile(URL.createObjectURL(e.target.files[0]) as any);
    }
  }





  const handleChangeRadio = (event: any) => {
    const selectedItem = ParishData.find(
      (item) => item.value === event.target.value
    );
    const selectedLabel = selectedItem ? selectedItem.label : ""; // Default to an empty string if undefined
    setSelectedOption({ label: selectedLabel, value: event.target.value });
    setFieldValue("Parish", event.target.value)
  };




  const handleCheckboxChange2 = (
    category: Category,
    value: string,
    checked: boolean,
    title?: any
  ) => {

    setSelectedItems((prevSelectedItems) => {
      const updatedCategory = checked
        ? [...prevSelectedItems[category], { label: title, value }]
        : prevSelectedItems[category].filter((item) => item.value !== value);
      return {
        ...prevSelectedItems,
        [category]: updatedCategory,
      };
    });

    // console.log("udteese",  category, selectedItems)
    const nameValue = ((category as string) === "subTypeOutdoor") || ((category as string) === "subTypeIutdoor") ? "subTypeActivity" : category
    if (((category as string) === "subTypeOutdoor") || ((category as string) === "subTypeIutdoor")) {
      if (checked) {
        setFieldValue(nameValue, [
          ...values.subTypeActivity,
          { value, title },
        ]);
      } else {
        setFieldValue(
          nameValue,
          values.subTypeActivity.filter((item: any) => item.value !== value)
        );
      }

    }
    else if ((category as string) === "Location") {
      if (checked) {
        setFieldValue(nameValue, [
          ...values.Location,
          { value, title },
        ]);
      } else {
        setFieldValue(
          nameValue,
          values.Location.filter((item: any) => item.value !== value)
        );
      }
    } else if ((category as string) === "KeyFacilities") {
      if (checked) {
        setFieldValue(nameValue, [
          ...values.KeyFacilities,
          { value, title },
        ]);
      } else {
        setFieldValue(
          nameValue,
          values.KeyFacilities.filter((item: any) => item.value !== value)
        );
      }
    } else if ((category as string) === "Seasonality") {
      if (checked) {
        setFieldValue(nameValue, [
          ...values.Seasonality,
          { value, title },
        ]);
      } else {
        setFieldValue(
          nameValue,
          values.Seasonality.filter((item: any) => item.value !== value)
        );
      }
    } else if ((category as string) === "BusRoutes") {
      if (checked) {
        setFieldValue(nameValue, [
          ...values.BusRoutes,
          { value, title },
        ]);
      } else {
        setFieldValue(
          nameValue,
          values.BusRoutes.filter((item: any) => item.value !== value)
        );
      }
    } else if (category === "Booking") {
      if (checked) {
        setFieldValue(category, [
          ...values.Booking,
          { value, title },
        ]);
      } else {
        setFieldValue(
          category,
          values.Booking.filter((item: any) => item.value !== value)
        );
      }
    } else if (category === "Accessibility") {
      if (checked) {
        setFieldValue(category, [
          ...values.Accessibility,
          { value, title },
        ]);
      } else {
        setFieldValue(
          category,
          values.Accessibility.filter((item: any) => item.value !== value)
        );
      }
    }
  };
  const subTypeValue =
    selectedActivity?.label === "Outdoor activities"
      ? selectedItems?.subTypeOutdoor
      : selectedItems?.subTypeIutdoor;


  // console.log("subTypeIutdoor", subTypeValue, selectedActivity?.label)
  function parseTitle(title: string) {
    const [mainTitle, italicPart] = title.split("<br>");
    const italicText = italicPart?.match(/<i>(.*?)<\/i>/)?.[1];
    return {
      mainTitle,
      italicText,
    };
  }

  useEffect(() => {
    if (file) {
      handleClose();
    }
  }, [file]);


  const submitFormikFunction = (e: any) => {
    e.preventDefault();
    handleSubmit()
  };


  const finalActivitySubmition = () => {
    const keyFeature = selectedItems.KeyFacilities.map((item: any) => ({
      label: item.label,
      value: item.value,
    }));
    const BookingEvent = selectedItems.Booking.map((item: any) => ({
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

    const finalObject: FinalObject = {
      acf: {
        title: values.DescriptionTitle,
        short_description: values.introDescription,
        long_description: values.moreInformation,
        sub_type: subTypeValue,
        type: selectedActivity,
        location: eventLocationArray,
        key_facilities: keyFeature,
        url: file,
        price_from: values.priceFrom,
        price_to: values.priceTo,
        booking_information: BookingEvent,
        display_name: values.DisplayName,
        email_address: values.EmailAddress,
        map_location: { lat: +location.latitude, lng: +location.longitude },
        telephone_number: {
          area_code: selectedCode,
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
        seasonality: seasonalityArray,
        bus_routes: busRouteArray,
        opening_hours: updateOpenHours(timeState),
        social_media: {
          facebook: values.Facebook,
          instagram: values.Instagram,
          twitter: values.Twitter,
        },
        accessibility: accessibilityArray,
        accessibility_additional_info: values.AdditionalInfo,
        accessibility_url: values.AccessibilityURL,
      },
      data_type: "jersey",
      type: "activities",
      manual: true,
    };

    if (drawerType === "Edit") {
      const obj = { finalObject, setIsDrawerOpen, id: dataById?._id };

      dispatch(updateActivity(obj) as any);
      dispatch(getActivityList() as any)
      resetForm()
      setSelectedItems({
        Type: [],
        subTypeOutdoor: [],
        subTypeIutdoor: [],
        Location: [],
        KeyFacilities: [],
        Booking: [],
        WeekDays: [],
        MonthDays: [],
        Seasonality: [],
        BusRoutes: [],
        Accessibility: [],
      });
      setTimeState({});
      setSelectedCode("");
      setSelectedActivity({ label: "", value: "" });
      setLocation({
        latitude: "",
        longitude: "",
      });
      setFile("");
      setSelectedOption({ label: "", value: "" });
    } else {
      const obj = { finalObject, setIsDrawerOpen };
      dispatch(createActivity(obj) as any);
      dispatch(getActivityList() as any)
      resetForm()
      setSelectedItems({
        Type: [],
        subTypeOutdoor: [],
        subTypeIutdoor: [],
        Location: [],
        KeyFacilities: [],
        Booking: [],
        WeekDays: [],
        MonthDays: [],
        Seasonality: [],
        BusRoutes: [],
        Accessibility: [],
      });
      setTimeState({});
      setSelectedCode("");
      setSelectedActivity({ label: "", value: "" });
      setLocation({
        latitude: "",
        longitude: "",
      });
      setFile("");
      setSelectedOption({ label: "", value: "" });
    }

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


              // DescriptionTitle={formData.DescriptionTitle}
              // handleDescriptionTitle={handleTextFieldChange}

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

              // value={formData.introDescription}
              // DescriptionTitle={formData.DescriptionTitle}
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

              // value={formData.moreInformation}
              // onchange={handleTextFieldChange}
              />
              <TitleText style={{ marginTop: 20 }}>Type *</TitleText>
              <div
                style={{
                  display: "grid",
                  gridGap: 10,
                  marginBottom: 20,
                }}
              >
                {TypeActivityData.map((item, index) => {
                  return (
                    <div key={index}>
                      <input
                        type="radio"
                        id={item.value}
                        name="activityType"
                        // value={values.activityType}
                        // onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.activityType === item.value}
                        value={item.value}
                        onChange={handleChangeRadioActivity}
                        // checked={selectedActivity.value === item.value}
                        style={{ marginRight: 10 }}
                      />
                      <label>{item.label}</label>
                    </div>
                  );
                })}
              </div>
              {/* {(touched.activityType && errors.activityType) ? (
                <div style={{ color: 'red' }}>{errors.activityType}</div>
              ) : null} */}
              <div style={{ marginTop: 20 }}>
                <TitleText>Sub Type *</TitleText>
                <div className="checkboxContainer">
                  {subTypeActivity?.map((item: any, index) => {

                    return (
                      <div style={{ marginBottom: 10 }} key={index}>
                        <Checkbox
                          title={item?.title}
                          value={item?.value}
                          isChecked={values.subTypeActivity.some(
                            (items: any) => items?.value === item?.value
                          )}
                          onCheckboxChange={(value, checked) =>
                            handleCheckboxChange2(
                              subTypeAct,
                              value,
                              checked,
                              item?.title
                            )
                          }
                        />
                      </div>
                    );
                  })}
                </div>
                {errors.subTypeActivity && touched.subTypeActivity ? (
                  <div style={{ color: 'red' }}>{errors.subTypeActivity}</div>
                ) : null}
              </div>
              <div style={{ marginTop: 20 }}>
                <TitleText>Location *</TitleText>
                <div className="checkboxContainer">
                  {locationData.map((item, index) => {
                    return (
                      <div style={{ marginBottom: 10 }} key={index}>
                        <Checkbox
                          title={item?.title}
                          value={item?.value}
                          isChecked={values.Location.some(
                            (items: any) => items?.value === item?.value
                          )}
                          onCheckboxChange={(value, checked) =>
                            handleCheckboxChange2(
                              "Location",
                              value,
                              checked,
                              item?.title
                            )
                          }
                        />
                      </div>
                    );
                  })}
                </div>
                {errors.Location && touched.Location ? (
                  <div style={{ color: 'red' }}>{errors.Location}</div>
                ) : null}
              </div>
              <div style={{ marginTop: 20, marginBottom: 20 }}>
                <TitleText>Key facilities *</TitleText>
                <div className="checkboxContainer">
                  {keyfacilityData.map((item, index) => {
                    return (
                      <div style={{ marginBottom: 10 }} key={index}>
                        <Checkbox
                          title={item?.title}
                          value={item?.value}
                          isChecked={values.KeyFacilities.some(
                            (items: any) => items?.value === item?.value
                          )}
                          onCheckboxChange={(value, checked) =>
                            handleCheckboxChange2(
                              "KeyFacilities",
                              value,
                              checked,
                              item?.title
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
                      type="number"
                      name="priceFrom"
                      className="custom-inputPrice"
                      value={values.priceFrom}
                      onChange={handleChange}
                      onBlur={handleBlur}


                    // value={formData.priceFrom}
                    // onChange={handleTextFieldChange}
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


                    // value={formData.priceTo}
                    // onChange={handleTextFieldChange}
                    />
                  </div>
                  {(touched.priceTo && errors.priceTo) ? (
                    <div style={{ color: 'red' }}>{errors.priceTo}</div>
                  ) : null}
                </div>
              </InputContainer>
              <TitleText style={{ margin: "20px 0px" }}>
                Booking information *
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
                        title={item?.title}
                        value={item?.value}
                        isChecked={values.Booking.some(
                          (items: any) => items?.value === item?.value
                        )}
                        onCheckboxChange={(value, checked) =>
                          handleCheckboxChange2(
                            "Booking",
                            value,
                            checked,
                            item?.title
                          )
                        }
                      />
                    </div>
                  );
                })}
              </div>
              {(touched.Booking && errors.Booking) ? (
                <div style={{ color: 'red' }}>{errors.Booking}</div>
              ) : null}
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


              // DescriptionTitle={formData.DisplayName}
              // handleDescriptionTitle={handleTextFieldChange}
              />
              <div style={{ margin: "20px 0px" }}>
                <ReusableInput
                  title="Email address *"
                  showCouter={false}
                  name="EmailAddress"
                  DescriptionTitle={values.EmailAddress}
                  handleDescriptionTitle={handleChange}
                  handleBlur={handleBlur}
                  error={errors.EmailAddress}
                  touch={touched.EmailAddress && errors.EmailAddress}


                // DescriptionTitle={formData.EmailAddress}
                // handleDescriptionTitle={handleTextFieldChange}
                />
              </div>
              <TitleText>Telephone number *</TitleText>
              <TitleTextMain>
                Please provide your full telephone number, including area code.
                For example: +44 (0) 1534 859000.
              </TitleTextMain>
              <div style={{ display: "flex", gap: 24 }}>
                <div style={{ width: 140 }}>
                  <h6 style={{ fontWeight: "normal", marginBottom: 20 }}>
                    Area Code
                  </h6>
                  <Select
                    id="country-code"
                    name="areaCode"
                    value={values.areaCode}
                    onChange={handleChangeCode}
                  >
                    {countryCodes.map((item, index) => (
                      <option key={index} value={item?.code}>
                        {item?.code}
                      </option>
                    ))}
                  </Select>
                </div>
                <div style={{ width: 120 }}>
                  <h6 style={{ fontWeight: "normal", marginBottom: 20 }}>
                    Prefix
                  </h6>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      value={values.Prefix}
                      name="Prefix"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="parentheses-input"
                    />
                  </div>
                  {(touched.Prefix && errors.Prefix) ? (
                    <div style={{ color: 'red' }}>{errors.Prefix}</div>
                  ) : null}
                </div>
                <div style={{ width: "100%" }}>
                  <h6 style={{ fontWeight: "normal", marginBottom: 20 }}>
                    Telephone
                  </h6>
                  <input
                    type="number"
                    className="custom-inputInfo"
                    placeholder="153400000"
                    value={values.Telephone}
                    name="Telephone"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {(touched.Telephone && errors.Telephone) ? (
                    <div style={{ color: 'red' }}>{errors.Telephone}</div>
                  ) : null}
                </div>
              </div>
              <TitleText>Website *</TitleText>
              <TitleTextMain>
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
              <TitleText style={{ marginTop: 20 }}>Address *</TitleText>
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
                <div style={{ width: '100%' }} >

                  <input
                    type="text"
                    className="custom-inputInfo"
                    placeholder="Place name"
                    name="PlaceName"
                    value={values.PlaceName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {(touched.PlaceName && errors.PlaceName) ? (
                    <div style={{ color: 'red' }}>{errors.PlaceName}</div>
                  ) : null}
                </div>
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
                <div style={{ width: '100%' }} >
                  <input
                    type="text"
                    className="custom-inputInfo"
                    placeholder="Address line 1"
                    name="AddressLine"
                    value={values.AddressLine}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {(touched.AddressLine && errors.AddressLine) ? (
                    <div style={{ color: 'red' }}>{errors.AddressLine}</div>
                  ) : null}
                </div>
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
                <div style={{ width: '100%' }} >
                  <input
                    type="text"
                    className="custom-inputInfo"
                    name="Postcode"
                    placeholder="Postcode"
                    value={values.Postcode}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {(touched.Postcode && errors.Postcode) ? (
                    <div style={{ color: 'red' }}>{errors.Postcode}</div>
                  ) : null}
                </div>
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
                        id={item?.value}
                        name="location"
                        value={item?.value}
                        onChange={handleChangeRadio}
                        checked={selectedOption?.value === item?.value}
                        style={{ marginRight: 10 }}
                      />
                      <label>{item?.label}</label>
                    </div>
                  );
                })}
              </div>
              {(touched.Parish && errors.Parish) ? (
                <div style={{ color: 'red' }}>{errors.Parish}</div>
              ) : null}
              <div>
                <TitleText>Map location *</TitleText>
                <TitleTextMain style={{ marginTop: 20 }}>
                  Search for your address or click on the map to manually place
                  a marker.
                </TitleTextMain>
                <div style={{ display: "flex", gap: 20, marginBottom: 20, marginTop: 20 }}>
                  <div style={{ width: '100%' }}>
                    <input
                      type="number"
                      className="custom-inputInfo"
                      placeholder="Latitude"
                      value={values?.latitude}
                      name="latitude"
                      onChange={onchangelocation}
                      onBlur={handleBlur}
                    />

                    {(touched.latitude && errors.latitude) ? (
                      <div style={{ color: 'red' }}>{errors.latitude}</div>
                    ) : null}
                  </div>
                  <div style={{ width: '100%' }}>

                    <input
                      type="number"
                      className="custom-inputInfo"
                      placeholder="Longitude"
                      value={values.longitude}
                      name="longitude"
                      onChange={onchangelocation}
                      onBlur={handleBlur}
                    />
                    {(touched.longitude && errors.longitude) ? (
                      <div style={{ color: 'red' }}>{errors.longitude}</div>
                    ) : null}
                  </div>
                </div>
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
                        title={item?.title}
                        value={item?.value}
                        isChecked={values.Seasonality.some(
                          (items: any) => items?.value === item?.value
                        )}
                        onCheckboxChange={(value, checked) =>
                          handleCheckboxChange2(
                            "Seasonality",
                            value,
                            checked,
                            item?.title
                          )
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
                }}
              >
                {BusRoutesData.map((item, index) => {
                  const { mainTitle, italicText } = parseTitle(item?.title);
                  return (
                    <div style={{ marginBottom: 10 }} key={index}>
                      {item.title != "" && (
                        <Checkbox
                          title={mainTitle}
                          value={item?.value}
                          isChecked={values.BusRoutes.some(
                            (items: any) => items?.value === item?.value
                          )}
                          onCheckboxChange={(value, checked) =>
                            handleCheckboxChange2(
                              "BusRoutes",
                              value,
                              checked,
                              item?.title
                            )
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
              <TitleText style={{ marginTop: 10 }}>Opening hours</TitleText>
              <TitleTextMain>
                If you are open all day,please leave the startend date blank
              </TitleTextMain>
              {WeeklyDaysData.map((item, index) => {
                const isChecked = selectedItems?.WeekDays.some(
                  (weekday) => weekday?.value === item?.value
                );
                return (

                  <div
                    style={{
                      marginBottom: 10,
                      display: "grid",
                      alignItems: "center",
                      gap: 20,
                      gridTemplateColumns: "1fr 3fr",
                    }}
                    key={index}
                  >
                    <Checkbox
                      title={item?.title}
                      value={item?.value}
                      isChecked={isChecked}
                      onCheckboxChange={(value, checked) =>
                        handleCheckboxChange("WeekDays", value, checked)
                      }
                    />
                    {isChecked && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <TimePicker
                          value={timeState[item?.value]?.opens || ""}
                          onChange={handleTimeChangehour(item?.value, "opens")}
                        />
                        -
                        <TimePicker
                          value={timeState[item?.value]?.closes || ""}
                          onChange={handleTimeChangehour(item?.value, "closes")}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              {errors.WeekDays && touched.WeekDays ? (
                <div style={{ color: 'red' }}>{errors.WeekDays}</div>
              ) : null}
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
                Accessibility *
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
                  marginTop: 20,
                }}
              >
                {AccessibilityData.map((item, index) => {
                  return (
                    <div key={index}>
                      <Checkbox
                        title={item?.title}
                        value={item?.value}
                        isChecked={values.Accessibility.some(
                          (items: any) => items?.value === item?.value
                        )}
                        onCheckboxChange={(value, checked) =>
                          handleCheckboxChange2(
                            "Accessibility",
                            value,
                            checked,
                            item?.title
                          )
                        }
                      />
                    </div>
                  );
                })}
              </div>
              {(touched.Accessibility && errors.Accessibility) ? (
                <div style={{ color: 'red' }}>{errors.Accessibility}</div>
              ) : null}
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
              {/* {(touched.AccessibilityURL && errors.AccessibilityURL) ? (
                <div style={{ color: 'red' }}>{errors.AccessibilityURL}</div>
              ) : null} */}
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
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: "600",
                    margin: "20px 0px",
                  }}
                >
                  Header image *
                </div>
                <div
                  style={{
                    borderTop: "1px solid #ccc",
                    borderLeft: "1px solid #ccc",
                    borderRight: "1px solid #ccc",
                    height: 300,
                    marginTop: 20,
                  }}
                >
                  {" "}
                  <img
                    src={file}
                    style={{ width: 100, marginTop: 20, marginLeft: 20 }}
                  />
                </div>
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
                    alignItems: "center",
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
                  disabled={file ? false : true}
                  style={{
                    cursor: file ? "pointer" : "not-allowed",
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

export default ActivityDataCreate;

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

const TitleText = styled.h6`
  display: block;
  line-height: 1;
  margin-bottom: 0.625rem;
  font-size: 1rem;
  font-weight: 700;
  color: #333;
`;

const TitleTextMain = styled.h6`
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
  cursor: pointer;
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
`;
