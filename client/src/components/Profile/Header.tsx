import "./profile.css"
import Relation from "./Relation"

function Header({ id, relations }: { id: number, relations:Record<string,any>}){
    return <>
        <header className="shadow bg-white">
            <img className="cover-img pointer shadow" src="#" alt="d" />
            <img className="profile-img rounded-circle pointer shadow" src="#" alt="d" />

            <div className="user-info">
                <h4 className="profile-name">john doe</h4>
                <p className="text-muted">Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, nihil vitae inventore officia porro nemo corporis repellat hic fugiat? Placeat quas mollitia, nam suscipit reiciendis perspiciatis assumenda magni perferendis itaque.</p>
            </div>
            <div style={{ height: "1px", backgroundColor: "black", width: "80%" }}></div>
            <nav className="d-flex justify-content-between w-100">
                <ul className="list-group list-group-horizontal m-auto">
                    <li className="mx-2 item active-item pointer">Timeline</li>
                    <li className="mx-2 item pointer">Friends</li>
                    <li className="mx-2 item pointer">About</li>
                </ul>
                <Relation {...{id,relations}}/>
            </nav>
        </header></>
}

export default Header