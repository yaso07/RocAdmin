// import { useFormik } from "formik";
// import { eventSchema } from "../utils/validation";
// import { formDataType } from "../types/event";
import EventField from "../ui/eventFormField";
import DateTimePicker from "./datePiker";



import { useState } from "react";
import TagField from "./tagField";
import Textarea from "./Textarea";


type TransformedType = {
    label: string;
    value: string;
};


interface Props {
    toggleDrawer: () => void;
    isOpen: any;
    setIsDrawerOpen: any;
}

interface DateTime {
    id: number;
    date: Date;
    time: string;
}

// const initialFormValues: formDataType = {
//     title: '',
//     subTitle: '',
//     date: '',
//     time: '',
//     email_address: '',
//     short_description: '',
//     website: '',
//     place_name: '',
//     address_line_1: '',
//     address_line_2: '',
//     postcode: '',
//     key_facilities: '',
//     accessibility: '',
//     bus_routes: '',
//     seasonality: '',
//     from_price: '',
// }

const Drawer = ({ isOpen, toggleDrawer, setIsDrawerOpen }: Props) => {
    const [feature, setFeature] = useState<Array<any>>([]);
    const [busRoute, setBusRoute] = useState<Array<any>>([]);
    const [opningTime, setOpningTime] = useState<Array<any>>([]);
    const [accessibility, setAccessibility] = useState<Array<any>>([]);
    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const [email_address, setEmail_Address] = useState("");
    const [website, setWebsite] = useState("");
    const [place_name, setPlace_Name] = useState("");
    const [address_line_1, setAddress_line_1] = useState("");
    const [address_line_2, setAddress_line_2] = useState("");
    const [postcode, setPostcode] = useState("");
    const [dateTimes, setDateTimes] = useState<DateTime[]>([]);
    const [showDateTime, setShowDateTime] = useState<DateTime[]>([])
    const [lat, setLat] = useState('')
    const [lng, setLng] = useState('')
    const [short_description, setShortDescription] = useState('');




    // const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null);


    // const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0];
    //     if (file) {
    //       const reader = new FileReader();
    //       reader.onloadend = () => {
    //         setSelectedImage(reader.result);
    //       };
    //       reader.readAsDataURL(file);
    //     }
    //   };





    const submitData = (e: any) => {
        e.preventDefault()
        const existingData: any[] = JSON.parse(localStorage.getItem("ela") || "[]");
        const keyFeature: TransformedType[] = feature.map(item => ({
            label: item.id,
            value: item.text,
        }));
        const busRouteArray: TransformedType[] = busRoute.map(item => ({
            label: item.id,
            value: item.text,
        }));
        const accessibilityArray: TransformedType[] = accessibility.map(item => ({
            label: item.id,
            value: item.text,
        }));
        const seasonalityArray: TransformedType[] = opningTime.map(item => ({
            label: item.id,
            value: item.text,
        }));
        const finalObject = {
            acf: {
                title: title,
                type: [{ value: subTitle, label: subTitle }],
                header_image_data: "[{\"url\":\"https://cdn.jersey.com/image/upload/v1715339820/Listings/8645486459_seaside-treasure.jpg\",\"public_id\":\"Listings/8645486459_seaside-treasure\",\"alt_text\":\"\",\"original_filename\":\"Seaside-Treasure\"}]",
                event_dates: dateTimes,
                email_address,
                website,
                address: {
                    place_name,
                    address_line_1,
                    address_line_2,
                    postcode
                },
                map_location_lat: lat,
                map_location_lng: lng,
                short_description,
                key_facilities: keyFeature,
                accessibility: accessibilityArray,
                bus_routes: busRouteArray,
                seasonality: seasonalityArray,
                from_price: "String",
            },
            data_type: "jersey",
            type: "events",
        }

        // Combine existing data with the new data
        const combinedData = [...existingData, finalObject];
        localStorage.setItem("ela", JSON.stringify(combinedData))
        setIsDrawerOpen(false)
        setFeature([])
        setBusRoute([])
        setDateTimes([])
        setAccessibility([])
        setOpningTime([])
        setTitle('')
        setSubTitle('')
        setEmail_Address('')
        setWebsite('')
        setPlace_Name('')
        setAddress_line_1('')
        setAddress_line_2('')
        setPostcode('')
        setLat('')
        setLng('')
        setShortDescription('')
    }











    return (
        <div className={`fixed inset-y-0 right-0 w-3/5 bg-white shadow-lg transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} duration-1000 overflow-y-auto max-h-[100dvh] hide-scrollbar`}>
            <div className="p-4">
                <div className="flex gap-10 flex-wrap w-full justify-between mb-2">
                    <button onClick={toggleDrawer} className="text-black">Close</button>
                    <button
                        type="button"
                        onClick={submitData}
                        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md transform transition-transform duration-150 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:bg-blue-700 active:scale-95">
                        Save
                    </button>
                </div>
                <hr />
                <form className="mt-2">
                    {/* <div className="container mx-auto p-4">
                        <h1 className="text-2xl font-bold mb-4">Image Upload</h1>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="mb-4"
                        />
                        {selectedImage && (
                            <div>
                                <img src={selectedImage as string} alt="Uploaded" className="w-[250px] max-w-sm" />
                            </div>
                        )}
                    </div> */}
                    <div className="flex gap-10 flex-wrap w-full">
                        <EventField
                            className="border border-gray-200 mt-2"
                            label="Title"
                            name="title"
                            type="text"
                            value={title}
                            handleChange={(e: any) => setTitle(e.target.value)}
                        />
                        <EventField
                            className="border border-gray-200 mt-2"
                            label="Type"
                            name="subTitle"
                            type="text"
                            value={subTitle}
                            handleChange={(e: any) => setSubTitle(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-10 flex-wrap w-full">
                        <EventField
                            className="border border-gray-200 mt-2"
                            label="Email"
                            name="email_address"
                            type="email"
                            value={email_address}
                            handleChange={(e: any) => setEmail_Address(e.target.value)}
                        />
                        <EventField
                            className="border border-gray-200 mt-2"
                            label="Website"
                            name="website"
                            type="text"
                            value={website}
                            handleChange={(e: any) => setWebsite(e.target.value)}
                        />
                    </div>
                    <div className="mb-4 w-full">
                        <h1 className="text-2xl font-bold mt-2 ">Address Form</h1>
                        <div className="flex gap-10 flex-wrap w-full">
                            <EventField className="border border-gray-200 mt-2"
                                label="Place Name"
                                type="text"
                                id="place_name"
                                name="place_name"
                                value={place_name}
                                handleChange={(e: any) => setPlace_Name(e.target.value)}
                            />

                            <EventField className="border border-gray-200 mt-2"
                                label="Address Line 1"
                                type="text"
                                id="address_line_1"
                                name="address_line_1"
                                value={address_line_1}
                                handleChange={(e: any) => setAddress_line_1(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-10 flex-wrap w-full">
                            <EventField className="border border-gray-200  mt-2"
                                label="Address Line 2"
                                type="text"
                                id="address_line_2"
                                name="address_line_2"
                                value={address_line_2}
                                handleChange={(e: any) => setAddress_line_2(e.target.value)}
                            />

                            <EventField
                                className="border border-gray-200 mt-2"
                                label="Postcode"
                                type="text"
                                id="postcode"
                                name="postcode"
                                value={postcode}
                                handleChange={(e: any) => setPostcode(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mb-4 w-full">
                        <h1 className="text-2xl font-bold mt-2 ">Direction LatLng</h1>
                        <div className="flex gap-10 flex-wrap w-full">
                            <EventField className="border border-gray-200 mt-2"
                                label="Latitude"
                                type="text"
                                id="lat"
                                name="lat"
                                value={lat}
                                handleChange={(e: any) => setLat(e.target.value)}
                            />

                            <EventField className="border border-gray-200 mt-2"
                                label="Longitude"
                                type="text"
                                id="lng"
                                name="lng"
                                value={lng}
                                handleChange={(e: any) => setLng(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-10 flex-wrap w-full">
                            <Textarea {...{ short_description, setShortDescription }} title={"Description"} />
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
                    <DateTimePicker {...{ dateTimes, setDateTimes, showDateTime, setShowDateTime }} />
                </form>
            </div>
        </div>
    );
};

export default Drawer;


