import { useFormik } from "formik";
import { eventSchema } from "../utils/validation";
import { formDataType } from "../types/event";
import EventField from "../ui/eventFormField";
import DateTimePicker from "./datePiker";
import fallback from "../assets/fallbackimage.png";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import TagField from "./tagField";
import Textarea from "./Textarea";
import { createEvent, updateEvent } from "../api/EventSlice/eventThunk";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import Dropdown from "./dropdown";

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
        console.log("bydkldskdlkslkd", drawerType);
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

  const handleSelect = (id: string) => {
    setParishName({ value: id, label: id });
  };

  // ==================================== POST FINAL EVENT DATA ====================================================
  const submitFormikFunction = () => {
    const keyFeature: TransformedType[] = feature.map((item) => ({
      label: item.id,
      value: item.text,
    }));
    const eventTypeArray: TransformedType[] = eventType.map((item) => ({
      label: item.id,
      value: item.text,
    }));
    const busRouteArray: TransformedType[] = busRoute.map((item) => ({
      label: item.id,
      value: item.text,
    }));
    const accessibilityArray: TransformedType[] = accessibility.map(
      (item: any) => ({
        label: item.id,
        value: item.text,
      })
    );
    const seasonalityArray: TransformedType[] = opningTime.map((item) => ({
      label: item.id,
      value: item.text,
    }));
    const dateTimeArray: any[] = dateTimes.map((item) => ({
      date: moment(item.date).format("YYYYMMDD"),
      start_time: item.start_time,
      end_time: item.end_time,
    }));

    const finalObject = {
      acf: {
        title: values.title,
        type: eventTypeArray,
        header_image_data: values.header_image_data,
        // header_image_data: "[{\"url\":\"https://cdn.jersey.com/image/upload/v1715339820/Listings/8645486459_seaside-treasure.jpg\",\"public_id\":\"Listings/8645486459_seaside-treasure\",\"alt_text\":\"\",\"original_filename\":\"Seaside-Treasure\"}]",
        event_dates: dateTimeArray,
        email_address: values.email_address,
        website: values.website,
        address: {
          place_name: values.place_name,
          address_line_1: values.address_line_1,
          address_line_2: values.address_line_2,
          postcode: values.postcode,
        },
        telephone_number: {
          area_code: "",
          prefix: "0",
          number: "",
          formatted: values.phoneNumber,
        },
        parish: parishName,
        map_location_lat: values.lat,
        map_location_lng: values.lng,
        short_description: values.short_description,
        key_facilities: keyFeature,
        accessibility: accessibilityArray,
        bus_routes: busRouteArray,
        seasonality: seasonalityArray,
        from_price: values.from_price,
        price_to: values.price_to,
        event_dates_start: dateTimeArray.length
          ? moment(dateTimeArray[0].date).format("DD/MM/YYYY")
          : "",
        event_dates_end: dateTimeArray.length
          ? moment(dateTimeArray[dateTimeArray.length - 1].date).format(
              "DD/MM/YYYY"
            )
          : "",
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
      // dispatch(getEventList() as any)
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
      } duration-1000 overflow-y-auto max-h-[100dvh] hide-scrollbar`}>
      <div className="p-4">
        <div className="flex gap-10 flex-wrap w-full justify-between mb-2">
          <button onClick={() => toggleDrawer("close")} className="text-black">
            Close
          </button>
          <button
            type="button"
            onClick={submitData}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md transform transition-transform duration-150 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:bg-blue-700 active:scale-95">
            {loading ? "loading..." : drawerType === "add" ? "Save" : "Update"}
          </button>
        </div>
        <hr />
        <form className="mt-2">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Image Upload</h1>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-4"
              ref={fileInputRef}
            />

            {loader ? (
              <div className="w-[150px] max-w-sm h-[150px] flex justify-center items-center bg-slate-300">
                <div className="">Loading...</div>
              </div>
            ) : (
              <>
                {selectedImage && (
                  <div>
                    <img
                      src={(selectedImage ? selectedImage : fallback) as string}
                      alt="Uploaded"
                      className="w-[150px] max-w-sm h-[150px]"
                    />
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex gap-10 flex-wrap w-full">
            <EventField
              className="border border-gray-200 mt-2"
              label="Title"
              name="title"
              type="text"
              value={values.title}
              handleChange={handleChange}
              handleBlur={handleBlur}
              error={errors.title}
              touch={touched.title && errors.title}
            />

            <EventField
              className="border border-gray-200 mt-2"
              label="Phone number"
              name="phoneNumber"
              type="text"
              value={values.phoneNumber}
              handleChange={handleChange}
              handleBlur={handleBlur}
              error={errors.phoneNumber}
              touch={touched.phoneNumber && errors.phoneNumber}
            />
          </div>
          <div className="flex gap-10 flex-wrap w-full">
            <EventField
              className="border border-gray-200 mt-2"
              label="Email"
              name="email_address"
              type="email"
              value={values.email_address}
              handleChange={handleChange}
              handleBlur={handleBlur}
              error={errors.email_address}
              touch={touched.email_address && errors.email_address}
            />
            <EventField
              className="border border-gray-200 mt-2"
              label="Website"
              name="website"
              type="text"
              value={values.website}
              handleChange={handleChange}
              handleBlur={handleBlur}
              error={errors.website}
              touch={touched.website && errors.website}
            />
          </div>
          <div className="mb-4 w-full">
            <h1 className="text-2xl font-bold mt-2 ">Address Form</h1>
            <div className="flex gap-10 flex-wrap w-full">
              <EventField
                className="border border-gray-200 mt-2"
                label="Place Name"
                type="text"
                id="place_name"
                name="place_name"
                value={values.place_name}
                handleChange={handleChange}
                handleBlur={handleBlur}
                error={errors.place_name}
                touch={touched.place_name && errors.place_name}
              />

              <EventField
                className="border border-gray-200 mt-2"
                label="Address Line 1"
                type="text"
                id="address_line_1"
                name="address_line_1"
                value={values.address_line_1}
                handleChange={handleChange}
                handleBlur={handleBlur}
                error={errors.address_line_1}
                touch={touched.address_line_1 && errors.address_line_1}
              />
            </div>
            <div className="flex gap-10 flex-wrap w-full">
              <EventField
                className="border border-gray-200  mt-2"
                label="Address Line 2"
                type="text"
                id="address_line_2"
                name="address_line_2"
                value={values.address_line_2}
                handleChange={handleChange}
                handleBlur={handleBlur}
                error={errors.address_line_2}
                touch={touched.address_line_2 && errors.address_line_2}
              />

              <EventField
                className="border border-gray-200 mt-2"
                label="Postcode"
                type="text"
                id="postcode"
                name="postcode"
                value={values.postcode}
                handleChange={handleChange}
                handleBlur={handleBlur}
                error={errors.postcode}
                touch={touched.postcode && errors.postcode}
              />
            </div>
          </div>
          <div className="mb-4 w-full">
            <h1 className="text-2xl font-bold mt-2 ">Direction LatLng</h1>
            <div className="flex gap-10 flex-wrap w-full">
              <EventField
                className="border border-gray-200 mt-2"
                label="Latitude"
                type="text"
                id="lat"
                name="lat"
                value={values.lat}
                handleChange={handleChange}
                handleBlur={handleBlur}
                error={errors.lat}
                touch={touched.lat && errors.lat}
              />

              <EventField
                className="border border-gray-200 mt-2"
                label="Longitude"
                type="text"
                id="lng"
                name="lng"
                value={values.lng}
                handleChange={handleChange}
                handleBlur={handleBlur}
                error={errors.lng}
                touch={touched.lng && errors.lng}
              />
            </div>
          </div>
          <div className="mb-4 w-full">
            <h1 className="text-2xl font-bold mt-2 ">Event Price</h1>
            <div className="flex gap-10 flex-wrap w-full">
              <EventField
                className="border border-gray-200 mt-2"
                label="Min price"
                type="text"
                id="from_price"
                name="from_price"
                value={values.from_price}
                handleChange={handleChange}
                handleBlur={handleBlur}
                error={errors.from_price}
                touch={touched.from_price && errors.from_price}
              />

              <EventField
                className="border border-gray-200 mt-2"
                label="Max price"
                type="text"
                id="price_to"
                name="price_to"
                value={values.price_to}
                handleChange={handleChange}
                handleBlur={handleBlur}
                error={errors.price_to}
                touch={touched.price_to && errors.price_to}
              />
            </div>
          </div>
          <div className="flex gap-10 flex-wrap w-full">
            <Textarea
              handleChange={handleChange}
              short_description={values.short_description}
              error={errors.short_description}
              touch={touched.short_description && errors.short_description}
              setFieldValue={setFieldValue}
              title={"Description"}
            />
          </div>
          <div className=" mb-4 w-full">
            <h1 className="text-2xl font-bold mb-2">Parish</h1>
            <Dropdown onSelect={handleSelect} />
          </div>
          <div className=" mb-4 w-full">
            <h1 className="text-2xl font-bold mb-2">Type</h1>
            <div className="flex gap-10 flex-wrap w-full">
              <TagField
                tags={eventType}
                setTags={setEventType}
                placeholder="Enter event type tags"
              />
            </div>
          </div>
          <div className=" mb-4 w-full">
            <h1 className="text-2xl font-bold mb-2">Key Features</h1>
            <div className="flex gap-10 flex-wrap w-full">
              <TagField
                tags={feature}
                setTags={setFeature}
                placeholder="Enter key feature tags"
              />
            </div>
          </div>
          <div className=" mb-4 w-full">
            <h1 className="text-2xl font-bold mb-2">Accessibility</h1>
            <div className="flex gap-10 flex-wrap w-full">
              <TagField
                tags={accessibility}
                setTags={setAccessibility}
                placeholder="Enter accessibility tags"
              />
            </div>
          </div>
          <div className=" mb-4 w-full">
            <h1 className="text-2xl font-bold mb-2">Bus Route</h1>
            <div className="flex gap-10 flex-wrap w-full">
              <TagField
                tags={busRoute}
                setTags={setBusRoute}
                placeholder="Enter bus route tags"
              />
            </div>
          </div>
          <div className=" mb-4 w-full">
            <h1 className="text-2xl font-bold mb-2">Opning</h1>
            <div className="flex gap-10 flex-wrap w-full">
              <TagField
                tags={opningTime}
                setTags={setOpningTime}
                placeholder="Enter opning time tags"
              />
            </div>
          </div>
          <DateTimePicker
            {...{ dateTimes, setDateTimes, showDateTime, setShowDateTime }}
          />
        </form>
      </div>
    </div>
  );
};

export default Drawer;
