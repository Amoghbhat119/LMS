import { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminDashboard = () => {
  const [active, setActive] = useState("classes");

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);

  const [className, setClassName] = useState("");
  const [subjectName, setSubjectName] = useState("");

  const [teacherForm, setTeacherForm] = useState({
    name: "",
    email: "",
    password: "",
    classId: "",
    subjectIds: [],
  });

  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    password: "",
    classId: "",
  });

  // 🔑 ONLY ADDITION
  const [showTeacherPassword, setShowTeacherPassword] = useState(false);

  /* ================= LOAD DATA ================= */

  const loadAll = async () => {
    const c = await api.get("/admin/classes");
    const s = await api.get("/admin/subjects");
    const t = await api.get("/admin/teachers");
    const st = await api.get("/admin/students");

    setClasses(c.data);
    setSubjects(s.data);
    setTeachers(t.data);
    setStudents(st.data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  /* ================= ACTIONS ================= */

  const createClass = async () => {
    if (!className) return alert("Enter class name");
    await api.post("/admin/class", { name: className });
    setClassName("");
    loadAll();
  };

  const createSubject = async () => {
    if (!subjectName || !teacherForm.classId)
      return alert("Enter subject & select class");

    await api.post("/admin/subject", {
      name: subjectName,
      classId: teacherForm.classId,
    });

    setSubjectName("");
    loadAll();
  };

  const createTeacher = async () => {
    if (
      !teacherForm.name ||
      !teacherForm.email ||
      !teacherForm.password ||
      !teacherForm.classId ||
      teacherForm.subjectIds.length === 0
    ) {
      return alert("Fill all teacher fields");
    }

    await api.post("/admin/teacher", {
      ...teacherForm,
      password: teacherForm.password.trim(), // safety
    });

    setTeacherForm({
      name: "",
      email: "",
      password: "",
      classId: "",
      subjectIds: [],
    });

    loadAll();
  };

  const createStudent = async () => {
    if (
      !studentForm.name ||
      !studentForm.email ||
      !studentForm.password ||
      !studentForm.classId
    ) {
      return alert("Fill all student fields");
    }

    await api.post("/admin/student", studentForm);

    setStudentForm({
      name: "",
      email: "",
      password: "",
      classId: "",
    });

    loadAll();
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  /* ================= FILTER SUBJECTS BY CLASS ================= */

  const subjectsByClass = subjects.filter(
    (s) => s.class?._id === teacherForm.classId
  );

  /* ================= UI ================= */

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-4 space-y-3">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <Menu title="Manage Classes" onClick={() => setActive("classes")} />
        <Menu title="Manage Teachers" onClick={() => setActive("teachers")} />
        <Menu title="Manage Students" onClick={() => setActive("students")} />
        <Menu title="Manage Subjects" onClick={() => setActive("subjects")} />
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 bg-white border-b px-6 flex justify-between items-center">
          <b>Learning Management System</b>
          <button onClick={logout} className="text-red-600 font-medium">
            Logout
          </button>
        </header>

        <main className="p-6 overflow-auto space-y-6">

          {/* ================= CLASSES ================= */}
          {active === "classes" && (
            <>
              <Section title="Create Class">
                <Input label="Class Name" v={className} f={setClassName} />
                <button className="btn" onClick={createClass}>Create</button>
              </Section>

              <Table
                title="All Classes"
                headers={["Class", "Teacher(s)", "Subjects", "Students"]}
                rows={classes.map(c => {
                  const teachers = [
                    ...new Set(
                      (c.subjects || [])
                        .map(s => s.teacher?.name)
                        .filter(Boolean)
                    )
                  ];

                  return [
                    c.name,
                    teachers.length ? teachers.join(", ") : "-",
                    c.subjects?.map(s => s.name).join(", ") || "-",
                    c.students?.length || 0
                  ];
                })}
              />
            </>
          )}

          {/* ================= TEACHERS ================= */}
          {active === "teachers" && (
            <>
              <Section title="Create Teacher">
                <Input label="Name" v={teacherForm.name} f={v => setTeacherForm({ ...teacherForm, name: v })} />
                <Input label="Email" v={teacherForm.email} f={v => setTeacherForm({ ...teacherForm, email: v })} />

                {/* 🔑 PASSWORD WITH EYE */}
                <div className="relative">
                  <input
                    type={showTeacherPassword ? "text" : "password"}
                    placeholder="Password"
                    value={teacherForm.password}
                    onChange={(e) =>
                      setTeacherForm({ ...teacherForm, password: e.target.value })
                    }
                    className="input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTeacherPassword(!showTeacherPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {showTeacherPassword ? "🙈" : "👁️"}
                  </button>
                </div>

                <Select
                  label="Class"
                  items={classes}
                  onChange={(v) =>
                    setTeacherForm({ ...teacherForm, classId: v, subjectIds: [] })
                  }
                />

                <MultiSelect
                  items={subjectsByClass}
                  onChange={(v) =>
                    setTeacherForm({ ...teacherForm, subjectIds: v })
                  }
                />

                <button className="btn" onClick={createTeacher}>
                  Create Teacher
                </button>
              </Section>

              <Table
                title="All Teachers"
                headers={["Name", "Email"]}
                rows={teachers.map(t => [t.name, t.email])}
              />
            </>
          )}

          {/* ================= STUDENTS ================= */}
          {active === "students" && (
            <>
              <Section title="Create Student">
                <Input label="Name" v={studentForm.name} f={v => setStudentForm({ ...studentForm, name: v })} />
                <Input label="Email" v={studentForm.email} f={v => setStudentForm({ ...studentForm, email: v })} />
                <Input label="Password" type="password" v={studentForm.password} f={v => setStudentForm({ ...studentForm, password: v })} />

                <Select
                  label="Class"
                  items={classes}
                  onChange={(v) =>
                    setStudentForm({ ...studentForm, classId: v })
                  }
                />

                <button className="btn" onClick={createStudent}>
                  Create Student
                </button>
              </Section>

              <Table
                title="All Students"
                headers={["Name", "Email"]}
                rows={students.map(s => [s.name, s.email])}
              />
            </>
          )}

          {/* ================= SUBJECTS ================= */}
          {active === "subjects" && (
            <>
              <Section title="Create Subject">
                <Input label="Subject Name" v={subjectName} f={setSubjectName} />
                <Select
                  label="Class"
                  items={classes}
                  onChange={(v) =>
                    setTeacherForm({ ...teacherForm, classId: v })
                  }
                />
                <button className="btn" onClick={createSubject}>
                  Create Subject
                </button>
              </Section>

              <Table
                title="All Subjects"
                headers={["Subject", "Class", "Teacher"]}
                rows={subjects.map(s => [
                  s.name,
                  s.class?.name || "-",
                  s.teacher?.name || "-"
                ])}
              />
            </>
          )}

        </main>
      </div>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const Menu = ({ title, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-3 py-2 rounded hover:bg-gray-200"
  >
    {title}
  </button>
);

const Section = ({ title, children }) => (
  <div className="bg-white p-4 rounded shadow space-y-3">
    <h3 className="font-semibold">{title}</h3>
    {children}
  </div>
);

const Table = ({ title, headers, rows }) => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="font-semibold mb-3">{title}</h3>
    <table className="w-full border">
      <thead className="bg-gray-100">
        <tr>
          {headers.map(h => (
            <th key={h} className="border p-2">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j} className="border p-2">{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Input = ({ label, v, f, type = "text" }) => (
  <input
    type={type}
    placeholder={label}
    value={v}
    onChange={(e) => f(e.target.value)}
    className="input"
  />
);

const Select = ({ label, items, onChange }) => (
  <select className="input" onChange={(e) => onChange(e.target.value)}>
    <option value="">Select {label}</option>
    {items.map(i => (
      <option key={i._id} value={i._id}>{i.name}</option>
    ))}
  </select>
);

const MultiSelect = ({ items, onChange }) => (
  <select
    multiple
    className="input h-28"
    onChange={(e) =>
      onChange([...e.target.selectedOptions].map(o => o.value))
    }
  >
    {items.map(i => (
      <option key={i._id} value={i._id}>{i.name}</option>
    ))}
  </select>
);

export default AdminDashboard;
