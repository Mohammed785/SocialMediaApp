import React, { ReactNode, useEffect, useState } from "react";
import { AuthContextType, IUser } from "../@types/auth";

const AuthContext = React.createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<IUser | null>(
        JSON.parse(window.localStorage.getItem("currentUser") || "null")
    );
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
                setCurrentUser
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
