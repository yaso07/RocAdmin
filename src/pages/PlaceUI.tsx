


import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPlaceList } from "../api/EventSlice/eventThunk";
import SingleActivitytData from "../components/SingleActivityData";
import ActivityLeftData from "../components/ActivityList";

// import Loading from "../components/Loading";
// import FileIcon from '../assets/upload.gif'
// import FileUploadComponent from "../components/FileUploadComponent";
// import ConfirmationComponent from "../components/confirmationUI";
// import styled from "styled-components";


const PlaceUI = () => {
  const dispatch = useDispatch()
  const data = useSelector((state: any) => { return state.event })
  const eventDataValue = data.placeList;
  
  const currectActivity = data.currentActivity

  const [eventdata, setEventData] = useState({})
  const [dataImage, setDataImage] = useState<string[] | string | any>('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedList, setSelectedList] = useState(0)
  const [drawerType, setDrawerType] = useState<string>('')
  
  // const [uploadedFileName, setUploadedFileNames] = useState<string | null>('')



  useEffect(() => {
    dispatch(getPlaceList() as any)
  }, [currectActivity])

  useEffect(() => {
    if (eventDataValue !== undefined) {
      const imageData = eventDataValue[selectedList]?.acf?.header_image_data ? JSON.parse(eventDataValue[selectedList]?.acf?.header_image_data) : [{ url: "" }]
      setEventData(eventDataValue[selectedList])
      setDataImage(eventDataValue[selectedList]?.photoUrl[0] ? eventDataValue[selectedList]?.photoUrl : imageData[0].url)
    }
  }, [eventDataValue])

  const handleEventData = (index: any, image: string[] | string) => {
    setSelectedList(index)
    setEventData(eventDataValue[index])
    setDataImage(image)
    setIsDrawerOpen(false)
  }

  // function handleCsvDataUpload(csvData: any[]) {
  //   console.log("csvvvvv", csvData)
  // }

  // function setUploadedFileName(value: SetStateAction<string | null>): void {
  //   setUploadedFileNames(value)
  // }

  // const toggleDrawer = (id: any) => {
  //   setIsDrawerOpen(true);
  //   // const data = { id: id, api: GET_ACTIVITY_LIST };
  //   // dispatch(fetchEventById(data) as any);
  //   setDrawerType("Edit");
  // };


  return (
    <>
      <div className={`h-lvh w-full gap-x-4 grid grid-cols-[400px_minmax(350px,_1fr)] fixed ${(currectActivity == undefined || currectActivity) ? "" : "pointer-events-none"}`}>
      {/* <div className={`h-lvh w-full gap-x-4 grid grid-cols-[400px_minmax(350px,_1fr)] fixed ${isLoading ? "pointer-events-none" : ""}`}> */}
        <ActivityLeftData {...{ handleEventData, setDrawerType, isDrawerOpen, setIsDrawerOpen, drawerType, selectedList, eventDataValue }} showType="place" />
        <div className="">
          {/* <div className="flex gap-2 justify-end max-h-[60px]">
            <EditBtn
              className="font-semibold text-lg capitalize mr-4"
              onClick={() => toggleDrawer(5)}>
              Edit
            </EditBtn>
            <ConfirmationComponent
              data={2}
              {...{ setSelectedList }}
            />
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
          </div> */}
          <SingleActivitytData data={eventdata} dataImage={dataImage} reservationModal={undefined} {...{ setIsDrawerOpen, setDrawerType, setSelectedList, selectedList }} showType="place" />
        </div>
      </div>

    </>


  );
}

export default PlaceUI



// const EditBtn = styled.button`
//   padding: 0px 12px;
//   border: 1px solid gray;
//   margin: 4px;
//   width:100px;
//   height: 45px;
//   border-radius: 5px;
//   cursor: pointer;
//   background: #1e2832;
//   color: white;
//   &:hover {
//     background: red;
//     transaction: 0.3s;
//   }
// `;

// const ContainerCSV = styled.div`
//     box-shadow: 2px 2px 25px aliceblue;
//     padding: 0px 10px;
//     min-width: 150px;
//     display: flex;
//     gap: 10px;
//     align-items: center;   
//     border-bottom: 2px solid blue
// `;