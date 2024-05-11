import { useNavigate } from "react-router"


const Header = () => {

   const navigate=useNavigate()
  const handleLogout=()=>{
       navigate('/logout')
  }
  return (
    <div className="w-full box-border flex justify-between py-5 px-5 items-center border border-gray">
      <div className="text-3xl text-bold text-safs text-sky-600">
        ROC <sup>Admin</sup>
      </div>
      <button 
        onClick={handleLogout}
        className="bg-black text-white p-2 h-max font-bold font-sans w-20 rounded-lg float-right mr-10"
      >
        Logout
      </button>
    </div>
  );
}

export default Header