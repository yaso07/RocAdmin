import styled from "styled-components"




import { useEffect } from "react";
import { Category } from "../types/Category";

import { useDispatch } from "react-redux";
import { fetchCategory} from "../api/Category/CategoryThunk";
import { AppDispatch, appSelector } from "../api/store";
import { setCurrentId } from "../api/Category/CategorySlice";
import Loading from "./Loading";





const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  height:100vh;
  width:100%;
  border-right: 1px solid rgb(234, 231, 231);
   
`;
const Detail = styled.div`
  display: flex;
  padding: 10px;
  gap: 5px;
  box-sizing: border-box;
  border-bottom: 1px solid rgb(234, 231, 231);
  column-gap:5;
  border-radius:5px;
  &:hover {
    background-color: rgb(250, 246, 246);
  }
`;

interface Props{
   isEmpty:()=>void
}

function Details({isEmpty}:Props) {
    
   const { categoryLoading,currentCategory,categoryData ,currentId} = appSelector((state) => {
     console.log(state.category.currentId);
     return state.category;
   });
   if (categoryData && categoryData.length == 0) {
     console.log("asda");
     isEmpty()
     
    
    
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

 
  return <>
    
    {(categoryLoading  || !currentCategory) && <Loading className="bg-white opacity-100"></Loading>}
     <Container>{(categoryData || []).map((item:Category,index)=>{
        return (
          <>
            {item.status=='Pending' &&
            <Detail key={index}
              onClick={() => {
                setCurrentID(item._id);
              }}
              style={{
                backgroundColor: `${
                  item._id ==currentId ? "rgb(234, 231, 231)" : ""
                }`,
              }}
            >
              <div className="">

                <p>{item.listName}</p>
              </div>
           
            </Detail>}
          </>
        );
    })}</Container>
 </>
}


export default Details