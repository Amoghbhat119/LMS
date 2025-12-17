import { useState } from "react";
import api from "../../../api/axios";

const CreateClass = () => {
  const [name, setName] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/class", { name });
      alert("Class created");
      setName("");
    } catch {
      alert("Error creating class");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <h3 className="font-semibold">Create Class</h3>
      <input className="input"
        placeholder="Class Name"
        value={name}
        onChange={(e)=>setName(e.target.value)} />
      <button className="btn-primary">Create</button>
    </form>
  );
};

export default CreateClass;
