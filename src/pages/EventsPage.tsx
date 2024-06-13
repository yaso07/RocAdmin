

import { useEffect, useState } from "react";
import EventDetails from "../components/EventList";
import SingleEventData from "../components/SingleEventData";
import { useDispatch, useSelector } from "react-redux";
import { getEventList } from "../api/EventSlice/eventThunk";
import Loading from "../components/Loading";


const EventsPage = () => {
    const dispatch = useDispatch()
    const eventDataValue = useSelector((state: any) => state.event.eventList)
    console.log("evnt data", eventDataValue)

    const [eventdata, setEventData] = useState({})
    const [dataImage, setDataImage] = useState('')
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedList, setSelectedList] = useState(0)

    const [drawerType, setDrawerType] = useState<string>('')

    useEffect(() => {
        dispatch(getEventList() as any)
    }, [])

    useEffect(() => {
        debugger
        if (eventDataValue !== undefined) {
            const imageData = eventDataValue[0]?.acf?.header_image_data ? JSON.parse(eventDataValue[0]?.acf?.header_image_data) : [{ url: "" }]
            setEventData(eventDataValue[0])
            setDataImage(imageData[0].url)
        }
    }, [eventDataValue])

    const handleEventData = (index: any, image: string) => {

        setSelectedList(index)
        setEventData(eventDataValue[index])
        setDataImage(image)
      
    }


    const toggleDrawer = (name: string) => {
        setIsDrawerOpen(!isDrawerOpen);
        setDrawerType(name)
    };

    return (
        <>
            {
                eventDataValue ?
                    <div className="h-lvh w-full gap-x-4 grid grid-cols-[400px_minmax(350px,_1fr)] fixed">

                        <EventDetails {...{ handleEventData, toggleDrawer, isDrawerOpen, setIsDrawerOpen, eventDataValue, drawerType, selectedList }} />
                        <div className="">
                            <SingleEventData data={eventdata} dataImage={dataImage} reservationModal={undefined} {...{ setIsDrawerOpen, setDrawerType }} />
                        </div>
                    </div>
                    :
                    <Loading />
            }
        </>


    );
}

export default EventsPage