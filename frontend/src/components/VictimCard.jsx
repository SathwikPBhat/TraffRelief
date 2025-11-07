import React from 'react';
import golimaams from '../assets/golimaams.png';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function VictimCard({victimData}) {
    const navigate = useNavigate();
    const handleNavigate = () =>{
        navigate(`/victim-profile/${victimData.victimId}`);
    }
  return (
    <div className='w-full rounded-xl border border-teal-600 shadow-[0px_4px_4px_0px_rgba(0,105,92,1.00)] bg-white flex flex-col sm:flex-row p-4 gap-4 justify-between font-[QuickSand] relative'>
        <div className='flex gap-4 w-full'>
            <div className='flex items-center justify-center'>
                <img src={golimaams} className='size-20' alt="victim_img" />
            </div>
            <div className='flex flex-col gap-2 justify-evenly'>
                <div className='flex items-center gap-2'>
                    <p>Id : {victimData.victimId}</p>
                    <p>Age : {victimData.age}</p>
                    <p>Gender : {victimData.gender}</p>
                </div>
                <div>
                    <p className='lg:text-2xl md:text-xl text-lg font-bold'>{victimData.fullName}</p>
                </div>
            </div>
        </div>
        <div className='flex flex-col sm:flex-row lg:w-1/3 md:w-1/3 w-full items-center justify-start lg:gap-20 gap-10'>
            <div className='flex flex-col gap-2 justify-center w-full sm:w-auto'>
                <p className='text-lg sm:text-md xs:text-sm'>Status</p>
                <p className='text-xl font-semibold sm:text-md xs:text-sm'>{victimData.status}</p>
            </div>
            <div className='flex flex-col gap-2 justify-center w-full sm:w-auto'>
                <p className='text-lg sm:text-md xs:text-sm'>Actions</p>
                <p className='text-xl font-semibold sm:text-md xs:text-sm'>Walking</p>
            </div>
        </div>
        <FaExternalLinkAlt className='absolute right-4 top-2' onClick = {handleNavigate}/>
    </div>
  );
}

export default VictimCard;