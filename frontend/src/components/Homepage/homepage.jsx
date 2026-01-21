import Register from "../Users/register"; 
export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2">

                {/* LEFT SIDE */}
                <div className="p-10 flex flex-col justify-center">
                    <span className="inline-block bg-green-100 text-green-600 text-sm font-semibold px-3 py-1 rounded mb-4 w-fit">
                        HEADER
                    </span>

                    <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                        A small business is only as good as its tools.
                    </h1>

                    <p className="text-gray-600 mt-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing.
                    </p>

                    <ul className="mt-6 space-y-3 text-gray-700">
                        <li>✅ Lorem ipsum dolor sit amet</li>
                        <li>✅ Suspendisse mollis tincidunt</li>
                        <li>✅ Praesent varius justo vel justo pulvinar</li>
                    </ul>
                </div>

                {/* RIGHT SIDE */}
                <Register />

            </div>
        </div>
    );
}
