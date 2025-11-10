import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import StaffNavbar from "../components/StaffNavbar";

export default function InterviewResultsPage() {
  const { hashId } = useParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!hashId) {
      setError("Missing identifier");
      setLoading(false);
      return;
    }
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/staff/release/${encodeURIComponent(hashId)}/results`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to load results");
        }
        
        setResult(data.release);
      } catch (err) {
        setError(err.message || "Failed to load results");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [hashId, token]);

  const formatScore = (score) => {
    return (parseFloat(score) * 100).toFixed(1) + "%";
  };

  return (
    <main className="w-full min-h-screen bg-stone-100 font-['QuickSand'] pt-20">
      <StaffNavbar />
      <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Interview Results</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : !result ? (
          <p>No results available.</p>
        ) : (
          <div className="space-y-6">
            {/*
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium mb-2">Interview Summary</h3>
              <p className="text-gray-700">{result.summary}</p>
            </div>*/}
            

            <div className="border-b pb-4">
              <h3 className="text-lg font-medium mb-2">Analysis Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(result.results || {}).map(([key, value]) => (
                  <div 
                    key={key}
                    className={`p-4 rounded-lg ${
                      key === result.verdict ? 'bg-teal-50 border-2 border-teal-500' : 'bg-gray-50'
                    }`}
                  >
                    <div className="text-sm text-gray-600 capitalize">
                      {key.replace(/_/g, ' ')}
                    </div>
                    <div className="text-xl font-semibold">
                      {formatScore(value)}
                    </div>
                    {key === result.verdict && (
                      <div className="text-xs text-teal-600 mt-1">Primary Indicator</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-lg font-medium mb-2">Full Transcription</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-wrap text-gray-700">{result.transcription}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              
              <div className="text-sm text-gray-500">
                Submitted: {new Date(result.submittedTime).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}