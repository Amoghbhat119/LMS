import api from "../../utils/api";
import {
  authRequest, stuffAdded, authSuccess, authFailed, authError, authLogout,
  doneSuccess, getDeleteSuccess, getRequest, getFailed, getError,
} from "./userSlice";

const toMsg = (err) => err?.response?.data?.message || err?.message || "Request failed";

export const loginUser = (fields, role) => async (dispatch) => {
  dispatch(authRequest());
  try {
    const { data } = await api.post(`/${role}Login`, fields);
    if (data?.role) dispatch(authSuccess(data));
    else dispatch(authFailed(data?.message || "Login failed"));
  } catch (err) {
    dispatch(authError(toMsg(err)));
  }
};

export const registerUser = (fields, role) => async (dispatch) => {
  dispatch(authRequest());
  try {
    const { data } = await api.post(`/${role}Reg`, fields);
    if (data?.schoolName) dispatch(authSuccess(data));   // AdminReg success path
    else if (data?.school) dispatch(stuffAdded());       // some “created” responses
    else if (data?.message) dispatch(authFailed(data.message));
    else dispatch(stuffAdded(data));
  } catch (err) {
    dispatch(authError(toMsg(err)));
  }
};

export const logoutUser = () => (dispatch) => dispatch(authLogout());

export const getUserDetails = (id, address) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const { data } = await api.get(`/${address}/${id}`);
    if (data) dispatch(doneSuccess(data));
    else dispatch(getFailed("Not found"));
  } catch (err) {
    dispatch(getError(toMsg(err)));
  }
};

// Delete disabled intentionally
export const deleteUser = () => async (dispatch) => {
  dispatch(getRequest());
  dispatch(getFailed("Sorry the delete function has been disabled for now."));
};

export const updateUser = (fields, id, address) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const { data } = await api.put(`/${address}/${id}`, fields);
    if (data?.schoolName) dispatch(authSuccess(data));
    else dispatch(doneSuccess(data));
  } catch (err) {
    dispatch(getError(toMsg(err)));
  }
};

export const addStuff = (fields, address) => async (dispatch) => {
  dispatch(authRequest());
  try {
    const { data } = await api.post(`/${address}Create`, fields);
    if (data?.message) dispatch(authFailed(data.message));
    else dispatch(stuffAdded(data));
  } catch (err) {
    dispatch(authError(toMsg(err)));
  }
};
