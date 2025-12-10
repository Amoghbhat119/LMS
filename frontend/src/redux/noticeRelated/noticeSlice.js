// src/redux/noticeRelated/noticeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  noticesList: [],
  loading: false,        // for GET list
  error: null,
  response: false,       // true when "no data" (kept to match rest of app)

  posting: false,        // for POST/CREATE
  postError: null,
};

const noticeSlice = createSlice({
  name: "notice",
  initialState,
  reducers: {
    // ----- GET LIST -----
    getRequest(state) {
      state.loading = true;
      state.error = null;
      state.response = false;
    },
    getSuccess(state, action) {
      state.loading = false;
      state.noticesList = action.payload || [];
      state.response = false;
    },
    getFailed(state, action) {
      state.loading = false;
      state.response = true;         // no data
      state.error = action.payload ?? null;
      state.noticesList = [];
    },
    getError(state, action) {
      state.loading = false;
      state.error = action.payload ?? "Request failed";
    },

    // ----- CREATE (POST) -----
    postRequest(state) {
      state.posting = true;
      state.postError = null;
    },
    postSuccess(state, action) {
      state.posting = false;
      const created = action.payload;
      // If API returns the created notice, append it; otherwise leave list as-is
      if (created) state.noticesList = [created, ...state.noticesList];
    },
    postFailed(state, action) {
      state.posting = false;
      state.postError = action.payload ?? "Create failed";
    },
  },
});

export const {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  postRequest,
  postSuccess,
  postFailed,
} = noticeSlice.actions;

export const noticeReducer = noticeSlice.reducer;
export default noticeReducer;
