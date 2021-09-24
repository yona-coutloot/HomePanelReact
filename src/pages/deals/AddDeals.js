import React, { useState, useEffect } from "react";
import axios from "../../axios/axios";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link, useHistory, useParams, useRouteMatch } from "react-router-dom";
import {
  Layout,
  Row,
  Col,
  Breadcrumb,
  Button,
  Typography,
  Switch,
  Form,
  Select,
  Input,
  DatePicker,
  TreeSelect,
  Checkbox,
  Modal,
  Affix,
} from "antd";
import { HomeFilled } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import {
  addDealsThunk,
  editDealsThunk,
  toggleAddModal,
} from "../../redux/slices/allDealsSlice";
import moment from "moment";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
// const { TreeNode } = TreeSelect;
const { SHOW_PARENT } = TreeSelect;

const dealStyles = {
  header: {
    padding: 0,
    background: "transparent",
    marginBottom: "0.5rem",
  },

  title: {
    margin: "0.5rem 1.1rem",
    fontWeight: "600",
  },

  breadcrumb: {
    marginLeft: "0.4rem",
    fontWeight: "400",
  },

  modalLabel: {
    display: "block",
    color: "#696969",
  },

  modalBodyLabel: {
    display: "block",
    color: "#262626",
  },

  btn: {
    width: "250px",
    height: "40px",
    margin: "0 auto",
    padding: "0",
    display: " inline-block",
    lineHeight: "30px",
    textAlign: "center",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
};

const CategoryComponent = ({ setsubCategorySpecific, disableCategory }) => {
  const [category, setCategory] = useState([]);
  const [treeData, setTreeData] = useState([]);

  //? Fetch Categories for Category Component
  const categoryApi = async () => {
    try {
      const { data } = await axios.get("/miscellaneous/appCategories", {});

      let categories = [];

      data.data.forEach((item) => {
        const treeObj = {
          title: "",
          key: "",
          value: "",
          children: [],
        };
        treeObj.title = (
          <Text style={{ color: "crimson" }}>{item.parentCategory.categoryName}</Text>
        );
        treeObj.key = `${item.parentCategory.categoryName}:${item.parentCategory.identification}`;
        treeObj.value = `${item.parentCategory.categoryName}:${item.parentCategory.identification}`;

        [...item.childCategoryOne].forEach((child) => {
          const childTreeObj = {
            title: "",
            key: "",
            value: "",
            children: [],
          };

          const levelOneCategory = child.categoryName;
          childTreeObj.title = (
            <Text style={{ color: "blue" }}>{levelOneCategory.split("/")[1]}</Text>
          );
          childTreeObj.key = `${levelOneCategory}:${child.identification}`;
          childTreeObj.value = `${levelOneCategory}:${child.identification}`;

          [...item.childCategoryTwo].forEach((child2) => {
            const child2TreeObj = {
              title: "",
              key: "",
              value: "",
            };

            const levelTwoCategory = child2.categoryName;

            if (levelTwoCategory.includes(levelOneCategory)) {
              child2TreeObj.title = levelTwoCategory.split("/")[2];
              child2TreeObj.key = `${levelTwoCategory}:${child2.identification}`;
              child2TreeObj.value = `${levelTwoCategory}:${child2.identification}`;

              childTreeObj.children.push(child2TreeObj);
            }
          });

          treeObj.children.push(childTreeObj);
        });
        categories.push(treeObj);
      });
      setTreeData(categories);
    } catch (error) {
      console.log("=== Line 89 ===", error);
    }
  };

  useEffect(() => {
    categoryApi();
  }, []);

  const handleCategory = (value) => {
    setCategory(value);
    // const categoriesToSend = value.map((val) => Number(val.split(":")[1]));
    const categoriesToSend = value.map((val) => val);
    setsubCategorySpecific(categoriesToSend);
  };

  const categoryProps = {
    allowClear: true,
    showSearch: true,
    listHeight: 400,
    treeData,
    value: category,
    onChange: handleCategory,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Please select Category(s)",
    disabled: disableCategory,
    style: {
      width: "100%",
    },
  };

  return (
    <div>
      <Form.Item label={<Text strong>Select Categories :</Text>}>
        <TreeSelect {...categoryProps} />
      </Form.Item>
      {/* <label className="dealsLabel">Select Categories</label> */}
    </div>
  );
};

const AddDeals = () => {
  const match = useRouteMatch("/deals/editdeal/:couponId");

  const { couponId } = useParams();
  const history = useHistory();
  const { allDealsArr, loading, addDealModalVisible } = useSelector((state) => state.allDeals);

  let editChangesBtn = false;
  let isOnlineField = false;
  let DealseenField = false;
  let couponCodeField = "";
  let amountOffField = "";
  let percentOffField = "";
  let dealTypeField = "";
  let minimumCapField = "";
  let shortDescpField = "";
  let longDescpField = "";

  let startDateField = "";
  let endDateField = "";
  let subCategorySpecificField = "";
  let showCategoryField = false;
  let sDate = "";
  let eDate = "";
  let showfreeShipActiveField = true;

  //? Show Edit Deal if route matches
  if (match && match.isExact) {
    let deal = allDealsArr.filter((deal) => deal.couponId === Number(couponId));
    deal = deal[0];
    editChangesBtn = true;
    isOnlineField = deal?.isOnline === 1 ? true : false;
    couponCodeField = deal?.code;
    amountOffField = deal?.amountOff;
    percentOffField = deal?.percentOff;
    dealTypeField = deal?.dealType;
    minimumCapField = deal?.minimumCap;
    shortDescpField = deal?.shortDescp;
    longDescpField = deal?.dealComments;
    DealseenField = deal?.seen === 1 ? true : false;
    subCategorySpecificField = deal?.subCategorySpecific[0];
    startDateField = deal?.liveDate;
    const defaultstartDate = new Date(startDateField * 1000);

    sDate = `${defaultstartDate.getDate()}/${
      defaultstartDate.getMonth() + 1
    }/${defaultstartDate.getFullYear()} ${defaultstartDate.getHours()}:${defaultstartDate.getMinutes()}`;

    endDateField = deal?.expiryDate;
    const defaultEndDate = new Date(endDateField * 1000);
    eDate = `${defaultEndDate.getDate()}/${
      defaultEndDate.getMonth() + 1
    }/${defaultEndDate.getFullYear()} ${defaultEndDate.getHours()}:${defaultEndDate.getMinutes()}`;

    showCategoryField = dealTypeField === 2 ? true : false;
    showfreeShipActiveField = dealTypeField === 3 ? false : true;
  }

  const [showEditbtn, setshowEditbtn] = useState(editChangesBtn);
  const [isOnline, setisOnline] = useState(isOnlineField);
  const [coupanCode, setcoupanCode] = useState(couponCodeField);
  const [amountOff, setamountOff] = useState(amountOffField);
  const [percentOff, setpercentOff] = useState(percentOffField);
  const [dealType, setdealType] = useState(dealTypeField);
  const [minimumCap, setminimumCap] = useState(minimumCapField);
  const [subCategorySpecific, setsubCategorySpecific] = useState([subCategorySpecificField]);

  const [categorySelect, setCategorySelect] = useState(showCategoryField);
  const [freeshipingActive, setFreeshipActive] = useState(showfreeShipActiveField);

  const [shortDescp, setShortDescp] = useState(shortDescpField);
  const [longDescp, setlongDescp] = useState(longDescpField);
  const [Dealseen, setDealseen] = useState(DealseenField);
  const [startDate, setstartDate] = useState(sDate);
  const [endDate, setendDate] = useState(eDate);

  const [percentDisabled, setpercentDisabled] = useState(false);
  const [amountDisabled, setamountDisabled] = useState(false);

  const [formRef] = Form.useForm();

  const dispatch = useDispatch();

  const dateFormat = "DD/MM/YYYY HH:mm";

  //? To Check dealtype from the given array
  const dealTypeArr = ["NA", "Order Specifc", "Category Specifc", "Free Shiping"];

  //? Retrieve Data from collection reducer...
  // const { loading, addDealModal } = useSelector((state) => state.allDeals);

  useEffect(() => {
    if (allDealsArr.length === 0) {
      return history.push("/deals");
    }
  }, [history, allDealsArr.length]);

  const handleOnlinePayment = (checked) => {
    setisOnline(checked);
  };

  const disabledAmount = (e) => {
    setamountOff(e.target.value);
    if (e.target.value.length > 0) {
      setpercentDisabled(true);
    } else {
      setpercentDisabled(false);
    }
  };

  const disabledPercentOff = (e) => {
    setpercentOff(e.target.value);
    if (e.target.value.length > 0) {
      setamountDisabled(true);
    } else {
      setamountDisabled(false);
    }
  };

  //* Method To Open Add Deal Modal
  const showAddModal = () => {
    dispatch(toggleAddModal({ modal: true }));
    formRef.resetFields();
  };

  //* Method To Close the Add Collection Modal
  const handleAddCancel = () => dispatch(toggleAddModal({ modal: false }));

  const handleDealType = (value) => {
    setdealType(value);
    if (value === 1) {
      setCategorySelect(false);
      setFreeshipActive(true);
    } else if (value === 2) {
      setCategorySelect(true);
      setFreeshipActive(true);
      // categoryApi();
    } else if (value === 3) {
      setCategorySelect(false);
      setFreeshipActive(false);
    }
  };

  const handleCouponCode = (e) => {
    setcoupanCode(e.target.value);
  };

  const handleMinimumCap = (e) => {
    setminimumCap(e.target.value);
  };

  const onStartDateChange = (dateString) => {
    setstartDate(dateString);
  };

  const onEndDateChange = (dateString) => {
    setendDate(dateString);
  };

  //? convert startdate and EndDate
  const startDateToSend = Math.floor(moment(startDate, dateFormat).valueOf() / 1000);
  const endDateToSend = Math.floor(moment(endDate, dateFormat).valueOf() / 1000);
  let startDateToDisplay = "";
  let endDateToDisplay = "";

  if (typeof startDate === "object") {
    startDateToDisplay =
      new Date(moment(startDate).valueOf()).toLocaleDateString() +
      " " +
      new Date(moment(startDate).valueOf()).toLocaleTimeString().slice(0, 5);
  } else {
    startDateToDisplay = startDate;
  }

  if (typeof endDate === "object") {
    endDateToDisplay =
      new Date(moment(endDate).valueOf()).toLocaleDateString() +
      " " +
      new Date(moment(endDate).valueOf()).toLocaleTimeString().slice(0, 5);
  } else {
    endDateToDisplay = endDate;
  }

  const handleAddDeal = () => {
    const dataToSend = {
      code: coupanCode,
      status: Number(isOnline),
      seen: Number(Dealseen),
      liveDate: startDateToSend,
      expiryDate: endDateToSend,
      dealType: dealType,
      orderSpecific: 0,
      minimumCap: Number(minimumCap),
      dealComments: longDescp,
      isOnline: Number(isOnline),
      shortDescp: shortDescp,
      longDescp: longDescp,
    };

    if (dealType === 1) {
      dataToSend["amountOff"] = Number(amountOff);
      dataToSend["percentOff"] = Number(percentOff);
    } else if (dealType === 2) {
      dataToSend["amountOff"] = Number(amountOff);
      dataToSend["percentOff"] = Number(percentOff);
      dataToSend["subCategorySpecific"] = [
        ...subCategorySpecific.map((val) => Number(val.split(":")[1])),
      ];
    }

    console.log("🚀 ~ file: AddDeals.js ~ line 148 ~ handleSubmit ~ dataToSend", dataToSend);

    dispatch(addDealsThunk(dataToSend));
  };

  const handleEditDeal = () => {
    const dataToSend = {
      couponId: Number(couponId),
      code: coupanCode,
      status: Number(isOnline),
      seen: Number(Dealseen),
      liveDate: startDateToSend,
      expiryDate: endDateToSend,
      dealType: dealType,
      minimumCap: Number(minimumCap),
      dealComments: longDescp,
      isOnline: Number(isOnline),
      shortDescp: shortDescp,
      longDescp: longDescp,
    };

    if (dealType === 1 || dealType === 2) {
      dataToSend["amountOff"] = Number(amountOff);
      dataToSend["percentOff"] = Number(percentOff);
    }

    console.log("🚀 ~ file: AddDeals.js ~ line 196 ~ handleEditDeal ~ body", dataToSend);
    dispatch(editDealsThunk(dataToSend));
  };

  return (
    <>
      <Sidebar />
      <Layout className="site-layout">
        <Header style={dealStyles.header}>
          <Row>
            <Col>
              <Title level={2} style={dealStyles.title}>
                Deals
                <Breadcrumb style={dealStyles.breadcrumb}>
                  <Breadcrumb.Item>
                    <a href="">
                      <HomeFilled /> Home
                    </a>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Link to="/deals"> Deals</Link>
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Title>
            </Col>
          </Row>
        </Header>

        <Content style={{ margin: "1rem 1rem", backgroundColor: "#FFFFFF" }}>
          <div style={{ margin: "1.5rem 1.5rem 1.5rem 1.5rem" }}>
            <Form
              layout="vertical"
              form={formRef}
              requiredMark={false}
              onFinish={showAddModal}
            >
              <Row gutter={16} style={{ marginTop: "10px" }}>
                <Col span={10}>
                  <Form.Item
                    label={<Text strong>Deal Type :</Text>}
                    initialValue={dealType}
                    name="dealType"
                    rules={[
                      {
                        required: true,
                        message: "Deal Type is Required",
                      },
                    ]}
                  >
                    <Select
                      defaultValue={dealType}
                      onChange={handleDealType}
                      disabled={match && match.isExact}
                    >
                      <Option value={1}>Order Specifc</Option>
                      <Option value={2}>Category Specifc</Option>
                      <Option value={3}>Free Shiping</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={10} offset={1}>
                  {categorySelect && (
                    <CategoryComponent
                      setsubCategorySpecific={setsubCategorySpecific}
                      disableCategory={match}
                    />
                  )}
                </Col>
              </Row>

              <Row gutter={16} style={{ marginTop: "10px" }}>
                <Col span={10}>
                  <Form.Item
                    label={<Text strong>Coupon Code :</Text>}
                    initialValue={coupanCode}
                    name="couponCode"
                    rules={[
                      {
                        required: true,
                        message: "Coupon Code is Required",
                      },
                      {
                        min: 5,
                        message: "Coupon Code must be minimum 5 Characters",
                      },
                    ]}
                  >
                    <Input placeholder="Enter Coupon Code" onChange={handleCouponCode} />
                  </Form.Item>
                </Col>
                <Col span={10} offset={1}>
                  <Form.Item
                    label={<Text strong>Minimum Order Value (₹) :</Text>}
                    initialValue={minimumCap}
                    name="minimumOrderValue"
                    rules={[
                      {
                        required: true,
                        message: "Minimum Order Value is Required",
                      },
                      {
                        pattern: /^(?:\d*)$/,
                        message: "Price should contain just numbers",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Minimum Order Value"
                      onChange={handleMinimumCap}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: "10px" }}>
                <Col span={21}>
                  <Form.Item
                    label={<Text strong>Deal Body :</Text>}
                    initialValue={longDescp}
                    name="dealBody"
                    rules={[
                      {
                        required: true,
                        message: "Deal Body is Required",
                      },
                      {
                        min: 10,
                        message: "Deal Body must be minimum 10 Characters",
                      },
                      {
                        max: 150,
                        message: "Deal Body must be maximum 150 Characters",
                      },
                    ]}
                  >
                    <TextArea
                      placeholder="Enter Deal Body"
                      onChange={(e) => setlongDescp(e.target.value)}
                    ></TextArea>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16} style={{ marginTop: "10px" }}>
                <Col span={21}>
                  <Form.Item
                    label={<Text strong>Short Description :</Text>}
                    initialValue={shortDescp}
                    name="shortDescription"
                    rules={[
                      {
                        required: true,
                        message: "Short Description is Required",
                      },
                      {
                        min: 10,
                        message: "Short Description must be minimum 10 Characters",
                      },
                      {
                        max: 100,
                        message: "Short Description must be maximum 100 Characters",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Short Description"
                      onChange={(e) => setShortDescp(e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: "10px" }}>
                <Col span={10}>
                  <Form.Item
                    label={<Text strong>Start Date :</Text>}
                    initialValue={startDate && moment(startDate, dateFormat)}
                    name="startDate"
                    rules={[
                      {
                        required: true,
                        message: "Start Date is Required",
                      },
                    ]}
                  >
                    <DatePicker
                      showTime={{ format: "HH:mm" }}
                      style={{ width: "250px" }}
                      format={dateFormat}
                      disabledDate={(current) => {
                        return moment().add(-1, "days") >= current;
                      }}
                      onChange={onStartDateChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={10} offset={1}>
                  <Form.Item
                    label={<Text strong>End Date :</Text>}
                    initialValue={endDate && moment(endDate, dateFormat)}
                    name="EndDate"
                    rules={[
                      {
                        required: true,
                        message: "End Date is Required",
                      },
                    ]}
                  >
                    <DatePicker
                      showTime={{ format: "HH:mm" }}
                      style={{ width: "250px" }}
                      format={dateFormat}
                      disabledDate={(current) => {
                        return moment().add(-1, "days") >= current;
                      }}
                      onChange={onEndDateChange}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {freeshipingActive && (
                <Row gutter={16} style={{ marginTop: "10px" }}>
                  <Col span={10}>
                    <Form.Item
                      label={<Text strong>% Percent Off :</Text>}
                      initialValue={percentOff}
                      name="percentOff"
                      rules={[
                        {
                          pattern: /^(?:\d*)$/,
                          message: "Percent Off should contain just numbers",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter Percent Off"
                        onChange={disabledPercentOff}
                        disabled={percentDisabled}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={10} offset={1}>
                    <Form.Item
                      label={<Text strong>₹ Amount Off :</Text>}
                      initialValue={amountOff}
                      name="amountOff"
                      rules={[
                        {
                          pattern: /^(?:\d*)$/,
                          message: "Amount Off should contain just numbers",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter Amount Off"
                        onChange={disabledAmount}
                        disabled={amountDisabled}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              <Row gutter={16} style={{ marginTop: "10px" }}>
                <Col span={10}>
                  <Form.Item
                    label={<Text strong>Show/Hide Deal :</Text>}
                    name="show/hide-deal"
                  >
                    <div>
                      <Checkbox
                        defaultChecked={Dealseen}
                        onChange={(e) => setDealseen(e.target.checked)}
                        style={{ transform: "scale(1.2)", marginLeft: "10px" }}
                      >
                        Show Deal
                      </Checkbox>
                    </div>
                  </Form.Item>
                </Col>
                <Col span={10} offset={1}>
                  <Form.Item
                    label={<Text strong>Online Payments :</Text>}
                    name="show/hide-deal"
                  >
                    <Switch
                      defaultChecked={isOnline}
                      unCheckedChildren="No"
                      checkedChildren="Yes"
                      onChange={handleOnlinePayment}
                    />
                    <Text style={{ marginLeft: "10px" }}>
                      Offer only for online payments ?
                    </Text>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                wrapperCol={{
                  offset: 18,
                  span: 16,
                }}
              >
                <Affix offsetBottom={20}>
                  <Button type="primary" htmlType="submit" style={dealStyles.btn}>
                    {showEditbtn ? "Edit Deal" : "Add Deal"}
                  </Button>
                </Affix>
              </Form.Item>
            </Form>
          </div>
        </Content>

        {/* Add/Edit Collection Modal */}
        <Modal
          title={
            showEditbtn ? (
              <Title level={4} style={{ marginBottom: "-5px", fontWeight: "500" }}>
                Edit Deal
              </Title>
            ) : (
              <Title level={4} style={{ marginBottom: "-5px", fontWeight: "500" }}>
                Add Deal
              </Title>
            )
          }
          visible={addDealModalVisible}
          okText="ADD"
          centered
          confirmLoading={loading}
          onCancel={handleAddCancel}
          maskClosable={false}
          footer={false}
          width="1000px"
        >
          <div
            style={{
              border: "solid 1px #8bc8ff",
              backgroundColor: "#f0f8ff",
              padding: "18px 33px 20px 33px",
              borderRadius: "8px",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div>
                <Row gutter={20}>
                  <Col span={6}>
                    <Text strong style={dealStyles.modalLabel}>
                      Coupan Code :
                    </Text>
                    <Text>{coupanCode}</Text>
                  </Col>
                  <Col span={5}>
                    <Text strong style={dealStyles.modalLabel}>
                      Minimum Order Value (₹) :
                    </Text>
                    <Text>{minimumCap}</Text>
                  </Col>
                  <Col span={4} offset={3}>
                    <Text strong style={dealStyles.modalLabel}>
                      %Percent Off :
                    </Text>
                    <Text>{percentOff || "NA"}</Text>
                  </Col>
                  <Col span={4} offset={2}>
                    <Text strong style={dealStyles.modalLabel}>
                      ₹ Amount Off :
                    </Text>
                    <Text>{amountOff || "NA"}</Text>
                  </Col>
                </Row>
              </div>

              <div style={{ marginTop: "1.5rem" }}>
                <Row gutter={20}>
                  <Col span={6}>
                    <Text strong style={dealStyles.modalLabel}>
                      Start Date :
                    </Text>
                    <Text>{startDateToDisplay}</Text>
                  </Col>
                  <Col span={6}>
                    <Text strong style={dealStyles.modalLabel}>
                      End Date :
                    </Text>
                    <Text>{endDateToDisplay}</Text>
                  </Col>
                </Row>
              </div>
            </div>
          </div>

          <Row>
            <Col span={7}>
              <div
                style={{
                  margin: "18px 0px",
                  padding: "13px",
                  border: "1px solid #d8d8d8",
                  borderRadius: "5px",
                }}
              >
                <Text>Offer only for online payments</Text>
                {isOnline ? (
                  <Text
                    style={{
                      backgroundColor: "#2ab418",
                      float: "right",
                      padding: "5px 10px",
                      marginTop: "-5px",
                      borderRadius: "5px",
                      color: "#ffffff",
                    }}
                    strong
                  >
                    Yes
                  </Text>
                ) : (
                  <Text
                    style={{
                      backgroundColor: "#FF2626",
                      float: "right",
                      padding: "5px 10px",
                      marginTop: "-5px",
                      borderRadius: "5px",
                      color: "#ffffff",
                    }}
                    strong
                  >
                    No
                  </Text>
                )}
              </div>
            </Col>
          </Row>

          <Row gutter={20}>
            <Col span={6}>
              <Text strong style={dealStyles.modalBodyLabel}>
                Deal Type :
              </Text>
              <Text>{dealTypeArr[dealType || 0]}</Text>
            </Col>

            {dealType === 2 && subCategorySpecific.every((val) => typeof val === "string") && (
              <Col span={16}>
                <Text strong style={dealStyles.modalBodyLabel}>
                  Category :
                </Text>
                <Text>{subCategorySpecific.map((val) => val.split(":")[0]).join(", ")}</Text>
              </Col>
            )}
          </Row>
          <Row style={{ marginTop: "1rem" }}>
            <Col span={23}>
              <Text strong style={dealStyles.modalBodyLabel}>
                Deal Body :
              </Text>
              <Text>{longDescp}</Text>
            </Col>
          </Row>

          <Row style={{ marginTop: "1rem" }}>
            <Col span={24}>
              <Text strong style={dealStyles.modalBodyLabel}>
                Short Description :
              </Text>
              <Text>{shortDescp}</Text>
            </Col>
          </Row>
          <Row>
            <Col offset={18}>
              <Button
                key="back"
                onClick={handleAddCancel}
                size="large"
                style={{ marginTop: "1.5rem", marginRight: "1.5rem" }}
              >
                Cancel
              </Button>
              {showEditbtn ? (
                <Button
                  key="submit"
                  loading={loading}
                  type="primary"
                  size="large"
                  onClick={handleEditDeal}
                >
                  Edit Deal
                </Button>
              ) : (
                <Button
                  key="submit"
                  loading={loading}
                  type="primary"
                  size="large"
                  onClick={handleAddDeal}
                >
                  Add Deal
                </Button>
              )}
            </Col>
          </Row>
        </Modal>
      </Layout>
    </>
  );
};

export default AddDeals;
