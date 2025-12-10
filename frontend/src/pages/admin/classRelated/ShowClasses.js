import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, IconButton, Tooltip, Menu, MenuItem, ListItemIcon } from '@mui/material';
import { getSclassList } from '../../../redux/sclassRelated/sclassHandle';
import TableTemplate from '../../../components/TableTemplate';
import { GreenButton, BlueButton } from '../../../components/buttonStyles';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddCardIcon from '@mui/icons-material/AddCard';
import styled from 'styled-components';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowClasses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser = null } = useSelector((s) => s.user || {});
  const { sclassesList = [], loading, error, response } = useSelector((s) => s.sclass || {});

  const adminID = useMemo(() => currentUser?._id || null, [currentUser]);

  useEffect(() => {
    if (adminID) dispatch(getSclassList(adminID));
  }, [dispatch, adminID]);

  if (error) console.error(error);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = () => {
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);
  };

  const columns = [
    { id: 'name', label: 'Class Name', minWidth: 170 },
    { id: 'numeric', label: 'Numeric', minWidth: 80 },
  ];

  const rows = sclassesList.map((c) => ({
    id: c?._id,
    name: c?.sclassName ?? '—',
    numeric: c?.numericName ?? '—',
  }));

  const ActionMenu = ({ actions }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClose = () => setAnchorEl(null);

    return (
      <>
        <Tooltip title="Add Students & Subjects">
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small" sx={{ ml: 2 }}>
            <h5 style={{ marginRight: 6 }}>Add</h5>
            <SpeedDialIcon />
          </IconButton>
        </Tooltip>
        <Menu anchorEl={anchorEl} id="class-actions" open={open} onClose={handleClose}
              onClick={handleClose} PaperProps={{ elevation: 0, sx: styles.styledPaper }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
          {actions.map((a, i) => (
            <MenuItem key={i} onClick={a.action}>
              <ListItemIcon>{a.icon}</ListItemIcon>{a.name}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  };

  const ButtonHaver = ({ row }) => {
    const actions = [
      { icon: <PostAddIcon />, name: 'Add Subjects', action: () => navigate(`/Admin/addsubject/${row.id}`) },
      { icon: <PersonAddAlt1Icon />, name: 'Add Student', action: () => navigate(`/Admin/class/addstudents/${row.id}`) },
    ];
    return (
      <BtnWrap>
        <IconButton onClick={deleteHandler}><DeleteIcon color="error" /></IconButton>
        <BlueButton variant="contained" onClick={() => navigate(`/Admin/class/${row.id}`)}>View</BlueButton>
        <ActionMenu actions={actions} />
      </BtnWrap>
    );
  };

  const actions = [
    { icon: <AddCardIcon color="primary" />, name: 'Add New Class', action: () => navigate("/Admin/addclass") },
    { icon: <DeleteIcon color="error" />, name: 'Delete All Classes', action: deleteHandler },
  ];

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Typography variant="h5" gutterBottom>Classes</Typography>

        {loading ? (
          <div style={{ fontSize: 18 }}>Loading…</div>
        ) : response ? (
          <>
            <div style={{ fontSize: 16, marginBottom: 16 }}>No Classes found</div>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <GreenButton variant="contained" onClick={() => navigate('/Admin/addclass')}>Add Class</GreenButton>
            </Box>
          </>
        ) : (
          <>
            {rows.length > 0 && <TableTemplate columns={columns} rows={rows} buttonHaver={ButtonHaver} />}
            <SpeedDialTemplate actions={actions} />
          </>
        )}
      </Paper>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default ShowClasses;

const styles = {
  styledPaper: {
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1.5,
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  },
};
const BtnWrap = styled.div`display: flex; align-items: center; gap: 1rem;`;
