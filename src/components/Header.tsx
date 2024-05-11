import { useNavigate } from "react-router"


const Header = () => {

   const navigate=useNavigate()
  const handleLogout=()=>{
       navigate('/logout')
  }
  return (
    <div className='w-full py-5 border border-gray '>
       
        <button onClick={handleLogout} className='bg-black text-white p-3 rounded-md float-right mr-10'>Logout</button>
    </div>
  )
}

export default Header