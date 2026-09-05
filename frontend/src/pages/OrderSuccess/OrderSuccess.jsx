import React from 'react';
import './OrderSuccess.css';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OrderSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const navigate = useNavigate();

    return (
        <div className='order-success-page'>
            <div className="order-success-card">
                <div className="success-icon-wrapper">
                    <div className="success-checkmark">✓</div>
                </div>

                <h2>Order Placed Successfully! 🎉</h2>
                <p className="success-subtitle">
                    Thank you for your order! We have received your payment and the kitchen is preparing your delicious meal.
                </p>

                {orderId && (
                    <div className="success-order-details">
                        <div className="detail-row">
                            <span>Order Reference ID:</span>
                            <strong>#{orderId}</strong>
                        </div>
                        <div className="detail-row">
                            <span>Status:</span>
                            <strong className="status-highlight">🍳 Food Processing</strong>
                        </div>
                        <div className="detail-row">
                            <span>Estimated Delivery:</span>
                            <strong>30 - 40 Mins</strong>
                        </div>
                        <div className="detail-row">
                            <span>SMS Notification:</span>
                            <span className="sms-sent-badge">📱 Sent to Mobile</span>
                        </div>
                    </div>
                )}

                <div className="order-success-actions">
                    <button className="track-btn" onClick={() => navigate('/myorders')}>
                        Track Order Live 📍
                    </button>
                    <button className="home-btn" onClick={() => navigate('/')}>
                        Order More Food 🏠
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
