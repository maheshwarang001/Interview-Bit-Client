import React, { useState, useEffect } from 'react';
import LoginService from '../services/LoginService';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { validateToken } from '../services/AuthService';

const Login = () => {

    const loginstate = {
        email: '',
        pwd: ''
      };

    const [isError, setIsError] = useState(false);

    const [formData, setFormData] = useState(loginstate);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const navigate = useNavigate();

    const handleSubmit = (e) => {
    e.preventDefault();

    LoginService.save(formData)
    .then((response) => {
        console.log(response);
        navigate('/home');
      })
      .catch((e) => {
        console.log(e);
      });


    console.log('Email:', formData.email);
    console.log('Password:', formData.pwd);
  };


  useEffect(() => {
    async function fetchData() {
      try {
      
        const result = await validateToken(Cookies.get('token')); 
        if(result===true){
            navigate("/home");
        }else{
          throw new Error("Invalid token");
        }
       
      } catch (error) {
        setIsError(true);
      }
    }
    fetchData();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="w-1/4 relative">
        <div className=" relative z-10 bg-gray-900 p-10 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-white">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-white">Email {formData.email ? '' : <span className="text-red-600">*</span>}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required={true}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-white">Password {formData.pwd ? '' : <span className="text-red-600">*</span>}</label>
              <input
                type="password"
                id="password"
                name='pwd'
                value={formData.pwd}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required={true}
              />
            </div>
            <button type="submit" className="w-full bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-purple-600">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
