import { FormEvent, useEffect } from "react"
import toast from "react-hot-toast"
import axiosClient from "../../axiosClient"
import { useAuthContext } from "../../context/authContext"
import useFormFields from "../../hooks/useFormChange"


function UpdateInfo({id}:{id:number}){
    const [userForm, setUserForm, setUser] = useFormFields({ firstName: "", lastName: "", gender: true, birthDate: "", bio: "", email: "" })
    const {setCurrentUser} = useAuthContext()!
    useEffect(()=>{
        async function getUserInfo(){
            try {
                const {data} = await axiosClient.get(`/user/?id=${id}`)
                setUser({...data.user})
            } catch (error) {
                console.error(error);                
            }
        }
        getUserInfo()
    },[])
    const handleSubmit= async(e:FormEvent)=>{
        e.preventDefault()
        try {
            userForm.gender = (userForm.gender==="male"||userForm.gender===true)?true:false
            const {data} = await axiosClient.patch("/auth/account/update",{...userForm})
            setCurrentUser(data.user)
            toast.success("info updated181b1e")
        } catch (error) {
            console.error(error);            
        }
    }
    return <>
        <button className="btn btn-primary ms-2" data-bs-toggle="modal" data-bs-target="#updateInfoModal">Update Info</button>
        <div className="modal fade" id="updateInfoModal" tabIndex={-1} aria-labelledby="updateInfoLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-dark">
                    <div className="modal-header text-muted">
                        <h5 className="modal-title" id="updateInfoLabel">Update Info</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit} method="POST">
                            <div className="form-group row mb-2">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" value={userForm?.firstName} onChange={setUserForm} className="form-control border-0 post-content" name="firstName" id="firstName" placeholder="First Name" />
                                        <label htmlFor="firstName">First Name</label>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" value={userForm?.lastName} onChange={setUserForm} className="form-control border-0 post-content" name="lastName" id="lastName" placeholder="Last Name" />
                                        <label htmlFor="lastName">Last Name</label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-floating my-2">
                                <input type="email" value={userForm?.email} onChange={setUserForm} className="form-control border-0 post-content" name="email" id="email" placeholder="Email" />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="form-group row">
                                <div className="col">
                                    <div className="form-check from-check-inline col">
                                        <input className="form-check-input inp"  onChange={setUserForm} type="radio" name="gender" id="g-m" value="male"/>
                                        <label className="form-check-label" htmlFor="g-m">Male</label>
                                    </div>

                                </div>
                                <div className="col">
                                    <div className="form-check from-check-inline">
                                        <input className="form-check-input inp" type="radio"  onChange={setUserForm} name="gender" id="g-f" value="female" />
                                        <label className="form-check-label" htmlFor="g-f">Female</label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mb-2" style={{ textAlign: "start" }}>
                                <label htmlFor="birthDate" className="form-label me-3">Birth date: </label>
                                <input type="date" value={new Date(userForm.birthDate).toLocaleDateString('en-CA')} onChange={setUserForm} className="form-control" name="birthDate" id="birthDate" />
                            </div>
                            <div className="form-floating my-2">
                                <textarea  value={userForm?.bio} onChange={setUserForm} className="form-control border-0 post-content" name="bio" id="bio" placeholder="Bio"></textarea>
                                <label htmlFor="bio">Bio</label>
                            </div>
                            <button type="submit" className="btn w-100 btn-primary">Update Info</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default UpdateInfo