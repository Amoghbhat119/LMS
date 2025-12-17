import { useState } from "react";
import api from "../../../api/axios";

const CreateUser = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "TEACHER",
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/user", form);
      alert("User created");
      setForm({ name: "", email: "", password: "", role: "TEACHER" });
    } catch {
      alert("Error creating user");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <h3 className="font-semibold">Create Teacher / Student</h3>

      <input className="input" placeholder="Name"
        value={form.name}
        onChange={(e)=>setForm({...form,name:e.target.value})} />

      <input className="input" placeholder="Email"
        value={form.email}
        onChange={(e)=>setForm({...form,email:e.target.value})} />

      <input className="input" placeholder="Password"
        value={form.password}
        onChange={(e)=>setForm({...form,password:e.target.value})} />

      <select className="input"
        value={form.role}
        onChange={(e)=>setForm({...form,role:e.target.value})}>
        <option value="TEACHER">Teacher</option>
        <option value="STUDENT">Student</option>
      </select>

      <button className="btn-primary">Create</button>
    </form>
  );
};

export default CreateUser;
