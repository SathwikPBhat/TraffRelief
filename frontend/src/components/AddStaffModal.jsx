import React,{useState, useEffect} from 'react'
import { IoCloseCircleOutline } from "react-icons/io5";
import { toast } from 'react-toastify';
import { createPortal } from 'react-dom';

function AddStaffModal({showModal}) {
    const [loading, setLoading] = useState(false);
    const [centreData, setCentreData] = useState([]);
    const token = localStorage.getItem("token");
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password:'',
        center: '',
        role:'',
        file: null
    });

    function handleChange(e){
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    }

    const getCentreDetails = async() =>{ 
        try{
            const res = await fetch(`http://localhost:5000/stats/centre-details`,{
                method:"GET",
                headers:{ Authorization : `Bearer ${token}` }
            })
            const data = await res.json();
            if(res.status == 200){
                setCentreData(data.centresUnderAdmin);
            } else{
                toast.error(data.message, {toastId: "centreFetchError"});
            }
        } catch(err){
            toast.error(err.message, {toastId: "centreFetchError"});
        }
    }

    useEffect(()=>{
        getCentreDetails();
    },[token]);

    const handleSubmit= async(e)=>{
        e.preventDefault();
        setLoading(true);
        try{
           const res =  await fetch('http://localhost:5000/admin/add-staff',{
                method:'POST',
                headers:{
                    'Authorization': `Bearer ${token}`,
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
                    center: '',
                    role:'',
                    file: null
                })
            } else {
                toast.error(data.message, {toastId: "addStaffError"});
            }
        } catch(err){
            toast.error(err.message, {toastId: "addStaffError"});
        } finally {
            setLoading(false);
        }
    }

    return createPortal(
      <>
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          onClick={()=>showModal(false)}
        />
        <div className="fixed inset-0 z-[61] flex items-start justify-center overflow-y-auto p-4 sm:p-6">
          <div className="relative mx-auto my-8 w-[92%] max-w-3xl">
            <div className="bg-stone-100 font-['QuickSand'] border border-teal-700 rounded-xl shadow-lg">
              <div className='relative flex p-4 items-center justify-center border-b border-teal-600 bg-stone-200 rounded-t-xl'>
                <p className='text-2xl font-semibold'>Add Staff</p>
                <button
                  onClick={()=>showModal(false)}
                  aria-label="Close"
                  className='absolute right-4 text-teal-800 hover:text-teal-900'
                >
                  <IoCloseCircleOutline className='text-2xl hover:text-red-700'/>
                </button>
              </div>

              <div className='flex py-4 px-6 w-full justify-center'>
                <form onSubmit={handleSubmit} className='grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 lg:gap-4 gap-2 border border-teal-600 shadow-[0px_2px_4px_0px_rgba(0,105,92,1.00)] rounded-xl p-6 w-full'>
                    {/* Name */}
                    <div className='flex flex-col gap-2 mb-4'>
                        <label htmlFor="name">Name</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full h-10 p-2 rounded-xl border border-teal-800 mb-4"/>
                    </div>
                    {/* Email */}
                    <div className='flex flex-col gap-2 mb-4'>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full h-10 p-2 rounded-xl border border-teal-800 mb-4"/>
                    </div>
                    {/* Phone */}
                    <div className='flex flex-col gap-2 mb-4'>
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full h-10 p-2 rounded-xl border border-teal-800 mb-4"/>
                    </div>
                    {/* Role */}
                    <div className='flex flex-col gap-2 mb-4'>
                        <label htmlFor="role">Role</label>
                        <select name="role" value={formData.role} onChange={handleChange} className='w-full p-2 border border-teal-800 rounded-xl mb-4'>    
                            <option value="">----Select A Role----</option>
                            <option value="center-manager">Center Manager</option>
                            <option value="administrative-officer">Administrative Officer</option>
                            <option value="counselor">Counselor</option>
                            <option value="medical-officer">Medical Officer</option>
                            <option value="psychologist">Psychologist</option>
                        </select>
                    </div>
                    {/* Password */}
                    <div className='flex flex-col gap-2 mb-4'>
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full h-10 p-2 rounded-xl border border-teal-800 mb-4"/>
                    </div>
                    {/* Centre */}
                    <div className='flex flex-col gap-2 mb-4'>
                        <label htmlFor="center">Center</label>
                        <select name="center" value={formData.center} onChange={handleChange} className='w-full p-2 border border-teal-800 rounded-xl mb-4'>    
                            <option value="">----Select A Center----</option>
                            {centreData.map((centre, idx) => (
                              <option key={idx} value={centre.centreId}>
                                {centre.centreName}
                              </option>
                            ))}
                        </select>
                    </div>
                    {/* File */}
                    <div className='flex flex-col gap-2 mb-4 lg:col-span-2'>
                        <label htmlFor="file">Upload File</label>
                        <input
                          type="file"
                          name="file"
                          onChange={(e)=> setFormData(prev => ({...prev, file: e.target.files?.[0] || null}))}
                          className=' w-full p-2 border border-teal-800 h-10 rounded-xl mb-4'
                        />
                    </div>
                    {/* Submit */}
                    <div className='flex flex-col gap-2 mb-4 items-center justify-center lg:col-span-2 md:col-span-2'>
                        <button type="submit" className='w-1/3 min-h-10 bg-teal-600 text-white justify-center items-center rounded-xl p-2'>
                          {loading ? 'Adding...' : 'Add Staff'}
                        </button>
                    </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>,
      document.body
    );
}

export default AddStaffModal