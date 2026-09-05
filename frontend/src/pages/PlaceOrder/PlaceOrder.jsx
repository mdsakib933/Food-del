import React, { useContext,useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios';

const PlaceOrder = () => {

const{getTotalCartAmount,token,food_list,cartItems,url} = useContext(StoreContext);

  const [data,setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}));
  }


  const placeOrder = async (event) => {
  event.preventDefault();

  // Cart empty check
  if (getTotalCartAmount() === 0) {
    alert("Your cart is empty");
    return;
  }

  let orderItems = [];

  food_list.forEach((item) => {
    if (cartItems[item._id] > 0) {
      orderItems.push({
        ...item,
        quantity: cartItems[item._id]
      });
    }
  });

  const orderData = {
    items: orderItems,
    amount: getTotalCartAmount() + 2,
    address: data
  };

  try {

    // Create Razorpay order from backend
    const response = await axios.post(
      url + "/api/order/place",
      orderData,
      {
        headers: {
          token
        }
      }
    );

    if (!response.data.success) {
      window.location.href = `/payment-failed?reason=${encodeURIComponent(response.data.message || "Unable to create order")}`;
      return;
    }

    const {
      order_id,
      amount,
      currency,
      dbOrderId
    } = response.data;

    // Razorpay Checkout
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount,
      currency: currency,
      name: "Tomato",
      description: "Food Delivery Payment",
      order_id: order_id,

      handler: async function (paymentResponse) {
        try {
          // Verify payment on backend
          const verifyResponse = await axios.post(
            url + "/api/order/verify",
            {
              orderId: dbOrderId,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature
            },
            {
              headers: { token }
            }
          );

          if (verifyResponse.data.success) {
            window.location.href = `/order-success?orderId=${dbOrderId}`;
          } else {
            window.location.href = `/payment-failed?reason=${encodeURIComponent("Payment verification failed")}`;
          }

        } catch (error) {
          console.log(error);
          window.location.href = `/payment-failed?reason=${encodeURIComponent("Payment verification error")}`;
        }
      },

      prefill: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contact: data.phone
      },

      notes: {
        address: data.street
      },

      theme: {
        color: "#ff6347"
      }
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", function (response) {
      console.log("Payment Failed:", response.error);
      const errorMsg = response.error?.description || "Payment failed or was cancelled by user.";
      window.location.href = `/payment-failed?reason=${encodeURIComponent(errorMsg)}`;
    });

    razorpay.open();

  } catch (error) {
    console.log(error);
    const errMsg = error.response?.data?.message || "Something went wrong while processing your payment.";
    window.location.href = `/payment-failed?reason=${encodeURIComponent(errMsg)}`;
  }
};

  return (
    <form onSubmit={placeOrder}  className='place-order'>

      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' />
        </div>

        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />

        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>

        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>

        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />

      </div>
      <div className="place-order-right">

        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${getTotalCartAmount()}</p>
            </div>
            <hr/>
            <div className="cart-total-details">
                <p>Delivery Free</p>
                <p>${getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr/>
            <div className="cart-total-details">
                <b>Total</b>
                <b>${getTotalCartAmount()===0?0:getTotalCartAmount() +2}</b>
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>

      </div>

    </form>
  )
}

export default PlaceOrder


