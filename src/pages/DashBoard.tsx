import styled from "styled-components";


import Details from "../components/CategoryList";
import SingleDetail from "../components/SingleCategory";
import { useState } from "react";
import { appSelector } from "../api/store";
import Error from "../components/Error";


const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
   
`;

 
const DashBoard = () => {

    const [isEmpty,setEmpty]=useState(false);
    const handleEmpty=()=>{
        setEmpty(!isEmpty)
    }
    const {categoryError} =
      appSelector((state) => {
        return state.category;
      });
  return (
    <>
      {categoryError && (
        <div className="w-full">
          <Error error={categoryError.toString()}></Error>
        </div>
      )}

      <MainContainer>
        {isEmpty && (
          <div className="text-2xl text-center w-full absolute mt-10">
            Empty List
          </div>
        )}
        {!isEmpty && !categoryError && (
          <>
            <Details setEmpty={handleEmpty}></Details>
            <SingleDetail></SingleDetail>
          </>
        )}
      </MainContainer>
    </>
  );
};

 
export default DashBoard;
