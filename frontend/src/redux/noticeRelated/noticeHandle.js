import api from "../../utils/api";
import {
  getRequest, getSuccess, getFailed, getError,
  postRequest, postSuccess, postFailed,
} from "./noticeSlice";

const toMsg = (e) => e?.response?.data?.message || e?.message || "Request failed";

export const getAllNotices = (scopeId) => async (dispatch) => {
  dispatch(getRequest());
  try {
    // backend route: /NoticeList/:id
    const { data } = await api.get(`/NoticeList/${scopeId}`);
    if (Array.isArray(data) && data.length > 0) dispatch(getSuccess(data));
    else dispatch(getFailed("No notices"));
  } catch (err) {
    dispatch(getError(toMsg(err)));
  }
};

export const createNotice = (payload) => async (dispatch) => {
  dispatch(postRequest());
  try {
    const { data } = await api.post(`/NoticeCreate`, payload);
    if (data?.message) dispatch(postFailed(data.message));
    else dispatch(postSuccess(data));
  } catch (err) {
    dispatch(postFailed(toMsg(err)));
  }
};
