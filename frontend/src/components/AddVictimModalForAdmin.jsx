import React,{useState} from 'react'
import { IoCloseCircleOutline } from "react-icons/io5";
import Select from 'react-select';

function AddVictimModalForAdmin() {

    const [langs, setLangs] = useState([]);

    const handleLangChange = (selected) => {
    setLangs(selected);
    };

    const languageOptions = [
        { value: "en", label: "English" },
        { value: "hi", label: "Hindi" },
        { value: "kn", label: "Kannada" },
        { value: "ta", label: "Tamil" },
        { value: "te", label: "Telugu" },
        { value: "mr", label: "Marathi" },
        { value: "bn", label: "Bengali" }, 
        { value: "gu", label: "Gujarati" }, 
        { value: "pa", label: "Punjabi" },
        { value: "ur", label: "Urdu" },
        { value: "ml", label: "Malayalam" },
        { value: "or", label: "Odia" },
        { value: "tcy", label: "Tulu" }, 
        { value: "kok", label: "Konkani" }
    ];
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '2rem',
            borderRadius: '0.75rem', 
            borderColor: state.isFocused ? '#047857' : '#047857', 
            boxShadow: state.isFocused ? '0 0 0 1px #047857' : 'none',
            '&:hover': {
                borderColor: '#047857',
            },
            backgroundColor: '#F5F5F5', 
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#0f766e' : state.isFocused ? '#e0f2f1' : 'white', // teal-700/teal-50
            color: state.isSelected ? 'white' : 'black',
            fontWeight: state.isSelected ? 'bold' : 'normal',
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#ccfbf1', // teal-100 for selected tag background
            borderRadius: '0.5rem',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#0f766e', // teal-700 for text
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: '#0f766e',
            '&:hover': {
                backgroundColor: '#99f6e4', // teal-200 on hover
                color: 'white',
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#9CA3AF', 
        }),
    };

    const traffickingTypes = ["Sexual","Child","Labor","Domestic","Organ","Cyber","Other"];

  return (
    
    <div className="w-full bg-stone-100 font-['QuickSand']" >
        <div className='w-full flex justify-center items-center gap-4 p-4 border border-teal-600'>
            <p className='text-center lg:text-3xl'>Add Victims</p>
            <IoCloseCircleOutline className='absolute right-4'/>
        </div>
        <form className='w-full flex flex-col items-center justify-around lg:px-28 px-8 py-8 gap-8'>
            <div className='w-full border border-teal-600 shadow-[0px_2px_4px_0px_rgba(0,105,92,1.00)] rounded-xl'>
                <div className='w-full bg-teal-800 text-white p-2 flex items-center justify-center rounded-t-xl lg:text-2xl'>Personal Information</div>
                <div className='w-full p-6 bg-stone-200 rounded-b-xl'>


                    <div className='grid lg:grid-cols-5 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4 justify-center'>
                        <div className='flex flex-col gap-2 lg:col-start-1 lg:col-end-3'>
                            <label htmlFor="name">Name</label>
                            <input type="text" className=' h-8 p-2 border border-teal-600 rounded-xl bg-stone-100 '/>
                        </div>
                        <div className='flex flex-col gap-2 lg:col-start-3 lg:col-end-6'>
                            <label htmlFor="age">Age</label>
                            <input type="number" className='h-8 p-2 border border-teal-600 rounded-xl bg-stone-100'/>
                        </div>
                        <div className='flex flex-col gap-2 lg:col-start-1 lg:col-end-2'>
                            <label htmlFor="gender">Gender</label>
                            <select name="gender" className='h-8 px-2  border border-teal-600 rounded-xl bg-stone-100'>
                                <option value="">---Select a Gender---</option>
                                <option value="male">M</option>
                                <option value="female">F</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className='flex flex-col gap-2 lg:col-start-2 lg:col-end-4'>
                            <label htmlFor="language">Languages Spoken</label>
                            <Select
                                options={languageOptions}
                                isMulti 
                                placeholder="Select languages spoken…"
                                value={langs} // Use the state variable
                                onChange={handleLangChange} // Use the handler
                                closeMenuOnSelect={false}  
                                hideSelectedOptions={false}
                                styles={customStyles} // Apply the custom styles
                                classNamePrefix="react-select"
                            />
                        </div>
                        <div className='flex flex-col gap-2 lg:col-start-4 lg:col-end-6'>
                            <label htmlFor="center">Center</label>
                            <select name="center" className='h-8 px-2  border border-teal-600 rounded-xl bg-stone-100'>
                                <option value="">---Select a Center---</option>
                                <option value="center1">Center 1</option>
                                <option value="center2">Center 2</option>
                                <option value="center3">Center 3</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>


            <div className='w-full border border-teal-600 shadow-[0px_2px_4px_0px_rgba(0,105,92,1.00)] rounded-xl'>
                <div className='w-full bg-teal-800 text-white p-2 flex items-center justify-center rounded-t-xl lg:text-2xl'>Case Information</div>
                <div className='w-full p-6 bg-stone-200 rounded-b-xl'>


                    <div className='grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4 justify-center'>
                        <div className='flex flex-col gap-2 '>
                            <label htmlFor="TraffickingType">Type of Trafficking</label>
                            <select name="traffickingType" className='h-8 px-2  border border-teal-600 rounded-xl bg-stone-100'>
                                    <option value="">---Select Type of Trafficking---</option>
                                    {
                                        traffickingTypes.map((type, idx)=>{
                                            return <option key={idx} value={type}>{type}</option>
                                        })
                                    }
                                
                            </select>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="geographicLocations">Geographic Locations</label>
                            <input type="text" placeholder="Ex: Mumbai, Delhi" className='h-8 p-2 border border-teal-600 rounded-xl bg-stone-100'/>
                        </div>
                        <div className='flex flex-col gap-2 '>
                            <label htmlFor="controlMethods">Methods of Control</label>
                            <select name="controlMethods" className='h-8 px-2  border border-teal-600 rounded-xl bg-stone-100'>
                                <option value="">---Select Methods---</option>
                            </select>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="duration">Duration of Exploitation</label>
                            <input type="text" placeholder="Ex: 6 months" className='h-8 p-2 border border-teal-600 rounded-xl bg-stone-100'/>
                        </div>
                        <div className='flex flex-col gap-2 lg:col-start-1 lg:col-end-3'>
                            <label htmlFor="certificate">Previous attempts at rescue</label>
                            <input type = "file" className=' h-8 p-2 border border-teal-600 rounded-xl bg-stone-100 '/>
                        </div>
                    </div>
                </div>
            </div>
            <button type = "submit" className='h-8 p-2 flex items-center justify-center text-white bg-teal-700 rounded-xl w-1/4'>Add</button>
        </form>
    </div>

    
  )
}

export default AddVictimModalForAdmin