import React, { useEffect, useState } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(url + "/api/order/list");
            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                toast.error("Error fetching orders");
            }
        } catch (error) {
            console.error("Fetch orders error:", error);
            toast.error("Server connection error");
        } finally {
            setLoading(false);
        }
    };

    const statusHandler = async (event, orderId) => {
        const newStatus = event.target.value;
        try {
            const response = await axios.post(url + "/api/order/status", {
                orderId,
                status: newStatus
            });
            if (response.data.success) {
                toast.success("Order status updated");
                await fetchAllOrders();
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            console.error("Update status error:", error);
            toast.error("Server error while updating status");
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    return (
        <div className='order add'>
            <h3>Order Page</h3>
            {loading ? (
                <div className="order-loading">Loading orders...</div>
            ) : orders.length === 0 ? (
                <div className="order-empty">No orders received yet.</div>
            ) : (
                <div className="order-list">
                    {orders.map((order, index) => (
                        <div key={order._id || index} className='order-item'>
                            <img src={assets.parcel_icon} alt="Parcel Icon" />
                            <div>
                                <p className='order-item-food'>
                                    {order.items.map((item, idx) => {
                                        if (idx === order.items.length - 1) {
                                            return item.name + " x " + item.quantity;
                                        } else {
                                            return item.name + " x " + item.quantity + ", ";
                                        }
                                    })}
                                </p>
                                <p className='order-item-name'>
                                    {order.address.firstName + " " + order.address.lastName}
                                </p>
                                <div className='order-item-address'>
                                    <p>{order.address.street + ", "}</p>
                                    <p>
                                        {order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}
                                    </p>
                                </div>
                                <p className='order-item-phone'>{order.address.phone}</p>
                            </div>
                            <p>Items: {order.items.length}</p>
                            <p>₹{order.amount}</p>
                            <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                                <option value="Food Processing">Food Processing</option>
                                <option value="Out for delivery">Out for delivery</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
