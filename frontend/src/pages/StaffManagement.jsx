import React, { useEffect, useState } from "react";
import SelectedVictimCard from "../components/SelectedVictimCard";
import Footer from "../components/Footer";
import AdminNavbar from "../components/AdminNavbar";
import Pagination from "../components/Pagination";
import AddStaffModal from '../components/AddStaffModal';
import { toast } from "react-toastify";

function StaffManagement() {
  const [selectedVictims, setSelectedVictims] = useState([
    "Sonam Wangchuk",
    "Mamata Bannerjee",
    "Dhruv Rathee",
    "Rahul Gandhi",
  ]);
  const [currPage, setCurrPage] = useState(1);
  const adminId = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const [staffData, setStaffData] = useState([]);

  const fetchStaffDetails = async()=>{
    try{
        const res = await fetch(`http://localhost:5000/admin/view-staffs/${adminId}`,{
          method : "GET",
          headers:{
            Authorization : `Bearer ${token}`
          },
        })
        const data = await res.json();
        if(res.status == 200){
          setStaffData(data.staffs);
          console.log(data.staffs);
        }
        else{
          toast.error(data.message,{toastId: "fetchStaffError"});
        }
      }
      catch(err){
        toast.error(err.message,{toastId: "fetchStaffError"});
      }
    }
  
  useEffect(()=>{
    fetchStaffDetails();
    console.log(staffData);
  },[adminId, token])

  // const StaffData = [
  //   { name: "Alice", role: "Admin", center: "Mumbai", status: "Active" },
  //   { name: "Bob", role: "Manager", center: "Delhi", status: "Inactive" },
  //   { name: "Charlie", role: "Staff", center: "Pune", status: "Active" },
  //   { name: "David", role: "Intern", center: "Goa", status: "Active" },
  //   { name: "Eva", role: "Lead", center: "Bangalore", status: "Active" },
  //   { name: "Frank", role: "Staff", center: "Kolkata", status: "Inactive" },
  //   { name: "Grace", role: "Admin", center: "Chennai", status: "Active" },
  //   { name: "Hank", role: "Intern", center: "Hyderabad", status: "Active" },
  // ];

  const deleteVictim = (nameToDelete) =>
    setSelectedVictims((currentVictims) =>
      currentVictims.filter((name) => name !== nameToDelete)
    );

  const totalPages = Math.ceil(staffData.length / 4);
  const startIdx = (currPage - 1) * 4;
  const endIdx = startIdx + 4;
  const visibleRows = staffData.slice(startIdx, endIdx);

  const handlePageChange = (pageNo) => {
    if (pageNo >= 1 && pageNo <= totalPages) setCurrPage(pageNo);
  };

  const [staffModal, setStaffModal] = useState(false);
  return (
    <>
      <main className="w-full min-h-screen bg-stone-100 flex flex-col items-start font-['QuickSand']" >
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
                  name="staff"
                  placeholder="Name,id.."
                  className="h-8 rounded-xl p-2 border border-teal-700"
                />
              </div>
              <button className="flex justify-center items-center text-white bg-teal-600 font-['QuickSand'] h-6 rounded-xl p-4 border border-gray-800">
                Search
              </button>
            </div>

            <div className="w-full flex flex-col justify-around">
              {/* filter by */}
              <p>Filter by</p>
              <div className="w-1/2 flex items-center justify-between gap-2 ">
                <select
                  name=""
                  id="role1"
                  className="w-1/3 border border-teal-700 rounded-xl  px-2 py-1 "
                >
                  <option value="">Role</option>
                </select>
                <select
                  name=""
                  id="role2"
                  className="w-1/3 border border-teal-700 rounded-xl  px-2 py-1 "
                >
                  <option value="">Role</option>
                </select>
                <select
                  name=""
                  id="role3"
                  className="w-1/3 border border-teal-700 rounded-xl  px-2 py-1 "
                >
                  <option value="">Role</option>
                </select>
              </div>
            </div>
          </div>

          {staffModal ? <AddStaffModal showModal={setStaffModal}/> : 
          <div className="w-full py-4 flex flex-col justify-around gap-4 mt-4">
            {/* stafflist */}
            
            <div className="w-full flex items-center justify-between">
              <p className="text-3xl font-medium ">Staff List</p>
              <button onClick={()=>{setStaffModal(true)}} className="flex items-center justify-center p-2 rounded-xl text-white bg-teal-600 hover:bg-teal-700 hover:cursor-pointer hover:scale-105">Add Staff</button>
            </div>
            <div className="w-full overflow-hidden rounded-2xl">
              <table className="w-full border-y-3 border-x-2 border-teal-700">
                <thead className="h-14 bg-stone-100 text-black font-['QuickSand'] font-semibold">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left hidden sm:table-cell">Role</th>
                    <th className="px-4 py-3 text-left">Center</th>
                    <th className="px-4 py-3 text-left hidden sm:table-cell">Status</th>
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
                        <td className="py-3 px-4 text-sm text-teal-600 font-medium cursor-pointer hover:underline">
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
          }

          <div className="mt-6 w-full flex flex-col justify-between gap-2">
            {/* Assign victims */}
            <p className="font-medium text-3xl ">Assign Victims</p>
            <div className="w-full grid items-center justify-between gap-16 lg:grid-cols-2 grid-cols-1">
              <div className="p-6 flex flex-col justify-between gap-2 border border-slate-900 shadow-[0px_2px_4px_0px_rgba(0,105,92,1.00)] rounded-xl">
                <div>
                  <label htmlFor="searchStaff">Search & Select Staff</label>
                  <input
                    type="search"
                    placeholder="Name, id.."
                    className="w-full border border-teal-700 rounded-xl h-8 p-2 "
                  />
                </div>

                <div className="w-full flex-col justify-between">
                  <p>Filter by</p>
                  <div className="w-full flex gap-2 items-center justify-around">
                    <select
                      name=""
                      id=""
                      className="w-1/3 border border-teal-700 p-2 rounded-xl"
                    >
                      <option value="">Role</option>
                    </select>
                    <select
                      name=""
                      id=""
                      className="w-1/3 border border-teal-700 p-2 rounded-xl"
                    >
                      <option value="">Role</option>
                    </select>
                    <select
                      name=""
                      id=""
                      className="w-1/3 border border-teal-700 p-2 rounded-xl"
                    >
                      <option value="">Role</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-start">
                  <button className="w-1/2 h-12 p-2 mt-4 rounded-xl text-white bg-teal-600 font-['QuickSand']">
                    Select
                  </button>
                </div>
              </div>
              <div className="p-6 flex flex-col justify-between gap-2 border  border-slate-900 shadow-[0px_2px_4px_0px_rgba(0,105,92,1.00)]  rounded-xl">
                <div>
                  <label htmlFor="searchVictims">Search & Assign Victims</label>
                  <input
                    type="search"
                    placeholder="Name, id.."
                    className="w-full border border-teal-700 rounded-xl h-8 p-2 "
                  />
                </div>

                <div className="w-full flex-col justify-between">
                  <p>Filter by</p>
                  <div className="w-full flex gap-2 items-center justify-around">
                    <select
                      name=""
                      id=""
                      className="w-1/3 border border-teal-700 p-2 rounded-xl"
                    >
                      <option value="">Role</option>
                    </select>
                    <select
                      name=""
                      id=""
                      className="w-1/3 border border-teal-700 p-2 rounded-xl"
                    >
                      <option value="">Role</option>
                    </select>
                    <select
                      name=""
                      id=""
                      className="w-1/3 border border-teal-700 p-2 rounded-xl"
                    >
                      <option value="">Role</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-start items-center mt-4">
                  <button className="w-1/2 h-12 p-2 rounded-xl text-white bg-teal-600 font-['QuickSand']">
                    Search
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-around gap-2 py-4">
              <p className="text-black text-2xl">Selected Victims</p>
              <div className="grid items-center justify-evenly lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-2 ">
                {selectedVictims.length > 0 ? (
                  selectedVictims.map((name) => (
                    <SelectedVictimCard
                      key={name}
                      name={name}
                      onDelete={deleteVictim}
                    />
                  ))
                ) : (
                  <p>No victim selected</p>
                )}
              </div>
            </div>
            {selectedVictims.length > 0 && 
              <div className="flex items-center justify-center">
              
                <button className="w-1/4 h-10 text-white bg-teal-700 p-4 rounded-xl flex justify-center items-center">Assign</button>
              </div>
            }
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}

export default StaffManagement;
