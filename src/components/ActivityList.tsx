


// import Drawer from "./Drawer";
import { fallbackImage, getImgeUrl } from "../utils/commanFun";
import ActivityDataList from "./ActivityDataList";


interface Props {
  handleEventData: any;
  setDrawerType: any;
  isDrawerOpen: boolean;
  setIsDrawerOpen: any;
  eventDataValue?: any;
  drawerType?: any;
  selectedList?: number;
}

function ActivityLeftData({ handleEventData, setDrawerType, isDrawerOpen, setIsDrawerOpen, eventDataValue, drawerType, selectedList }: Props) {




  const toggleDrawer = (name: string) => {
    setIsDrawerOpen(!isDrawerOpen);
    setDrawerType(name)

  };
  

  return (
    <>
      <div className="p-2 flex flex-col gap-y-3 border-r border-gray-300">
        <button
          onClick={() => toggleDrawer("add")}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md transform transition-transform duration-150 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:bg-blue-700 active:scale-95">
          {isDrawerOpen ? "Close" : "Add"} Drawer
        </button>

        <div className="overflow-y-auto max-h-[calc(100dvh-200px)] hide-scrollbar">
          {
            eventDataValue.map((item: any, index: number) => {
              if(item?.acf?.header_image_data === undefined){
                return ""
              }
            
              return (
                <div
                  className={`flex items-center gap-x-5 border-b border-gray-300 p-2 cursor-pointer ${selectedList === index && "bg-indigo-300"}`}
                  key={index}
                  onClick={() => handleEventData(index, getImgeUrl(item?.acf?.header_image_data))}
                >
                  <div style={{ width: "90px", height: "90px" }}>
                    <img
                      className="w-full h-full rounded-md object-fit-cover" 
                      src={getImgeUrl(item?.acf?.header_image_data) ? getImgeUrl(item?.acf?.header_image_data) : fallbackImage}
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <p>{item?.acf?.title}</p>
                    <p className="text-orange-500">{item?.date}</p>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>

      {/* <Drawer isOpen={isDrawerOpen} {...{setIsDrawerOpen, drawerType, setDrawerType}}/> */}
      <ActivityDataList isOpen={isDrawerOpen} {...{ setIsDrawerOpen, drawerType, setDrawerType }} />
    </>
  );
}


export default ActivityLeftData