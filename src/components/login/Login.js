import { useEffect, useState } from "react";
import { Input, Button, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import CoutlootLogo from "../../assets/img/coutloot-logo.svg";
import { sentOtp, validateOtp } from "../../redux/slices/loginSlice";
import { useHistory } from "react-router";

const styles = {
  inputStyle: {
    margin: "10px 0",
    padding: "10px",
  },
  parentDiv: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#001629",
    backgroundImage: "url(../../assets/img/Login-bg.svg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
};
const Login = () => {
  const [userEmail, setEmail] = useState(null);
  const [userMobile, setMobile] = useState(null);
  const [otp, setOtp] = useState(null);

  //? AUTH GUARD ADDED FOR PROTECTED ROUTE
  const history = useHistory();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      history.push("/collections");
    }
  }, [history]);

  const hasReceivedOTP = useSelector((state) => state.login.showOtpInput);
  const dispatch = useDispatch();

  const loginOTP = async () => {
    dispatch(sentOtp({ email: userEmail, mobile: userMobile }));

    // try {
    //   const otpDataResponse = await getLoginOTP(userEmail, userMobile);
    //   if (otpDataResponse.success == 0) {
    //     message.error(otpDataResponse.errMessage);
    //   } else {
    //     message.success("Sent Otp");
    //     localStorage.setItem("otpToken", otpDataResponse.otpToken);
    //     setHasReceivedOTP(true);
    //   }
    // } catch (error) {
    //   console.log("Error getting OTP from /api/auth/Login.js");
    // }
  };
  const loginwithOTP = async () => {
    dispatch(validateOtp({ mobile: userMobile, otp: otp }));
  };

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };
  const handleMobileInput = (e) => {
    setMobile(e.target.value);
  };
  const handleOTPInput = (e) => {
    setOtp(e.target.value);
  };

  return (
    <div style={styles.parentDiv}>
      <Card
        style={{
          width: 450,
          height: 450,
          padding: 20,
          textAlign: "center",
          borderRadius: "10px",
        }}
      >
        <img style={{ margin: "0 0 20px 0" }} src={CoutlootLogo} alt="coutlootLogo" />
        <Input
          onChange={handleEmailInput}
          style={styles.inputStyle}
          placeholder="Email ID"
          type="email"
        />
        <Input
          onChange={handleMobileInput}
          style={styles.inputStyle}
          placeholder="Mobile Number"
        />
        {hasReceivedOTP ? (
          <>
            <Input
              onChange={handleOTPInput}
              style={{ ...styles.inputStyle }}
              placeholder="Enter OTP"
            />
            <Button
              onClick={() => loginwithOTP()}
              block
              type="primary"
              style={{ padding: 10, height: 50, marginTop: "20px" }}
            >
              Sign In
            </Button>
          </>
        ) : (
          <Button
            onClick={() => loginOTP()}
            block
            type="primary"
            style={{ padding: 10, height: 50, marginTop: "20px" }}
          >
            Get OTP
          </Button>
        )}
      </Card>
    </div>
  );
};
export default Login;
