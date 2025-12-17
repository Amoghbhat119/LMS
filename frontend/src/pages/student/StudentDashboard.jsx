import { useState } from "react";
import api from "../../api/axios";

const StudentDashboard = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [materials, setMaterials] = useState([]);

  const viewAttendance = async () => {
    if (!from || !to) return alert("Select date range");

    const res = await api.get("/student/attendance", {
      params: { from, to },
    });

    setAttendance(res.data);
  };

  const viewMaterials = async () => {
    const res = await api.get("/student/materials");
    setMaterials(res.data);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>

      {/* ATTENDANCE */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-3">View Attendance</h2>

        <div className="flex gap-2 mb-3">
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
          <input type="date" value={to} onChange={e => setTo(e.target.value)} />
          <button className="btn" onClick={viewAttendance}>View</button>
        </div>

        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((a, i) => (
              <tr key={i}>
                <td className="border p-2">
                  {new Date(a.date).toLocaleDateString()}
                </td>
                <td className="border p-2">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MATERIALS */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Study Materials</h2>

        <button className="btn mb-3" onClick={viewMaterials}>
          Load Materials
        </button>

        <table className="w-full border">
          <tbody>
            {materials.map(m => (
              <tr key={m._id}>
                <td className="border p-2">{m.file}</td>
                <td className="border p-2">
                  <a
                    href={`http://localhost:5000/uploads/${m.file}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={logout} className="text-red-600 mt-6">
        Logout
      </button>
    </div>
  );
};

export default StudentDashboard;
