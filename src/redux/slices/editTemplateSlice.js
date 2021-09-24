import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import axios from "../../axios/axios";

const initialState = {
  allViewsArr: [],
  deleteViewModal: false,
  panelLoading: false,
};

const styles = {
  message: {
    marginTop: "10vh",
    fontSize: "1.2rem",
    fontWeight: "500",
  },
};

const commonErrorResponse = (state, action) => {
  const { data, message: errorMessage, loggedIn, success } = action.payload;

  if (success === 0 && loggedIn === 0) {
    localStorage.clear();
    return (window.location.href = "/");
  }

  if (success === 0) {
    state.panelLoading = false;
    // state.modal = false;
    message.error({
      content: errorMessage,
      style: styles.message,
    });
  }
};

export const getAllViews = createAsyncThunk(
  "editTemplate/getAllTemplatesThunk",
  async ({ templateId }, { rejectWithValue }) => {
    const options = {
      templateId,
    };

    try {
      const { data } = await axios.post("/template/getTemplate", options);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const saveSortedViews = createAsyncThunk(
  "editTemplate/saveSortedViews",
  async ({ templateId }, { getState, rejectWithValue }) => {
    const sortedViews = getState();
    const template = sortedViews.editTemplate.allViewsArr.map(
      (value) => value.viewUnique
    );
    const options = { templateId, template };
    try {
      const { data } = await axios.patch("/template/rearrangeView", options);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteView = createAsyncThunk(
  "editTemplate/deleteView",
  async ({ templateId, viewUnique }, { rejectWithValue }) => {
    const options = { data: { templateId, viewUnique } };
    try {
      const { data } = await axios.delete("/template/deleteView", options);

      return  data 
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const editTemplateSlice = createSlice({
  name: "editTemplate",
  initialState,
  reducers: {
    deleteViewModalVisible: (state, action) => {
      state.deleteViewModal = action.payload.modal;
    },
    sortViews: (state, action) => {
      state.allViewsArr = action.payload.sortedViews;
    },
  },
  extraReducers: {
    //? All Views Thunk
    [getAllViews.pending]: (state, action) => {
      state.panelLoading = true;
    },

    [getAllViews.fulfilled]: (state, action) => {
      const { success, data } = action.payload;
      state.panelLoading = false;
      state.allViewsArr = data.template;
    },

    [getAllViews.rejected]: (state, action) => {
      commonErrorResponse(state, action);
    },

    //? Sorted Views Thunk
    [saveSortedViews.pending]: (state, action) => {
      state.panelLoading = true;
    },

    [saveSortedViews.fulfilled]: (state, action) => {
      const { data } = action.payload;
      state.panelLoading = false;
      message.success("Views Sorted Successfully");
      state.allViewsArr = data.template;
    },

    [saveSortedViews.rejected]: (state, action) => {
      commonErrorResponse(state, action);
    },

    //? Delete View Thunk
    [deleteView.pending]: (state, action) => {
      state.panelLoading = true;
    },

    [deleteView.fulfilled]: (state, action) => {
      const { data } = action.payload;
      message.success("View Deleted Successfully");
      state.panelLoading = false;
      state.deleteViewModal = false;
      state.allViewsArr = data.template;
    },

    [deleteView.rejected]: (state, action) => {
      commonErrorResponse(state, action);
    },
  },
});

export const { sortViews, deleteViewModalVisible } = editTemplateSlice.actions;

export default editTemplateSlice.reducer;
