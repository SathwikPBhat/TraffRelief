import React from "react";
import { toast } from "react-toastify";

export  const getUserData = async(token, setUserData) =>{
    try{
      const res = await fetch(`http://localhost:5000/user/me`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json();
      setUserData(data);

    }
    catch(err){
      console.log(err.message);
    }
  }

export const fetchDistinctRoles = async (token, setRoles) => {
  try {
    const res = await fetch(
      `http://localhost:5000/stats/distinct-roles`,
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

export const fetchCentreDetails = async (token, setCentres) => {
  try {
    const res = await fetch(
      `http://localhost:5000/stats/centre-details`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    if (res.status == 200) {
      setCentres(data.centres);
    } else {
      toast.error(data.message, { toastId: "centre fetch error" });
    }
  } catch (err) {
    toast.error(err.message);
  }
};

export const getVictims = async (staffId, token, setVictimData) => {
  try {
    const res = await fetch(`http://localhost:5000/staff/get-victims/${staffId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (res.ok) {
      setVictimData(
        data.victims.map((v) => ({
          fullName: v.fullName,
          victimId: v.victimId,
          status: v.status,
          gender: v.gender,
          age: v.age,
        }))
      );
    } else {
      toast.error(data.message, { toastId: "fetch-victims-error" });
    }
  } catch (err) {
    toast.error(err.message, { toastId: "fetch-victims-error" });
  }
};
