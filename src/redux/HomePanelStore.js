import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slices/loginSlice";
import allDealsReducer from "./slices/allDealsSlice";
import allTemplateReducer from "./slices/allTemplateSlice";
import editTemplateReducer from "./slices/editTemplateSlice";
import collectionReducer from "./slices/collectionSlice";

export default configureStore({
  reducer: {
    login: loginReducer,
    allTemplates: allTemplateReducer,
    allDeals: allDealsReducer,
    editTemplate: editTemplateReducer,
    allCollections: collectionReducer,
  },
});
