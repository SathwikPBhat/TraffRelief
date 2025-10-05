import { useState } from 'react';
import logo from './assets/logo.png';
import Login from './pages/Login';
import StaffManagement from './pages/StaffManagement';

function App() {
  
  const [username,setUsername] = useState("");
  const[password, setPassword] = useState("");

  const handleSubmit = () => {}
  return (
    <>
    <StaffManagement/>
    </>
  )
}

export default App
