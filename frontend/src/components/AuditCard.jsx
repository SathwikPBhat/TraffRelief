import { useNavigate } from 'react-router-dom'; 

function AuditCard({ data }) {
  const { auditId, date, staffName, victimName } = data; 
  const displayDate = date ? new Date(date).toLocaleDateString() : 'N/A';
  const navigate = useNavigate(); 

  return (
    <div className="w-full rounded-xl border border-teal-600 bg-white p-4 shadow-sm hover:shadow-md transition font-['QuickSand']">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-black">{auditId}</span>
            <span className="text-xs px-2 py-1 rounded-md border border-teal-500 bg-teal-50 text-teal-700 tracking-wide">
              {displayDate}
            </span>
          </div>
          <div className="flex flex-col text-sm text-slate-700">
            <span>
              By: <span className="font-medium text-black">{staffName}</span>
            </span>
            <span>
              Of: <span className="font-medium text-black">{victimName}</span>
            </span>
          </div>
        </div>

        <button
          type="button"
          className="h-full px-3 flex items-center justify-center rounded-md border border-teal-500 text-teal-600 text-lg font-bold hover:bg-teal-50 active:scale-95 transition"
          aria-label={`View audit ${auditId}`}
          onClick={() => navigate(`/audit-summary/${auditId}`, { state: { auditId } })}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

export default AuditCard;