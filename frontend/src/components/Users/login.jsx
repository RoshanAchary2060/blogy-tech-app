import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { LoginAction } from "../../redux/slices/users/userSlices";
import { useSelector } from "react-redux";
import ErrorMsg from '../alert/errorMsg'
import SuccessMsg from '../alert/successMsg'
export default function Login() {
    const dispatch = useDispatch();

    // Initialize formData state correctly (fix missing closing brace)
    const [formData, setFormData] = useState({
        username: 'Roshan',
        password: 'roshan',
    });

    // Handle input changes using name attribute
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);

        // You can dispatch your login action here if needed
        // dispatch(loginAction(formData));
        dispatch(LoginAction({ username: formData.username, password: formData.password }));

        // Reset form fields
        setFormData({
            username: '',
            password: '',
        });
    };

    const { loading, error, success } = useSelector((state) => state?.users);
    console.log('loading', loading)
    console.log('error', error)
    console.log('success', success)
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">

                <h1 className="text-4xl font-bold text-center mb-2">
                    Login to your account
                </h1>

                <p className="text-center text-gray-500 mb-6">
                    Enter your details below.
                </p>
                {/* DISPLAY ERROR */}
                {error && <ErrorMsg message={error?.message} />}

                {success && <SuccessMsg message='Login Successful' />}

                {/* Bind handleSubmit to the form onSubmit, not button onClick */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Bind inputs to formData and update on change */}
                    <input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter Username"
                        className="w-full border p-3 rounded"
                    />

                    <input
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="Enter your Password"
                        className="w-full border p-3 rounded"
                    />
                    {loading ? (
                        <button
                            type="submit"
                            disabled
                            className="w-full bg-indigo-600 text-white py-3 rounded font-semibold"
                        >
                            Logging in...
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-3 rounded font-semibold"
                        >
                            Login Account
                        </button>
                    )}

                </form>

                {/* Sign Up Link */}
                <p className="text-sm text-center text-gray-600 mt-6">
                    Don’t have an account?{" "}
                    <Link
                        to="/"
                        className="text-indigo-600 font-semibold hover:underline"
                    >
                        Sign up
                    </Link>
                </p>

            </div>
        </div>
    );
}
