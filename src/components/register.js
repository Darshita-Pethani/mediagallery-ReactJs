import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export const initialValues = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    user_name: '',
};

export const validationSchema = Yup.object({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    user_name: Yup.string().required('Username is required'),
});

const Register = () => {

    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/add', values);
            console.log('response: ', response);
            if (response.status === 200) {
                navigate("/")
            }

        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
    });

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

                <div className="mb-4">
                    <label className="block mb-1">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.first_name}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {formik.touched.first_name && formik.errors.first_name && (
                        <p className="text-red-500 text-sm">{formik.errors.first_name}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.last_name}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {formik.touched.last_name && formik.errors.last_name && (
                        <p className="text-red-500 text-sm">{formik.errors.last_name}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Username</label>
                    <input
                        type="text"
                        name="user_name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.user_name}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {formik.touched.user_name && formik.errors.user_name && (
                        <p className="text-red-500 text-sm">{formik.errors.user_name}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-sm">{formik.errors.email}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-sm">{formik.errors.password}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Register
                </button>

                <div className="mt-4 text-center">
                    <p className="text-gray-600">
                        back to login?
                        <Link to="/" className="text-blue-500 hover:underline">Login</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Register;
