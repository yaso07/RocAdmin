
import { NavLink, NavLinkProps } from 'react-router-dom';

interface Props extends NavLinkProps{
    children:string|JSX.Element
}
const NavButton= ({children,...props}:Props) => {
  const className =`hover:bg-sky-600  outline outline-sky-600 text-black hover:text-white list-none flex  justify-center place-items-center h-10 w-[80px] font-sans rounded-md float-right mr-6`
  
  return (
    <NavLink 
      {...props}    className={({ isActive }) => (isActive ? "bg-sky-600 text-white" : "") +` ${className} ${props.className}`}
        >
      {children}
    </NavLink>
  );
}

export default NavButton