import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { IoMdNotifications } from "react-icons/io";

function AdminNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const getNotifications = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/admin/get-activity-details/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (res.status == 200) {
        setNotifications(data.log);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDrawerClose= async() =>{
    setNotifOpen(false);
    try{
      await fetch(`http://localhost:5000/admin/mark-all-notifications-read/${id}`,{
        method: "PATCH",
        headers:{
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
    }
    catch(err){
      console.log('Failed to mark as read:', err.message);
    }
  }
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!notifOpen) return;
    getNotifications();
  }, [notifOpen]);

  const isActive = (path) => location.pathname === path;
  const linkBase = "block px-4 py-3 rounded-lg transition";
  const linkActive = "bg-teal-100 text-teal-900 border border-teal-200";
  const linkIdle = "text-slate-800 hover:bg-teal-50 hover:text-teal-800";

  const formatTs = (ts) => {
    const d = new Date(ts);
    return isNaN(d)
      ? String(ts)
      : d.toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  return (
    <>
      <div className="w-full top-0 h-16 p-4 flex justify-between items-center bg-teal-800 text-white font-medium font-['QuickSand'] lg:text-2xl ">
        <div className="flex items-center gap-2 justify-between">
          <img src={logo} alt="logo" className="w-8 h-8 max-w-full" />
          <p>Admin Portal</p>
        </div>

        <p className="lg:text-4xl text-sm">
          {{
            "/admin/dashboard": "Dashboard",
            "/admin/staff-details": "Staff",
            "/admin/victims": "Victims",
            "/admin/profile": "Profile",
          }[location.pathname] || "Admin"}
        </p>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => {
              setMenuOpen(true);
              setNotifOpen(false);
            }}
            aria-label="Open menu"
            className="text-white text-2xl leading-none"
            title="Menu"
          >
            &#9776;
          </button>

          <button
            onClick={() => {
              setNotifOpen(true);
              setMenuOpen(false);
            }}
            aria-label="Open notifications"
            className="relative p-1 rounded hover:bg-white/10 transition"
            title="Notifications"
          >
            <IoMdNotifications className="text-white" size={22} />

            {notifications.length > 0 && (
              <span
                className={`absolute -top-1 -right-1 ${
                  notifications.some((n) => n.readStatus === false)
                    ? "bg-teal-600"
                    : "bg-teal-400"
                } text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full`}
              >
                {Math.min(notifications.length, 9)}+
              </span>
            )}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <aside
          role="dialog"
          aria-modal="true"
          className={`absolute right-0 top-0 h-full w-72 md:w-80 bg-white shadow-xl transform transition-transform duration-300
            ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <img src={logo} alt="logo" className="w-8 h-8" />
              <span className="font-semibold text-teal-800">Admin Menu</span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="text-slate-600 hover:text-teal-800 text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          <nav className="p-3 font-['QuickSand']">
            <Link
              to="/admin/dashboard"
              onClick={() => setMenuOpen(false)}
              className={`${linkBase} ${
                isActive("/admin/dashboard") ? linkActive : linkIdle
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/staff-details"
              onClick={() => setMenuOpen(false)}
              className={`${linkBase} ${
                isActive("/admin/staff-details") ? linkActive : linkIdle
              }`}
            >
              Staff Details
            </Link>
            <Link
              to="/admin/victims"
              onClick={() => setMenuOpen(false)}
              className={`${linkBase} ${
                isActive("/admin/victims") ? linkActive : linkIdle
              }`}
            >
              Victims
            </Link>
            <Link
              to="/admin/profile"
              onClick={() => setMenuOpen(false)}
              className={`${linkBase} ${
                isActive("/admin/profile") ? linkActive : linkIdle
              }`}
            >
              Profile
            </Link>
          </nav>

          <div className="mt-auto p-4 text-xs text-slate-500">
            <p className="text-center">TraffRelief Admin</p>
          </div>
        </aside>
      </div>

      <div
        className={`fixed inset-0 z-50 ${
          notifOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            notifOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setNotifOpen(false)}
        />
        <aside
          role="dialog"
          aria-modal="true"
          className={`absolute right-0 top-0 h-full w-80 max-w-[90%] bg-white shadow-xl transform transition-transform duration-300
            ${notifOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-teal-800">Notifications</span>
            </div>
            <button
              onClick={handleDrawerClose}
              aria-label="Close notifications"
              className="text-slate-600 hover:text-teal-800 text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          <div className="p-3 h-[calc(100%-64px)] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-500">No notifications</p>
            ) : (
              <ul className="space-y-3">
                {notifications.map((n, i) => (
                  <li
                    key={i}
                    className={`border rounded-lg p-3 transition hover:bg-teal-50/40 ${
                      n.readStatus === false
                        ? "bg-teal-50 border-teal-400"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="text-xs text-slate-500">
                      {formatTs(n.timestamp)}
                    </div>
                    <div
                      className={`text-sm font-semibold mt-0.5 ${
                        n.readStatus === false
                          ? "text-teal-900"
                          : "text-teal-800"
                      }`}
                    >
                      {n.activity || n.activityType || "Activity"}
                    </div>
                    <div className="text-sm text-slate-800">
                      {n.description || n.details || ""}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

export default AdminNavbar;
