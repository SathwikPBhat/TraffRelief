import React, { useState, useEffect } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import Select from "react-select";
import { createPortal } from "react-dom";
import { fetchCentreDetails } from "../utils/CommonFetches";
import { toast } from "react-toastify";

function AddVictimModalForAdmin({ onClose }) {
  const [langs, setLangs] = useState([]);
  const token = localStorage.getItem("token");
  const [centres, setCentres] = useState([]);

  const [controlMethods, setControlMethods] = useState([]);
  const handleLangChange = (selected) => {
    setLangs(selected);
    console.log(langs);
  };

  const controlMethodOptions = [
    { value: "Physical Violence", label: "Physical Violence" },
    { value: "Threats", label: "Threats" },
    { value: "Confinement", label: "Confinement" },
    { value: "Debt Bondage", label: "Debt Bondage" },
    { value: "Document Confiscation", label: "Document Confiscation" },
    { value: "Drug Dependency", label: "Drug Dependency" },
    { value: "Isolation", label: "Isolation" },
    {
      value: "Psychological Manipulation",
      label: "Psychological Manipulation",
    },
    { value: "Threats to Family", label: "Threats to Family" },
    { value: "Withholding Wages", label: "Withholding Wages" },
  ];

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "hi", label: "Hindi" },
    { value: "kn", label: "Kannada" },
    { value: "ta", label: "Tamil" },
    { value: "te", label: "Telugu" },
    { value: "mr", label: "Marathi" },
    { value: "bn", label: "Bengali" },
    { value: "gu", label: "Gujarati" },
    { value: "pa", label: "Punjabi" },
    { value: "ur", label: "Urdu" },
    { value: "ml", label: "Malayalam" },
    { value: "or", label: "Odia" },
    { value: "tcy", label: "Tulu" },
    { value: "kok", label: "Konkani" },
  ];
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "2rem",
      borderRadius: "0.75rem",
      borderColor: state.isFocused ? "#047857" : "#047857",
      boxShadow: state.isFocused ? "0 0 0 1px #047857" : "none",
      "&:hover": {
        borderColor: "#047857",
      },
      backgroundColor: "#F5F5F5",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#0f766e"
        : state.isFocused
        ? "#e0f2f1"
        : "white", // teal-700/teal-50
      color: state.isSelected ? "white" : "black",
      fontWeight: state.isSelected ? "bold" : "normal",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#ccfbf1", // teal-100 for selected tag background
      borderRadius: "0.5rem",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#0f766e", // teal-700 for text
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#0f766e",
      "&:hover": {
        backgroundColor: "#99f6e4", // teal-200 on hover
        color: "white",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9CA3AF",
    }),
  };
  const handleControlMethodsChange = (selected) => {
    setControlMethods(selected);
  };
  const traffickingTypes = [
    "Sexual",
    "Child",
    "Labor",
    "Domestic",
    "Organ",
    "Cyber",
    "Other",
  ];
  const [formData, setFormdata] = useState({
    name: "",
    age: "",
    gender: "",
    centre: "",
    traffickingType: "",
    locations: "",
    duration: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormdata((prev) => ({ ...prev, file }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log(formData)
  const fd = new FormData();
  fd.append("fullName", formData.name);
  fd.append("age", formData.age);
  fd.append("gender", formData.gender);
  fd.append("traffickingType", formData.traffickingType);
  fd.append("locations", formData.locations);
  fd.append("duration", formData.duration);
 
  fd.append("languagesSpoken", JSON.stringify(langs.map(l => l.label)));
  fd.append("controlMethods", JSON.stringify(controlMethods.map(c => c.label)));

  if (formData.file) {
    fd.append("file", formData.file);
  }
 
  try {
    const res = await fetch(`http://localhost:5000/admin/add-victim`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: fd,
    });

    const data = await res.json();
    if (res.ok) {
      toast.success(`${data.message} Victim id: ${data.victimId}`, {toastId:"add-victim-success"});
      onClose();
    } else {
      toast.error(data.message, {toastId: "add-victim-error"});
    }
  } catch (err) {
    toast.error(err.message, {toastId: "add-victim-error"});
  }
};


  useEffect(() => {
    fetchCentreDetails(token, setCentres);
    console.log(centres);
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-[61] mx-auto my-8 w-[92%] max-w-4xl">
        <div className="w-full bg-stone-100 font-['QuickSand'] border border-teal-700 rounded-xl shadow-lg">
          <div className="relative w-full flex justify-center items-center gap-4 p-4 border border-teal-600 rounded-t-xl">
            <p className="text-center lg:text-3xl">Add Victims</p>
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 text-teal-800 hover:text-teal-900"
            >
              <IoCloseCircleOutline className="text-2xl hover:text-red-700" />
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center justify-around lg:px-28 px-8 py-8 gap-8"
          >
            <div className="w-full border border-teal-600 shadow-[0px_2px_4px_0px_rgba(0,105,92,1.00)] rounded-xl">
              <div className="w-full bg-teal-800 text-white p-2 flex items-center justify-center rounded-t-xl lg:text-2xl">
                Personal Information
              </div>
              <div className="w-full p-6 bg-stone-200 rounded-b-xl">
                <div className="grid lg:grid-cols-5 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4 justify-center">
                  <div className="flex flex-col gap-2 lg:col-start-1 lg:col-end-3">
                    <label htmlFor="name">Name</label>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className=" h-8 p-2 border border-teal-600 rounded-xl bg-stone-100 "
                    />
                  </div>
                  <div className="flex flex-col gap-2 lg:col-start-3 lg:col-end-6">
                    <label htmlFor="age">Age</label>
                    <input
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      className="h-8 p-2 border border-teal-600 rounded-xl bg-stone-100"
                    />
                  </div>
                  <div className="flex flex-col gap-2 lg:col-start-1 lg:col-end-3">
                    <label htmlFor="gender">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="h-8 px-2  border border-teal-600 rounded-xl bg-stone-100 overflow-ellipsis"
                    >
                      <option value="">---Select a Gender---</option>
                      <option value="M">M</option>
                      <option value="F">F</option>
                      <option value="O">Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2 lg:col-start-3 lg:col-end-6">
                    <label htmlFor="language">Languages Spoken</label>
                    <Select
                      options={languageOptions}
                      isMulti
                      placeholder="Select languages spoken…"
                      value={langs}
                      onChange={handleLangChange}
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      styles={customStyles}
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full border border-teal-600 shadow-[0px_2px_4px_0px_rgba(0,105,92,1.00)] rounded-xl">
              <div className="w-full bg-teal-800 text-white p-2 flex items-center justify-center rounded-t-xl lg:text-2xl">
                Case Information
              </div>
              <div className="w-full p-6 bg-stone-200 rounded-b-xl">
                <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4 justify-center">
                  <div className="flex flex-col gap-2 ">
                    <label htmlFor="TraffickingType">Type of Trafficking</label>
                    <select
                      name="traffickingType" value={formData.traffickingType}
                      onChange={handleChange}
                      className="h-8 px-2  border border-teal-600 rounded-xl bg-stone-100"
                    >
                      <option value="">---Select Type of Trafficking---</option>
                      {traffickingTypes.map((type, idx) => {
                        return (
                          <option key={idx} value={type}>
                            {type}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="geographicLocations">
                      Geographic Locations
                    </label>
                    <input
                      name="locations"
                      value={formData.locations}
                      onChange={handleChange}
                      type="text"
                      placeholder="Ex: Mumbai, Delhi"
                      className="h-8 p-2 border border-teal-600 rounded-xl bg-stone-100"
                    />
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <label htmlFor="controlMethods">Methods of Control</label>
                    <Select
                      options={controlMethodOptions}
                      isMulti
                      placeholder="Select control methods…"
                      value={controlMethods}
                      onChange={handleControlMethodsChange}
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      styles={customStyles}
                      classNamePrefix="react-select"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="duration">Duration of Exploitation</label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="Ex: 6 months"
                      className="h-8 p-2 border border-teal-600 rounded-xl bg-stone-100"
                    />
                  </div>
                  <div className="flex flex-col gap-2 lg:col-start-1 lg:col-end-3">
                    <label htmlFor="certificate">
                      Previous attempts at rescue
                    </label>
                    <input
                      type="file"
                      name="file"
                      accept=".pdf,.doc,.docx,image/*"
                      onChange={handleFileChange}
                      className=" h-8 p-2 border border-teal-600 rounded-xl bg-stone-100 "
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="h-8 p-2 flex items-center justify-center text-white bg-teal-700 rounded-xl w-1/4"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AddVictimModalForAdmin;
