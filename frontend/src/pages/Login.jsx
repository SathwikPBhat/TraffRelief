import { useState } from 'react';
import logo from '../assets/logo.png';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { RxEyeOpen } from "react-icons/rx";
import { RxEyeClosed } from "react-icons/rx";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    role: "",
    id : "",
    password:""
  });

  function handleChange(e){
    const {name, value} = e.target;
    setLoginData((prev) => ({...prev, 
      [name] : value
    })
  )}

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(loginData);
    try{
        const res = await fetch('http://localhost:5000/user/login',{
              method: 'POST',
              headers:{
                'Content-Type':'application/json'
              },
              body: JSON.stringify(loginData)
        })
        const data = await res.json();
        if(res.status == 200){

          toast.success(data.message, {toastId : "loginSuccess"});
          localStorage.setItem("token", data.token);
          localStorage.setItem("id", loginData.id);
          localStorage.setItem("role", loginData.role);
          if(loginData.role === 'admin'){
            navigate('/admin/dashboard');
          }
          else{
            navigate('/staff/dashboard');
          }
        }
        else{
          toast.error(data.message, {toastId:"loginFailure"});
        }
      }
    catch(err){
      toast.error(err.message, {toastId:"loginFailure"});
    }
  }


  return (
    <>
    <main className='w-full min-h-screen bg-stone-100 flex items-center justify-center'>
      <form  onSubmit={handleSubmit} className='bg-stone-100 border border-teal-800 rounded-2xl min-w-sm p-8 gap-6 flex flex-col shadow-[0px_2px_4px_0px_rgba(0,105,92,1.00)]'>
        <div className='max-w-full flex justify-center items-center'>
        {/* logo */}
        <img src={logo} alt="" className='w-10 h-10 '/>
        </div>
        <span className='flex  justify-around'>
          {/* admin staff */}
          <div>
          <input type="radio" name="role" value="admin" onChange={handleChange} required/>
          <label htmlFor="admin" className="text-2xl font-medium text-teal-800 font-['Playfair_Display']">Admin</label>
          </div>
          <div>
          <input type="radio" name="role" value="staff" onChange={handleChange} required/>
          <label htmlFor="staff"  className="text-2xl font-medium text-teal-800 font-['Playfair_Display']">Staff</label>
          </div>
        </span>
        <div className='flex flex-col justify-evenly'>
        {/* id + input */}
        <label htmlFor="id" className="text-slate-700 font-['QuickSand']" >ID</label>
        <input type="text" name="id" value = {loginData.id} onChange={handleChange} className='border border-teal-800 rounded-xl h-8 w-full p-2 text-sm'/>
        </div>
        <div className='flex flex-col justify-center'>
      {/* password */}
      <label htmlFor="Password" className="text-slate-700 font-['QuickSand']" >Password</label>
      <div className='relative'>
        <input type={showPassword ? "text" : "password"} name="password" value = {loginData.password} onChange={handleChange} className='border border-teal-800 rounded-xl h-8 w-full p-2 pr-10'/>
        {
          showPassword ? 
          <RxEyeOpen onClick = {()=>setShowPassword(prev => !prev)} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer'/> :
          <RxEyeClosed onClick = {()=>setShowPassword(prev => !prev)} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer'/>
        }
      </div>
        </div>
        <div className='flex justify-center items-center'>
          {/* submit */}
          <button type="submit" className="bg-teal-600 hover:bg-teal-800 text-white w-1/2 h-9 p-4 mt-6 rounded-2xl border border-gray-800 flex justify-center items-center font-['QuickSand]">Submit</button>
        </div>
      </form>
    </main>
    </>
  )
}

export default Login
