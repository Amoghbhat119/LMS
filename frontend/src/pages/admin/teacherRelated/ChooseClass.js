import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography } from '@mui/material';
import { getSclassList } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate } from 'react-router-dom';
import { PurpleButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';

const ChooseClass = ({ situation }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { sclassesList = [], loading, error, response } = useSelector((s) => s.sclass);
  const { currentUser = null } = useSelector((s) => s.user);
  const adminID = useMemo(() => currentUser?._id || null, [currentUser]);

  useEffect(() => {
    if (adminID) dispatch(getSclassList(adminID));
  }, [dispatch, adminID]);

  if (error) console.error(error);

  const go = (classID) => {
    if (situation === 'Teacher') navigate(`/Admin/teachers/choosesubject/${classID}`);
    else if (situation === 'Subject') navigate(`/Admin/addsubject/${classID}`);
  };

  const columns = [{ id: 'name', label: 'Class Name', minWidth: 170 }];
  const rows = sclassesList.map((c) => ({ id: c._id, name: c.sclassName }));

  const ButtonHaver = ({ row }) => (
    <PurpleButton variant="contained" onClick={() => go(row.id)}>Choose</PurpleButton>
  );

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : response ? (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" onClick={() => navigate('/Admin/addclass')}>Add Class</Button>
        </Box>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>Choose a class</Typography>
          {rows.length > 0 && <TableTemplate columns={columns} rows={rows} buttonHaver={ButtonHaver} />}
        </>
      )}
    </>
  );
};

export default ChooseClass;
