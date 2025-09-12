export default function ConciergePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Welcome to Concierge
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Your payment has been processed successfully. Our concierge team will be in touch with you shortly.
                    </p>
                    <div className="space-y-3">
                        <a 
                            href="/dashboard" 
                            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Go to Dashboard
                        </a>
                        <a 
                            href="/" 
                            className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Return Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
