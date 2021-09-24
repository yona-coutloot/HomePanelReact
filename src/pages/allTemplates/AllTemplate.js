import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Layout,
  Breadcrumb,
  Typography,
  Row,
  Col,
  Button,
  Modal,
  BackTop,
  Input,
  Affix,
  Pagination,
} from "antd";
import {
  HomeFilled,
  EyeOutlined,
  EditOutlined,
  CopyOutlined,
  DeleteFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import templateImg from "../../assets/img/imgplace.png";
import {
  addNewTemplate,
  getAllTemplatesThunk,
  addTemplateModalVisible,
  cloneTemplateModalVisible,
  deleteTemplateModalVisible,
  cloneTemplate,
  deleteTemplate,
} from "../../redux/slices/allTemplateSlice";

import "./allTemplate.css";
import Sidebar from "../../components/sidebar/Sidebar";
import { useHistory, useRouteMatch } from "react-router";
const { Header, Content } = Layout;
const { Title } = Typography;

const TemplateImageDiv = () => {
  return (
    <div>
      <img src={templateImg} alt="template_avatar" className="template-image" />
    </div>
  );
};

const TemplateInfoDiv = ({ templateId, templateName, status }) => {
  const [tagType, tagText] = status === 1 ? ["success", "ACTIVE"] : ["error", "INACTIVE"];
  return (
    <div>
      <Row gutter={16} style={{ marginBottom: "0.3rem" }}>
        <Col className="gutter-row" span={13}>
          <Title level={5}>{templateName}</Title>
        </Col>
        <Col>
          <Tag color={tagType} style={{ marginLeft: "1rem" }}>
            {tagText}
          </Tag>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={10}>
          <Row> Template ID : {templateId}</Row>
        </Col>
        <Col className="gutter-row" span={7}>
          <Row>Created Date : 12-08-2016</Row>
        </Col>
      </Row>
    </div>
  );
};

const allTemplateInlineStyles = {
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
  btn: {
    width: "250px",
    height: "40px",
    margin: "0 auto",
    padding: "0",
    display: " inline-block",
    lineHeight: "40px",
    textAlign: "center",
    fontSize: "1.5rem",
  },
};

const AllTemplate = () => {
  const [pageNo, setPageNo] = useState(1);
  const [templateName, setTemplateName] = useState("");
  const [cloneTemplateId, setCloneTemplateId] = useState(null);
  const [cloneTemplateName, setCloneTemplateName] = useState(null);
  const [deleteTemplateId, setDeleteTemplateId] = useState(null);
  const [deleteTemplateName, setDeleteTemplateName] = useState(null);

  //? Dispatch action to the reducers
  const dispatch = useDispatch();

  //? Retrieve the Data from HomePanel Store with help of Selector
  const loading = useSelector((state) => state.allTemplates.panelLoading);
  const allTemplatesData = useSelector((state) => state.allTemplates.allTeamplatesArr);
  const addModalVisible = useSelector((state) => state.allTemplates.addTemplateModal);
  const cloneModalVisible = useSelector((state) => state.allTemplates.cloneTemplateModal);
  const deleteModalVisible = useSelector((state) => state.allTemplates.deleteTemplateModal);

  const history = useHistory();
  const { url } = useRouteMatch();

  //? Load The Templates By dispatching the Page No to the Store
  useEffect(() => {
    dispatch(getAllTemplatesThunk(pageNo));
  }, [dispatch, pageNo]);

  //? Set Template Name for Add or Clone Template
  const handleTemplateName = (e) => {
    setTemplateName(e.target.value);
  };

  // ======== ADD TEMPLATE MODAL FUNCTIONS ========== //
  //* Method to Show the Add Template Modal
  const showAddModal = () => {
    dispatch(addTemplateModalVisible({ modal: true }));
  };

  //* Method To Close the Add Template Modal
  const handleAddCancel = () => {
    dispatch(addTemplateModalVisible({ modal: false }));
  };

  //* Method To dipatch for Creating/Adding New Template
  const handleAddTemplate = () => {
    dispatch(addNewTemplate({ templateName }));
  };

  // ======== CLONE TEMPLATE MODAL FUNCTIONS ======= //

  //* Method to Show the Clone Modal and Set Template Name and Id for the Template to Clone
  const showCloneModal = (id, name) => {
    dispatch(cloneTemplateModalVisible({ modal: true }));
    setCloneTemplateName(name);
    setCloneTemplateId(id);
  };

  //* Method To Close the CloneTemplate Modal
  const handleCloneCancel = () => {
    dispatch(cloneTemplateModalVisible({ modal: false }));
  };

  //* Method To dipatch template Id & Template Name of the template to be Cloned to The Store
  const handleCloneTemplate = () => {
    dispatch(
      cloneTemplate({
        templateName,
        templateId: cloneTemplateId,
      })
    );
  };

  // ====== DELETE TEMPLATE MODAL FUNCTIONS ======== //

  //* Method to Show the Delete Modal and Set Template Name and Id for the Template to delete
  const showDeleteModal = (id, name) => {
    dispatch(deleteTemplateModalVisible({ modal: true }));
    setDeleteTemplateId(id);
    setDeleteTemplateName(name);
  };

  //* Method To Close the DeleteTemplate Modal
  const handleDeleteCancel = () => {
    dispatch(deleteTemplateModalVisible({ modal: false }));
  };

  //* Method To dipatch template Id of the template to be deleted to The Store
  const handleDeleteTemplate = () => {
    dispatch(
      deleteTemplate({
        templateId: deleteTemplateId,
      })
    );
  };

  // ========= EDIT TEMPLATE METHOD ============== //

  const handleEditTemplate = (templateId) => {
    history.push(`${url}/editTemplate/${templateId}`);
  };

  // ============= PAGINATION ==================== //

  const pageChange = (page) => setPageNo(page);

  //? Set the Columns for the Table
  const columns = [
    {
      key: "imgs",
      width: 30,
      render: () => <TemplateImageDiv />,
    },
    {
      dataIndex: ["templateId", "templateName", "status"],
      render: (key, obj) => (
        <TemplateInfoDiv
          templateId={obj.templateId}
          templateName={obj.templateName}
          status={obj.status}
        />
      ),
    },
    {
      key: "preview",
      width: 30,
      render: () => (
        <EyeOutlined className="preview-icon" style={allTemplateInlineStyles.previewIcon} />
      ),
    },
    {
      key: "edit",
      dataSource: ["templateId"],
      width: 30,
      render: (key, obj) => (
        <EditOutlined
          className="edit-icon"
          style={allTemplateInlineStyles.editIcon}
          onClick={() => handleEditTemplate(obj.templateId)}
        />
      ),
    },
    {
      key: "clone",
      dataIndex: ["templateId", "templateName"],
      width: 30,
      render: (key, obj) => (
        <CopyOutlined
          className="clone-icon"
          style={allTemplateInlineStyles.cloneIcon}
          onClick={() => showCloneModal(obj.templateId, obj.templateName)}
        />
      ),
    },
    {
      key: "delete",
      dataIndex: ["templateId", , "templateName"],
      width: 30,
      render: (key, obj) => (
        <DeleteFilled
          className="delete-icon"
          style={allTemplateInlineStyles.deleteIcon}
          onClick={() => showDeleteModal(obj.templateId, obj.templateName)}
        />
      ),
    },
  ];

  return (
    <>
      <Sidebar trigger="allTemplates" />
      <Layout className="site-layout">
        <Header style={allTemplateInlineStyles.header}>
          <Row>
            <Col>
              <Title level={2} style={allTemplateInlineStyles.title}>
                All Templates
                <Breadcrumb style={allTemplateInlineStyles.breadcrumb}>
                  <Breadcrumb.Item>
                    <a href="">
                      <HomeFilled /> Home
                    </a>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <a href="/allTemplates">Templates</a>
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Title>
            </Col>
            <Col offset={15}>
              <div>
                <Affix offsetTop={10}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={showAddModal}
                  >
                    Add New Template
                  </Button>
                </Affix>
              </div>
            </Col>
          </Row>
        </Header>

        <Content style={{ margin: "1rem 1rem" }}>
          <Table
            columns={columns}
            dataSource={allTemplatesData}
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
        {/* Add Template Modal */}
        <Modal
          title="Add Template"
          visible={addModalVisible}
          onOk={handleAddTemplate}
          okText="ADD"
          confirmLoading={loading}
          onCancel={handleAddCancel}
          maskClosable={false}
        >
          <div className="addTemplate-modal">
            <Title level={5}>Template Name :</Title>
            <Input
              placeholder="Enter Template Name"
              onChange={handleTemplateName}
              size="large"
            />
          </div>
        </Modal>
        {/* Clone Template Modal */}
        <Modal
          title="Clone Template"
          visible={cloneModalVisible}
          footer={null}
          onCancel={handleCloneCancel}
          maskClosable={false}
        >
          <div className="cloneTemplate-modal" style={{ textAlign: "center" }}>
            <div style={{ marginBottom: "20px" }}>
              <Title level={4}>
                Do you really want to Clone{" "}
                <strong style={{ color: "#177ce6" }}>“ {cloneTemplateName} ”</strong> Template
              </Title>
              <Title level={4} style={{ color: "#6c757d" }}>
                To
              </Title>
            </div>

            <Title level={5} style={{ float: "left" }}>
              {" "}
              New Template Name :
            </Title>
            <Input
              placeholder="Enter Template Name"
              onChange={handleTemplateName}
              size="large"
              style={{ marginBottom: "2rem" }}
            />
            <Button
              type="primary"
              loading={loading}
              onClick={handleCloneTemplate}
              style={allTemplateInlineStyles.btn}
            >
              Clone
            </Button>
          </div>
        </Modal>
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
                <strong style={{ color: "#FD4D4F" }}> “ {deleteTemplateName} ” </strong>{" "}
                Template permanently
              </Title>
            </div>
            <Button
              type="danger"
              loading={loading}
              onClick={handleDeleteTemplate}
              style={allTemplateInlineStyles.btn}
            >
              Delete
            </Button>
          </div>
        </Modal>
      </Layout>
    </>
  );
};

export default AllTemplate;
