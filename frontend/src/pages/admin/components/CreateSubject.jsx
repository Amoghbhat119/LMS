import { useState } from "react";
import api from "../../../api/axios";

const CreateSubject = () => {
  const [data, setData] = useState({
    name: "",
    classId: "",
    teacherId: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/subject", data);
      alert("Subject created");
    } catch {
      alert("Error creating subject");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <h3 className="font-semibold">Create Subject</h3>

      <input className="input" placeholder="Subject Name"
        onChange={(e)=>setData({...data,name:e.target.value})} />

      <input className="input" placeholder="Class ID"
        onChange={(e)=>setData({...data,classId:e.target.value})} />

      <input className="input" placeholder="Teacher ID"
        onChange={(e)=>setData({...data,teacherId:e.target.value})} />

      <button className="btn-primary">Create</button>
    </form>
  );
};

export default CreateSubject;
