import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { toast } from "react-toastify";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";

function Analytics() {
  const token = localStorage.getItem("token");

  const [traffickingData, setTraffickingData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [centres, setCentres] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState("all");
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [statusData, setStatusData] = useState([]);

  const generateDynamicColors = (count, baseHue = 174) => {
    return Array.from({ length: count }, (_, i) => {
      const hue = (baseHue + (i * 360) / count) % 360;
      const saturation = 60 + (i % 3) * 10;
      const lightness = 40 + (i % 4) * 10;
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    });
  };

  const GENDER_COLORS = {
    M: "#14b8a6",
    F: "#f472b6",
    O: "#a78bfa",
  };

  const STATUS_COLORS = {
    active: "#10b981", // green
    missing: "#f59e0b", // amber
    released: "#3b82f6", // blue
    deceased: "#ef4444", // red
    unassigned: "#6b7280", // gray
  };
  const getStatusColor = (status) => STATUS_COLORS[status] || "#6b7280";
  const capitalize = (s) =>
    typeof s === "string" && s.length
      ? s.charAt(0).toUpperCase() + s.slice(1)
      : s;

  const fetchCentres = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/stats/get-centres-for-analytics`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setCentres(data.centres || []);
      } else {
        toast.error("Failed to fetch centres");
      }
    } catch (err) {
      toast.error("Error fetching centres");
    }
  };

  const fetchTraffickingTypes = async () => {
    try {
      const url =
        selectedCentre === "all"
          ? `http://localhost:5000/stats/get-trafficking-types`
          : `http://localhost:5000/stats/get-trafficking-types?centreId=${selectedCentre}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTraffickingData(data.traffickingData);
      } else {
        toast.error(data.message || "Failed to fetch trafficking data");
      }
    } catch (err) {
      toast.error("Error fetching trafficking data");
    }
  };

  const fetchVictimsByGender = async () => {
    try {
      const url =
        selectedCentre === "all"
          ? `http://localhost:5000/stats/get-victims-by-gender`
          : `http://localhost:5000/stats/get-victims-by-gender?centreId=${selectedCentre}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const mappedData = data.victimsByGender.map((item) => ({
          ...item,
          genderName:
            item._id === "M" ? "Male" : item._id === "F" ? "Female" : "Other",
        }));
        setGenderData(mappedData);
      } else {
        toast.error(data.message || "Failed to fetch gender data");
      }
    } catch (err) {
      toast.error("Error fetching gender data");
    }
  };

  const fetchVictimsByAge = async () => {
    try {
      const url =
        selectedCentre === "all"
          ? `http://localhost:5000/stats/get-victims-by-age`
          : `http://localhost:5000/stats/get-victims-by-age?centreId=${selectedCentre}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const mappedData = data.victimsByAge.map((item) => {
          let ageRange = "";
          if (item._id === 0) ageRange = "0-12 (Children)";
          else if (item._id === 13) ageRange = "13-17 (Teens)";
          else if (item._id === 18) ageRange = "18-24 (Young Adults)";
          else if (item._id === 25) ageRange = "25-34 (Adults)";
          else if (item._id === 35) ageRange = "35-49 (Middle Age)";
          else if (item._id === 50) ageRange = "50-64 (Seniors)";
          else if (item._id === 65) ageRange = "65+ (Elderly)";
          else ageRange = "Other";

          return {
            ...item,
            ageRange: ageRange,
          };
        });
        setAgeData(mappedData);
      } else {
        toast.error(data.message || "Failed to fetch age data");
      }
    } catch (err) {
      toast.error("Error fetching age data");
    }
  };

  const fetchVictimsByStatus = async () => {
    try {
      const url =
        selectedCentre === "all"
          ? `http://localhost:5000/stats/get-victims-by-status`
          : `http://localhost:5000/stats/get-victims-by-status?centreId=${selectedCentre}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setStatusData(data.statusData);
      } else {
        toast.error(data.message || "Failed to fetch status data");
      }
    } catch (err) {
      toast.error("Error fetching status data");
    }
  };
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchCentres();
      setLoading(false);
    };
    loadInitialData();
  }, [token]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoadingCharts(true);
      try {
        await Promise.all([
          fetchTraffickingTypes(),
          fetchVictimsByGender(),
          fetchVictimsByAge(),
          fetchVictimsByStatus(),
        ]);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        toast.error("Failed to load chart data");
      } finally {
        setLoadingCharts(false);
      }
    };

    if (!loading) {
      fetchAllData();
    }
  }, [selectedCentre, loading]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = traffickingData.reduce(
        (sum, item) => sum + item.totalVictims,
        0
      );
      return (
        <div className="bg-white p-3 rounded-lg border border-teal-600 shadow-lg">
          <p className="text-teal-700 font-semibold">
            {payload[0].payload._id || "Unknown"}
          </p>
          <p className="text-teal-600 font-medium">
            Victims: {payload[0].value}
          </p>
          <p className="text-gray-600 text-sm">
            {total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0}%
          </p>
        </div>
      );
    }
    return null;
  };

  const GenderTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = genderData.reduce(
        (sum, item) => sum + item.totalVictims,
        0
      );
      return (
        <div className="bg-white p-3 rounded-lg border border-teal-600 shadow-lg">
          <p className="text-teal-700 font-semibold">
            {payload[0].payload.genderName}
          </p>
          <p className="text-teal-600 font-medium">
            Victims: {payload[0].value}
          </p>
          <p className="text-gray-600 text-sm">
            {total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0}%
          </p>
        </div>
      );
    }
    return null;
  };

  const AgeTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = ageData.reduce((sum, item) => sum + item.totalVictims, 0);
      return (
        <div className="bg-white p-3 rounded-lg border border-teal-600 shadow-lg">
          <p className="text-teal-700 font-semibold">
            {payload[0].payload.ageRange}
          </p>
          <p className="text-teal-600 font-medium">
            Victims: {payload[0].value}
          </p>
          <p className="text-gray-600 text-sm">
            {total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0}%
          </p>
        </div>
      );
    }
    return null;
  };
  const StatusTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = statusData.reduce(
        (sum, item) => sum + item.totalVictims,
        0
      );
      return (
        <div className="bg-white p-3 rounded-lg border border-teal-600 shadow-lg">
          <p className="text-teal-700 font-semibold">
            {payload[0].payload._id}
          </p>
          <p className="text-teal-600 font-medium">Count: {payload[0].value}</p>
          <p className="text-gray-600 text-sm">
            {total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0}%
          </p>
        </div>
      );
    }
    return null;
  };
  if (loading || loadingCharts) {
    return (
      <main className="w-full min-h-screen bg-stone-100 flex items-center justify-center font-['QuickSand']">
        <p className="text-teal-700 text-lg">Loading analytics...</p>
      </main>
    );
  }

  const totalVictims = traffickingData.reduce(
    (sum, item) => sum + item.totalVictims,
    0
  );

  const dynamicColors = generateDynamicColors(traffickingData.length || 7);

  return (
    <main className="w-full min-h-screen bg-stone-100 font-['QuickSand'] flex flex-col">
      <AdminNavbar />

      <div className="flex-grow p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Dropdown */}
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-teal-700 mb-2">
                Trafficking Analytics
              </h1>
              <p className="text-gray-600">
                {selectedCentre === "all"
                  ? "Breakdown of trafficking data across all centres"
                  : `Analytics for ${
                      centres.find((c) => c._id === selectedCentre)
                        ?.centreName || "Selected Centre"
                    }`}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <label className="text-sm text-gray-600 font-medium">
                Filter by Centre:
              </label>
              <select
                value={selectedCentre}
                onChange={(e) => setSelectedCentre(e.target.value)}
                className="px-4 py-2 border-2 border-teal-600 rounded-lg bg-white text-teal-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-[200px]"
              >
                <option value="all">All Centres</option>
                {centres.map((centre) => (
                  <option key={centre._id} value={centre._id}>
                    {centre.centreName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-8 flex items-center justify-center text-lg">
            <p className="text-3xl font-bold text-teal-700">
              Total Victims = {totalVictims}
            </p>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Trafficking Type Distribution */}
            <div className="bg-white p-8 rounded-lg border border-teal-600 shadow-[0px_2px_20px_0px_rgba(96,125,139,0.50)]">
              <h2 className="text-2xl font-semibold text-teal-700 mb-6">
                Trafficking Type Distribution
              </h2>

              {traffickingData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={traffickingData}
                      dataKey="totalVictims"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label={({ _id, percent }) =>
                        `${_id || "Unknown"} (${(percent * 100).toFixed(0)}%)`
                      }
                      labelLine={true}
                    >
                      {traffickingData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={dynamicColors[index % dynamicColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry) =>
                        entry.payload._id || "Unknown"
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    No trafficking data available
                  </p>
                </div>
              )}
            </div>

            {/* Gender Distribution */}
            <div className="bg-white p-8 rounded-lg border border-teal-600 shadow-[0px_2px_20px_0px_rgba(96,125,139,0.50)]">
              <h2 className="text-2xl font-semibold text-teal-700 mb-6">
                Gender Distribution
              </h2>

              {genderData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={genderData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis
                      dataKey="genderName"
                      tick={{ fill: "#0d9488" }}
                      axisLine={{ stroke: "#0d9488" }}
                    />
                    <YAxis
                      tick={{ fill: "#0d9488" }}
                      axisLine={{ stroke: "#0d9488" }}
                    />
                    <Tooltip content={<GenderTooltip />} />
                    <Bar dataKey="totalVictims" radius={[8, 8, 0, 0]}>
                      {genderData.map((entry, index) => (
                        <Cell
                          key={`gender-cell-${index}`}
                          fill={GENDER_COLORS[entry._id] || "#14b8a6"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    No gender data available
                  </p>
                </div>
              )}
            </div>

            {/* Status Distribution - Donut */}
            <div className="bg-white p-8 rounded-lg border border-teal-600 shadow-[0px_2px_20px_0px_rgba(96,125,139,0.50)]">
              <h2 className="text-2xl font-semibold text-teal-700 mb-6">
                Case Status Distribution
              </h2>

              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="totalVictims"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={140}
                      paddingAngle={2}
                      label={({ _id, percent }) =>
                        `${_id} (${(percent * 100).toFixed(0)}%)`
                      }
                      labelLine={true}
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`status-cell-${index}`}
                          fill={getStatusColor(entry._id)}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<StatusTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry) =>
                        (entry?.payload?._id ?? value).replace(/^\w/, (c) =>
                          c.toUpperCase()
                        )
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    No status data available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Age Distribution - Full Width */}
          <div className="bg-white p-8 rounded-lg border border-teal-600 shadow-[0px_2px_20px_0px_rgba(96,125,139,0.50)]">
            <h2 className="text-2xl font-semibold text-teal-700 mb-6">
              Age Distribution
            </h2>

            {ageData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={ageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis
                    dataKey="ageRange"
                    tick={{ fill: "#0d9488", fontSize: 12 }}
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                   <YAxis
                   tick={{ fill: "#0d9488" }}
                   axisLine={{ stroke: "#0d9488" }}
                   allowDecimals={false}
                   domain={[0, 'dataMax + 1']}
                />
                  <Tooltip content={<AgeTooltip />} />
                  <Bar
                    dataKey="totalVictims"
                    fill="#14b8a6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No age data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default Analytics;
