import React, { useContext, useEffect } from 'react'
import './Verify.css'
import {useNavigate, useSearchParams} from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {
  
    const [searchParams, setSearchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const {url} = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        if (success === "true") {
            navigate(`/order-success?orderId=${orderId || ''}`, { replace: true });
        } else {
            navigate("/", { replace: true });
        }
    }

    useEffect(()=>{
      verifyPayment();
    },[])
    

  return (
    <div className='verify'>
      <div className='spinner'>

      </div>

    </div>
  )
}

export default Verify

