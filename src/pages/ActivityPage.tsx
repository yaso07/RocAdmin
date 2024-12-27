

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getActivityList } from "../api/EventSlice/eventThunk";
import Loading from "../components/Loading";
import ActivityLeftData from "../components/ActivityList";
import SingleActivitytData from "../components/SingleActivityData";


const EventsPage = () => {
    const data = useSelector((state: any) => { return state.event })
    const eventDataValue = data.activitiesList;
    const [eventdata, setEventData] = useState({})
    const [dataImage, setDataImage] = useState('')
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedList, setSelectedList] = useState(0)

    const [drawerType, setDrawerType] = useState<string>('')
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getActivityList() as any)
    }, [data.currentActivity, data.updateActivity])

    useEffect(() => {
        if (eventDataValue !== undefined) {

            if (eventDataValue[selectedList]?.acf?.header_image_data !== undefined) {
                const imageData = eventDataValue[selectedList]?.acf?.header_image_data ? JSON.parse(eventDataValue[selectedList]?.acf?.header_image_data) : [{ url: "" }]
                setEventData(eventDataValue[selectedList])
                setDataImage(imageData[0].url)
            }
            if (eventDataValue.length == 0) {
                setEventData("");
                setDataImage("");
            }
        }


    }, [eventDataValue, isDrawerOpen])

    const handleEventData = (index: any, image: string) => {
        setSelectedList(index)
        setEventData(eventDataValue[index])
        setDataImage(image)
        setIsDrawerOpen(false)
    }

    return (
        <>
            {
                eventDataValue ?
                    <div className="h-lvh w-full gap-x-4 grid grid-cols-[400px_minmax(350px,_1fr)] fixed">
                        <ActivityLeftData {...{ handleEventData, setDrawerType, isDrawerOpen, setIsDrawerOpen, eventDataValue, drawerType, selectedList }} showType ="activity" />
                        <div className="">
                            <SingleActivitytData data={eventdata} dataImage={dataImage} reservationModal={undefined} {...{ setIsDrawerOpen, setDrawerType, setSelectedList }} />
                        </div>
                    </div>
                    :
                    <Loading />
            }
        </>


    );
}

export default EventsPage