import React from "react";
import { toast } from "react-toastify";

export const fetchDistinctRoles = async (id, token, setRoles) => {
  try {
    const res = await fetch(
      `http://localhost:5000/stats/distinct-roles/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    if (res.status == 200) {
      setRoles(data.roles);
    } else {
      toast.error(data.message, { toastId: "fetchRoleError" });
    }
  } catch (err) {
    toast.error(err.message, { toastId: "fetchRoleError" });
  }
};


export const fetchCentreDetails = async(id, token, setCentres) =>{
      try{
          const res = await fetch(`http://localhost:5000/stats/centre-details/${id}`,{
              method:"GET",
              headers:{
                  'Authorization':`Bearer ${token}`,
                  'Content-Type':'application/json'
              }
          })
          const data = await res.json();
          if(res.status == 200){
              setCentres(data.centres);
          }
          else{
              toast.error(data.message, {toastId :"centre fetch error"});
          }
      }
      catch(err){
          toast.error(err.message);
      }
  }