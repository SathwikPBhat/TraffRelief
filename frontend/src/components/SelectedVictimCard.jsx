import React from 'react'

function SelectedVictimCard({name, onDelete}) {
  return (
   
        <div className="h-10 p-2 rounded-xl border border-teal-800 font-['QuickSand'] flex items-center justify-between gap-4">
            <p className='text-teal-600 text-sm text-left'>{name}</p>
            <p onClick = {()=>onDelete(name)} className='text-gray-600 font-md font-bold hover:text-red-900 hover:cursor-pointer'>X</p>
        </div>
  
  )
}

export default SelectedVictimCard