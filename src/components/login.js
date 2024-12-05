import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '../store/userSlice';
import { useContext, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { SnackbarContext } from '../context/snackbarContext';

const initialValues = {
    email: '',
    password: '',
};

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { setIsVisible, setShowNotification } = useContext(SnackbarContext);

    const handleSubmit = async (values) => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/signin', values);
            dispatch(setAuthToken(response?.data?.userData?.user_token?.access_token))
            navigate('/media');
            setShowNotification({ status: 'Info', message: 'Login success'});
            setIsVisible(true);
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
    });

    const googleCallBack = async () => {
        const params = new URLSearchParams(window.location.search);
        console.log('params: ', params);
        const token = params.get('token');
        const error = params.get('error');

        if (token) {
            localStorage.setItem('authToken', token);
            dispatch(setAuthToken(token));
            navigate('/media');
        } else if (error) {
            console.error('Google Login Error:', error);
            navigate('/');
        }
    };

    useEffect(() => {
        if (window.location) {
            googleCallBack();
        }
    }, []);

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: {
                        Authorization: `Bearer ${response.access_token}`
                    }
                });

                const data = {
                    first_name: res?.data?.given_name,
                    last_name: res?.data?.family_name,
                    email: res?.data?.email,
                    isGoogleLogin: 1
                }

                const responseData = await axios.post('http://localhost:5000/api/users/signinWithGoogle', data);
                if (responseData.status === 200) {
                    dispatch(setAuthToken(responseData?.data?.userData?.user_token?.access_token))
                    navigate('/media');
                }
                
            } catch (err) {
                console.log(err);
            }
        }
    });


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={formik?.handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        onChange={formik?.handleChange}
                        onBlur={formik?.handleBlur}
                        value={formik?.values.email}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {formik?.touched.email && formik?.errors.email && (
                        <p className="text-red-500 text-sm">{formik?.errors.email}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        onChange={formik?.handleChange}
                        onBlur={formik?.handleBlur}
                        value={formik?.values.password}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {formik?.touched.password && formik?.errors.password && (
                        <p className="text-red-500 text-sm">{formik?.errors.password}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Login
                </button>

                <div className="mt-4 text-center">
                    <span className="text-gray-600">Or</span>
                </div>

                <button
                    type="button"
                    onClick={loginWithGoogle}
                    className="w-full flex justify-center items-center gap-3 p-2 mt-5 bg-[#3b82f636] rounded-md border border-[#3b82f6] hover:bg-[#3b82f680]"
                >
                    <FaGoogle /> Continue with Google
                </button>

                <div className="mt-4 text-center">
                    <p className="text-gray-600">
                        Don't have an account?
                        <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
