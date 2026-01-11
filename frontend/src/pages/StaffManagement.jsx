import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import AdminNavbar from "../components/AdminNavbar";
import Pagination from "../components/Pagination";
import AddStaffModal from "../components/AddStaffModal";
import { toast } from "react-toastify";
import { fetchDistinctRoles, fetchCentreDetails } from "../utils/CommonFetches";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function StaffManagement() {
  const [victimSearch, setVictimSearch] = useState("");
  const [staffSearch, setStaffSearch] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedVictimIds, setSelectedVictimIds] = useState([]);
  const [selectedVictims, setSelectedVictims] = useState([]);
  const [unassignedVictims, setUnassignedVictims] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const token = localStorage.getItem("token");
  const [staffData, setStaffData] = useState([]);
  const statuses = ["active", "inactive"];
  const [roles, setRoles] = useState([]);
  const [centres, setCentres] = useState([]);
  const navigate = useNavigate();

  const fetchUnassignedVictims = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/admin/get-unassigned-victims`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.status == 200) {
        setUnassignedVictims(data.victims);
        console.log(data.victims);
      } else {
        toast.error(data.message, { toastId: "fetchUnassignedVictimsError" });
      }
    } catch (err) {
      toast.error(err.message, { toastId: "fetchUnassignedVictimsError" });
    }
  };
  const fetchStaffDetails = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/admin/view-staffs`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.status == 200) {
        setStaffData(data.staffs);
        console.log(data.staffs);
      } else {
        toast.error(data.message, { toastId: "fetchStaffError" });
      }
    } catch (err) {
      toast.error(err.message, { toastId: "fetchStaffError" });
    }
  };

  useEffect(() => {
    fetchStaffDetails();
    fetchDistinctRoles(token, setRoles);
    fetchCentreDetails(token, setCentres);
    fetchUnassignedVictims();
  }, [token]);

  const deleteVictim = (nameToDelete) =>
    setSelectedVictims((currentVictims) =>
      currentVictims.filter((name) => name !== nameToDelete)
    );

  const [filters, setFilters] = useState({
    centre: "",
    role: "",
    status: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const handleFilters = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrPage(1);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    const finalQuery = query.trim().toLowerCase();
    setSearchQuery(finalQuery);
    setCurrPage(1);
  };

  const getFilteredData = () => {
    let filtered = staffData;
    if (searchQuery.trim()) {
      filtered = filtered.filter((staff) => {
        return (
          staff.staffId.toLowerCase().includes(searchQuery) ||
          staff.fullName.toLowerCase().includes(searchQuery)
        );
      });
    }
    if (filters.centre) {
      filtered = filtered.filter((staff) => staff.centre === filters.centre);
    }
    if (filters.role) {
      filtered = filtered.filter((staff) => staff.role === filters.role);
    }
    if (filters.status) {
      filtered = filtered.filter((staff) => staff.status === filters.status);
    }
    return filtered;
  };

  const filteredData = getFilteredData();
  const clearFilters = () => {
    setFilters({
      centre: "",
      role: "",
      status: "",
    });
    setSearchQuery("");
  };

  const totalPages = Math.ceil(filteredData.length / 4);
  const startIdx = (currPage - 1) * 4;
  const endIdx = startIdx + 4;
  const visibleRows = filteredData.slice(startIdx, endIdx);

  const handlePageChange = (pageNo) => {
    if (pageNo >= 1 && pageNo <= totalPages) setCurrPage(pageNo);
  };

  const filteredStaffForSelect = staffData.filter(
    (s) =>
      !staffSearch ||
      s.fullName.toLowerCase().includes(staffSearch.toLowerCase()) ||
      s.staffId.toLowerCase().includes(staffSearch.toLowerCase())
  );

  const filteredVictimsForSelect = unassignedVictims.filter(
    (v) =>
      !victimSearch ||
      v.fullName.toLowerCase().includes(victimSearch.toLowerCase()) ||
      v.victimId.toLowerCase().includes(victimSearch.toLowerCase())
  );

  const toggleVictim = (victim) => {
    setSelectedVictimIds((prev) =>
      prev.includes(victim.victimId)
        ? prev.filter((id) => id !== victim.victimId)
        : [...prev, victim.victimId]
    );
    setSelectedVictims((prev) =>
      prev.find((v) => v.victimId === victim.victimId)
        ? prev.filter((v) => v.victimId !== victim.victimId)
        : [...prev, victim]
    );
  };
  const handleAssign = async () => {
    if (!selectedStaff) {
      toast.error("Select a staff first", { toastId: "assignNoStaff" });
      return;
    }
    if (selectedVictimIds.length === 0) {
      toast.error("Select at least one victim", { toastId: "assignNoVictim" });
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/admin/assign-victims`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            staffId: selectedStaff.staffId,
            victimIds: selectedVictimIds,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Victims assigned", { toastId: "assignSuccess" });
        // Refresh victims & staff if needed
        fetchUnassignedVictims();
        fetchStaffDetails();
      setSelectedVictimIds([]);
      setSelectedVictims([]);
      setSelectedStaff(null);
      } else {
        toast.error(data.message || "Assign failed");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const [staffModal, setStaffModal] = useState(false);
  return (
    <>
      <main className="w-full min-h-screen bg-stone-200 flex flex-col items-start font-['QuickSand']">
        <AdminNavbar />
        <div className="w-full p-6 flex-col items-center gap-6">
          <div className="w-full flex flex-col gap-2">
            {/* search + filter by */}
            <div className="w-full py-2 flex justify-between items-center">
              <div className="flex flex-col w-1/2">
                {/* search */}
                <label htmlFor="search-staff">Search Staff</label>
                <input
                  type="search"
                  name="search"
                  placeholder="Name,id.."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="h-8 rounded-xl p-2 border border-teal-700 bg-gray-200"
                />
              </div>
              <button
                onClick={clearFilters}
                className="flex justify-center items-center text-white bg-teal-600 font-['QuickSand'] h-6 rounded-xl p-4 border border-gray-800"
              >
                Clear Filters
              </button>
            </div>

            <div className="w-full flex flex-col justify-around">
              {/* filter by */}
              <p>Filter by</p>
              <div className="w-full grid gap-4 lg:grid-cols-3 md:grid-cols-3 grid-cols-1 ">
                <select
                  name="centre"
                  onChange={handleFilters}
                  className="border border-teal-700 rounded-xl  px-2 py-1 bg-gray-200"
                >
                  <option value="">--Select a Centre--</option>
                  {centres.map((centre, idx) => (
                    <option key={idx} value={centre}>
                      {centre}
                    </option>
                  ))}
                </select>
                <select
                  name="role"
                  onChange={handleFilters}
                  value={filters.role}
                  className=" border border-teal-700 rounded-xl  px-2 py-1 bg-gray-200"
                >
                  <option value="">--Select a Role--</option>
                  {roles.map((role, idx) => (
                    <option key={idx} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <select
                  name="status"
                  onChange={handleFilters}
                  value={filters.status}
                  className=" border border-teal-700 rounded-xl px-2 py-1 bg-gray-200"
                >
                  <option value="">--Select Status--</option>
                  {statuses.map((status, idx) => (
                    <option key={idx} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {staffModal ? (
            <AddStaffModal showModal={setStaffModal} />
          ) : (
            <div className="w-full py-4 flex flex-col justify-around gap-4 mt-4">
              {/* stafflist */}

              <div className="w-full flex items-center justify-between">
                <p className="text-3xl font-medium ">Staff List</p>
                <button
                  onClick={() => {
                    setStaffModal(true);
                  }}
                  className="flex items-center justify-center p-2 rounded-xl text-white bg-teal-600 hover:bg-teal-700 hover:cursor-pointer hover:scale-105"
                >
                  Add Staff
                </button>
              </div>
              <div className="w-full overflow-hidden rounded-2xl">
                <table className="w-full border-y-3 border-x-2 border-teal-700">
                  <thead className="h-14 bg-stone-100 text-black font-['QuickSand'] font-semibold">
                    <tr>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left hidden sm:table-cell">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left">Center</th>
                      <th className="px-4 py-3 text-left hidden sm:table-cell">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {visibleRows.map((val, i) => {
                      return (
                        <tr
                          key={i}
                          className="border-t border-gray-200 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {val.fullName}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700 hidden sm:table-cell">
                            {val.role}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700 ">
                            {val.centre.centreName}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700 hidden sm:table-cell">
                            {val.status}
                          </td>
                          <td onClick={()=> navigate(`/staff-profile/${val?.staffId}`)} className="py-3 px-4 text-sm text-teal-600 font-medium cursor-pointer hover:underline">
                            View
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Pagination
                curr={currPage}
                total={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          <div className="mt-6 w-full flex flex-col gap-4">
            <p className="font-medium text-3xl">Assign Victims</p>

            <div className="w-full grid gap-6 lg:grid-cols-2 grid-cols-1">
              <div className="p-6 flex flex-col gap-4 border border-teal-700 shadow-[0_2px_4px_0_rgba(0,105,92,0.5)] rounded-xl bg-white">
                <div className="flex flex-col">
                  <label className="mb-1 font-semibold">Select Staff</label>
                  <input
                    type="search"
                    placeholder="Search by name or ID..."
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                    className="w-full border border-teal-700 rounded-xl h-9 px-3 bg-gray-100"
                  />
                </div>

                <div className="max-h-80 overflow-y-auto border rounded-lg divide-y">
                  {filteredStaffForSelect.length === 0 && (
                    <p className="p-3 text-sm text-slate-500">No staff found</p>
                  )}
                  {filteredStaffForSelect.map((st) => {
                    const active = selectedStaff?.staffId === st.staffId;
                    return (
                      <button
                        type="button"
                        key={st.staffId}
                        onClick={() => setSelectedStaff(st)}
                        className={`w-full text-left px-4 py-3 flex flex-col hover:bg-teal-50 transition ${
                          active ? "bg-teal-100 border-l-4 border-teal-600" : ""
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span
                            className={`font-medium ${
                              active ? "text-teal-800" : ""
                            }`}
                          >
                            {st.fullName}
                          </span>
                          {active && <FaCheck className="text-teal-700" />}
                        </div>
                        <span className="text-xs text-slate-500">
                          {st.staffId} • {st.role}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {selectedStaff && (
                  <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                    <p className="text-sm font-semibold text-teal-800">
                      Selected Staff:
                    </p>
                    <p className="text-sm text-teal-700">
                      {selectedStaff.fullName} ({selectedStaff.role})
                    </p>
                  </div>
                )}
              </div>

              {/* Victim selector */}
              <div className="p-6 flex flex-col gap-4 border border-teal-700 shadow-[0_2px_4px_0_rgba(0,105,92,0.5)] rounded-xl bg-white">
                <div className="flex flex-col">
                  <label className="mb-1 font-semibold">Select Victims</label>
                  <input
                    type="search"
                    placeholder="Search by name or ID..."
                    value={victimSearch}
                    onChange={(e) => setVictimSearch(e.target.value)}
                    className="w-full border border-teal-700 rounded-xl h-9 px-3 bg-gray-100"
                  />
                </div>

                <div className="max-h-80 overflow-y-auto border rounded-lg divide-y">
                  {filteredVictimsForSelect.length === 0 && (
                    <p className="p-3 text-sm text-slate-500">
                      No victims found
                    </p>
                  )}
                  {filteredVictimsForSelect.map((v) => {
                    const checked = selectedVictimIds.includes(v.victimId);
                    return (
                      <label
                        key={v.victimId}
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-teal-50 transition ${
                          checked ? "bg-teal-50" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="mt-1 accent-teal-600 w-4 h-4"
                          checked={checked}
                          onChange={() => toggleVictim(v)}
                        />
                        <div className="flex flex-col flex-1">
                          <span className="font-medium text-teal-800">
                            {v.fullName}
                            <span className="text-xs text-slate-500 ml-2">
                              ({v.victimId})
                            </span>
                          </span>
                          <span className="text-xs text-slate-500">
                            {v.caseDetailsForAdmin?.traffickingType ||
                              "Type N/A"}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {selectedVictimIds.length > 0 && (
                  <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                    <p className="text-sm font-semibold text-teal-800">
                      {selectedVictimIds.length} victim
                      {selectedVictimIds.length > 1 ? "s" : ""} selected
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Selected Victims Display - BOTTOM */}
            <div className="w-full p-6 border border-teal-700 shadow-[0_2px_4px_0_rgba(0,105,92,0.5)] rounded-xl bg-white">
              <p className="text-xl font-semibold mb-3">Selected Victims</p>
              {selectedVictims.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No victims selected yet
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedVictims.map((v) => (
                    <span
                      key={v.victimId}
                      className="px-4 py-2 rounded-full bg-teal-100 text-teal-800 text-sm flex items-center gap-2 border border-teal-300"
                    >
                      <span className="font-medium">{v.fullName}</span>
                      <span className="text-xs text-slate-600">
                        ({v.victimId})
                      </span>
                      <button
                        onClick={() => toggleVictim(v)}
                        className="ml-1 text-teal-700 hover:text-teal-900 hover:bg-teal-200 rounded-full w-5 h-5 flex items-center justify-center transition"
                        aria-label="Remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Assign Button */}
            <div className="flex justify-center mt-4">
              <button
                onClick={handleAssign}
                disabled={!selectedStaff || selectedVictimIds.length === 0}
                className={`w-64 h-12 rounded-xl text-white font-semibold text-lg transition ${
                  !selectedStaff || selectedVictimIds.length === 0
                    ? "bg-teal-400 cursor-not-allowed"
                    : "bg-teal-700 hover:bg-teal-800 hover:shadow-lg"
                }`}
              >
                {!selectedStaff
                  ? "Select Staff First"
                  : selectedVictimIds.length === 0
                  ? "Select Victims"
                  : `Assign ${selectedVictimIds.length} Victim${
                      selectedVictimIds.length > 1 ? "s" : ""
                    }`}
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}

export default StaffManagement;
