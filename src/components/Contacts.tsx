import { Contact } from "../types/Contact"

const Contacts = ({currentContact}:{currentContact:Contact}) => {

     
 
  return <>
    <div className="col-span-4 overflow-hidden h-screen">
      <div className="box-border m-5">
        <div className="flex flex-col gap-y-5">
          <p className="text-xl">Name : {currentContact.name}</p>
          <p className="text-xl">Email : {currentContact.email}</p>
          <div>
            <h2 className="text-2xl">Comments</h2>

            <div className="mt-4 indent-5 text-xl text-gray-700">{currentContact.comments}</div>
          </div>
        </div>
      </div>
    </div>
  </>
}

export default Contacts