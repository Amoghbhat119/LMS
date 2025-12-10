import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getSclassList } from '../../../redux/sclassRelated/sclassHandle';
import { CircularProgress } from '@mui/material';

const AddStudent = ({ situation }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { status, currentUser, response } = useSelector((s) => s.user);
  const { sclassesList = [] } = useSelector((s) => s.sclass);

  const [name, setName] = useState('');
  const [rollNum, setRollNum] = useState('');
  const [password, setPassword] = useState('');
  const [className, setClassName] = useState('');
  const [sclassName, setSclassName] = useState('');

  const adminID = useMemo(() => currentUser?._id || null, [currentUser]);

  useEffect(() => {
    if (situation === 'Class') setSclassName(params.id);
  }, [params.id, situation]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (adminID) dispatch(getSclassList(adminID));
  }, [adminID, dispatch]);

  const changeHandler = (e) => {
    if (e.target.value === 'Select Class') {
      setClassName('Select Class');
      setSclassName('');
    } else {
      const selected = sclassesList.find((c) => c.sclassName === e.target.value);
      setClassName(selected?.sclassName || '');
      setSclassName(selected?._id || '');
    }
  };

  const fields = { name, rollNum, password, sclassName, adminID, role: 'Student', attendance: [] };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!sclassName) {
      setMessage('Please select a classname');
      setShowPopup(true);
    } else {
      setLoader(true);
      dispatch(registerUser(fields, 'Student'));
    }
  };

  useEffect(() => {
    if (status === 'added') {
      dispatch(underControl());
      navigate(-1);
    } else if (status === 'failed') {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === 'error') {
      setMessage('Network Error');
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, response, dispatch, navigate]);

  return (
    <>
      <div className="register">
        <form className="registerForm" onSubmit={submitHandler}>
          <span className="registerTitle">Add Student</span>

          <label>Name</label>
          <input className="registerInput" type="text" placeholder="Enter student's name..."
                 value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />

          {situation === 'Student' && (
            <>
              <label>Class</label>
              <select className="registerInput" value={className} onChange={changeHandler} required>
                <option value="Select Class">Select Class</option>
                {sclassesList.map((c) => (
                  <option key={c._id} value={c.sclassName}>{c.sclassName}</option>
                ))}
              </select>
            </>
          )}

          <label>Roll Number</label>
          <input className="registerInput" type="number" placeholder="Enter student's Roll Number..."
                 value={rollNum} onChange={(e) => setRollNum(e.target.value)} required />

          <label>Password</label>
          <input className="registerInput" type="password" placeholder="Enter student's password..."
                 value={password} onChange={(e) => setPassword(e.target.value)}
                 autoComplete="new-password" required />

          <button className="registerButton" type="submit" disabled={loader}>
            {loader ? <CircularProgress size={24} color="inherit" /> : 'Add'}
          </button>
        </form>
      </div>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default AddStudent;
