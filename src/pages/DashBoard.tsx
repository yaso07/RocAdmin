import styled from "styled-components";


import Details from "../components/CategoryList";
import SingleDetail from "../components/SingleCategory";


const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
   
`;

 
const DashBoard = () => {

      
  return (
    <>
     
      <MainContainer>
        <Details></Details>
        <SingleDetail></SingleDetail>
      </MainContainer>
    </>
  );
};

 
export default DashBoard;
