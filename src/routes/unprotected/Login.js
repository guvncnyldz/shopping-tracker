import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { login } from '../../db/db';
import { getAuth, setAuth } from '../../db/auth';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isUsernameEmpty, setUsernameEmpty] = useState(false)
    const [isPasswordEmpty, setPasswordEmpty] = useState(false)
    const [isPageReady, setPageReady] = useState(false)
    const [forgetPassword, setForgetPassword] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        setError('');
        setUsernameEmpty(false)
        setPasswordEmpty(false)
    }, [forgetPassword])

    useEffect(() => {
        const checkSession = async () => {
            setPageReady(true)
            const user = getAuth()

            if (user) {
                navigate('/');
                return
            }
        }

        checkSession()
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleForgetPassword = async () => {
        let errorMessage = '';

        if (username.trim() === '') {
            errorMessage = 'Kullanıcı adı boş olamaz!';
        }

        if (errorMessage) {
            setError(errorMessage);
            setUsernameEmpty(username.trim() === '');
            setPasswordEmpty(password.trim() === '');
            return;
        }

        setError('');
        setUsernameEmpty(false)
        setPasswordEmpty(false)
        setLoading(true);

        /*const result = await supabase.auth.resetPasswordForEmail(email, { redirectTo: "https://fidept.com.tr/reset-password" })

        setLoading(false);

        if (result.error) {
            setError("Bir hata meydana geldi!")
            return
        }*/

        setForgetPassword(false)
    }

    const handleLogin = async () => {
        let errorMessage = '';

        if (username.trim() === '' && password.trim() === '') {
            errorMessage = 'Kullanıcı adı ve şifre boş olamaz!';
        } else if (username.trim() === '') {
            errorMessage = 'Kullanıcı adı boş olamaz!';
        } else if (password.trim() === '') {
            errorMessage = 'Şifre boş olamaz!';
        }

        if (errorMessage) {
            setError(errorMessage);
            setUsernameEmpty(username.trim() === '');
            setPasswordEmpty(password.trim() === '');
            return;
        }

        setError('');
        setUsernameEmpty(false)
        setPasswordEmpty(false)
        setLoading(true);

        const user = await login(username, password)

        if (!user) {
            setError("Hatalı Kullanıcı Adı veya Şifre");
            setLoading(false)
            return
        }

        setLoading(false)

        setAuth(user)
        navigate("/")
    };

    if (!isPageReady) return null;
    return (
        <>
            <div className="flex justify-center items-center w-screen h-screen">
                <div className="shadow-md bg-white w-96 h-96 p-4 rounded-[40px]">
                    <div className="flex flex-col gap-6 mt-10">
                        <div className="flex flex-col gap-3 font-bold">
                            <label>{forgetPassword ? "Şifremi unuttum!" : "Giriş Yap"}</label>
                            <hr />
                        </div>

                        <div>
                            <div className="text">
                                <label>Kullanıcı Adı</label>
                            </div>
                            <input
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                                className={`${isUsernameEmpty ? "focus:outline-2 focus:border-4 focus:outline-black border-2 border-rose-500" : "outline-none border-2 focus:border-black"} w-full p-1 rounded`}
                            />
                        </div>
                        <div>
                            {!forgetPassword ? (<>
                                <div>
                                    <label>Şifre</label>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`${isPasswordEmpty ? "focus:outline-2 focus:border-4 focus:outline-black border-2 border-rose-500" : "outline-none border-2 focus:border-black"} w-full p-1 rounded`}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className={showPassword ? "hidden" : "block"} viewBox="0 0 64 40" width="26" height="40">
                                            <ellipse cx="32" cy="20" rx="30" ry="18" stroke="#D9D9D9" strokeWidth="4" fill="none" />
                                            <circle cx="32" cy="20" r="10" stroke="#D9D9D9" strokeWidth="4" fill="none" />
                                            <line x1="10" y1="35" x2="54" y2="5" stroke="#D9D9D9" strokeWidth="4" />
                                        </svg>
                                        <svg className={!showPassword ? "hidden" : "block"} viewBox="0 0 64 40" width="26" height="40">
                                            <ellipse cx="32" cy="20" rx="30" ry="18" stroke="#D9D9D9" strokeWidth="4" fill="none" />
                                            <circle cx="32" cy="20" r="10" stroke="#D9D9D9" strokeWidth="4" fill="none" />
                                            <circle cx="32" cy="20" r="5" fill="#D9D9D9" />
                                        </svg>
                                    </button>
                                </div></>) : (<></>)}
                            <div className='h-6'>
                                {error && <div className="text-red-500">{error}</div>}
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className="w-full flex justify-center">
                                <button
                                    onClick={forgetPassword ? handleForgetPassword : handleLogin}
                                    disabled={loading}
                                    className={`bg-blue-500 ${loading ? 'bg-gray-500' : 'hover:bg-blue-700'} text-white font-bold py-2 px-10 rounded-full`}>
                                    {loading ? (
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                        </svg>
                                    ) : forgetPassword ? ("GÖNDER") : ('GİRİŞ')
                                    }
                                </button>
                            </div>
                            {/*<div className='flex justify-center items-center'>
                                <button onClick={() => forgetPassword ? setForgetPassword(false) : setForgetPassword(true)} className='text-blue-400 underline'>{forgetPassword ? "Giriş yap" : "Şifremi unuttum!"}</button>
                            </div>*/}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
