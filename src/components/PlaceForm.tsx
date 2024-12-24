import Accordion from "../components/Accordion/Accordion";
import { useState, useEffect } from "react";
import { createPlace, updatePlace } from "../api/EventSlice/eventThunk";
import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
import ReusableInput from "./InputBox/ReusableInput";
import TextField from "./InputBox/TextField";
import Checkbox from "./InputBox/Checkbox";
import "../App.css";
import InputBoxWithImage from "./InputBox/InputBoxWithImage";
import styled from "styled-components";
import TimePicker from "./DateAndTimePicker/TimePicker";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    countryCodes,
    ParishData,
    WeeklyDaysData,
} from "../utils/data";
import { convertHours, updateOpenHours } from "../utils/commanFun";
import { FinalObject, Props, SelectedHours, TimeState } from "../utils/interface";
import { useFormik } from "formik";
import { PlaceInitialFormValues, placeSchema } from "../utils/validation";
import moment from "moment";
import TagField from "../ui/TagField";
// import DynamicInput from "./dynamicInput";
// import { formDataType } from "../types/event";
// import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
// import axios from "axios";
import DynamicInput from "./dynamicInput";



const PlaceForm = ({ setIsDrawerOpen, drawerType }: Props) => {

    const dataById = useSelector((state: any) => state.event.singleEventData)
    const isLoading = useSelector((state: any) => state.event.isLoading)
    const dispatch = useDispatch();

    const currentTime = moment(new Date()).format("HH:mm");
    const newTime = moment(currentTime, "HH:mm").add(2, 'hours').format("HH:mm");
    const [timeState, setTimeState] = useState<TimeState>({});
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    // const [show, setShow] = useState(false);
    // const [loading, setLoading] = useState(false)
    // const [file, setFile] = useState<File[]>([]);

    // const [selectedCode, setSelectedCode] = useState("+1");

    const [selectedOption, setSelectedOption] = useState({
        label: "",
        value: "",
    });
    const [selectedItems, setSelectedItems] = useState<SelectedHours>({
        WeekDays: [],
    });
    const [location, setLocation] = useState<any>({
        latitude: "",
        longitude: "",
    });

    const [imageInput, setImageInput] = useState<string[]>([""])



    const { handleChange, handleSubmit, setFieldValue, handleBlur, resetForm, values, errors, touched } = useFormik({
        initialValues: PlaceInitialFormValues,
        validationSchema: placeSchema,
        onSubmit: () => finalActivitySubmition(),
    });




    useEffect(() => {
        if (drawerType === "Edit") {
            if (JSON.stringify(dataById)) {
                setFieldValue("introDescription", dataById?.editorial_summary?.overview);
                setFieldValue("DisplayName", dataById?.name);
                setFieldValue("EmailAddress", dataById?.email ?? "");
                // setFieldValue("Prefix", dataById?.acf?.telephone_number?.prefix);
                // setFieldValue("areaCode", dataById?.acf?.telephone_number?.area_code);
                // setFieldValue("Telephone", dataById?.acf?.telephone_number?.number);
                setFieldValue("areaCode", dataById?.international_phone_number ? +dataById?.international_phone_number.split(" ")[0] : "");
                setFieldValue("Prefix", dataById?.international_phone_number ? +dataById?.international_phone_number.split(" ")[1] : "");
                setFieldValue("Telephone", dataById?.international_phone_number ? +dataById?.international_phone_number.split(" ")[2] : "");
                setFieldValue("Website", dataById?.website ?? "");
                setFieldValue("PlaceName", dataById?.address?.place_name);
                setFieldValue("AddressLine", dataById?.address?.address_line_1);
                setFieldValue("AddressLineOptional", dataById?.address?.address_line_2);
                setFieldValue("Postcode", dataById?.address?.postcode);
                if (dataById?.current_opening_hours?.weekday_text) {
                    const openDays = dataById?.current_opening_hours?.weekday_text
                        .filter((day: any) => !day.includes("Closed")) // Filter out closed days
                        .map((day: any) => ({ value: day.split(": ")[0] }))

                    setFieldValue("WeekDays", openDays)
                    setSelectedItems({
                        ...selectedItems,
                        WeekDays: openDays,
                    })

                    setTimeState({ ...convertHours(dataById?.current_opening_hours?.weekday_text) })
                }
                location.latitude = dataById?.geometry?.location.lat,
                    location.longitude = dataById?.geometry?.location.lng
                setLocation({ ...location })
                setFieldValue("latitude", dataById?.geometry?.location.lat)
                setFieldValue("longitude", dataById?.geometry?.location.lng)
                setFieldValue("tags", dataById?.types)
                setSelectedOption({ label: dataById?.parish, value: dataById?.parish });
                setFieldValue("Parish", dataById?.parish)
                const imageURL = dataById?.photoUrl ? dataById?.photoUrl :[]
                setFieldValue("imageUrl", imageURL)
                setImageInput(imageURL)
            }
        } else if (drawerType === "add" || drawerType === "close") {
            setTimeState({});
            selectedItems.WeekDays = []
            setSelectedItems({ ...selectedItems });
            setLocation({ latitude: "", longitude: "" });
            setSelectedOption({ label: "", value: "" });
            setImageInput([""])
            resetForm()
        }

    }, [JSON.stringify(dataById), drawerType])





    const handleCheckboxChange = (category: string, value: string, checked: boolean) => {
        setSelectedItems((prevState: any) => {
            const newWeekDays = checked
                ? [...prevState.WeekDays, { value }]
                : prevState.WeekDays.filter((item: any) => item.value !== value);
            return { ...prevState, WeekDays: newWeekDays };
        });
        if (checked) {
            setFieldValue(category, [...values.WeekDays, { value }])
        } else {
            setFieldValue(category, values.WeekDays.filter((item: any) => item.value !== value))
        }
        setTimeState((prevState: any) => {
            return {
                ...prevState,
                [value]: {
                    is_open: checked ? "1" : "0",
                    opens: checked ? currentTime : "",
                    closes: checked ? newTime : ""
                },
            };
        });
    };

    const handleTimeChangehour = (day: string, type: "opens" | "closes") => (time: string) => {
        setTimeState((prevState) => ({...prevState,
            [day]: {
                ...prevState[day],
                [type]: time,
            },
        }));
    };





    const onchangelocation = (e: any) => {
        const { name, value } = e.target;
        setLocation((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));
        setFieldValue(name, value)
    };



    const handleChangeCode = (event: any) => {
        setFieldValue("areaCode", event.target.value)
    };




    // async function handleFileChange(e: any) {
    //     const file = e.target.files?.[0];
    //     const url = import.meta.env.VITE_REACT_APP_API_UPLOAD_IMAGE;
    //     if (file) {
    //         const formData = new FormData();
    //         formData.append("image", file);
    //         try {
    //             setLoading(true)
    //             const res = await axios.post(url, formData);
    //             if (res?.status === 200) {
    //                 setLoading(false)
    //                 setFile(res?.data);
    //                 setFieldValue("file", res?.data)
    //             } else {
    //                 setLoading(false)
    //                 setFile("");
    //                 setFieldValue("file", "")
    //             }
    //         } catch (error) {
    //             setLoading(false)
    //         }
    //         //  setFile(URL.createObjectURL(e.target.files[0]) as any);
    //     }
    // }





    const handleChangeRadio = (event: any) => {
        const selectedItem = ParishData.find(
            (item) => item.value === event.target.value
        );
        const selectedLabel = selectedItem ? selectedItem.label : ""; // Default to an empty string if undefined
        setSelectedOption({ label: selectedLabel, value: event.target.value });
        setFieldValue("Parish", event.target.value)
    };




    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);

    // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     if (event.target.files) {
    //         const newFiles = Array.from(event.target.files);
    //         if (file.length + newFiles.length <= 8) {
    //             setFile([...file, ...newFiles]);
    //         } else {
    //             alert('You can only upload up to 8 images.');
    //         }
    //     }
    // };

    // const removeFile = (index: number) => {
    //     const updatedFiles = file.filter((_, i) => i !== index);
    //     setFile(updatedFiles);
    // };





    const submitFormikFunction = (e: any) => {
        e.preventDefault();
        handleSubmit()
    };


    const finalActivitySubmition = () => {
        const imageURL = values.imageUrl.map(item => ({ url: item }))

        const finalObject: FinalObject = {
            acf: {
                short_description: values.introDescription,
                header_image_data: JSON.stringify(imageURL),
                // header_image_data: "[{\"url\":\"https://storage.googleapis.com/roc-app-425011.appspot.com//Events/photo/festive activitiesz.jpeg\"},{\"url\":\"https://storage.googleapis.com/roc-app-425011.appspot.com//Events/photo/festive activitiesz.jpeg\"}]",
                title: values.DisplayName,
                types: values.tags,
                // display_name: values.DisplayName,
                email_address: values.EmailAddress,
                map_location: { lat: +location.latitude, lng: +location.longitude },
                telephone_number: {
                    area_code: values.Telephone ? values.areaCode : "",
                    prefix: values.Telephone ? values.Prefix : "",
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
                opening_hours: values.WeekDays.length ? updateOpenHours(timeState) : {},
            },
            // data_type: "jersey",
            // type: "Place",
            // manual: true,
        };
        // console.log("timesss-----", finalObject, timeState)
        // return
        if (drawerType === "Edit") {
            const obj = { finalObject, setIsDrawerOpen, id: dataById?._id };
            dispatch(updatePlace(obj) as any);
            resetForm()
            setSelectedItems({ WeekDays: [] });
            setTimeState({});
            setLocation({ latitude: "", longitude: "" });
            setSelectedOption({ label: "", value: "" });
            setImageInput([""])
        } else {
            const obj = { finalObject, setIsDrawerOpen };
            dispatch(createPlace(obj) as any);
            resetForm()
            setSelectedItems({ WeekDays: [] });
            setTimeState({});
            setLocation({ latitude: "", longitude: "" });
            setSelectedOption({ label: "", value: "" });
            setImageInput([""])
        }

    }


    return (
        <div>

            <Accordion
                title="Contact"
                content={
                    <>
                        <div>
                            <ReusableInput
                                title="Name *"
                                name="DisplayName"
                                showCouter={false}
                                DescriptionTitle={values.DisplayName}
                                handleDescriptionTitle={handleChange}
                                error={errors.DisplayName}
                                touch={touched.DisplayName && errors.DisplayName}
                            />
                            <div style={{ margin: "20px 0px" }}>
                                <ReusableInput
                                    title="Email address"
                                    showCouter={false}
                                    name="EmailAddress"
                                    DescriptionTitle={values.EmailAddress}
                                    handleDescriptionTitle={handleChange}
                                    handleBlur={handleBlur}
                                    error={errors.EmailAddress}
                                    touch={touched.EmailAddress && errors.EmailAddress}
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
                                        id="areaCode"
                                        name="areaCode"
                                        value={`+${values.areaCode}`}
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
                            <TitleText>Website</TitleText>
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
                                                id={item?.value.toLowerCase()}
                                                name="location"
                                                value={item?.value}
                                                onChange={handleChangeRadio}
                                                checked={selectedOption?.value === item?.value}
                                                style={{ marginRight: 10 }}
                                            />
                                            <label htmlFor={item?.value.toLowerCase()}>{item?.label}</label>
                                        </div>
                                    );
                                })}
                            </div>
                            {(touched.Parish && errors.Parish) ? (
                                <div style={{ color: 'red' }}>{errors.Parish}</div>
                            ) : null}
                            <div>
                                <TitleText>Direction</TitleText>
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
                            <TitleText style={{ marginTop: 10 }}>Opening hours</TitleText>
                            <TitleTextMain>
                                If you are open all day, please leave the startend date blank
                            </TitleTextMain>
                            {WeeklyDaysData.map((item, index) => {
                                const isChecked = selectedItems?.WeekDays.some((weekday) => weekday?.value === item?.value );
                                return (
                                    <div
                                        style={{ marginBottom: 10, display: "grid", alignItems: "center", gap: 20, gridTemplateColumns: "1fr 3fr" }}
                                        key={index}
                                    >
                                        <Checkbox
                                            title={item?.title}
                                            value={item?.value}
                                            isChecked={isChecked}
                                            onCheckboxChange={(value, checked) => handleCheckboxChange("WeekDays", value, checked) }
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
                        </div>
                    </>
                }
            />
            <Accordion
                title="Description"
                content={
                    <>
                        <div className="flex flex-col gap-4">
                            <TextField
                                title="Description *"
                                description="This will be used for the What’s On printed guide. It will also be used on the website where a short, preview piece of copy may be required to introduce your listing."
                                maxLength="350"
                                name="introDescription"
                                value={values.introDescription}
                                onchange={handleChange}
                                handleBlur={handleBlur}
                                error={errors.introDescription}
                                touch={touched.introDescription && errors.introDescription}
                            />
                            <div className="mb-2 relative">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Tags *
                                    <span
                                        className="cursor-pointer text-blue-600"
                                        onMouseEnter={() => setIsPopupVisible(true)}
                                        onMouseLeave={() => setIsPopupVisible(false)}
                                    >
                                        {/* Popup */}
                                        {isPopupVisible && (
                                            <div className="absolute z-10 w-48 p-2 mt-1 text-sm text-white bg-gray-800 rounded shadow-lg">
                                                Please press the Enter key after filling in the input to
                                                create a tag.
                                            </div>
                                        )}
                                        ℹ️
                                    </span>
                                </label>
                                <TagField
                                    tags={values.tags}
                                    placeholder="Enter tags"
                                    error={errors.tags}
                                    touch={touched.tags}
                                    value={setFieldValue}
                                    handleBlur={handleBlur}
                                />
                            </div>
                        </div>
                    </>
                }
            />


            <Accordion
                title="Media"
                content={
                    <>
                        <TitleText>Image Url *</TitleText>
                        <DynamicInput
                            {...{ imageInput, setImageInput, setFieldValue }}
                            imageValue={values.imageUrl}
                            error={errors.imageUrl}
                            touch={touched.imageUrl && errors.imageUrl}
                        />
                    </>
                    // <>
                    //     <div>
                    //         <p
                    //             style={{
                    //                 fontSize: 17,
                    //                 fontWeight: "600",
                    //                 margin: "20px 0px",
                    //             }}
                    //         >
                    //             Images
                    //         </p>
                    //         <ImageInfoText>
                    //             Images play a key role in inspiring visitors. Where possible,
                    //             listings should show the visitor experience and include people.
                    //         </ImageInfoText>
                    //         <ImageInfoText>
                    //             For your images to be approved, ensure they are high quality /
                    //             professionally shot and showcase the relevant subject matter.
                    //             Find out more about selecting high-quality images{" "}
                    //             <span>here</span>.
                    //         </ImageInfoText>
                    //         <ImageInfoText>
                    //             Image resolution should be at least 1024px x 683px but we
                    //             recommend uploading a higher resolution image where possible.
                    //             When in doubt, a bigger photo is better.
                    //         </ImageInfoText>
                    //         <ImageInfoText>
                    //             If your images are too large to upload (greater than 8MB) then
                    //             you can reduce the filesize <span>here</span>.
                    //         </ImageInfoText>
                    //         <ImageInfoText>
                    //             Images uploaded to the Portal may be used to promote your
                    //             business via Visit Jersey’s wider channels.
                    //         </ImageInfoText>
                    //         <div>
                    //             <div
                    //                 style={{
                    //                     fontSize: 17,
                    //                     fontWeight: "600",
                    //                     margin: "20px 0px",
                    //                 }}
                    //             >
                    //                 Header image *
                    //             </div>
                    //             <div
                    //                 style={{
                    //                     borderTop: "1px solid #ccc",
                    //                     borderLeft: "1px solid #ccc",
                    //                     borderRight: "1px solid #ccc",
                    //                     height: 300,
                    //                     marginTop: 20,
                    //                 }}
                    //             >
                    //                 {" "}
                    //                 <img
                    //                     src={file}
                    //                     style={{ width: 100, marginTop: 20, marginLeft: 20 }}
                    //                 />
                    //             </div>
                    //             <div
                    //                 style={{
                    //                     border: "1px solid #ccc",
                    //                     display: "flex",
                    //                     justifyContent: "space-between",
                    //                     alignItems: "center",
                    //                     padding: 10,
                    //                 }}
                    //             >
                    //                 <ButtonText onClick={handleShow}>Add Image</ButtonText>
                    //                 <MaximumImageValue>
                    //                     Maximum number of images:{" "}
                    //                     <span style={{ fontWeight: "bold", color: "#000" }}>1</span>
                    //                 </MaximumImageValue>
                    //             </div>
                    //         </div>
                    //         {errors.file && touched.file ? (
                    //             <div style={{ color: 'red' }}>{errors.file}</div>
                    //         ) : null}
                    //     </div>
                    //     <Modal
                    //         show={show}
                    //         onHide={handleClose}
                    //         animation={false}
                    //         size="xl"
                    //         aria-labelledby="contained-modal-title-vcenter"
                    //         centered
                    //     >
                    //         <Modal.Header closeButton>
                    //             <Modal.Title>Add Image to Gallery</Modal.Title>
                    //         </Modal.Header>
                    //         <div
                    //             style={{
                    //                 display: "flex",
                    //                 justifyContent: "center",
                    //                 alignItems: "center",
                    //                 height: "50vh",
                    //             }}
                    //         >
                    //             <div className="image-upload">
                    //                 <input
                    //                     type="file"
                    //                     accept="image/*"
                    //                     multiple
                    //                     onChange={handleFileChange}
                    //                     className="file-input"
                    //                 />
                    //                 <div className="image-preview">
                    //                     {file.map((file, index) => (
                    //                         <Imagecontainer key={index}>
                    //                             <img width={'100px'} height={"120px"} src={URL.createObjectURL(file)} alt={`preview-${index}`} className="preview-image" />
                    //                             <RemoveIcon width={'100px'} height={"120px"} src={URL.createObjectURL(file)} alt={`preview-${index}`} className="preview-image" />
                    //                             {/* <Remove type="button" onClick={() => removeFile(index)} className="remove-button">
                    //                                 Remove
                    //                             </Remove> */}
                    //                         </Imagecontainer>
                    //                     ))}
                    //                 </div>
                    //             </div>
                    //         </div>
                    //         <Modal.Footer>
                    //             <SelectImage
                    //                 disabled={file ? false : true}
                    //                 style={{
                    //                     cursor: file ? "pointer" : "not-allowed",
                    //                 }}
                    //                 onClick={handleClose}
                    //             >
                    //                 Select
                    //             </SelectImage>
                    //         </Modal.Footer>
                    //     </Modal>
                    // </>
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

export default PlaceForm;


// const ButtonText = styled.div`
//   font-size: 13px;
//   font-weight: 600;
//   border: 2px solid #4965a7;
//   color: #4965a7;
//   padding: 5px 20px;
//   cursor: pointer;
// `;


// const MaximumImageValue = styled.p`
//   font-size: 13px;
//   font-weight: 400;
//   color: #807b7b;
// `;

// const ImageInfoText = styled.div`
//   font-size: 14px;
//   margin-top: 20px;
// `;

// const SelectImage = styled.button`
//   color: #a7aaad;
//   background: #f6f7f7;
//   border-color: #dcdcde;
//   box-shadow: none;
//   text-shadow: none;
//   cursor: default;
//   padding: 6px 12px;
//   font-size: 12px;
// `;

// const DropImage = styled.p`
//   font-size: 20px;
//   line-height: 1.4;
//   font-weight: 400;
//   color: #333;
// `;

// const ButtonImage = styled.label`
//   font-size: 14px;
//   min-height: 46px;
//   line-height: 3.14285714;
//   padding: 0 36px;
//   color: #2271b1;
//   border-color: #2271b1;
//   background: #f6f7f7;
//   vertical-align: top;
//   cursor: pointer;
//   border-width: 1px;
//   border-style: solid;
//   -webkit-appearance: none;
//   border-radius: 3px;
//   white-space: nowrap;
//   box-sizing: border-box;
// `;



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


// const Imagecontainer = styled.div`
// display: flex;
// gap: 10px;
// margin-top: 5px;
// position: relative;
// `;

// const RemoveIcon = styled.button`
// position: absolute;
// `;