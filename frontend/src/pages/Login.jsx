import { useState } from 'react';
import logo from '../assets/logo.png';

function Login() {
  
  const [username,setUsername] = useState("");
  const[password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  }
  return (
    <>
    <main className='w-full min-h-screen bg-stone-100 flex items-center justify-center'>
      <div className='bg-stone-100 border border-teal-800 rounded-2xl min-w-sm p-8 gap-6 flex flex-col'>
        <div className='max-w-full flex justify-center items-center'>
        {/* logo */}
        <img src={logo} alt="" className='w-10 h-10 '/>
        </div>
        <span className='flex  justify-around'>
          {/* admin staff */}
          <div>
          <input type="radio" name="role" value="admin"/>
          <label htmlFor="admin" className="text-2xl font-medium text-teal-800 font-['Playfair_Display']">Admin</label>
          </div>
          <div>
          <input type="radio" name="role" value="staff"/>
          <label htmlFor="staff"  className="text-2xl font-medium text-teal-800 font-['Playfair_Display']">Staff</label>
          </div>
        </span>
        <div className='flex flex-col justify-evenly'>
        {/* username + input */}
        <label htmlFor="username" className="text-slate-700 font-['QuickSand']" >Username</label>
        <input type="text" name="username" value = {username} onChange={(e)=>{setUsername(e.target.value)}}className='border border-teal-800 rounded-xl h-8 w-full p-2 text-sm'/>
        </div>
        <div className='flex flex-col justify-center'>
      {/* password */}
      <label htmlFor="Password" className="text-slate-700 font-['QuickSand']" >Password</label>
        <input type="password" name="password" value = {password} onChange={(e) => setPassword(e.target.value)} className='border border-teal-800 rounded-xl h-8 w-full p-2'/>
        </div>
        <div className='flex justify-center items-center'>
          {/* submit */}
          <button type="submit" onSubmit={handleSubmit} className="bg-teal-600 hover:bg-teal-800 text-white w-1/2 h-9 p-4 mt-6 rounded-2xl border border-gray-800 flex justify-center items-center font-['QuickSand]">Submit</button>
        </div>
      </div>
    </main>
    </>
  )
}

export default Login
