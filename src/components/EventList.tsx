


import { useEffect, useState } from "react";
import Drawer from "./Drawer";
import { mappedArray } from "../utils/dataMapping";


interface Props {
  handleEventData: any;
  toggleDrawer: any;
  isDrawerOpen: boolean;
  setIsDrawerOpen: any;
  eventDataValue?: any;
  drawerType?: any;
}

function EventDetails({ handleEventData , toggleDrawer, isDrawerOpen, setIsDrawerOpen, eventDataValue, drawerType}: Props) {
  // const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [eventList, setEventList] = useState([])
  // const elaString = localStorage.getItem('ela');





  useEffect(() => {

    // const ela = elaString ? JSON.parse(elaString) : [];
    // if(ela.length){
    //   const mappedData: any = mappedArray(ela)
    //   setEventList(mappedData)
    // }else {
      const mappedData: any = mappedArray(eventDataValue)
      setEventList(mappedData)
    // }
   
  }, [eventList.length, isDrawerOpen, eventDataValue])

  // useEffect(()=>{
  //   dispatch(getEventList() as any)
  // },[])


  return (
    <>
      <div className="p-2 flex flex-col gap-y-3 border-r border-gray-300">
        <button
          onClick={()=>toggleDrawer("add")}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md transform transition-transform duration-150 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:bg-blue-700 active:scale-95">
          Add Event
        </button>
        <div className="overflow-y-auto max-h-[calc(100dvh-200px)] hide-scrollbar">
          {
            eventList.map((item: any, index: number) => {

              return (

                <div
                  className="flex items-center gap-x-5 border-b border-gray-300 p-2 cursor-pointer"
                  key={index}
                  onClick={() => handleEventData(index, item?.image)}
                >
                  <div style={{ width: "90px", height: "90px" }}>
                    <img
                      className="w-full h-full rounded-md "
                      src={item?.image}
                    />
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <p>{item?.title}</p>
                    <p className="text-orange-500">{item?.date}</p>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>

      <Drawer isOpen={isDrawerOpen} {...{setIsDrawerOpen, drawerType}} toggleDrawer={toggleDrawer} />
    </>
  );
}


export default EventDetails