import CreateForm from "../components/Group/GroupForm"
import GroupsList from "../components/Group/GroupsList"
import useTitle from "../hooks/useTitle"

function Groups() {
    useTitle("Groups")
    return <>
        <div className="col-12 col-lg-6 pb-5" style={{ paddingTop: "56px", }}>
                <CreateForm/>
                <h1 className="text-center my-2">My Groups</h1>
            <div className="d-flex justify-content-center mt-4 mx-auto" style={{ maxWidth: "680px" }}>
                <GroupsList/>
            </div>
        </div>
    </>
}

export default Groups