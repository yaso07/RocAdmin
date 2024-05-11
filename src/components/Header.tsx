import { useNavigate } from "react-router"


const Header = () => {

   const navigate=useNavigate()
  const handleLogout=()=>{
       navigate('/logout')
  }
  return (
    <div className="flex w-full justify-between py-5 px-5 items-center border border-gray ">
      <div className="text-3xl text-bold text-safs text-sky-600">
        ROC <sup>Admin</sup>
      </div>
      <button
        onClick={handleLogout}
        className="bg-black text-white p-3 rounded-md float-right mr-10"
      >
        Logout
      </button>
    </div>
  );
}

export default Header