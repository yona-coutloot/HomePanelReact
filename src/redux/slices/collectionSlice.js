import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import axios from "../../axios/axios";

const initialState = {
  allCollectionsArr: [],
  loading: false,
  productListLoader: false,
  addCollectionModal: false,
  deleteCollectionModal: false,
  mergeCollectionModal: false,
  collectionSummaryModal: false,
  collectionName: null,
  description: null,
  filterObj: null,
  filterDisplay: null,
  scrolledPageNo: 0,
  productCount: 0,
  hasMoreProducts: null,
  filteredProducts: [],
};

const styles = {
  message: {
    marginTop: "10vh",
    fontSize: "1.2rem",
    fontWeight: "500",
  },
};

const commonErrorResponse = (state, action) => {
  const { message: errorMessage, loggedIn, success } = action.payload;

  if (success === 0 && loggedIn === 0) {
    localStorage.clear();
    return (window.location.href = "/");
  }

  if (success === 0) {
    state.loading = false;
    // state.modal = false;
    message.error(
      {
        content: errorMessage,
        style: styles.message,
      },
      6000
    );
  }
};

export const fetchAllCollections = createAsyncThunk(
  "collection/fetchAllCollections",
  async ({ pageNo }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/collection/allCollections", {
        params: {
          pageNo,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchProducts = createAsyncThunk(
  "collection/fetchProducts",
  async (payload, { rejectWithValue, getState }) => {
    const { filterObj, scrolledPageNo } = getState().allCollections;

    const requestProduct = { ...filterObj };
    requestProduct.pageNo = scrolledPageNo;
    try {
      const { data } = await axios.post("/collection/filterProduct", requestProduct);
      return data;
    } catch (error) {
      console.log("🚀 ~ file: collectionSlice.js ~ line 87 ~ error", error);
      return rejectWithValue(error);
    }
  }
);

export const addCollection = createAsyncThunk(
  "collection/addCollection",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/collection/addCollection", payload);
      return data;
    } catch (error) {
      console.log("🚀 ~ file: collectionSlice.js ~ line 97 ~ error", error);
      return rejectWithValue(error);
    }
  }
);

export const fetchCollectionById = createAsyncThunk(
  "collection/fetchCollectionById",
  async ({ collectionId }, { rejectWithValue, getState }) => {
    try {
      const { data } = await axios.get("/collection/fetchCollectionById", {
        params: {
          collectionId,
          pageNo: getState().allCollections.scrolledPageNo,
        },
      });
      return data;
    } catch (error) {
      console.log("🚀 ~ file: collectionSlice.js ~ line 99 ~ error", error);
      return rejectWithValue(error);
    }
  }
);

export const editCollectionThunk = createAsyncThunk(
  "collection/editCollection",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch("/collection/editCollection", payload);
      return data;
    } catch (error) {
      console.log("🚀 ~ file: collectionSlice.js ~ line 119 ~ error", error);
      return rejectWithValue(error);
    }
  }
);

export const deleteCollection = createAsyncThunk(
  "collection/deleteCollection",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete("/collection/deleteCollection", { data: payload });
      return data;
    } catch (error) {
      console.log("🚀 ~ file: collectionSlice.js ~ line 135 ~ error", error);
      return rejectWithValue(error);
    }
  }
);

export const mergeCollection = createAsyncThunk(
  "collection/mergeCollection",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/collection/mergeCollection", payload);
      return data;
    } catch (error) {
      console.log("🚀 ~ file: collectionSlice.js ~ line 149 ~ error", error);
      return rejectWithValue(error);
    }
  }
);

const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    toggleAddModal: (state, action) => {
      state.addCollectionModal = action.payload.modal;
    },

    toggleDeleteModal: (state, action) => {
      state.deleteCollectionModal = action.payload.modal;
    },

    toggleCollectionSummaryModal: (state, action) => {
      state.collectionSummaryModal = action.payload.modal;
    },

    toggleMergeCollectionModal: (state, action) => {
      state.mergeCollectionModal = action.payload.modal;
    },

    addCollectionData: (state, action) => {
      const { collectionName, description } = action.payload;
      state.collectionName = collectionName;
      state.description = description;
      state.addCollectionModal = false;
    },

    addFilterObj: (state, action) => {
      const { requestProduct } = action.payload;
      state.filterObj = requestProduct;
      state.hasMoreProducts = true;
      state.scrolledPageNo = 0;
    },

    addFilterDisplay: (state, action) => {
      const { filterDisplay } = action.payload;
      state.filterDisplay = filterDisplay;
    },

    setProductCount: (state, action) => {
      const { count } = action.payload;
      state.productCount = count;
    },

    sortProducts: (state, action) => {
      const { sortBy } = action.payload;
      if (sortBy === "HighToLow") {
        state.isSorted = true;
      } else if (sortBy === "LowToHigh") {
        state.isSorted = true;
        state.unsortedProducts = state.sortedProducts.slice();
        state.unsortedProducts.sort();
      } else {
        state.isSorted = false;
      }
    },

    clearCollectionData: (state, action) => {
      const { type: actionType } = action.payload;
      switch (actionType) {
        case "CLEAR_PRODUCTS":
          return {
            ...state,
            filterObj: null,
            filterDisplay: null,
            filteredProducts: [],
            scrolledPageNo: 0,
            productCount: 0,
            hasMoreProducts: null,
          };

        case "CLEAR_ALL":
          return {
            ...state,
            filteredProducts: [],
            collectionName: null,
            description: null,
            filterObj: null,
            filterDisplay: null,
            scrolledPageNo: 0,
            productCount: 0,
            hasMoreProducts: null,
          };

        default:
          return state;
      }
    },
  },
  extraReducers: {
    //? Fetch All Collections Thunk
    [fetchAllCollections.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchAllCollections.fulfilled]: (state, action) => {
      const { data } = action.payload;
      state.loading = false;
      state.allCollectionsArr = data;
    },
    [fetchAllCollections.rejected]: (state, action) => {
      state.loading = false;
      commonErrorResponse(state, action);
    },

    //? Fetch All Products Thunk
    [fetchProducts.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchProducts.fulfilled]: (state, action) => {
      const { data } = action.payload;
      state.loading = false;
      if (state.filteredProducts.length < 3000) {
        state.filteredProducts = state.filteredProducts.concat(data);
        state.scrolledPageNo++;
        state.productCount += data.length;
      } else {
        state.hasMoreProducts = false;
        message.success(
          {
            content: "Collection Can Only Have 3000 Products",
            style: styles.message,
          },
          10000
        );
      }
    },
    [fetchProducts.rejected]: (state, action) => {
      state.loading = false;
      commonErrorResponse(state, action);
    },

    //? Fetch Collection by Id Thunk
    [fetchCollectionById.pending]: (state, action) => {
      state.loading = true;
    },

    [fetchCollectionById.fulfilled]: (state, action) => {
      const { data } = action.payload;
      state.loading = false;
      state.collectionName = data.collectionName;
      state.description = data.description;
      state.filterDisplay = data.collectionFilter;
      if (state.filteredProducts.length < 3000) {
        state.hasMoreProducts = true;
        state.filteredProducts = state.filteredProducts.concat(data.products);
        state.scrolledPageNo++;
        state.productCount += data.products.length;
      } else {
        state.hasMoreProducts = false;
        message.success(
          {
            content: "Collection Can Only Have 3000 Products",
            style: styles.message,
          },
          10000
        );
      }
    },

    [fetchCollectionById.rejected]: (state, action) => {
      state.loading = false;
      commonErrorResponse(state, action);
    },

    //? Add Collection Thunk
    [addCollection.pending]: (state, action) => {
      state.productListLoader = true;
    },
    [addCollection.fulfilled]: (state, action) => {
      const { data } = action.payload;
      state.productListLoader = false;
      message.success({
        content: data.message,
        style: styles.message,
      });
      return (window.location.href = "/collections");
    },

    [addCollection.rejected]: (state, action) => {
      state.productListLoader = false;
      commonErrorResponse(state, action);
    },

    //? Edit Collection Thunk
    [editCollectionThunk.pending]: (state, action) => {
      state.productListLoader = true;
    },
    [editCollectionThunk.fulfilled]: (state, action) => {
      const { data } = action.payload;
      state.productListLoader = false;
      message.success({
        content: data.message,
        style: styles.message,
      });
      return (window.location.href = "/collections");
    },
    [editCollectionThunk.rejected]: (state, action) => {
      state.productListLoader = false;
      commonErrorResponse(state, action);
    },

    //? Delete Collection Thunk
    [deleteCollection.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteCollection.fulfilled]: (state, action) => {
      const { data } = action.payload;
      state.loading = false;

      const index = state.allCollectionsArr.findIndex(
        (val) => val.collectionId === data.collectionId
      );

      state.allCollectionsArr.splice(index, 1, data);
      state.deleteCollectionModal = false;
    },
    [deleteCollection.rejected]: (state, action) => {
      state.loading = false;
      commonErrorResponse(state, action);
    },

    //? Merge Collection Thunk
    [mergeCollection.pending]: (state, action) => {
      state.loading = true;
    },
    [mergeCollection.fulfilled]: (state, action) => {
      const { data } = action.payload;
      state.loading = false;
      state.allCollectionsArr.pop();
      state.allCollectionsArr.unshift(data);
      state.mergeCollectionModal = false;
    },
    [mergeCollection.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const {
  toggleAddModal,
  toggleDeleteModal,
  toggleCollectionSummaryModal,
  addCollectionData,
  addFilterObj,
  addFilterDisplay,
  clearCollectionData,
  setProductCount,
  toggleMergeCollectionModal,
} = collectionSlice.actions;

export default collectionSlice.reducer;
