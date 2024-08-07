 
import NavButton from "../ui/NavButton"



const Header = () => {

  

  return (
    <nav className="sticky top-0 w-full bg-white box-border flex justify-between py-5 px-5 items-center border border-gray">
      <div className="text-3xl text-bold text-safs text-sky-600">
        ROC <sup>Admin</sup>
      </div>
      <div className="">
        <NavButton to={"/logout"}>
          Logout
        </NavButton>
        <NavButton to={"contacts"}>Contacts</NavButton>
        <NavButton to={"activity"}>Activity</NavButton>
        <NavButton to={"events"}>Events</NavButton>
        <NavButton to={""}>Category</NavButton>
      </div>
    </nav>
  );
}

export default Header