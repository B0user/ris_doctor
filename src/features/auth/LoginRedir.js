import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import jwt_decode from "jwt-decode";

const LoginRedir = () => {
    const { auth } = useAuth();
    
    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined;
    
    const roles = decoded?.UserInfo?.roles || [];
    return (
        roles 
            ? roles.includes(1101) 
                ? <Navigate to="/panel/products" replace />
                : roles.includes(2837) 
                    ? <Navigate to="/support" replace />
                    : <Navigate to="/login" replace />
            : <Navigate to="/login" replace />
    );    
}

export default LoginRedir
