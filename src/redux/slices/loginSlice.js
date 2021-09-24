import { message } from "antd";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const styles = {
  message: {
    marginTop: "10vh",
    fontSize: "1.2rem",
    fontWeight: "500",
  },
};

export const sentOtp = createAsyncThunk("login/sendOtp", async ({ email, mobile }) => {
  const config = {
    method: "post",
    url: "https://internal-auth.coutloot.com/auth/sendOTP",
    data: {
      email,
      mobile,
    },
  };
  try {
    message.loading({
      content: "Please Wait...",
      key: "sentOtp",
      style: styles.message,
    });
    const { data } = await axios(config);
    return data;
  } catch (error) {
    console.log("🚀 ~ file: loginSlice.js ~ line 19 ~ error", error);
  }
});

export const validateOtp = createAsyncThunk(
  "login/validateOtp",
  async ({ mobile, otp }, { getState }) => {
    const state = getState();

    const config = {
      method: "post",
      url: "https://internal-auth.coutloot.com/auth/login",
      data: {
        otpToken: state.login.otpToken,
        mobile,
        otp,
      },
    };

    try {
      message.loading({
        content: "Please Wait...",
        key: "validateOtp",
        style: styles.message,
      });

      const { data } = await axios(config);
      return data;
    } catch (error) {
      console.log("🚀 ~ file: loginSlice.js ~ line 53 ~ error", error);
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState: {
    otpToken: null,
    showOtpInput: false,
  },
  extraReducers: {
    [sentOtp.fulfilled]: (state, action) => {
      const { success, message: apiMessage, otpToken } = action.payload;

      if (success === 1) {
        state.showOtpInput = true;
        state.otpToken = otpToken;
        message.success({
          content: apiMessage,
          key: "sentOtp",
          style: styles.message,
        });
      } else {
        state.showOtpInput = false;
        message.error({
          content: apiMessage,
          className: "custom-class",
          style: styles.message,
          key: "sentOtp",
        });
      }
    },

    // Validate Otp Reducer
    [validateOtp.fulfilled]: (state, action) => {
      const { success, token, message: apiMessage } = action.payload;

      if (success === 1) {
        localStorage.setItem("token", token);
        state.otpToken = null;
        message.success({
          content: "Welcome To Home-Panel",
          key: "validateOtp",
          style: styles.message,
        });
        return (window.location.href = "/collections");
      } else {
        state.showOtpInput = false;
        state.otpToken = null;
        message.error({
          content: apiMessage,
          className: "custom-class",
          style: styles.message,
          key: "sentOtp",
        });
      }
    },
  },
});

export default loginSlice.reducer;
