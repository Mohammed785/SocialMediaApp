import { FormEvent } from "react"
import toast from "react-hot-toast"
import axiosClient from "../../axiosClient"
import useFormFields from "../../hooks/useFormChange"

function ChangePassword(){
    const [passFields, setField] = useFormFields({ oldPass: "", newPass: "", confirmPass: "" })
    const handlePassSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const { data } = await axiosClient.patch("/auth/changePassword", passFields)
            toast.success("Password updated")
        } catch (error) {
            console.error(error);
        }
    }
    return <>
        <button className="btn btn-primary ms-2" data-bs-toggle="modal" data-bs-target="#changePassModal">Change Password</button>
        <div className="modal fade" id="changePassModal" tabIndex={-1} aria-labelledby="changePassLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-dark">
                    <div className="modal-header text-white">
                        <h5 className="modal-title" id="changePassLabel">Change Password</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handlePassSubmit} method="POST">
                            <div className="form-floating my-2">
                                <input type="text" value={passFields.oldPass} onChange={setField} className="form-control border-0 post-content" name="oldPass" id="oldPass" placeholder="Old Password" />
                                <label htmlFor="oldPass">Old Password</label>
                            </div>
                            <div className="form-floating my-2">
                                <input type="password" value={passFields.newPass} onChange={setField} className="form-control border-0 post-content" name="newPass" id="newPass" placeholder="New Password" />
                                <label htmlFor="newPass">New Password</label>
                            </div>
                            <div className="form-floating my-2">
                                <input type="password" value={passFields.confirmPass} onChange={setField} className="form-control border-0 post-content" name="confirmPass" id="confirmPass" placeholder="Confirm Password" />
                                <label htmlFor="confirmPass">Confirm Password</label>
                            </div>
                            <button type="submit" className="btn w-100 btn-primary">Update Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ChangePassword