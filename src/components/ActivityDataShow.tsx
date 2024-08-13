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



const ActivityDataCreate = ({ setIsDrawerOpen, drawerType }: Props) => {

  const dataById = useSelector((state: any) => state.event.singleEventData)
  const dispatch = useDispatch();

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


  const [timeState, setTimeState] = useState<TimeState>({});
  const [show, setShow] = useState(false);

  const [selectedCode, setSelectedCode] = useState("");
  const [selectedActivity, setSelectedActivity] = useState({
    label: "",
    value: "",
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
  const [file, setFile] = useState();
  const [location, setLocation] = useState<any>({
    latitude: "",
    longitude: "",
  });


  useEffect(() => {
    if (drawerType === "Edit") {
      if (dataById?.acf?.title) {
        formData.DescriptionTitle = dataById?.acf?.title,
          formData.introDescription = dataById?.acf?.short_description,
          formData.moreInformation = dataById?.acf?.long_description,
          formData.priceFrom = dataById?.acf?.from_price, // not getting key from backend
          formData.priceTo = dataById?.acf?.price_to,
          formData.DisplayName = dataById?.acf?.display_name, // not getting key from backend
          formData.EmailAddress = dataById?.acf?.email_address,
          formData.Prefix = dataById?.acf?.telephone_number?.prefix,
          formData.Telephone = dataById?.acf?.telephone_number?.number,
          formData.Website = dataById?.acf?.website,
          formData.PlaceName = dataById?.acf?.address?.place_name,
          formData.AddressLine = dataById?.acf?.address?.address_line_1,
          formData.AddressLineOptional = dataById?.acf?.address?.address_line_2,
          formData.Postcode = dataById?.acf?.address?.postcode,
          formData.Facebook = dataById?.acf?.social_media.facebook,
          formData.Instagram = dataById?.acf?.social_media.instagram,
          formData.Twitter = dataById?.acf?.social_media.twitter,
          formData.AdditionalInfo = dataById?.acf?.accessibility_additional_info, // not getting key from backend
          formData.AccessibilityURL = dataById?.acf?.accessibility_url // not getting key from backend
        setFormData({ ...formData })
        setSelectedActivity({ label: dataById?.acf?.type?.label, value: dataById?.acf?.type?.value });
        const weekDay: any = []
        for (const key in dataById?.acf?.opening_hours) {
          if (dataById?.acf?.opening_hours.hasOwnProperty(key)) {
            if (dataById?.acf?.opening_hours[key].is_open == 1) {
              weekDay.push({ value: key })
            }
          }
        }

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
        setTimeState({ ...dataById?.acf?.opening_hours })
        setSelectedOption({ label: dataById?.acf?.parish?.label, value: dataById?.acf?.parish?.value });
        const image = dataById?.acf?.header_image_data !== undefined ? JSON.parse(dataById?.acf?.header_image_data) : ""
        setFile(image[0].url)
      }
    } else {
      setFormData({
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
      setFile(undefined);
      setSelectedOption({ label: "", value: "" });
    }

  }, [dataById?.acf?.title, drawerType])




  const handleCheckboxChange = (
    category: string,
    value: string,
    checked: boolean
  ) => {
    console.log(category)
    setSelectedItems((prevState: any) => {
      const newWeekDays = checked
        ? [...prevState.WeekDays, { value }]
        : prevState.WeekDays.filter((item: any) => item.value !== value);
      return { ...prevState, WeekDays: newWeekDays };
    });

    setTimeState((prevState: any) => {
      return {
        ...prevState,
        [value]: {
          is_open: checked ? "1" : "0",
        },
      };
    });
  };

  const handleTimeChangehour =
    (day: string, type: "opens" | "closes") => (time: string) => {
      setTimeState((prevState) => ({
        ...prevState,
        [day]: {
          ...prevState[day],
          [type]: time,
        },
      }));
    };



  const handleTextFieldChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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
  };



  const handleChangeCode = (event: any) => {
    setSelectedCode(event.target.value);
  };





  const handleChangeRadioActivity = (event: any) => {
    const selectedItem = TypeActivityData.find(
      (item) => item.value === event.target.value
    );
    const selectedLabel = selectedItem ? selectedItem.label : ""; // Default to an empty string if undefined
    setSelectedActivity({ label: selectedLabel, value: event.target.value });
  };


  const subTypeActivity =
    selectedActivity?.label == "Outdoor activities"
      ? typesData
      : IndoretypesData;
  const subTypeAct =
    selectedActivity?.label == "Outdoor activities"
      ? "subTypeOutdoor"
      : "subTypeIutdoor";


  async function handleChange(e: any) {
    const file = e.target.files?.[0];
    const url = import.meta.env.VITE_REACT_APP_API_UPLOAD_IMAGE;
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post(url, formData);

      setFile(res?.data);
      //  setFile(URL.createObjectURL(e.target.files[0]) as any);
    }
  }





  const handleChangeRadio = (event: any) => {
    const selectedItem = ParishData.find(
      (item) => item.value === event.target.value
    );
    const selectedLabel = selectedItem ? selectedItem.label : ""; // Default to an empty string if undefined
    setSelectedOption({ label: selectedLabel, value: event.target.value });
  };


  const subTypeValue =
    selectedActivity?.label === "Indoor activities"
      ? selectedItems?.subTypeIutdoor
      : selectedItems?.subTypeOutdoor;

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
  };

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



  const submitFormikFunction = () => {
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
        title: formData.DescriptionTitle,
        short_description: formData.introDescription,
        long_description: formData.moreInformation,
        sub_type: subTypeValue,
        type: selectedActivity,
        location: eventLocationArray,
        key_facilities: keyFeature,
        url: file,
        from_price: formData.priceFrom,
        price_to: formData.priceTo,
        booking_information: BookingEvent,
        display_name: formData.DisplayName,
        email_address: formData.EmailAddress,
        map_location: { lat: +location.latitude, lng: +location.longitude },
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
        parish: selectedOption,
        seasonality: seasonalityArray,
        bus_routes: busRouteArray,
        opening_hours: updateOpenHours(timeState),
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
      type: "activities",
      manual: true,
    };
    
    if (drawerType === "Edit") {
      const obj = { finalObject, setIsDrawerOpen, id: dataById?._id };

      dispatch(updateActivity(obj) as any);
      dispatch(getActivityList() as any)
    } else {
      const obj = { finalObject, setIsDrawerOpen };
      dispatch(createActivity(obj) as any);
      dispatch(getActivityList() as any)
    }
    setFormData({
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
    setFile(undefined);
    setSelectedOption({ label: "", value: "" });
  };

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
                        name="location"
                        value={item.value}
                        onChange={handleChangeRadioActivity}
                        checked={selectedActivity.value === item.value}
                        style={{ marginRight: 10 }}
                      />
                      <label>{item.label}</label>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 20 }}>
                <TitleText>SubType *</TitleText>
                <div className="checkboxContainer">
                  {subTypeActivity?.map((item: any, index) => {

                    return (
                      <div style={{ marginBottom: 10 }} key={index}>

                        <Checkbox
                          title={item.title}
                          value={item.value}
                          isChecked={subTypeValue.some(
                            (items) => items.value === item.value
                          )}
                          onCheckboxChange={(value, checked) =>
                            handleCheckboxChange2(
                              subTypeAct,
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
                            handleCheckboxChange2(
                              "Location",
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
                              checked,
                              item.title
                            )
                          }
                        />
                      </div>
                    );
                  })}
                </div>
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
                      type="number"
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
                          handleCheckboxChange2(
                            "Booking",
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
                  <h6 style={{ fontWeight: "normal", marginBottom: 20 }}>
                    Area Code
                  </h6>
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
                  <h6 style={{ fontWeight: "normal", marginBottom: 20 }}>
                    Prefix
                  </h6>
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
                  <h6 style={{ fontWeight: "normal", marginBottom: 20 }}>
                    Telephone
                  </h6>
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
                <TitleTextMain>
                  Search for your address or click on the map to manually place
                  a marker.
                </TitleTextMain>
                <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
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
                          handleCheckboxChange2(
                            "Seasonality",
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
              <TitleText style={{ marginTop: 20 }}>Bus routes *</TitleText>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
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
                          isChecked={selectedItems.BusRoutes.some(
                            (items) => items.value === item.value
                          )}
                          onCheckboxChange={(value, checked) =>
                            handleCheckboxChange2(
                              "BusRoutes",
                              value,
                              checked,
                              item.title
                            )
                          }
                        />
                      )}

                      <p style={{ marginLeft: 20 }}>{italicText}</p>
                    </div>
                  );
                })}
              </div>
              <TitleText style={{ marginTop: 10 }}>Opening hours</TitleText>
              <TitleTextMain>
                If you are open all day,please leave the startend date blank
              </TitleTextMain>
              {WeeklyDaysData.map((item, index) => {
                // console.log("kdkdddkdkdkd", item, selectedItems?.WeekDays)
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
                        title={item.title}
                        value={item.value}
                        isChecked={selectedItems.Accessibility.some(
                          (items) => items.value === item.value
                        )}
                        onCheckboxChange={(value, checked) =>
                          handleCheckboxChange2(
                            "Accessibility",
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
                  marginTop: 20,
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
      <ButtonSubmit onClick={submitFormikFunction}>Submit</ButtonSubmit>
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
  padding: 10px;
  background-color: #2271b1;
  color: #fff;
  margin-top: 20px;
  border-radius: 5px;
`;
