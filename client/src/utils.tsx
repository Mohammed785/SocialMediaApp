const setFormMSG=(container:HTMLElement,msg:string,isError=true)=>{
    container.classList.remove("alert-danger", "alert-success");
    isError ? container.classList.add("alert-danger") : container.classList.add("alert-success")
    container.innerText = msg;

}

export {setFormMSG}