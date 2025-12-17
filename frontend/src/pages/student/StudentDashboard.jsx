import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";

const StudentDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("/api/student/subjects");
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMaterials = async (subjectId) => {
    if (!subjectId) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `/api/student/materials/${subjectId}`
      );
      setMaterials(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Student Dashboard</h1>

      <h2 className="font-semibold mb-2">Subjects</h2>
      {subjects.map((sub) => (
        <div
          key={sub._id}
          className="flex justify-between items-center mb-2"
        >
          <span>{sub.name}</span>
          <button
            onClick={() => fetchMaterials(sub._id)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            View Materials
          </button>
        </div>
      ))}

      <h2 className="font-semibold mt-6 mb-2">Materials</h2>
      {loading && <p>Loading...</p>}

      {!loading && materials.length === 0 && (
        <p>No materials found.</p>
      )}

      {materials.map((m) => (
        <div key={m._id}>
          <a
            href={m.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            {m.title}
          </a>
        </div>
      ))}
    </div>
  );
};

export default StudentDashboard;
