import { useEffect, useRef } from "react";

import { useSelector } from "react-redux";
import "../App.css";
import ActivityDataCreate from "./ActivityDataShow";
import PlaceForm from "./PlaceForm";

interface Props {
  isOpen: any;
  setIsDrawerOpen: any;
  setDrawerType: any;
  drawerType: string;
  showType?: string;
}

const Drawer = ({
  isOpen,
  setIsDrawerOpen,
  drawerType,
  setDrawerType,
  showType,
}: Props) => {
  const currentEvent = useSelector((state: any) => state.event.currentEvent);
  const updateEventValue = useSelector((state: any) => state.event.updateEvent);
  const loading = useSelector((state: any) => state.event.isLoading);
  const error = useSelector((state: any) => state.event.error);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==================================== POST FINAL EVENT DATA ====================================================

  useEffect(() => {
    if (!loading && error === "") {
      setIsDrawerOpen(false);

      // Reset the input field
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the input element
      }
      // const data = {};
      // dispatch(fetchEventById(data) as any)
      // dispatch(getEventList() as any);
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
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-3/5 bg-white shadow-lg transform transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"
        } duration-1000 overflow-y-auto max-h-[100dvh] hide-scrollbar z-20`}>
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
        {
          showType === "activity" ?
            <ActivityDataCreate {...{ setIsDrawerOpen, drawerType, showType }} />
            :
            <PlaceForm {...{ setIsDrawerOpen, drawerType, showType }} />
        }
      </div>
    </div>
  );
};

export default Drawer;
