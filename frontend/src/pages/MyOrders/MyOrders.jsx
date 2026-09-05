import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString());
    const [refreshSuccessMsg, setRefreshSuccessMsg] = useState(false);
    const [activeTrackOrder, setActiveTrackOrder] = useState(null);

    const fetchOrders = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const response = await axios.post(
                url + "/api/order/userOrders",
                {},
                { headers: { token } }
            );
            if (response.data.success) {
                setData(response.data.data);
                setLastRefreshed(new Date().toLocaleTimeString());
                
                // If tracking modal is open, update selected order data seamlessly
                if (activeTrackOrder) {
                    const updated = response.data.data.find(o => o._id === activeTrackOrder._id);
                    if (updated) setActiveTrackOrder(updated);
                }
            } else {
                console.error("Fetch orders failed:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching user orders:", error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const handleManualRefresh = async () => {
        setRefreshing(true);
        await fetchOrders(true);
        setRefreshing(false);
        setRefreshSuccessMsg(true);
        setTimeout(() => {
            setRefreshSuccessMsg(false);
        }, 2500);
    };

    // Initial load + 5 second automatic background live polling
    useEffect(() => {
        if (token) {
            fetchOrders(false);
            const intervalId = setInterval(() => {
                fetchOrders(true);
            }, 5000);

            return () => clearInterval(intervalId);
        }
    }, [token]);

    // Helper to calculate tracking stage (1: Food Processing, 2: Out for delivery, 3: Delivered)
    const getTrackingStep = (status) => {
        switch (status) {
            case "Food Processing":
                return { step: 1, progress: 33, label: "Preparing Food in Kitchen" };
            case "Out for delivery":
                return { step: 2, progress: 66, label: "Driver is on the way" };
            case "Delivered":
                return { step: 3, progress: 100, label: "Order Delivered" };
            default:
                return { step: 1, progress: 33, label: "Order Placed" };
        }
    };

    return (
        <div className='my-orders'>
            <div className="my-orders-header">
                <h2>My Orders</h2>
                <div className="live-status-badge">
                    <span className="live-pulsing-dot"></span>
                    <span>LIVE UPDATES ACTIVE (Auto 5s)</span>
                </div>
            </div>

            {loading && data.length === 0 ? (
                <div className='my-orders-loading'>Loading your orders...</div>
            ) : data.length === 0 ? (
                <div className='my-orders-empty'>
                    <p>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="container">
                    {data.map((order, index) => {
                        const trackingInfo = getTrackingStep(order.status);
                        return (
                            <div key={order._id || index} className='my-orders-order-card'>
                                <div className='my-orders-order'>
                                    <img src={assets.parcel_icon} alt="Parcel Icon" />
                                    <p className='order-items'>
                                        {order.items.map((item, idx) => {
                                            if (idx === order.items.length - 1) {
                                                return item.name + " x " + item.quantity;
                                            } else {
                                                return item.name + " x " + item.quantity + ", ";
                                            }
                                        })}
                                    </p>
                                    <p>${order.amount}.00</p>
                                    <p>Items: {order.items.length}</p>
                                    <p className='status-pill'>
                                        <span className={`status-dot ${order.status.replace(/\s+/g, '-').toLowerCase()}`}>&#x25cf;</span>
                                        <b>{order.status}</b>
                                    </p>
                                    <button onClick={() => setActiveTrackOrder(order)}>
                                        Track Order 📍
                                    </button>
                                </div>

                                {/* Inline Quick Tracker Bar */}
                                <div className="quick-tracker">
                                    <div className="tracker-bar-bg">
                                        <div
                                            className="tracker-bar-fill"
                                            style={{ width: `${trackingInfo.progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="tracker-steps-labels">
                                        <span className={trackingInfo.step >= 1 ? "active-step" : ""}>
                                            🍳 Order Placed
                                        </span>
                                        <span className={trackingInfo.step >= 2 ? "active-step" : ""}>
                                            🛵 Out for Delivery
                                        </span>
                                        <span className={trackingInfo.step >= 3 ? "active-step" : ""}>
                                            ✅ Delivered
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Tracking Modal */}
            {activeTrackOrder && (
                <div className="tracking-modal-overlay" onClick={() => setActiveTrackOrder(null)}>
                    <div className="tracking-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="tracking-modal-header">
                            <div className="tracking-modal-title">
                                <h3>Live Order Tracking</h3>
                                <div className="live-status-badge small">
                                    <span className="live-pulsing-dot"></span>
                                    <span>LIVE</span>
                                </div>
                            </div>
                            <button className="close-btn" onClick={() => setActiveTrackOrder(null)}>✕</button>
                        </div>

                        <div className="tracking-order-summary">
                            <p><strong>Order ID:</strong> #{activeTrackOrder._id}</p>
                            <p><strong>Total Amount:</strong> ${activeTrackOrder.amount}.00</p>
                            <p><strong>Payment Status:</strong> {activeTrackOrder.payment ? "✅ Paid Online" : "⏳ Pending"}</p>
                        </div>

                        {/* Visual Step Tracker */}
                        {(() => {
                            const { step, progress, label } = getTrackingStep(activeTrackOrder.status);
                            return (
                                <div className="tracking-visual-container">
                                    <div className="current-status-banner">
                                        Current Status: <span>{label}</span>
                                    </div>

                                    <div className="stepper-wrapper">
                                        <div className="stepper-line-bg">
                                            <div
                                                className="stepper-line-progress"
                                                style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                                            ></div>
                                        </div>

                                        <div className={`step-item ${step >= 1 ? "completed" : ""}`}>
                                            <div className="step-circle">{step > 1 ? "✓" : "1"}</div>
                                            <div className="step-title">Food Processing</div>
                                            <div className="step-desc">Kitchen preparing your meal</div>
                                        </div>

                                        <div className={`step-item ${step >= 2 ? "completed" : ""}`}>
                                            <div className="step-circle">{step > 2 ? "✓" : "2"}</div>
                                            <div className="step-title">Out for Delivery</div>
                                            <div className="step-desc">Rider picked up food</div>
                                        </div>

                                        <div className={`step-item ${step >= 3 ? "completed" : ""}`}>
                                            <div className="step-circle">{step >= 3 ? "✓" : "3"}</div>
                                            <div className="step-title">Delivered</div>
                                            <div className="step-desc">Enjoy your meal!</div>
                                        </div>
                                    </div>

                                    <div className="delivery-details-box">
                                        <h4>Delivery Information</h4>
                                        <p><strong>Name:</strong> {activeTrackOrder.address.firstName} {activeTrackOrder.address.lastName}</p>
                                        <p><strong>Address:</strong> {activeTrackOrder.address.street}, {activeTrackOrder.address.city}, {activeTrackOrder.address.state} - {activeTrackOrder.address.zipcode}</p>
                                        <p><strong>Contact Phone:</strong> {activeTrackOrder.address.phone}</p>
                                    </div>

                                    {refreshSuccessMsg && (
                                        <div className="refresh-toast-banner">
                                            ✓ Latest Live Status fetched! Updated at {lastRefreshed}
                                        </div>
                                    )}

                                    <div className="tracking-modal-actions">
                                        <span className="last-updated-time">Last updated: {lastRefreshed}</span>
                                        <button
                                            className={`refresh-status-btn ${refreshing ? 'spin' : ''}`}
                                            onClick={handleManualRefresh}
                                            disabled={refreshing}
                                        >
                                            {refreshing ? "⏳ Fetching Status..." : "🔄 Refresh Live Status"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
