import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotices } from "../redux/noticeRelated/noticeHandle";
import { Paper } from "@mui/material";
import TableViewTemplate from "./TableViewTemplate";

const SeeNotice = () => {
  const dispatch = useDispatch();
  const { currentUser, currentRole } = useSelector((s) => s.user);
  const { noticesList = [], loading, error, response } = useSelector((s) => s.notice);

  useEffect(() => {
    if (!currentUser || !currentRole) return;
    const scopeId = currentRole === "Admin" ? currentUser._id : currentUser.school?._id;
    if (scopeId) dispatch(getAllNotices(scopeId, "Notice"));
  }, [dispatch, currentUser, currentRole]);

  if (error) {
    // keep console-only to avoid breaking UI
    // eslint-disable-next-line no-console
    console.error(error);
  }

  const noticeColumns = [
    { id: "title", label: "Title", minWidth: 170 },
    { id: "details", label: "Details", minWidth: 100 },
    { id: "date", label: "Date", minWidth: 170 },
  ];

  const noticeRows = (noticesList || []).map((n) => {
    const d = new Date(n.date);
    const dateString = isNaN(d.getTime()) ? "Invalid Date" : d.toISOString().substring(0, 10);
    return { id: n._id, title: n.title, details: n.details, date: dateString };
    }
  );

  if (!currentUser || !currentRole) {
    return <div style={{ fontSize: 16, opacity: 0.7, marginTop: 16 }}>Loading…</div>;
  }

  return (
    <div style={{ marginTop: "50px", marginRight: "20px" }}>
      {loading ? (
        <div style={{ fontSize: "20px" }}>Loading...</div>
      ) : response ? (
        <div style={{ fontSize: "20px" }}>No Notices to Show Right Now</div>
      ) : (
        <>
          <h3 style={{ fontSize: "30px", marginBottom: "40px" }}>Notices</h3>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            {Array.isArray(noticesList) && noticesList.length > 0 && (
              <TableViewTemplate columns={noticeColumns} rows={noticeRows} />
            )}
          </Paper>
        </>
      )}
    </div>
  );
};

export default SeeNotice;
