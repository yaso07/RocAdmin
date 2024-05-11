
import styled from 'styled-components'
import { fetchCategoryById, updateStatus } from '../api/Category/CategoryThunk';
import {  useDispatch} from 'react-redux';
import { useEffect, useState } from 'react';
import { AppDispatch, appSelector } from '../api/store';
import { SingleCategory } from '../types/CategoryList';
import Loading from './Loading';
import { toast } from 'react-toastify';



const Panel=styled.div`
    display:grid;
    grid-template-columns:1fr 2fr;
    box-sizing:border-box;
   
`
const Image=styled.img`
     width:100%;
      height:100%;
      border-radius:10px;
`
const ListItem = styled.div`
  display: flex;
  align-items: center;
  column-gap: 10px;
  border-bottom: 1px solid rgb(234, 231, 231);
  padding: 5px;
`;

 
const SingleDetail = () => {
           const {categoryListLoading,currentCategory,currentId,categoryStatus}= appSelector((state) => {
             return state.category;
           })
           const data=currentCategory
           
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
      {categoryListLoading && currentCategory && (
        <Loading className="bg-black opacity-80"></Loading>
      )}
      <Panel>
        {data && (
          <div
            style={{
              padding: "20px",
              boxSizing: "border-box",
              borderRight: "1px solid rgb(234, 231, 231)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <p>list name:{data?.listName ? data.listName : "not found"}</p>
            <p>email:{data?.creatorId ? data.creatorId.email : "not found"}</p>
            <p>Icon :{data?.iconName}</p>
            <div className="flex gap-x-5 ">
              <button
                disabled={categoryStatus}
                onClick={() => {
                  handleCategoryStatus("Approved");
                }}
                className="p-3 text-white rounded-md bg-green-600"
              >
                {(categoryStatus && currentStatus=='Approved' && "...sending") || "Accept"}
              </button>
              <button
                disabled={categoryStatus}
                onClick={() => {
                  handleCategoryStatus("Rejected");
                }}
                className="p-3 text-white rounded-md bg-red-600"
              >
                {(categoryStatus && currentStatus=='Rejected' && "...sending") || "Reject"}
              </button>
            </div>
          </div>
        )}
        <div
          style={{
            padding: "10px",
            boxSizing: "border-box",
            height: "100vh",
       
          }}
        >
          {data && data.categoryList?.length == 0 && (
            <div className="text-center text-2xl mt-10">No entries</div>
          )}
          {((data && data.categoryList) || []).map(
            (category: SingleCategory,index) => {
              return (
                <>
                  <ListItem key={index}>
                    <div style={{ width: "90px", height: "90px" }}>
                      <Image src={category.icon}></Image>
                    </div>
                    <div>
                      <p style={{ fontWeight: "bold" }}> {} </p>
                      <p>{category.name}</p>
                    </div>
                  </ListItem>
                </>
              );
            }
          )}
        </div>
      </Panel>
    </>
  );
}

 
export default SingleDetail