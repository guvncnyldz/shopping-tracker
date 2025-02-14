import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getAuth } from "../db/auth";

const ProtectedRoute = ({ permissionLevels }) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const user = getAuth();

        if (!user) {
            navigate("/login");
        } else {
            setLoading(false);
        }
    }, [navigate]);

    if (loading) return null;

    return <Outlet />;
};

export default ProtectedRoute;
