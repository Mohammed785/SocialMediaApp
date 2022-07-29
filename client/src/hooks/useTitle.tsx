import { useEffect } from "react";

export default function useTitle(title:string,auth=false){
    useEffect(()=>{
        title &&  (document.title = title)
        if(auth){
            document.getElementById("root")?.classList.add("form-signin","w-100","m-auto","bg-dark")
            document.querySelector("body")?.classList.add("text-center","body","bg-dark")
        }
    },[title])
}