import React,{ useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import userEcomStore from '../../store/ecom-store';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();

  const actionLogin = userEcomStore((state) => state.actionLogin);
  const user = userEcomStore((state) => state.user);
  console.log("user from zustand",user);
  


  const [form, setForm] = useState({
    email:"",
    password:""
  });

  const handleOnChange = (e)=>{
    // console.log(e.target.name,e.target.value);
    setForm({
      ...form,
      [e.target.name]:e.target.value
    });
  };

  const handleSubmit = async (e)=>{
    e.preventDefault(); //prevent from to refresh
    
    
    // send to backend
    try{
      const res = await actionLogin(form);
      // store role to check admin or user
      const role = res.data.payload.role;
      console.log(role);
      roleRedirect(role);
      toast.success('Welcome')
    }catch(err){
      console.log(err);
      const errMsg = err.response?.data?.message
      toast.error(errMsg)
    }
  }

  // redirect admin and user
  const roleRedirect = (role) => {
    if (role === 'admin') {
      navigate('/admin')
    }else{
      navigate('/user')
    }
  }



  return (
    <div>
      Login

      <form onSubmit={handleSubmit}>
        email
        <input className='border' 
          onChange={handleOnChange}
          name='email'
          type='email'
          
        />

        password
        <input className='border' 
          onChange={handleOnChange}
          name='password'
          type='text'
          
        />

          

        <button className='bg-teal-400 rounded-md'>Login</button>

      </form>
    </div>
  )
}

export default Login
