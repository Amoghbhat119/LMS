import { useNavigate } from "react-router-dom";

const DashboardLayout = ({ title, children }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">LMS</h2>
        <button
          onClick={logout}
          className="text-red-600 hover:underline"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-4">{title}</h1>
        <div className="bg-white p-6 rounded shadow">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
