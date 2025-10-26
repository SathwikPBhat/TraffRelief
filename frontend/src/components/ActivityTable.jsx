import React from 'react'

function ActivityTable({tableHeaders,tableData}) {

  return (
    <div className="w-full overflow-hidden rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,105,92,1.00)] hover:scale-101 transition">
              <table className="w-full border-y-3 border-x-2 border-teal-700">
                <thead className="h-14 bg-gray-50 text-black font-['QuickSand'] font-semibold ">
                  <tr>
                    {   tableHeaders.map((curr,i)=>{ 
                        return(
                            <th key={i} className="px-4 py-3 text-left">{curr}</th>
                        )
                        })
                    }
                  </tr>
                </thead>
                <tbody className="bg-white font-['QuickSand'] font-medium">
                  {tableData.map((val, i) => {
                    return (
                      <tr
                        key={i}
                        className="border-t border-slate-600 hover:bg-gray-50"
                      >
                      
                      <td className="py-3 px-4 text-sm text-slate-900">
                        {isNaN(new Date(val.timestamp)) ? val.timestamp : new Date(val.timestamp).toLocaleString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                      </td>
                      
                        <td className="py-3 px-4 text-sm text-slate-900">
                          {val.activity}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-900">
                          {val.description}
                        </td>
                        
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
  )
}

export default ActivityTable