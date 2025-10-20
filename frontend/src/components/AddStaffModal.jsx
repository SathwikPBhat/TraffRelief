import React,{useState} from 'react'
import { IoCloseCircleOutline } from "react-icons/io5";
import { toast } from 'react-toastify';

function AddStaffModal({showModal}) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password:'',
        center: '#',
        file: null
    });

    function handleChange(e){
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    }

    const handleSubmit= async(e)=>{
        e.preventDefault();
        setLoading(true);
        console.log(formData);
        try{
           const res =  await fetch('http://localhost:5000/admin/add-staff',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)
            });

            const data = await res.json();
            if(res.status == 201){
                toast.success(data.message, {toastId: "addStaffSuccess"});
                showModal(false);
                setFormData({
                    fullName: '',
                    email: '',
                    phoneNumber: '',
                    password: '',
                    center: '#',
                    file: null
                })
                setLoading(false);
            }
            else{
                toast.error(data.message, {toastId: "addStaffError"});
                setLoading(false);
            }
        }
        catch(err){
            toast.error(data.message, {toastId: "addStaffError"});
            setLoading(false);
        }
    }

  return (
    <div className="flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 border border-teal-800 m-4 rounded-xl">
        <div className="bg-stone-100 font-['QuickSand']  rounded-xl w-full ">
            <div className='flex p-4 items-center justify-center shadow-[0px_2px_20px_0px_rgba(96,125,139,0.50)] border-b border-b-green-600 bg-stone-200'>
                <p className='text-2xl font-semibold'>Add Staff</p>
                <IoCloseCircleOutline onClick={()=>showModal(false)} className='justify-end hover:text-red-500 hover:scale-130 hover:cursor-pointer absolute right-4'/>
            </div>
            <div className='flex py-4 px-6 w-full'>
                <form onSubmit={handleSubmit} className='w-full border border-teal-600 shadow-[0px_2px_4px_0px_rgba(0,105,92,1.00)] rounded-xl p-6'>
                    <div className='flex items-center justify-between gap-4 mb-4 w-full'>
                        <div className='flex flex-col gap-2 w-1/2'>
                            <label htmlFor="name">Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="h-10 p-2 rounded-xl border border-teal-800"/>
                        </div>
                        <div className='flex flex-col gap-2 w-1/2'>
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange}  className="h-10 p-2 rounded-xl border border-teal-800"/>
                        </div>
                    </div>
                    <div className='w-full flex items-center gap-4 mb-4'>
                        <div className='flex flex-col gap-2 w-1/4'>
                            <label htmlFor="phone">Phone Number</label>
                            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange = {handleChange} className="h-10 p-2 rounded-xl border border-teal-800"/>
                        </div>
                        <div className='flex flex-col gap-2 w-1/3'>
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange}className="h-10 p-2 rounded-xl border border-teal-800"/>
                        </div>
                        <div className='flex flex-col gap-2 w-1/3'>
                            <label htmlFor="center">Center</label>
                            <select name="center" value={formData.center} onChange = {handleChange}className='p-2 border border-teal-800 rounded-xl'>
                                <option value="#">----Select A Center----</option>
                                <option value="center1">Center 1</option>
                                <option value="center2">Center 2</option>
                                <option value="center3">Center 3</option>
                            </select>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 mb-4'>
                        <input type="file" className=' p-2 flex w-full border border-teal-800 h-10 rounded-xl'/>
                    </div>
                    
                    <div className='flex flex-col gap-2 mb-4 items-center justify-center'>
                        <button type="submit" className='w-1/3 h-10 bg-teal-600 text-white justify-center items-center rounded-xl p-2'>
                        {
                            loading ? 'Adding...' : 'Add Staff'
                        }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default AddStaffModal