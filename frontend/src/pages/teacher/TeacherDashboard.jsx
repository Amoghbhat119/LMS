import { useEffect, useState } from "react";
import api from "../../api/axios";

const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState("");

  const [file, setFile] = useState(null);

  const [mode, setMode] = useState("MARK"); // MARK | VIEW_ATT | VIEW_FILES
  const [viewStudents, setViewStudents] = useState([]);
  const [viewRecords, setViewRecords] = useState({});
  const [materials, setMaterials] = useState([]);

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  /* ================= LOAD CLASSES ================= */
  const loadClasses = async () => {
    const res = await api.get("/teacher/classes");
    setClasses(res.data);
  };

  const loadStudents = async (classId) => {
    const res = await api.get(`/teacher/students/${classId}`);
    setStudents(res.data);

    const map = {};
    res.data.forEach(s => (map[s._id] = true));
    setAttendance(map);
  };

  useEffect(() => {
    loadClasses();
  }, []);

  /* ================= ATTENDANCE ================= */
  const submitAttendance = async () => {
    await api.post("/teacher/attendance", {
      classId: selectedClass._id,
      records: attendance,
      date,
    });
    alert("Attendance saved");
  };

  const viewAttendance = async () => {
    if (!date) return alert("Select date");

    const res = await api.get("/teacher/attendance", {
      params: { classId: selectedClass._id, date },
    });

    setViewStudents(res.data.students);
    setViewRecords(res.data.records);
    setMode("VIEW_ATT");
  };

  /* ================= UPLOAD ================= */
  const uploadMaterial = async () => {
    const form = new FormData();
    form.append("file", file);
    form.append("classId", selectedClass._id);

    await api.post("/teacher/material", form);
    alert("Uploaded");
    setFile(null);
  };

  const viewUploads = async () => {
    const res = await api.get("/teacher/materials", {
      params: { classId: selectedClass._id },
    });
    setMaterials(res.data);
    setMode("VIEW_FILES");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white p-4 border-r flex flex-col">
        <h2 className="font-bold mb-3">Teacher</h2>

        {classes.map(c => (
          <button
            key={c._id}
            onClick={() => {
              setSelectedClass(c);
              setMode("MARK");
              loadStudents(c._id);
            }}
            className="block w-full text-left p-2 hover:bg-gray-200"
          >
            {c.name}
          </button>
        ))}

        {/* ✅ LOGOUT BUTTON */}
        <button
          onClick={logout}
          className="mt-auto text-red-600 hover:underline"
        >
          Logout
        </button>
      </aside>

      <div className="flex-1 p-6 overflow-auto">
        {!selectedClass && <p>Select a class</p>}

        {selectedClass && mode === "MARK" && (
          <>
            <h2 className="font-semibold mb-2">Attendance</h2>

            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />

            <table className="w-full border mt-3">
              <tbody>
                {students.map(s => (
                  <tr key={s._id}>
                    <td className="border p-2">{s.name}</td>
                    <td className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={attendance[s._id] || false}
                        onChange={() =>
                          setAttendance({
                            ...attendance,
                            [s._id]: !attendance[s._id],
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 space-x-2">
              <button className="btn" onClick={submitAttendance}>Save</button>
              <button className="btn" onClick={viewAttendance}>View Attendance</button>
              <button className="btn" onClick={viewUploads}>View Uploads</button>
            </div>

            <div className="mt-4">
              <input type="file" onChange={e => setFile(e.target.files[0])} />
              <button className="btn ml-2" onClick={uploadMaterial}>Upload</button>
            </div>
          </>
        )}

        {mode === "VIEW_ATT" && (
          <>
            <h2 className="font-semibold mb-3">Attendance on {date}</h2>
            <table className="w-full border">
              <tbody>
                {viewStudents.map(s => (
                  <tr key={s._id}>
                    <td className="border p-2">{s.name}</td>
                    <td className="border p-2">
                      {viewRecords[s._id] ? "Present" : "Absent"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn mt-4" onClick={() => setMode("MARK")}>Back</button>
          </>
        )}

        {mode === "VIEW_FILES" && (
          <>
            <h2 className="font-semibold mb-3">Uploaded Files</h2>
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
            <button className="btn mt-4" onClick={() => setMode("MARK")}>Back</button>
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
