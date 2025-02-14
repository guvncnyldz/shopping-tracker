import { useState, useEffect } from 'react';
import {Outlet, useNavigate } from "react-router-dom";

import AddProduct from '../components/AddProduct';
import ProductList from '../components/ProductList.js';
import { getAuth, removeAuth } from '../db/auth.js';
export default function MainPage() {
    const [key, setKey] = useState(0)
    const [username, setUsername] = useState()
    const navigate = useNavigate();

    useEffect(() => {
        setUsername(getAuth().username)
    },[])

    const handleLogout = () => {
        removeAuth()
        navigate("/login");
    }

    return (
        <div className="p-4 max-w-lg mx-auto">
            <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-semibold">{username}</div>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Çıkış
                </button>
            </div>
            <AddProduct onAdd={() => setKey(key + 1)} />
            <ProductList key={key} />
        </div>
    );
}