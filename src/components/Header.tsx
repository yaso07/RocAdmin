
import NavButton from "../ui/NavButton"



const Header = () => {



  return (
    <nav className="sticky top-0 w-full bg-white box-border flex justify-between py-3 px-3 items-center border border-gray">
      <div className="text-3xl text-bold text-safs text-sky-600">
        ROC <sup>Admin</sup>
      </div>
      <div className="flex gap-4">
        <NavButton to={""}>Category</NavButton>
        <NavButton to={"events"}>Events</NavButton>
        <NavButton to={"activity"}>Activity</NavButton>
        <NavButton to={"contacts"}>Contacts</NavButton>
        <NavButton to={"roc-places"}>Place</NavButton>
        <NavButton to={"/logout"}>
          Logout
        </NavButton>
      </div>
    </nav>
  );
}

export default Header