import React from 'react'

function Pagination({curr, total, onPageChange}) {

function getPageNumbers(){
    const pages = [];
    const start = Math.max(curr-1,2);
    const end = Math.min(curr+1,total-1);
    pages.push(1);
    if(start > 2) pages.push('...');
    for(let i = start; i <= end; i++){
        pages.push(i);
    }
    if(end < total - 1) pages.push('...');
    if(total > 1) pages.push(total);
    
    return pages;
    
}

  return (

    <div className='flex justify-center items-center mt-4 text-gray-700 font-semibold'>
    <button onClick={()=> onPageChange(curr - 1)} disabled={curr === 1} className='px-3 py-1 mr-2 font-bold disabled:text-gray-500 disabled:opacity-50 hover:bg-gray-100 transition'>
    &lt;
    </button>
    {
        getPageNumbers().map((pageNo)=> (
            <button key={pageNo} onClick={()=>onPageChange(pageNo)} className={`w-8 h-8 mx-1 transition ${pageNo === curr ? ' text-black font-bold shadow-md' : 'font-normal'}`}>
                {pageNo}
            </button>
        ))
    }


    <button onClick={()=> onPageChange(curr + 1)} disabled={curr === total} className='px-3 py-1 ml-2 font-bold disabled:text-gray-500 disabled:opacity-50 hover:bg-gray-100 transition'>
    &gt;
    </button>
    </div>
  )
}

export default Pagination