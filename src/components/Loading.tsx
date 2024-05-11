import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLAttributes, useEffect } from "react";

interface Props extends HTMLAttributes<HTMLElement>{
    
}
const Loading = ({...rest}:Props) => {
  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflowY = "scroll";
    };
  });
  return (
    <div className={`fixed w-full h-full flex place-items-center ${rest.className}`}>
      <div className="w-full flex justify-center">
        <div>
          <FontAwesomeIcon
            className="animate-spin text-5xl text-red-800"
            icon={faSpinner}
          />
        </div>
      </div>
    </div>
  );
};

export default Loading;
