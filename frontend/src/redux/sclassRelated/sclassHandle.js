import api from '../../utils/api';
import {
  getRequest, getSuccess, getFailed, getError,
  getStudentsSuccess, detailsSuccess,
  getFailedTwo, getSubjectsSuccess,
  getSubDetailsSuccess, getSubDetailsRequest,
} from './sclassSlice';

const toMsg = (e) => e?.response?.data?.message || e?.message || 'Request failed';

/** Fetch all classes for the given school/admin id */
export const getSclassList = (schoolId) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const { data } = await api.get(`/SclassList/${schoolId}`);
    if (Array.isArray(data)) {
      if (data.length === 0) dispatch(getFailed('No classes'));
      else dispatch(getSuccess(data));
    } else {
      dispatch(getFailed('Unexpected response'));
    }
  } catch (err) {
    dispatch(getError(toMsg(err)));
  }
};

export const getClassStudents = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const { data } = await api.get(`/Sclass/Students/${id}`);
    if (data?.message) dispatch(getFailedTwo(data.message));
    else dispatch(getStudentsSuccess(data));
  } catch (err) {
    dispatch(getError(toMsg(err)));
  }
};

export const getClassDetails = (id, address) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const { data } = await api.get(`/${address}/${id}`);
    if (data) dispatch(detailsSuccess(data));
  } catch (err) {
    dispatch(getError(toMsg(err)));
  }
};

export const getSubjectList = (id, address) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const { data } = await api.get(`/${address}/${id}`);
    if (data?.message) dispatch(getFailed(data.message));
    else dispatch(getSubjectsSuccess(data));
  } catch (err) {
    dispatch(getError(toMsg(err)));
  }
};

export const getTeacherFreeClassSubjects = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const { data } = await api.get(`/FreeSubjectList/${id}`);
    if (data?.message) dispatch(getFailed(data.message));
    else dispatch(getSubjectsSuccess(data));
  } catch (err) {
    dispatch(getError(toMsg(err)));
  }
};

export const getSubjectDetails = (id, address) => async (dispatch) => {
  dispatch(getSubDetailsRequest());
  try {
    const { data } = await api.get(`/${address}/${id}`);
    if (data) dispatch(getSubDetailsSuccess(data));
  } catch (err) {
    dispatch(getError(toMsg(err)));
  }
};
