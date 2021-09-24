import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import axios from "../../axios/axios";

const initialState = {
  allDealsArr: [],
  loading: false,
  addDealModalVisible: false,
  error: null,
  deleteModalVisible: false,
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

export const getAllDealsThunk = createAsyncThunk(
  "allDeals/getAllDealsThunk",
  async (pageNo, { rejectWithValue }) => {
    const options = {
      pageNo,
    };

    try {
      const { data } = await axios.post("/deal/allDeals", options);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addDealsThunk = createAsyncThunk(
  "allDeals/addDealsThunk",
  async (adddealData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/deal/addDeal", adddealData);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const editDealsThunk = createAsyncThunk(
  "allDeals/editDealsThunk",
  async (adddealData, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch("/deal/editDeal", adddealData);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteDeal = createAsyncThunk(
  "allDeals/deleteDeal",
  async ({ couponId }, { rejectWithValue }) => {
    const options = { data: { couponId } };
    try {
      const { data } = await axios.delete("/deal/deleteDeal", options);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const allDealsSlice = createSlice({
  name: "allDeals",
  initialState,
  reducers: {
    toggleDeleteModal: (state, action) => {
      state.deleteModalVisible = action.payload.modal;
    },
    toggleAddModal: (state, action) => {
      state.addDealModalVisible = action.payload.modal;
    },
  },

  extraReducers: {
    //? All Templates Thunk
    [getAllDealsThunk.pending]: (state, action) => {
      state.loading = true;
    },

    [getAllDealsThunk.fulfilled]: (state, action) => {
      const { success, data } = action.payload;
      state.loading = false;
      state.allDealsArr = data;
    },

    [getAllDealsThunk.rejected]: (state, action) => {
      commonErrorResponse(state, action);
    },

    //add deals Thunk
    [addDealsThunk.pending]: (state, action) => {
      state.loading = true;
    },
    [addDealsThunk.fulfilled]: (state, action) => {
      const { success, data } = action.payload;
      state.loading = false;
      // state.allDealsArr = data;
      return (window.location.href = "/deals");
    },
    [addDealsThunk.rejected]: (state, action) => {
      commonErrorResponse(state, action);
    },

    //? Delete Template Thunk
    [deleteDeal.pending]: (state, action) => {
      state.loading = true;
    },

    [deleteDeal.fulfilled]: (state, action) => {
      const { success, data } = action.payload;
      state.loading = false;
      state.deleteModalVisible = false;
      // state.allDealsArr = state.allDealsArr.filter((deal) => deal.couponId !== data.couponId);
      return (window.location.href = "/deals");
    },

    [deleteDeal.rejected]: (state, action) => {
      // state.loading = false;
      commonErrorResponse(state, action);
    },

    //edit Deal Thunk
    [editDealsThunk.pending]: (state, action) => {
      state.loading = true;
    },
    [editDealsThunk.fulfilled]: (state, action) => {
      const { success, data } = action.payload;
      state.loading = false;
      // state.allDealsArr = data;
      return (window.location.href = "/deals");
    },
    [editDealsThunk.rejected]: (state, action) => {
      commonErrorResponse(state, action);
    },
  },
});

export const { setAllDeals, cleanup, toggleDeleteModal, toggleAddModal } =
  allDealsSlice.actions;

export default allDealsSlice.reducer;
