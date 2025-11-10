import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AuditTable({ tableHeaders, tableData }) {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-hidden rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,105,92,1.00)] hover:scale-101 transition">
      <table className="w-full border-y-3 border-x-2 border-teal-700">
        <thead className="h-14 bg-gray-50 text-black font-['QuickSand'] font-semibold ">
          <tr>
            {tableHeaders.map((curr, i) => {
              return (
                <th key={i} className="px-4 py-3 text-left">
                  {curr}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="bg-white font-['QuickSand'] font-medium">
          {tableData.map((val, i) => {
            return (
              <tr
                key={i}
                className="border-t border-slate-600 hover:bg-gray-50"
              >
                <td className="py-3 px-4 text-sm text-slate-900">{val.date}</td>
                <td className="py-3 px-4 text-sm text-slate-900">{val.id}</td>
                <td className="py-3 px-4 text-sm text-slate-900">
                  {val.victimId}
                </td>
                <td
                  onClick={() => navigate(`/audit/${val.victimId}`)}
                  className="py-3 px-4 text-sm text-teal-600 font-medium cursor-pointer hover:underline"
                >
                  View
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AuditTable;
