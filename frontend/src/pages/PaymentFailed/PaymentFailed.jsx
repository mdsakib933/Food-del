import React from 'react';
import './PaymentFailed.css';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentFailed = () => {
    const [searchParams] = useSearchParams();
    const reason = searchParams.get('reason') || "Payment was cancelled or failed to verify.";
    const navigate = useNavigate();

    return (
        <div className='payment-failed-page'>
            <div className="payment-failed-card">
                <div className="failed-icon-wrapper">
                    <div className="failed-cross">✕</div>
                </div>

                <h2>Payment Failed / Cancelled</h2>
                <p className="failed-subtitle">
                    Unfortunately, your payment could not be completed. If any amount was debited, it will be refunded automatically by your bank within 3-5 business days.
                </p>

                <div className="failed-reason-box">
                    <span>Reason:</span>
                    <strong>{reason}</strong>
                </div>

                <div className="payment-failed-actions">
                    <button className="retry-btn" onClick={() => navigate('/cart')}>
                        Retry Payment 🔄
                    </button>
                    <button className="home-btn" onClick={() => navigate('/')}>
                        Back to Home 🏠
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;
