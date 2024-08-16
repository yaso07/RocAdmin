
import { useEffect, useRef } from "react";
import {
  getEventList,
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



const Drawer = ({
  isOpen,
  setIsDrawerOpen,
  drawerType,
  setDrawerType,
}: Props) => {
  const dispatch = useDispatch();
  const currentEvent = useSelector((state: any) => state.event.currentEvent);
  const updateEventValue = useSelector((state: any) => state.event.updateEvent);
  const loading = useSelector((state: any) => state.event.isLoading);
  const error = useSelector((state: any) => state.event.error);
  const fileInputRef = useRef<HTMLInputElement>(null);

  
  useEffect(() => {
    if (!loading && error === "") {
      setIsDrawerOpen(false);
      // Reset the input field
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the input element
      }
      dispatch(getEventList() as any);
    }
  }, [currentEvent, updateEventValue]);



  const toggleDrawer = (name: string) => {
    setIsDrawerOpen(false);
    setDrawerType(name);
    // Reset the input field
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the input element
    }
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-3/5 bg-white shadow-lg transform transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"
        } duration-1000 overflow-y-auto max-h-[100dvh] hide-scrollbar`}
    >
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
        <EventDataShow {...{ drawerType }} />
      </div>
    </div>
  );
};

export default Drawer;
