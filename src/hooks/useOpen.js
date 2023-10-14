import { useState } from "react";

const useOpen = () => {
    const [open,setOpen] = useState(false)
    const handleOpen =()=>{
      setOpen(!open)
    }
  return {open,setOpen,handleOpen}
};

export default useOpen;
