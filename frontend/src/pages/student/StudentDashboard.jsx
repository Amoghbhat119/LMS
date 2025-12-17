import DashboardLayout from "../../components/DashboardLayout";

const StudentDashboard = () => {
  return (
    <DashboardLayout title="Student Dashboard">
      <p className="text-gray-700">
        View attendance, notes, and videos shared by teachers.
      </p>
    </DashboardLayout>
  );
};

export default StudentDashboard;
