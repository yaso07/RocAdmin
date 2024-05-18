
import { fetchCategoryById, updateStatus } from '../api/Category/CategoryThunk';
import {  useDispatch} from 'react-redux';
import { useEffect, useState } from 'react';
import { AppDispatch, appSelector } from '../api/store';
import { SingleCategory } from '../types/CategoryList';
import Loading from './Loading';
import { toast } from 'react-toastify';

import Error from './Error';


 
const SingleDetail = () => {
           const {currentCategoryLoading,currentCategory,currentId,categoryStatus,currentCategoryError}= appSelector((state) => {
             return state.category;
           })
          
           
        const dispatch: AppDispatch = useDispatch(); 
  useEffect(() => {
    dispatch(fetchCategoryById(currentId));
  }, [dispatch, currentId]);
  
  const [currentStatus,setCurrentStatus]=useState<string>();
  const handleCategoryStatus=async(value:string)=>{
        setCurrentStatus(value)
        const status={id:currentId,status:value}
        dispatch(updateStatus(status))
        toast.success('updated successfully')
  }
  return (
    <>
      {currentCategoryLoading && (
        <Loading className="bg-black opacity-80"></Loading>
      )}
      {currentCategoryError && (
        <Error error={currentCategoryError.toString()}></Error>
      )}

      
      { !currentCategoryLoading && !currentCategoryError && (
        <div className="grid grid-cols-3">
          {currentCategory && (
            <div className="col-span-1 box-border p-5  flex flex-col gap-5">
              {currentCategory.creatorId?.userName && (
                <p>user name : {currentCategory?.creatorId?.userName}</p>
              )}
              <p>email: {currentCategory.creatorId?.email}</p>

              <div className="flex gap-x-5 ">
                <button
                  disabled={categoryStatus}
                  onClick={() => {
                    handleCategoryStatus("Approved");
                  }}
                  className="h-10  w-[70px] text-white rounded-md bg-green-600"
                >
                  {(categoryStatus &&
                    currentStatus == "Approved" &&
                    "...sending") ||
                    "Accept"}
                </button>
                <button
                  disabled={categoryStatus}
                  onClick={() => {
                    handleCategoryStatus("Rejected");
                  }}
                  className="h-10  w-[70px] text-white rounded-md bg-red-600"
                >
                  {(categoryStatus &&
                    currentStatus == "Rejected" &&
                    "...sending") ||
                    "Reject"}
                </button>
              </div>
            </div>
          )}
          <div className="col-span-2 overflow-auto border-l border-gray-300 box-border p-5 h-screen">
            {currentCategory && currentCategory.categoryList?.length == 0 && (
              <div className="text-center text-2xl mt-10">No entries</div>
            )}
            {((currentCategory && currentCategory.categoryList) || []).map(
              (category: SingleCategory, index) => {
                return (
                  <>
                    <div
                      className="flex items-center gap-x-5 border-b border-gray-300 p-2"
                      key={index}
                    >
                      <div style={{ width: "90px", height: "90px" }}>
                        <img
                          className="w-full h-full rounded-md"
                          src={category.photoUrl}
                        ></img>
                      </div>
                      <div className="flex flex-col gap-y-1">
                        <p>{category.name}</p>
                        <p className="text-orange-500">{category.rating}</p>
                        {category.opening_hours && (
                          <p
                            className={`${
                              category.opening_hours?.open_now
                                ? "text-green-900"
                                : "text-red-800"
                            }`}
                          >
                            {category.opening_hours?.open_now
                              ? "Open"
                              : "Close"}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                );
              }
            )}
          </div>
        </div>
      )}
    </>
  );
}

 
export default SingleDetail