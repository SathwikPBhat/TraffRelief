import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function PageNotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  const homeHref = location.pathname.startsWith("/admin")
    ? "/admin/dashboard"
    : location.pathname.startsWith("/staff")
    ? "/staff/dashboard"
    : "/";

  return (
    <main className="w-full min-h-screen bg-stone-100 font-['QuickSand'] flex flex-col">
      <header className="h-16 px-4 flex items-center justify-between bg-teal-800 text-white">
        <div className="flex items-center gap-2">
          <img src={logo} alt="TraffRelief" className="w-8 h-8" />
          <span className="font-semibold">TraffRelief</span>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-xl">
          <div className="inline-flex items-center justify-center rounded-full bg-teal-50 border border-teal-200 w-28 h-28 mb-6">
            <span className="text-4xl md:text-5xl font-extrabold text-teal-700">404</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-2">Page not found</h1>
          <p className="text-slate-600 mb-6">
            The page you're looking for doesn't exist or has moved.
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-xl border border-teal-700 text-teal-800 bg-white hover:bg-teal-50 transition"
            >
              Go Back
            </button>
            <Link
              to={homeHref}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition"
            >
              Go Home
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

export default PageNotFound;