import React from 'react'
import { BsFillImageFill } from "react-icons/bs";
import { useContext,useEffect } from 'react';
import {roomContext} from '../contexts/roomContext'
export default function PickImage() {
    const {Image,setImage} =useContext(roomContext);
    const resizeImage = (file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDimension = 800; // Set your desired maximum dimension here
          let width = img.width;
          let height = img.height;
  
          if (width > height) {
            if (width > maxDimension) {
              height *= maxDimension / width;
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width *= maxDimension / height;
              height = maxDimension;
            }
          }
  
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const resizedBase64 = canvas.toDataURL('image/jpeg');
          setImage({ base64: resizedBase64 });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    };
    useEffect(() => {
        const handlePaste = (e) => {
          const items = e.clipboardData?.items;
          if (items) {
            for (const item of items) {
              if (item.type.includes("image")) {
                const file = item.getAsFile();
                if(file){
                  resizeImage(file);
                    // const reader =new FileReader();
                    // reader.onloadend = () => {
                    //     setImage({ base64: reader.result });
                    // };
                    //reader.readAsDataURL(file);
                  }
              }
            }
          }
        };
    
        document.addEventListener("paste", handlePaste);
    
        return () => {
          document.removeEventListener("paste", handlePaste);
        };
      }, [setImage]);
    const inputImage=()=>{
        const fileInput=document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.click();
        fileInput.addEventListener("change", () => {
        if (fileInput && fileInput.files) {
          const file = fileInput.files[0];
          if(file){
            resizeImage(file);
          }
        }
    });
    
    }

  return (
    <button className='btn-icon text-xl ' onClick={inputImage}>
        <BsFillImageFill/>
    </button>
  )
}
