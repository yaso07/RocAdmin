import { useEffect, useState } from "react";

export default function useModal() {
  const [isOpen, setisOpen] = useState(false);

  const toggle = () => {
    setisOpen(!isOpen);
  };

  useEffect(()=>{
if(isOpen){
  document.body.classList.add('modal-open');
}else{
  document.body.classList.remove('modal-open');
}
  },[isOpen])

  return {
    isOpen,
    toggle
  };
}
