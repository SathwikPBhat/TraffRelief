import React, { useState } from 'react'
import AdminNavbar from '../components/AdminNavbar'
import Table from '../components/Table'
import Pagination from '../components/Pagination'
import { IoSearch } from 'react-icons/io5'
import Footer from '../components/Footer'

function VictimManagementForAdmin() {

  const [victimData, setVictimData] = useState([
    {name:'Sundar', id:'V-101', status:'active', centre:'mumbai', staff:'yamal', gender:'M', type:'Sexual'},
    {name:'Pichai', id:'V-102', status:'active', centre:'bengaluru', staff:'messi', gender:'F', type:'Child'},
    {name:'Altman', id:'V-103', status:'active', centre:'bihar', staff:'ronaldo', gender:'M', type:'Labor'},
    {name:'Sam', id:'V-104', status:'active', centre:'kerala', staff:'mbappe', gender:'O', type:'Domestic'},
    {name:'Samay', id:'V-105', status:'active', centre:'mumbai', staff:'yamal', gender:'M', type:'Organ'},
  ])

  const [currPage, setCurrPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState({
    centre:'',
    staff:'',
    gender:'',
    type:''
  })


  const centres = ['mumbai', 'bengaluru', 'bihar','kerala'];
  const staffs = ['yamal', 'messi', 'ronaldo','mbappe'];
  const genders = ['M','F', 'O'];
  const traffickingTypes = ["Sexual","Child","Labor","Domestic","Organ","Cyber","Other"];


  const handleSearch = (e) => {
    const str = e.target.value.trim().toLowerCase();
    setSearchQuery(str);
    setCurrPage(1); 
  }

  const getFilteredData = () => {
    let filtered = victimData;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((victim) => 
        victim.id.toLowerCase().includes(query) || 
        victim.name.toLowerCase().includes(query)
      );
    }
    if (filters.centre) {
      filtered = filtered.filter(victim => victim.centre === filters.centre);
    }

    if (filters.staff) {
      filtered = filtered.filter(victim => victim.staff === filters.staff);
    }

    if (filters.gender) {
      filtered = filtered.filter(victim => victim.gender === filters.gender);
    }

    if (filters.type) {
      filtered = filtered.filter(victim => victim.type === filters.type);
    }

    return filtered;
  }
  const filteredData = getFilteredData();

  const handleFilters = (e) =>{
    const {name, value} = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }) );
    setCurrPage(1);
  }

  const totalPages = Math.ceil(filteredData.length / 4);
  const startIdx = (currPage - 1) * 4;
  const endIdx = startIdx + 4;
  const visibleRows = filteredData.slice(startIdx, endIdx);

  const handlePageChange = (pageNo) => {
    if (pageNo >= 1 && pageNo <= totalPages) setCurrPage(pageNo);
  };

  const handleClear = () =>{
    setFilters({
      centre:'',  
      staff:'',
      gender:'',
      type:''
    })
    setSearchQuery(''); 
    setCurrPage(1);
  }
  return (  
    <main className="w-full bg-stone-100 font-['QuickSand'] flex flex-col min-h-screen">
        <AdminNavbar/>
        <div className='flex-grow'>
          <div className='w-full p-8 '>
              <div className='w-full grid lg:grid-cols-2 grid-cols-1 gap-4 justify-start'>
                  <div className=' flex items-center justify-start lg:text-3xl md:text-2xl text-lg font-semibold'>Victim list</div>
                  <div className='flex items-center relative'>
                    <input type="search" placeholder='Name, id ..' value={searchQuery} onChange = {handleSearch} className = 'h-8 p-2 border border-teal-600 bg-gray-200 rounded-xl w-full'/>
                  </div>
                  <div className='w-full flex flex-col gap-2 justify-between lg:col-span-full'>
                    <div className=''>Filter</div>
                    <div className='grid gap-4 lg:grid-cols-4 md:grid-cols-2 grid-cols-1'>
                      <select name="centre" value={filters.centre}  onChange = {handleFilters} className='h-10 border border-teal-600 rounded-xl p-2 bg-gray-200 '>
                        <option value="">--Select a centre--</option>
                        {
                          centres.map((centre, idx) => (
                            <option key={idx} value={centre}>{centre}</option>
                          ))
                        }
                      </select>
                      <select name="staff" value={filters.staff} onChange = {handleFilters} className='h-10 border border-teal-600 rounded-xl p-2 bg-gray-200 '>
                        <option value="">--Select staff assigned--</option>
                        {
                          staffs.map((staff, idx) => (
                            <option key = {idx} value ={staff}>{staff}</option>
                          ))
                        }
                      </select>
                      <select name="gender" value={filters.gender}  onChange = {handleFilters} className='h-10 border border-teal-600 rounded-xl p-2 bg-gray-200 '>
                        <option value="">--Select Gender--</option>
                          {
                          genders.map((gender, idx) => (
                            <option key = {idx} value ={gender}>{gender}</option>
                          ))
                        }
                      </select>
                      <select name="type" value={filters.type} onChange = {handleFilters} className='h-10 border border-teal-600 rounded-xl p-2 bg-gray-200 '>
                        <option value="">--Select Trafficking Type--</option>
                        {
                          traffickingTypes.map((type, idx) => (
                            <option key = {idx} value ={type}>{type}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>
              </div>
              <div className='w-full mt-16 flex flex-col gap-4 p-4 lg:px-8 md:px-4 px-2 mb-4'>
                <div className='w-full flex justify-end items-center'>
                   <button onClick={handleClear} className='flex justify-center items-center p-4 h-10 bg-teal-600 text-white rounded-xl hover:cursor-pointer hover:bg-teal-700 '>Clear filters</button>
                </div>

                {
                  filteredData.length > 0 ?
                  (<Table tableHeaders={["Name", "ID", "Status", "Action"]} tableData={visibleRows}/>) :
                  (<p className='text-md text-red-600 '>No data found</p>)
                }
                <Pagination curr={currPage} total={totalPages} onPageChange={handlePageChange}/>
              </div>
          </div>
        </div>
        <Footer className='flex-shrink-0'/>
    </main>
  )
}

export default VictimManagementForAdmin