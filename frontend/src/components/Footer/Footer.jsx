import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>

        <div className="footer-content">

            <div className="footer-content-left">
                <img src={assets.logo} alt=""/>
                <p> Tomato is a full-stack food delivery application that allows users to explore food items,
                    manage their cart, place orders, make secure online payments, and manage their accounts.
                    The application is built using React.js, Node.js, Express.js, and MongoDB, 
                    with REST APIs for communication between the frontend and backend. It includes features such
                    as User Authentication, Food Management, Cart Management, Order Management, Payment System, 
                    and REST API integration, providing a complete and user-friendly food ordering experience.
                </p>

                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                </div>
            </div>

            <div className="footer-content-center">
                 <h2>COMPANY</h2>
                 <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>
                 </ul>
            </div>

            <div className="footer-content-right">
                 <h2>GET IN TOUCH</h2>
                 <ul>
                    {/* <li>+91 9334513107</li> */}
                    {/* <li>mohammadsakib7151@gmail.com</li> */}
                    <a href="tel:+919334513107">+91 9334513107</a>
                    <hr/>
                  <a href="mailto:mohammadsakib7151@gmail.com">
                    mohammadsakib7151@gmail.com
                  </a>
                 </ul>
            </div>
        </div>
      
      <hr/>
      <p className="footer-copyright">© Tomoto Food Delivery | Full Stack Project.</p>
    </div>
  )
}

export default Footer
