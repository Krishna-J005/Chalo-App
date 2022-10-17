import { useState, useEffect } from 'react';
import { data } from './components/data'
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Filter from './components/Filter';
import Table from './components/Table';
import ChaloForm from './components/ChaloForm'
import Maps from './components/Maps/index';
import NotFound from './components/NotFound';
const rowsPerPageOptions = [10, 20, 50];

const columns = [
  { id: 'routeId', label: 'Route ID', minWidth: 100 },
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 90 },
  { id: 'direction', label: 'Direction', minWidth: 110 },
  { id: 'actions', label: 'ACTIONS', minWidth: 200, },
];
const buttons = [
  { id: 'view', label: 'View', minWidth: 100, format: "button" },
  { id: 'edit', label: 'Edit', minWidth: 100, format: "button" },
  { id: 'delete', label: 'Delete', minWidth: 100, format: "button" }
]
function App() {
  const location = useLocation()
  const [allRoute, setAllRoute] = useState([])
  const [rows, setRows] = useState([])
  const handleResetChange = () => {
    setRows(allRoute)
  }
  useEffect(() =>{
    const dataVal = JSON.parse(localStorage.getItem('data'))?.length > 0  ? JSON.parse(localStorage.getItem('data')) : data
    const value = dataVal.map((curr,ind) =>{
       const {mobile,stopList,...rest} = {...curr}
       return rest;
    })
    localStorage.setItem('data',JSON.stringify(dataVal))
    setAllRoute(value)
    setRows(value)
  },[location])

  // const deleteRow = (id) =>{
  //   const localData = JSON.parse(localStorage.getItem('data'))
  //   const filterData = localData.filter(curr => curr.routeId !== id)
  //   localStorage.setItem('data',JSON.stringify(filterData))
  //   setRows(filterData)
  // }

  const handleFilterChange = (values) => {
    const directionArr = allRoute?.filter(row => {
      return values.direction === 'all' ? row : row.direction === values.direction
    })
    const status = directionArr?.filter(row => {
      return values.status === 'all' ? row : row.status === values.status
    })
    const nameArr = status.filter(row => {
      return row.name.toLowerCase().indexOf(values.name.toLowerCase()) !== -1
    })
    const filterData = nameArr.filter(row => {
      return row.routeId.toLowerCase().indexOf(values.routeId.toLowerCase()) !== -1
    })
    setRows(filterData)
  }
  return (
    <div className="displayComponent">
      <div className="header">Chalo APP</div>

      <Routes>
        <Route path="/" element={
          <>
            <Filter handleFilterChange={handleFilterChange} handleResetChange={handleResetChange} />
            <Table columns={columns} rowsPerPageOptions={rowsPerPageOptions} rows={rows} buttons={buttons} />
          </>}
        />
        <Route path="/addRoute" exact element={<ChaloForm editData ={false}/>} />
        <Route path="/editRoute/:routeId" element={<ChaloForm editData ={true}/>} />
        <Route path="/viewRoute/:routeId" element={<Maps/>} />
        <Route path="*" element = {<NotFound/>}/>
      </Routes>
    </div>
  );
}

export default App;
