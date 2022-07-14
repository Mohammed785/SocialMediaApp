import { useEffect } from "react";

export default function useTitle(title:string,auth=false){
    useEffect(()=>{
        title &&  (document.title = title)
        if(auth){
            document.getElementById("root")?.classList.add("form-signin","w-100","m-auto")
            document.querySelector("body")?.classList.add("text-center")
        }
    },[title])
}