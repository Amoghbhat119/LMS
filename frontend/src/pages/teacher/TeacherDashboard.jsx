import { useEffect, useState } from "react";
import api from "../../api/axios";

const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [file, setFile] = useState(null);

  /* ================= LOAD ASSIGNED CLASSES ================= */

  const loadClasses = async () => {
    const res = await api.get("/teacher/classes");
    setClasses(res.data);
  };

  const loadStudents = async (classId) => {
    const res = await api.get(`/teacher/classes/${classId}/students`);
    setStudents(res.data);

    // initialize attendance
    const map = {};
    res.data.forEach(s => (map[s._id] = true));
    setAttendance(map);
  };

  useEffect(() => {
    loadClasses();
  }, []);

  /* ================= ATTENDANCE ================= */

  const toggleAttendance = (id) => {
    setAttendance({ ...attendance, [id]: !attendance[id] });
  };

  const submitAttendance = async () => {
    await api.post("/teacher/attendance", {
      classId: selectedClass._id,
      records: attendance,
    });
    alert("Attendance saved");
  };

  /* ================= FILE UPLOAD ================= */

  const uploadMaterial = async () => {
    if (!file || !selectedClass) return alert("Select file & class");

    const form = new FormData();
    form.append("file", file);
    form.append("classId", selectedClass._id);

    await api.post("/teacher/materials", form);
    alert("File uploaded");
    setFile(null);
  };

  /* ================= LOGOUT ================= */

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  /* ================= UI ================= */

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-4">
        <h2 className="text-xl font-bold mb-4">Teacher</h2>

        {classes.map(c => (
          <button
            key={c._id}
            onClick={() => {
              setSelectedClass(c);
              loadStudents(c._id);
            }}
            className={`w-full text-left px-3 py-2 rounded mb-1 ${
              selectedClass?._id === c._id ? "bg-blue-100" : "hover:bg-gray-200"
            }`}
          >
            {c.name}
          </button>
        ))}

        <button onClick={logout} className="text-red-600 mt-6">
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <div className="flex-1 p-6 overflow-auto">

        <h1 className="text-2xl font-semibold mb-4">Teacher Dashboard</h1>

        {!selectedClass && (
          <p>Select a class to manage attendance and materials.</p>
        )}

        {selectedClass && (
          <>
            {/* STUDENTS */}
            <div className="bg-white p-4 rounded shadow mb-6">
              <h2 className="font-semibold mb-3">
                Attendance — {selectedClass.name}
              </h2>

              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Student</th>
                    <th className="border p-2">Present</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s._id}>
                      <td className="border p-2">{s.name}</td>
                      <td className="border p-2 text-center">
                        <input
                          type="checkbox"
                          checked={attendance[s._id] || false}
                          onChange={() => toggleAttendance(s._id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={submitAttendance}
                className="btn mt-3"
              >
                Save Attendance
              </button>
            </div>

            {/* FILE UPLOAD */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold mb-3">Upload Notes / Videos</h2>

              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="mb-3"
              />

              <button onClick={uploadMaterial} className="btn">
                Upload
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
