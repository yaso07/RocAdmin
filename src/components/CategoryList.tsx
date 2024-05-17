


import { useEffect } from "react";
import { Category } from "../types/Category";

import { useDispatch } from "react-redux";
import { fetchCategory} from "../api/Category/CategoryThunk";
import { AppDispatch, appSelector } from "../api/store";
import { setCurrentId } from "../api/Category/CategorySlice";
import Loading from "./Loading";






interface Props{
   setEmpty:()=>void
}

function Details({setEmpty}:Props) {
    
   const { categoryLoading,categoryError,categoryData ,currentId} = appSelector((state) => {
     
     return state.category;
   });
 

   if (categoryData && categoryData.length==0) {
       setEmpty()
   }
  
 const dispatch: AppDispatch = useDispatch();   
  
     if(!currentId && categoryData && categoryData.length>0)
      {
           dispatch(setCurrentId(categoryData[0]._id));
      }
   
  
   useEffect(() => {
     dispatch(fetchCategory());
   }, [dispatch]);

   

   
  
   
 const setCurrentID=(id:string)=>{
    dispatch(setCurrentId(id))
 }  

 
  return (
    <>
      {categoryLoading && <Loading className="bg-white opacity-100"></Loading>}
      {!categoryLoading && !categoryError && (
        <div className="p-2 flex flex-col gap-y-3 border-r border-gray-300">
          <div className="text-2xl text-center p-1 text-sky-600  border-y border-sky-600">
            Category
          </div>
          {(categoryData || []).map((item: Category, index) => {
            return (
              <>
                {item.status == "Pending" && (
                  <div
                    className={`${
                      item._id == currentId ? "bg-gray-300" : ""
                    }  box-border rounded-md p-3 pl-5  border-b border-gray-200`}
                    key={index}
                    onClick={() => {
                      setCurrentID(item._id);
                    }}
                  >
                    <div className="">
                      <p>{item.listName}</p>
                    </div>
                  </div>
                )}
              </>
            );
          })}
        </div>
      )}
    </>
  );
}


export default Details