import React, { useState } from "react";
import { Row, Typography, Divider, Input, Upload, Button, Spin, Image } from "antd";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;

const popupStyles = {
  initialPopupLayout: {
    background: "#ffffff",
    margin: "1.3rem 1rem",
    height: "90%",
  },
  uploadBtn: { marginLeft: "4rem", width: "100%", marginTop: "1.7rem" },
};

const InitialPopup = () => {
  const [popupImg, setPopupImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const spinner = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const uploadImg = ({ file, onSuccess }) => {
    setLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const imgRes = await fetch(
        "https://dev-gtw1.coutloot.com/x38/v-0-2/apis/images/uploadImage",
        {
          method: "post",
          headers: {
            "Appapi-Id": "h4er9jdt33i6_bg80ty",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageData: reader.result.split(",")[1],
            typeName: "Image_Compress",
          }),
        }
      );

      const imgUrl = await imgRes.json();
      setLoading(false);
      setPopupImg(imgUrl.data);
    };
    onSuccess("ok");
  };

  return (
    <div style={popupStyles.initialPopupLayout}>
      <Row>
        <Title level={4} style={{ margin: "0.5rem 5rem" }}>
          INITIAL POPUP
        </Title>
      </Row>
      <Divider />
      <Row>
        <Title level={5} style={{ margin: "0.3rem 1.5rem" }}>
          Popup Name:
        </Title>
        <Input
          placeholder="Enter Popup Name"
          style={{ width: "75%", marginLeft: "1.4rem" }}
        />
      </Row>
      <Divider />
      <Title level={5} style={{ margin: "0.2rem 1.5rem" }}>
        Popup Image:
      </Title>
      <Upload customRequest={uploadImg} onRemove={() => setPopupImg(null)}>
        <Button icon={<UploadOutlined />} style={popupStyles.uploadBtn}>
          Click To Upload
        </Button>
      </Upload>
      <Spin indicator={spinner} spinning={loading} style={{ margin: "4rem" }} />
      {popupImg && (
        <Image width={200} height={180} src={popupImg} style={{ margin: "1rem" }} />
      )}
    </div>
  );
};

export default InitialPopup;
