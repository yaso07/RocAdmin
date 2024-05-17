import { useEffect, useState } from "react"
import { Contact } from "../types/Contact"
import { AppDispatch, appSelector } from "../api/store"
import { useDispatch } from "react-redux"
import { setContact } from "../api/Contacts/ContactSlice"
import { getContacts } from "../api/Contacts/ContactsThunk"
import Loading from "./Loading"


 
interface Props {
  setEmpty: () => void;
}

const ContactList = ({setEmpty}:Props) => {
    
   const [currentId,setCurrentId]=useState<string>('');
   const dispatch: AppDispatch = useDispatch();
const { contactList, error, isLoading } = appSelector((state) => {
  return state.contact;
});
       if (contactList && contactList.length == 0) {
         setEmpty();
          
       } 
      if (contactList && !currentId) {
           dispatch(setContact(contactList[0]));
           setCurrentId(contactList[0]._id)
      }
      
   useEffect(() => {
    dispatch(getContacts())
   }, [dispatch]);

   const showContactDetails=(index:number)=>{
       dispatch(setContact(contactList[index]))
         setCurrentId(contactList[index]._id);
   }
   

   
    
    
  return (
    <>
      {isLoading && <Loading></Loading>}
      {!isLoading && !error && (
        <div className="col-span-1 p-2 flex flex-col gap-y-3 overflow-auto border-r border-gray-300">
          <div className="text-2xl text-center p-1 text-sky-600  border-y border-sky-600">Contacts</div>
          {(contactList || []).map((contact: Contact, index) => {
            return (
              <>
                <div
                  key={index}
                  onClick={() => {
                    showContactDetails(index);
                  }}
                  className={`${
                    currentId == contact._id ? "bg-gray-200" : ""
                  } box-border rounded-md p-3 pl-5  border-b border-gray-200`}
                >
                  {contact.name}
                </div>
              </>
            );
          })}
        </div>
      )}
    </>
  );
}

export default ContactList