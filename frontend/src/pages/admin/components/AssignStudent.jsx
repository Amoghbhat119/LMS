import { useState } from "react";
import api from "../../../api/axios";

const AssignStudent = () => {
  const [data, setData] = useState({
    classId: "",
    studentId: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/assign-student", data);
      alert("Student assigned");
    } catch {
      alert("Error assigning student");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <h3 className="font-semibold">Assign Student to Class</h3>

      <input className="input" placeholder="Class ID"
        onChange={(e)=>setData({...data,classId:e.target.value})} />

      <input className="input" placeholder="Student ID"
        onChange={(e)=>setData({...data,studentId:e.target.value})} />

      <button className="btn-primary">Assign</button>
    </form>
  );
};

export default AssignStudent;
