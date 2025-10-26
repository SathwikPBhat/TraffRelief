import React from 'react'
import StaffNavbar from '../components/StaffNavbar'
import VictimCard from '../components/VictimCard'
import Footer from '../components/Footer'

function VictimManagementForStaff() {
  return (
    <main className="w-full bg-stone-100 font-['QuickSand'] flex flex-col min-h-screen">
        <StaffNavbar/>
        <div className='flex flex-col mt-2 gap-4 p-6'>
            <p className='text-2xl font-semibold'>Victim List</p>
            <div className='flex flex-col gap-4 mb-4'>
                <VictimCard/>
                <VictimCard/>
                <VictimCard/>
                <VictimCard/>
            </div>
        </div>
        <Footer/>
    </main>
  )
}

export default VictimManagementForStaff