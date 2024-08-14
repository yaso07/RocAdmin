import { useFormik } from "formik";
import { eventSchema } from "../utils/validation";
import { formDataType } from "../types/event";
import { useEffect, useRef } from "react";
import {
  createEvent,
  getEventList,
  updateEvent,
} from "../api/EventSlice/eventThunk";
import { useDispatch, useSelector } from "react-redux";
import "../App.css";
import EventDataShow from "./EventDataShow";

interface Props {
  isOpen: any;
  setIsDrawerOpen: any;
  setDrawerType: any;
  drawerType: string;
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setFieldValue, resetForm } = useFormik({
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

        setFieldValue(
          "header_image_data",
          SingleEventData?.acf?.header_image_data
        );
      }
    } else {
      resetForm();

      // Reset the input field
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the input element
      }
    }
  }, [SingleEventData, drawerType]);

  // ====================================== Image upload URL =====================================================

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

  const toggleDrawer = (name: string) => {
    setIsDrawerOpen(false);

    setDrawerType(name);

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
          {/* <button
            type="button"
            onClick={submitData}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md transform transition-transform duration-150 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:bg-blue-700 active:scale-95"
          >
            {loading ? "loading..." : drawerType === "add" ? "Save" : "Update"}
          </button> */}
        </div>
        <hr />
        {/* <div style={{ display: "flex",alignItems:"center",gap:10,marginTop:10,marginBottom:20 }}>
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
        </div> */}
        {/* {selectedOption === "option1" && <EventDataShow />}
        {selectedOption === "option2" && <ActivityDataShow />} */}
        <EventDataShow />
      </div>
    </div>
  );
};

export default Drawer;
