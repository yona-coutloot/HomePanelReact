import React, { useState, useEffect } from "react";
import templateImg from "../../assets/img/imgplace.png";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import {
  getAllDealsThunk,
  toggleDeleteModal,
  deleteDeal,
} from "../../redux/slices/allDealsSlice";
import { useDispatch, useSelector } from "react-redux";

import {
  Layout,
  Row,
  Col,
  Breadcrumb,
  Button,
  Affix,
  Typography,
  Tag,
  Tooltip,
  BackTop,
  Table,
  Modal,
  Pagination,
} from "antd";
import { HomeFilled, EditOutlined, DeleteFilled, PlusOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title } = Typography;

const allTemplateStyles = {
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

  previewIcon: {
    color: "#ff8e43",
    fontSize: "18px",
  },
  editIcon: {
    color: "#756afc",
    fontSize: "18px",
  },
  cloneIcon: {
    color: "#4a87f5",
    fontSize: "18px",
  },
  deleteIcon: {
    color: "#ff743c",
    fontSize: "18px",
  },
};

const Deals = () => {
  const [pageNo, setPageNo] = useState(1);

  const [coupanName, setCoupanName] = useState();
  const [couponId, setCoupanID] = useState();
  const allDealsDispatch = useDispatch();
  //url change add to edit
  const history = useHistory();
  const { url } = useRouteMatch();

  useEffect(() => {
    allDealsDispatch(getAllDealsThunk(pageNo));
  }, [allDealsDispatch, pageNo]);

  const handleEdit = (couponId) => {
    history.push(`${url}/editdeal/${couponId}`);
  };

  const TemplateImageDiv = () => {
    return (
      <div>
        <img src={templateImg} alt="template_avatar" className="template-image" />
      </div>
    );
  };

  const TemplateInfoDiv = ({
    couponId,
    code,
    status,
    dealComments,
    isOnline,
    dealType,
    amountOff,
    percentOff,
    createdAt,
    expiryAt,
  }) => {
    const [tagType, tagText] = status === 1 ? ["success", "ACTIVE"] : ["error", "INACTIVE"];

    const onlinePay = isOnline === 1 ? "Enabled" : "Disabled";

    const comment =
      dealComments && dealComments.length > 30
        ? dealComments.substring(0, 30) + "..."
        : dealComments || "NA";

    //? To Check dealtype from the given array
    const dealTypeArr = ["NA", "Order Specifc", "Category Specifc", "Free Shiping"];

    const formatedCreatedAt = new Date(createdAt * 1000).toString().slice(0, 21);
    const formatedExpiredAt = new Date(expiryAt * 1000).toString().slice(0, 21);

    return (
      <div>
        <Row gutter={16} style={{ marginBottom: "0.3rem" }}>
          <Col className="gutter-row" span={15}>
            <Title level={5}>
              {code}
              <span>
                <Tag color={tagType} style={{ marginLeft: "1rem" }}>
                  {tagText}
                </Tag>
              </span>
            </Title>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={10}>
            <Row> Coupon ID : {couponId}</Row>
          </Col>
          <Col className="gutter-row" span={7}>
            <Row>Online Payment : {onlinePay} </Row>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={10}>
            <Tooltip placement="top" title={dealComments}>
              Amount Off : ₹{amountOff || "NA"}
            </Tooltip>
          </Col>
          <Col className="gutter-row" span={7}>
            Percent Off : {percentOff || "NA"}%
          </Col>
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={10}>
            <Tooltip placement="top" title={dealComments}>
              Created At : {formatedCreatedAt}
            </Tooltip>
          </Col>
          <Col className="gutter-row" span={7}>
            Expiry At : {formatedExpiredAt}
          </Col>
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={10}>
            <Tooltip placement="top" title={dealComments}>
              Comment : {comment}
            </Tooltip>
          </Col>
          <Col className="gutter-row" span={7}>
            Deal Type : {dealTypeArr[dealType || 0]}
          </Col>
        </Row>
      </div>
    );
  };

  const columns = [
    {
      key: "imgs",
      width: 30,
      render: () => <TemplateImageDiv />,
    },
    {
      dataIndex: [
        "couponId",
        "code",
        "status",
        "dealComments",
        "isOnline",
        "dealType",
        "amountOff",
        "percentOff",
      ],
      render: (key, obj) => (
        <TemplateInfoDiv
          couponId={obj.couponId}
          code={obj.code}
          status={obj.status}
          dealComments={obj.dealComments}
          isOnline={obj.isOnline}
          dealType={obj.dealType}
          amountOff={obj.amountOff}
          percentOff={obj.percentOff}
          createdAt={obj.liveDate}
          expiryAt={obj.expiryDate}
        />
      ),
    },

    {
      dataIndex: ["couponId"],
      key: "edit",
      width: 30,
      render: (key, obj) => (
        <EditOutlined
          className="edit-icon"
          style={allTemplateStyles.editIcon}
          onClick={() => handleEdit(obj.couponId)}
        />
      ),
    },
    {
      dataIndex: ["coupanId", "code"],
      key: "delete",
      width: 30,
      render: (key, obj) => (
        <DeleteFilled
          className="delete-icon"
          style={allTemplateStyles.deleteIcon}
          onClick={() => showDeleteModal(obj.couponId, obj.code)}
        />
      ),
    },
  ];

  const handleDeleteCancel = () => {
    allDealsDispatch(toggleDeleteModal({ modal: false }));
  };

  const handleDeleteTemplate = () => {
    allDealsDispatch(
      deleteDeal({
        couponId: couponId,
      })
    );
  };

  const showDeleteModal = (id, name) => {
    allDealsDispatch(toggleDeleteModal({ modal: true }));
    setCoupanID(id);
    setCoupanName(name);
  };

  // ============= PAGINATION ==================== //

  const pageChange = (page) => setPageNo(page);

  //? Retrieve the Data from HomePanel Store with help of Selector
  const {
    allDealsArr: allDealsData,
    deleteModalVisible,
    loading,
  } = useSelector((state) => state.allDeals);

  return (
    <>
      <Sidebar trigger="deals" />
      <Layout className="site-layout">
        <Header style={allTemplateStyles.header}>
          <Row>
            <Col>
              <Title level={2} style={allTemplateStyles.title}>
                Deals
                <Breadcrumb style={allTemplateStyles.breadcrumb}>
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
            <Col offset={15}>
              <div>
                <Affix offsetTop={10}>
                  <Link to="/deals/addDeals">
                    <Button type="primary" icon={<PlusOutlined />} size="large">
                      Add Deals
                    </Button>
                  </Link>
                </Affix>
              </div>
            </Col>
          </Row>
        </Header>

        <Content style={{ margin: "1rem 1rem" }}>
          <Table
            columns={columns}
            dataSource={allDealsData}
            showHeader={false}
            loading={loading}
            rowKey="templateId"
            pagination={false}
          />
          <BackTop />
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Affix offsetBottom={20}>
              <Pagination current={pageNo} onChange={pageChange} total={50} />
            </Affix>
          </div>
        </Content>

        {/* Delete Template Modal */}
        <Modal
          title="Delete Template"
          visible={deleteModalVisible}
          footer={null}
          onCancel={handleDeleteCancel}
          maskClosable={false}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: "2.5rem" }}>
              <Title level={4}>
                Do you really want to delete{" "}
                <strong style={{ color: "#FD4D4F" }}> “ {coupanName} ” </strong> Template
                permanently
              </Title>
            </div>
            <Button
              type="danger"
              loading={loading}
              onClick={handleDeleteTemplate}
              style={allTemplateStyles.btn}
            >
              Delete
            </Button>
          </div>
        </Modal>
      </Layout>
    </>
  );
};

export default Deals;
