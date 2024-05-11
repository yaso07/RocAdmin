import styled from "styled-components";


import Details from "../components/CategoryList";
import SingleDetail from "../components/SingleCategory";
import { useState } from "react";


const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
   
`;

 
const DashBoard = () => {

    const [empty,isEmpty]=useState(false);
    const handleEmpty=()=>{
        isEmpty(!empty)
    }
  return (
    <>
      <MainContainer>
        { empty && <div className="text-2xl text-center w-full absolute mt-10">Empty List</div> ||<>
        <Details isEmpty={handleEmpty}></Details>
        <SingleDetail></SingleDetail></>}
      </MainContainer>
    </>
  );
};

 
export default DashBoard;
