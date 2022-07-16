import React, { useEffect, useState } from "react";
import { AuthContextType, IUser } from "../@types/auth";

const AuthContext = React.createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: JSX.Element }) => {
    const [currentUser, setCurrentUser] = useState<IUser | null>(
        JSON.parse(window.localStorage.getItem("currentUser") || "null")
    );
    const [token, setToken] = useState("");
    useEffect(() => {
        window.localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }, [currentUser]);
    const loginUser = (user: IUser) => {
        setCurrentUser({ ...user });
    };
    const logoutUser = () => {
        setCurrentUser(null);
    };
    return (
        <AuthContext.Provider
            value={{
                user: currentUser,
                loginUser, logoutUser,
                token, setToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

function useAuthContext() {
    return React.useContext(AuthContext);
}

export { useAuthContext, AuthProvider };
