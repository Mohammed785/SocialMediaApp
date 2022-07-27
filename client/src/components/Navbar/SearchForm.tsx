import { UIEvent, useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa"
import { Link } from "react-router-dom";
import axiosClient from "../../axiosClient";
import image from "../img.jpg"

interface ISearch{
    search:string
    cursor:number
    result:any[]
    type:string
}

function SearchForm() {
    const [searchInfo,setSearchInfo] = useState<ISearch>({search:"",cursor:0,type:"user",result:[]})
    const searchMsgRef = useRef<HTMLParagraphElement>(null)
    const loadMoreRef = useRef<HTMLButtonElement>(null)
    async function userSearch(){
        try{
            const url = searchInfo.type==='user'?
            `/user/all/?search=${searchInfo.search}&cursor=${searchInfo.cursor}`
            :`/group/search/?search=${searchInfo.search}&cursor=${searchInfo.cursor}`
            const response = await axiosClient.get(url)
            setSearchInfo({ ...searchInfo, cursor: response.data.cursor, result: [...response.data.result,...searchInfo.result] })
        }catch(error){
            console.error(error);
        }
    }
    useEffect(()=>{
        setSearchInfo({...searchInfo,cursor:0,result:[]})
        if(searchInfo.search.length>=4){
            searchMsgRef.current!.classList.add("d-none")
            userSearch()
        }else{
            searchMsgRef.current!.classList.remove("d-none")
        }
    },[searchInfo.search])
    function handleSearchScroll(e: UIEvent) {
        if (searchInfo.cursor===0) {
            loadMoreRef.current?.classList.remove("d-none")
        }else{
            loadMoreRef.current?.classList.add("d-none")
        }
    }
    const handleSearchTypeChange = (value:string)=>{
        setSearchInfo({ ...searchInfo, cursor: 0, result: [], type: value })
    }
    return (
        <>
            <div className="col d-flex align-items-center">
                <i className="fab fa-facebook text-primary" style={{ fontSize: "3rem" }}></i>
                <div className="input-group ms-2" typeof="button">
                    <span className="input-group-prepend" id="searchMenu" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                        <div className="input-group-text bg-gray border-0 rounded-circle" style={{ minHeight: "40px" }}>
                            <FaSearch title="Search" type="button" className="text-muted" />
                        </div>
                    </span>
                    <div onScroll={handleSearchScroll} className="dropdown-menu overflow-auto border-0 shadow p-3" style={{ width: "20em", maxHeight: "600px" }} aria-labelledby="searchMenu" data-popper-placement="bottom-start">
                        <div>
                            <input type="text" value={searchInfo.search} onChange={(e)=>setSearchInfo({...searchInfo,search:e.target.value})} style={{margin:"0px"}} className="rounded-pill border-0 bg-gray dropdown-item" name="search" id="search" placeholder="Search..." />
                            <div className="form-check form-check-inline me-3">
                                <input className="form-check-input" onChange={(e)=>handleSearchTypeChange(e.target.value)} defaultChecked type="radio" name="searchType" id="searchType1" value="user"/>
                                <label className="form-check-label" htmlFor="searchType1">User</label>
                            </div>
                            <div className="form-check form-check-inline ms-3">
                                <input className="form-check-input" onChange={(e)=>handleSearchTypeChange(e.target.value)} type="radio" name="searchType" id="searchType2" value="group"/>
                                <label className="form-check-label" htmlFor="searchType2">Group</label>
                            </div>
                            <hr style={{ margin: "10px 0px" }} />
                        </div>
                        <div>
                            <p ref={searchMsgRef} className="text-muted text-center">Write {4 - searchInfo.search.length} more letter to start search</p>
                            {searchInfo.result && 
                                searchInfo.result.map((res:Record<string,any>)=>{
                                    if(searchInfo.type==='user'){
                                        return <div className="my-4" key={res.id}>
                                            <div className=" alert fade show dropdown-item p-1 m-0 d-flex align-items-center justify-content-between" role="alert">
                                                <Link className="d-flex align-items-center" to={"/profile/" + res.id}>
                                                    <img src={image} alt="avatar" className="rounded-circle me-2" style={{ width: "35px", height: "35px", objectFit: "cover" }} />
                                                    <p className="m-0" style={{color:"black"}}>{res.firstName+res.lastName}</p>
                                                </Link>
                                                <button type="button" className="btn-close p-0 m-0" data-bs-dismiss="alert" aria-label="Close"></button>
                                            </div>
                                        </div>
                                    }else{
                                        return <div className="my-4" key={res.id}>
                                            <div className=" alert fade show dropdown-item p-1 m-0 d-flex align-items-center justify-content-between" role="alert">
                                                <Link className="d-flex align-items-center" to={"/group/" + res.id}>
                                                    <img src={res.image} alt="avatar" className="rounded-circle me-2" style={{ width: "35px", height: "35px", objectFit: "cover" }} />
                                                    <p className="m-0" style={{ color: "black" }}>{res.name}</p>
                                                </Link>
                                                <button type="button" className="btn-close p-0 m-0" data-bs-dismiss="alert" aria-label="Close"></button>
                                            </div>
                                        </div> 
                                    }
                                })
                            }
                        </div>
                            {searchInfo.cursor!==0 && 
                            <button onClick={userSearch} ref={loadMoreRef} className="btn btn-success">Load More</button>
                            }
                    </div>
                </div>
            </div>
        </>
    );
}

export default SearchForm;