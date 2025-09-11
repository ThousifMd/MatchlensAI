"use client";

import { useState, useEffect } from "react";

interface Payment {
    id: number;
    order_id: string;
    payment_id: string;
    amount: number;
    currency: string;
    package_id: string;
    package_name: string;
    customer_email: string;
    customer_name: string;
    status: string;
    onboarding_data: any;
    created_at: string;
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await fetch('/api/payments/list');
            const data = await response.json();

            if (data.success) {
                setPayments(data.payments);
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading payments...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Payment Records</h1>

            {payments.length === 0 ? (
                <p>No payments found.</p>
            ) : (
                <div className="space-y-6">
                    {payments.map((payment) => (
                        <div key={payment.id} className="border rounded-lg p-6 bg-white shadow-sm">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-600">Order ID</h3>
                                    <p className="text-sm">{payment.order_id}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-600">Amount</h3>
                                    <p className="text-sm">${payment.amount} {payment.currency}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-600">Package</h3>
                                    <p className="text-sm">{payment.package_name}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-600">Date</h3>
                                    <p className="text-sm">{new Date(payment.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-600">Customer</h3>
                                    <p className="text-sm">{payment.customer_name}</p>
                                    <p className="text-sm text-gray-500">{payment.customer_email}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-600">Status</h3>
                                    <span className={`px-2 py-1 rounded text-xs ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {payment.status}
                                    </span>
                                </div>
                            </div>

                            {payment.onboarding_data && (
                                <div className="border-t pt-4">
                                    <h3 className="font-semibold text-gray-600 mb-2">Onboarding Data</h3>
                                    <div className="bg-gray-50 p-4 rounded text-sm">
                                        <pre className="whitespace-pre-wrap">{JSON.stringify(payment.onboarding_data, null, 2)}</pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
