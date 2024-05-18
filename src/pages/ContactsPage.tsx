
import { useState } from "react";
import { appSelector } from "../api/store";
import ContactList from "../components/ContactList"
import Contacts from "../components/Contacts"
import Error from "../components/Error";
 

const ContactsPage = () => {
 
     
    const {isLoading,currentContact,error}=appSelector((state)=>{
         return state.contact
    })
       const [isEmpty, setEmpty] = useState(false);
       const handleEmpty = () => {
         setEmpty(!isEmpty);
       };
  
  return (
    <>
    
      {!isLoading && !error && isEmpty && (
        <div className="text-2xl text-center w-full absolute mt-10">
          Empty List
        </div>
      )}
      {error && <Error error={error}></Error>}
      <div className="h-lvh w-full gap-x-4 grid grid-cols-5 fixed">
        {!isEmpty &&<ContactList setEmpty={handleEmpty}></ContactList>}
        { !isLoading && currentContact && (
          <Contacts currentContact={currentContact}></Contacts>
        )}
      </div>
    </>
  );
}

export default ContactsPage