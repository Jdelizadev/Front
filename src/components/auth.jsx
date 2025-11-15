import { createContext, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext()

const AuthProvider = ({ children }) => {

    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    const login = ({ userName, token, userID}) => {
        setUser({ userName, token, userID })

        navigate('/dashboard', {replace: true})
    }

    const logout = () => {
        setUser(null)
        navigate('/', {replace: true})
    }
    
    const auth = { user, login, logout }

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const auth = useContext(AuthContext)
    return auth
}



export {
    AuthProvider,
    useAuth
}