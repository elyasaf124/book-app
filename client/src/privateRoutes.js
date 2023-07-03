import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom'


const PrivateRoutes = () => {
    let status = useSelector((state) => state.isLoggedIn)

    return status !== true ? <Navigate to="/" /> : <Outlet />;
};

export default PrivateRoutes;
