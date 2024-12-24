


// import Drawer from "./Drawer";
import { SetStateAction, useEffect, useState } from "react";
import ActivityDataList from "./ActivityDataList";
import { mappedArray } from "../utils/dataMapping";
import { useDispatch, useSelector } from "react-redux";
import FileUploadComponent from "./FileUploadComponent";
import styled from "styled-components";
import FileIcon from '../assets/upload.gif'
import { createBulk } from "../api/EventSlice/eventThunk";
import { checkFields, getInitials } from "../utils/commanFun";
import { toast } from "react-toastify";
import { ImageWithFallback } from "./Image";
// import { downloadExcel, formatExcel } from "./Export";
// import DownloadProducts from "./ExportCSV";


interface Props {
  handleEventData: any;
  setDrawerType: any;
  isDrawerOpen: boolean;
  setIsDrawerOpen: any;
  eventDataValue?: any;
  drawerType?: any;
  selectedList?: number;
  showType?: string;
}

function ActivityLeftData({ handleEventData, setDrawerType, isDrawerOpen, setIsDrawerOpen, eventDataValue = [], drawerType, selectedList, showType }: Props) {
  const [eventList, setEventList] = useState([]);
  const data = useSelector((state: any) => { return state.event })
  const currectActivity = data.currentActivity
  const isLoading = data.isLoading
  const dispatch = useDispatch()

  // const elaString = localStorage.getItem('ela');

  const [uploadedFileName, setUploadedFileNames] = useState<string | null>('')


  useEffect(() => {
    const mappedData: any = mappedArray(eventDataValue)
    setEventList(mappedData)
  }, [currectActivity, isLoading])

  useEffect(() => {
    const mappedData: any = mappedArray(eventDataValue)
    setEventList(mappedData)
  }, [eventDataValue.length, isDrawerOpen])

  const toggleDrawer = (name: string) => {
    setIsDrawerOpen(!isDrawerOpen);
    setDrawerType(name)
  };
  function handleCsvDataUpload(csvData: any[]) {

    const { result, error } = checkFields(csvData)

    if (result) {
      const bulkData = csvData.map(item => {
        return (
          {
            id: item?.id ?? "",
            acf: {
              ...item,
              map_location: { lat: parseFloat(item?.lat) ?? "", lng: parseFloat(item?.lng) ?? "" },
              email_address: item?.email_address ?? "",
              website: item?.website ?? "",
              address: {
                place_name: item?.place_name ?? "",
                address_line_1: item?.address_line_1 ?? "",
                address_line_2: item?.address_line_2 ?? "",
                postcode: item?.postcode ?? "",
              },
              parish: { label: item?.parish ? item?.parish.replace("-", ". ") : "", value: item?.parish ?? "" },
              opening_hours: {},
              types: item.types ? item.types.split(",") : [],
              telephone_number: { area_code: item?.area_code ?? "", prefix: item?.prefix ?? "", number: item?.number ? +item?.number : "" },
              header_image_data: JSON.stringify(item?.header_image_url.split(",").map((val: any) => (
                { url: val }
              )))
            }
          }
        )
      }
      )
      const parem = { places: [...bulkData] }
      dispatch(createBulk(parem) as any)

    } else {
      toast.error(<div>
        {error.map((val, index) => (
          <div key={index}>{val}</div>
        ))}
      </div>)
    }
  }

  function setUploadedFileName(value: SetStateAction<string | null>): void {
    setUploadedFileNames(value)
  }


  // function exportExcel() {
  //   downloadExcel(formatExcel)
  //   throw new Error("Function not implemented.");
  // }





  // console.log("eventListeventListeventListeventList", eventList)

  //   return <><div className="">dkflsdkflsd</div></>

  return (
    <>
      <div className="p-2 flex flex-col gap-y-3 border-r border-gray-300">
        <button
          onClick={() => toggleDrawer("add")}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md transform transition-transform duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:bg-blue-700 active:scale-95">
          {isDrawerOpen ? "CLOSE" : "ADD"} {showType?.toLocaleUpperCase()}
        </button>
        {/* <button
          onClick={ exportExcel}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md transform transition-transform duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:bg-blue-700 active:scale-95">
          downloadExcel
        </button>
        <DownloadProducts /> */}
        {
          showType === "place" &&
          <FileUploadComponent
            onCsvDataUpload={handleCsvDataUpload}
            setUploadedFileName={setUploadedFileName}
          >
            <ContainerCSV>
              <img src={FileIcon} alt="" width={"30px"} height={"25px"} />
              <div className="w-full">

                {uploadedFileName ? (
                  <>
                    <p>File Processed!</p>
                    <span className="text-green-500">{uploadedFileName}</span>
                  </>
                ) : (
                  <>
                    {" "}
                    <p>Select a CSV file to import</p>
                    <span>or drag and drop it here</span>
                  </>
                )}
              </div>
            </ContainerCSV>
          </FileUploadComponent>
        }

        <div className="overflow-y-auto max-h-[calc(100dvh-200px)] hide-scrollbar">
          {
            eventList.map((item: any, index: number) => {
              return (
                <div
                  className={`rainbow
                    flex items-center gap-x-5 border-b border-gray-300 p-2 cursor-pointer ${selectedList === index && "bg-indigo-300"}`}
                  key={index}
                  onClick={() => handleEventData(index, item?.image?.url)}
                >
                  <div style={{ width: "80px", height: "80px" }}>


                    <ImageWithFallback
                      className="w-full h-full rounded-md object-fit-cover"
                      src={ showType === "place" ? item?.image?.url[0] : item?.image?.url}
                      alt={`<p> "bharat"</p>`}
                      name={getInitials(item?.title)}
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
      <ActivityDataList isOpen={isDrawerOpen} {...{ setIsDrawerOpen, drawerType, setDrawerType, showType }} />
    </>
  );
}


export default ActivityLeftData




const ContainerCSV = styled.div`
    box-shadow: 2px 2px 25px aliceblue;
    padding: 0px 10px;
    min-width: 150px;
    display: flex;
    gap: 10px;
    align-items: center;   
    border-bottom: 2px solid blue
`;