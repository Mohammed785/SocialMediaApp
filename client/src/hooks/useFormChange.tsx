import {ChangeEvent, useState} from "react";

export default function useFormFields(state:any){
    const [fields,setField] = useState(state)
    return [fields,
    function (e:ChangeEvent){
        const name = (e.target as HTMLInputElement).name
        const val = (e.target as HTMLInputElement).value
        setField({...fields,[name]:val})
    }]
}