import { Link } from "react-router-dom";

export default function Register() {
    return (
        <div className="p-10 bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">

                <h2 className="text-2xl font-bold text-center mb-2">
                    Join our community
                </h2>

                <form className="space-y-4">
                    <input className="w-full border p-2 rounded" placeholder="Username" />
                    <input className="w-full border p-2 rounded" placeholder="Email" />
                    <input className="w-full border p-2 rounded" placeholder="Password" />

                    <button className="w-full bg-green-500 text-white py-2 rounded">
                        Get Started
                    </button>
                </form>

                <p className="text-sm text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-green-500 font-medium">
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    );
}
