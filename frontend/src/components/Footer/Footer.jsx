import React, { useState } from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);

    const handleHomeClick = () => {
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAboutClick = () => {
        navigate('/');
        setTimeout(() => {
            const menuElement = document.getElementById('explore-menu');
            if (menuElement) {
                menuElement.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 100);
    };

    const handleDeliveryClick = () => {
        setShowDeliveryModal(true);
    };

    const handlePrivacyClick = () => {
        setShowPrivacyModal(true);
    };

    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo} alt="Tomato Logo" className="footer-logo" onClick={handleHomeClick} style={{ cursor: 'pointer' }} />
                    <p>
                        Tomato is a full-stack food delivery application that allows users to explore delicious food items,
                        manage their cart, place orders, make secure online payments, and track live order status.
                        Built with React.js, Node.js, Express.js, and MongoDB with SMS notification support.
                    </p>

                    <div className="footer-social-icons">
                        <a href="https://github.com/mdsakib933" target="_blank" rel="noopener noreferrer">
                            <img src={assets.github_icon} alt="GitHub" />
                        </a>
                        <a href="https://www.linkedin.com/in/mohammad-sakib-495985291/" target="_blank" rel="noopener noreferrer">
                            <img src={assets.linkedin_icon} alt="LinkedIn" />
                        </a>
                        <a href="https://skillrank.in/dashboard/profile" target="_blank" rel="noopener noreferrer">
                            <img src={assets.skillrank_icon} alt="Skillrank" />
                        </a>
                    </div>
                </div>

                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li onClick={handleHomeClick}>Home</li>
                        <li onClick={handleAboutClick}>About us</li>
                        <li onClick={handleDeliveryClick}>Delivery</li>
                        <li onClick={handlePrivacyClick}>Privacy policy</li>
                    </ul>
                </div>

                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li><a href="tel:+919334513107" className="footer-contact-link">📞 +91 9334513107</a></li>
                        <li><a href="mailto:mohammadsakib7151@gmail.com" className="footer-contact-link">✉️ mohammadsakib7151@gmail.com</a></li>
                    </ul>
                </div>
            </div>

            <hr />
            <p className="footer-copyright">© Tomato Food Delivery | Full Stack Project.</p>

            {/* Privacy Policy Modal */}
            {showPrivacyModal && (
                <div className="footer-modal-overlay" onClick={() => setShowPrivacyModal(false)}>
                    <div className="footer-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="footer-modal-header">
                            <h3>🔒 Privacy Policy</h3>
                            <button className="close-btn" onClick={() => setShowPrivacyModal(false)}>✕</button>
                        </div>
                        <div className="footer-modal-body">
                            <p><strong>1. Data Collection:</strong> We collect minimal personal data including your name, email address, delivery street address, and mobile phone number strictly to process your food orders.</p>
                            <p><strong>2. SMS & Mobile Notifications:</strong> Your phone number is used exclusively to send SMS order confirmations and live order tracking updates post-payment.</p>
                            <p><strong>3. Payment Security:</strong> All online payments are securely processed via Razorpay API endpoints using 256-bit SSL encryption. We never store credit card or banking PIN credentials on our servers.</p>
                            <p><strong>4. Account Rights:</strong> You may request account deletion or data inspection at any time by contacting our support team.</p>
                        </div>
                        <div className="footer-modal-footer">
                            <button onClick={() => setShowPrivacyModal(false)}>I Understand</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delivery Info Modal */}
            {showDeliveryModal && (
                <div className="footer-modal-overlay" onClick={() => setShowDeliveryModal(false)}>
                    <div className="footer-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="footer-modal-header">
                            <h3>🛵 Delivery Information</h3>
                            <button className="close-btn" onClick={() => setShowDeliveryModal(false)}>✕</button>
                        </div>
                        <div className="footer-modal-body">
                            <p><strong>Standard Delivery Fee:</strong> Flat ₹40 delivery fee applies to all food orders.</p>
                            <p><strong>Estimated Delivery Time:</strong> 30 - 45 Minutes depending on your distance from our partner kitchen.</p>
                            <p><strong>Live Order Tracking:</strong> Track your order stage in real-time (Food Processing → Out for Delivery → Delivered) on the <span className="modal-link-btn" onClick={() => { setShowDeliveryModal(false); navigate('/myorders'); }}>My Orders Page</span>.</p>
                            <p><strong>Contact Driver:</strong> Your delivery rider's contact details and SMS updates are dispatched upon order dispatch.</p>
                        </div>
                        <div className="footer-modal-footer">
                            <button className="track-nav-btn" onClick={() => { setShowDeliveryModal(false); navigate('/myorders'); }}>
                                Go to My Orders 📍
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Footer;
