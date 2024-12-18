
import { NavLink, NavLinkProps } from 'react-router-dom';

interface Props extends NavLinkProps{
    children:string|JSX.Element
}
const NavButton= ({children,...props}:Props) => {
  // const className =`m-2 p-10 text-white rounded-xl transition-all duration-500 bg-gradient-to-br to-white via-black from-red-500 bg-size-200 hover:bg-right-bottom`
  const className =`hover:bg-sky-600 outline transition-all duration-500 outline-sky-600 text-black hover:text-white list-none flex justify-center place-items-center h-8 w-[80px] font-sans rounded-md float-right`
  
  return (
    <NavLink 
      {...props}    className={({ isActive }) => (isActive ? "bg-sky-600 text-white" : "") +` ${className} ${props.className}`}
        >
      {children}
    </NavLink>
  );
}

export default NavButton