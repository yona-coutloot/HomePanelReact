import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import axios from "../../axios/axios";

const initialState = {
  allTeamplatesArr: [],
  panelLoading: false,
  addTemplateModal: false,
  cloneTemplateModal: false,
  deleteTemplateModal: false,
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

export const getAllTemplatesThunk = createAsyncThunk(
  "allTemplates/getAllTemplatesThunk",
  async (pageNo, { rejectWithValue }) => {
    const options = {
      pageNo,
    };

    try {
      const { data } = await axios.get("/template/allTemplates", {
        params: options,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addNewTemplate = createAsyncThunk(
  "allTemplates/addNewTemplate",
  async ({ templateName }, { rejectWithValue }) => {
    const options = {
      templateName,
    };

    try {
      const { data } = await axios.post("/template/addNewTemplate", options);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const cloneTemplate = createAsyncThunk(
  "allTemplates/cloneTemplate",
  async ({ templateId, templateName }, { rejectWithValue }) => {
    try {
      const options = { templateId, templateName };
      const { data } = await axios.post("/template/cloneTemplate", options);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  "allTemplates/deleteTemplate",
  async ({ templateId }, { rejectWithValue }) => {
    const options = { data: { templateId } };
    try {
      const { data } = await axios.delete("/template/deleteTemplate", options);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const allTemplateSlice = createSlice({
  name: "allTemplates",
  initialState,
  reducers: {
    addTemplateModalVisible: (state, action) => {
      state.addTemplateModal = action.payload.modal;
    },
    cloneTemplateModalVisible: (state, action) => {
      state.cloneTemplateModal = action.payload.modal;
    },
    deleteTemplateModalVisible: (state, action) => {
      state.deleteTemplateModal = action.payload.modal;
    },
  },
  extraReducers: {
    //? All Templates Thunk
    [getAllTemplatesThunk.pending]: (state, action) => {
      state.panelLoading = true;
    },

    [getAllTemplatesThunk.fulfilled]: (state, action) => {
      const { success, data } = action.payload;
      state.panelLoading = false;
      state.allTeamplatesArr = data;
    },

    [getAllTemplatesThunk.rejected]: (state, action) => {
      commonErrorResponse(state, action);
    },

    //? Add New Template Thunk
    [addNewTemplate.pending]: (state, action) => {
      state.panelLoading = true;
    },

    [addNewTemplate.fulfilled]: (state, action) => {
      const { success, data } = action.payload;
      state.panelLoading = false;
      state.addTemplateModal = false;
      state.allTeamplatesArr.unshift(data);
    },

    [addNewTemplate.rejected]: (state, action) => {
      commonErrorResponse(state, action);
    },

    //? Clone Template Thunk
    [cloneTemplate.pending]: (state, action) => {
      state.panelLoading = true;
    },

    [cloneTemplate.fulfilled]: (state, action) => {
      const { success, data } = action.payload;
      state.panelLoading = false;
      state.cloneTemplateModal = false;
      state.allTeamplatesArr.unshift(data);
    },

    [cloneTemplate.rejected]: (state, action) => {
      commonErrorResponse(state, action);
    },

    //? Delete Template Thunk
    [deleteTemplate.pending]: (state, action) => {
      state.panelLoading = true;
    },

    [deleteTemplate.fulfilled]: (state, action) => {
      const { success, data } = action.payload;
      state.panelLoading = false;
      state.deleteTemplateModal = false;
      state.allTeamplatesArr = state.allTeamplatesArr.filter(
        (template) => template.templateId !== data.templateId
      );
    },

    [deleteTemplate.rejected]: (state, action) => {
      commonErrorResponse(state, action);
    },
  },
});

export const {
  addTemplateModalVisible,
  cloneTemplateModalVisible,
  deleteTemplateModalVisible,
} = allTemplateSlice.actions;

export default allTemplateSlice.reducer;
