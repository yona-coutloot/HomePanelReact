import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Layout,
  Breadcrumb,
  Typography,
  Row,
  Col,
  Tooltip,
  Button,
  Modal,
  BackTop,
  Form,
  Input,
  Affix,
  Pagination,
  message,
  Select,
} from "antd";

import {
  HomeFilled,
  BlockOutlined,
  DeleteFilled,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Sidebar from "../../components/sidebar/Sidebar";
import templateImg from "../../assets/img/imgplace.png";
import { useDispatch, useSelector } from "react-redux";
import {
  addCollectionData,
  clearCollectionData,
  deleteCollection,
  fetchAllCollections,
  fetchCollectionById,
  mergeCollection,
  toggleAddModal,
  toggleDeleteModal,
  toggleMergeCollectionModal,
} from "../../redux/slices/collectionSlice";
import { useHistory, useRouteMatch } from "react-router-dom";
import axios from "../../axios/axios";
const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const allCollectionStyles = {
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
  message: {
    marginTop: "10vh",
    fontSize: "1.2rem",
    fontWeight: "500",
  },
};

const TemplateImageDiv = () => {
  return (
    <div>
      <img src={templateImg} alt="template_avatar" className="template-image" />
    </div>
  );
};

const TemplateInfoDiv = ({
  collectionId,
  collectionName,
  products,
  status,
  description,
  createdAt,
  deletedAt,
  createdBy,
  mergedCollections,
}) => {
  const [tagType, tagText] =
    status === "ACTIVE" ? ["success", "ACTIVE"] : ["error", "DELETED"];

  const collectionDescription =
    description && description.length > 30
      ? description.substring(0, 30) + "..."
      : description || "NA";

  const formatedCreatedAt = new Date(createdAt).toString().slice(0, 21);
  const formatedDeletedAt = new Date(deletedAt).toString().slice(0, 21);

  return (
    <div>
      <Row gutter={16}>
        <Col span={13}>
          <Title level={5}>{collectionName}</Title>
        </Col>
        <Col>
          <Tag color={tagType} style={{ marginLeft: "1rem" }}>
            {tagText}
          </Tag>
        </Col>
      </Row>
      <Row style={{ marginBottom: "0.1rem" }}>
        <Col span={10}>
          <Row> No Of Products : {products}</Row>
        </Col>
        <Col span={7}>
          <Row>Collection Id : {collectionId}</Row>
        </Col>
      </Row>
      <Row style={{ marginBottom: "0.1rem" }}>
        <Col span={10}>
          <Tooltip placement="top" title={description}>
            <Row>Description : {collectionDescription}</Row>
          </Tooltip>
        </Col>
        <Col span={7}>
          <Row>Created By : {createdBy}</Row>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <Row>Created At : {formatedCreatedAt}</Row>
        </Col>
        <Col span={10}>
          <Row>Deleted At : {deletedAt ? formatedDeletedAt : "NA"}</Row>
        </Col>
      </Row>
      {mergedCollections.length > 0 && (
        <Row>Merged Collections : {mergedCollections.join(", ")}</Row>
      )}
    </div>
  );
};

const AllCollection = () => {
  const [pageNo, setPageNo] = useState(1);
  const [collectionName, setCollectionName] = useState("");
  const [deleteCollectionName, setDeleteCollectionName] = useState("");
  const [deleteCollectionId, setDeleteCollectionId] = useState(0);
  const [description, setDescription] = useState("");
  const [dropdownChildren, setDropDownChildren] = useState([]);
  const [mergeCollectionIds, setMergeCollectionIds] = useState([]);
  const [disableMerge, setDisableMerge] = useState(false);
  const dispatch = useDispatch();
  const [formRef] = Form.useForm(); //? Use Form Hook to operate with the form elements
  const history = useHistory();
  const { url } = useRouteMatch();

  //? Retrieve Data from collection reducer...
  const {
    allCollectionsArr,
    loading,
    addCollectionModal,
    deleteCollectionModal,
    mergeCollectionModal,
  } = useSelector((state) => state.allCollections);

  //? Set Collection Name for Collection to be created
  const handleCollectionName = (e) => {
    setCollectionName(e.target.value);
  };

  //? Set Description for Collection to be created
  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  // ======== ADD COLLECTION MODAL FUNCTIONS ========== //

  //* Method To Open Add Collection Modal
  const showAddModal = () => {
    dispatch(toggleAddModal({ modal: true }));
    formRef.resetFields();
  };

  //* Method To Close the Add Collection Modal
  const handleAddCancel = () => dispatch(toggleAddModal({ modal: false }));

  const handleAddCollection = () => {
    dispatch(addCollectionData({ collectionName, description }));
    history.push("/collections/filters");
  };

  // ======== PREVIEW COLLECTION FUNCTIONS ========== //

  const handlePreviewCollection = (collectionId, status) => {
    if (status === "DELETED") {
      return message.error(
        {
          content: `DELETED Collection Cannot be Edited`,
          style: allCollectionStyles.message,
        },
        4000
      );
    }
    dispatch(fetchCollectionById({ collectionId }));
    history.push(`${url}/viewEditCollection/${collectionId}`);
  };

  // ======== DELETE COLLECTION FUNCTIONS ========== //

  //* Method To Open Add Collection Modal
  const showDeleteModal = (collectionId, collectionName, status) => {
    if (status === "DELETED") {
      return message.error(
        {
          content: "Collection is Already Deleted",
          style: allCollectionStyles.message,
        },
        4000
      );
    }
    setDeleteCollectionId(collectionId);
    setDeleteCollectionName(collectionName);
    dispatch(toggleDeleteModal({ modal: true }));
  };

  //* Method To Close the Delete Collection Modal
  const handleDeleteCancel = () => dispatch(toggleDeleteModal({ modal: false }));

  //* Method To Dispatch Delete Collection.
  const handleDeleteCollection = () => {
    const collectionToDelete = {
      collectionId: deleteCollectionId,
    };

    dispatch(deleteCollection(collectionToDelete));
  };

  // ======== MERGE COLLECTION FUNCTIONS ========== //
  const showMergeCollectionModal = () => {
    dispatch(toggleMergeCollectionModal({ modal: true }));
    formRef.resetFields();
    setDisableMerge(false);
    setMergeCollectionIds([]);
  };

  const handleMergeCancel = () => {
    dispatch(toggleMergeCollectionModal({ modal: false }));
    setMergeCollectionIds([]);
    setDisableMerge(false);
  };

  const mergeCollectionOptionsApi = async () => {
    try {
      const { data } = await axios.get("/collection/fetchCollectionOption", {});

      const optionData = [];
      for (const val of data.data) {
        optionData.push(
          <Option value={`${val.collectionName}:${val.collectionId}:${val.products}`}>
            <div>
              <Row>{val.collectionName}</Row>
              <Row>
                <Col span={6}>Collection Id: {val.collectionId} </Col>
                <Col offset={1}>Products: {val.products}</Col>
              </Row>
            </div>
          </Option>
        );
      }

      setDropDownChildren(optionData);
    } catch (error) {
      history.push("/collections");
    }
  };

  const handleDropdownAdd = (value) => {
    const mergeIds = [];
    let collectionCount = 0;
    if (value.length === 0) {
      setMergeCollectionIds([]);
    }

    for (const collection of value) {
      const productCount = Number(collection.split(":")[2]);

      const collectionId = Number(collection.split(":")[1]);

      collectionCount = collectionCount + productCount;

      if (collectionCount <= 3000) {
        mergeIds.push(collectionId);
        setMergeCollectionIds(mergeIds);
        setDisableMerge(false);
      } else {
        setDisableMerge(true);
        return message.error({
          content: "Collection Limit is of 3000 products, Please remove some collections",
          style: allCollectionStyles.message,
        });
      }
    }
  };

  const handleDropdownDelete = (value) => {
    const collectionId = Number(value.split(":")[1]);

    const index = mergeCollectionIds.findIndex((val) => val === collectionId);

    if (index > -1) {
      mergeCollectionIds.splice(index, 1);
      setMergeCollectionIds(mergeCollectionIds);
    }
  };

  const submitMergeCollection = () => {
    const collectionToMerge = {
      collectionName,
      description,
      mergedCollection: mergeCollectionIds,
    };

    dispatch(mergeCollection(collectionToMerge));
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
      dataIndex: ["collectionId", "collectionName", "status"],
      render: (key, obj) => (
        <TemplateInfoDiv
          collectionId={obj.collectionId}
          collectionName={obj.collectionName}
          status={obj.status}
          products={obj.products}
          description={obj.description}
          createdAt={obj.createdAt}
          deletedAt={obj.deletedAt}
          createdBy={obj.createdBy.name}
          mergedCollections={obj.mergedCollections}
        />
      ),
    },

    {
      key: "edit",
      dataSource: ["collectionId"],
      width: 30,
      render: (key, obj) => (
        <EyeOutlined
          className="preview-icon"
          style={allCollectionStyles.previewIcon}
          onClick={() => handlePreviewCollection(obj.collectionId, obj.status)}
        />
      ),
    },

    {
      key: "delete",
      dataIndex: ["collectionId", "collectionName"],
      width: 30,
      render: (key, obj) => (
        <DeleteFilled
          className="delete-icon"
          style={allCollectionStyles.deleteIcon}
          onClick={() => showDeleteModal(obj.collectionId, obj.collectionName, obj.status)}
        />
      ),
    },
  ];

  useEffect(() => {
    dispatch(fetchAllCollections({ pageNo }));
    dispatch(clearCollectionData({ type: "CLEAR_ALL" }));
    mergeCollectionOptionsApi();
  }, [dispatch, pageNo]);

  return (
    <>
      <Sidebar trigger="collections" />
      <Layout className="site-layout">
        <Header style={allCollectionStyles.header}>
          <Row>
            <Col span={10}>
              <Title level={2} style={allCollectionStyles.title}>
                Collection
                <Breadcrumb style={allCollectionStyles.breadcrumb}>
                  <Breadcrumb.Item>
                    {/* <a href="/allTemplates"> */}
                    <a href="/collections">
                      <HomeFilled /> Home
                    </a>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <a href="/collections">Collection</a>
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Title>
            </Col>

            <Col offset={5}>
              <div>
                <Affix offsetTop={10}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={showAddModal}
                  >
                    Add Collection
                  </Button>
                </Affix>
              </div>
            </Col>
            <Col offset={1}>
              <div>
                <Affix offsetTop={10}>
                  <Button
                    type="primary"
                    icon={<BlockOutlined />}
                    size="large"
                    onClick={showMergeCollectionModal}
                  >
                    Merge Collection
                  </Button>
                </Affix>
              </div>
            </Col>
          </Row>
        </Header>

        <Content style={{ margin: "1rem 1rem" }}>
          <Table
            columns={columns}
            dataSource={allCollectionsArr}
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
        {/* Add Collection Modal */}
        <Modal
          title={
            <Title level={4} style={{ marginBottom: "-5px", fontWeight: "500" }}>
              Add New Collection
            </Title>
          }
          visible={addCollectionModal}
          onOk={handleAddCollection}
          okText="ADD"
          confirmLoading={loading}
          onCancel={handleAddCancel}
          maskClosable={false}
          footer={false}
        >
          <div>
            <Form
              layout="vertical"
              form={formRef}
              requiredMark={false}
              onFinish={handleAddCollection}
            >
              <Form.Item
                label={<Title level={5}>Collection Name :</Title>}
                name="collectionName"
                wrapperCol={{ span: 23 }}
                rules={[
                  {
                    required: true,
                    message: "Collection Name is Required",
                  },
                  {
                    min: 10,
                    message: "Collection Name must be minimum 10 Character",
                  },
                ]}
              >
                <Input placeholder="Enter Collection Name" onChange={handleCollectionName} />
              </Form.Item>

              <Form.Item
                label={<Title level={5}>Description :</Title>}
                name="description"
                wrapperCol={{ span: 23 }}
                rules={[
                  {
                    required: true,
                    message: "Description is Required",
                  },
                  {
                    min: 5,
                    message: "Description must be minimum 5 Character",
                  },
                ]}
              >
                <Input.TextArea
                  placeholder="Enter Description For Collection"
                  onChange={handleDescription}
                />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 20,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Add
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>

        {/* Delete Collection Modal */}
        <Modal
          visible={deleteCollectionModal}
          footer={null}
          onCancel={handleDeleteCancel}
          maskClosable={false}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: "2.5rem" }}>
              <Title level={4}>
                <span style={{ display: "block" }}>
                  Do you want to delete this collection?
                </span>
                <strong style={{ color: "#FD4D4F" }}> “ {deleteCollectionName} ” </strong>{" "}
              </Title>
            </div>
            <Button
              type="danger"
              loading={loading}
              onClick={handleDeleteCollection}
              style={allCollectionStyles.btn}
            >
              Delete
            </Button>
          </div>
        </Modal>

        {/* Merge Collection Modal */}
        <Modal
          title={
            <Title level={4} style={{ marginBottom: "-5px", fontWeight: "500" }}>
              Merge Collection
            </Title>
          }
          visible={mergeCollectionModal}
          okText="Merge"
          confirmLoading={loading}
          onCancel={handleMergeCancel}
          maskClosable={false}
          footer={false}
        >
          <div>
            <Form
              layout="vertical"
              form={formRef}
              requiredMark={false}
              onFinish={submitMergeCollection}
            >
              <Form.Item
                label={<Title level={5}>Select Collection :</Title>}
                name="allCollectionsMenu"
                wrapperCol={{ span: 23 }}
                rules={[
                  {
                    required: true,
                    message: "Collection is Required",
                  },
                ]}
              >
                <Select
                  mode="tags"
                  onChange={handleDropdownAdd}
                  onDeselect={handleDropdownDelete}
                >
                  {dropdownChildren}
                </Select>
              </Form.Item>
              <Form.Item
                label={<Title level={5}>Collection Name :</Title>}
                name="collectionName"
                wrapperCol={{ span: 23 }}
                rules={[
                  {
                    required: true,
                    message: "Collection Name is Required",
                  },
                  {
                    min: 10,
                    message: "Collection Name must be minimum 10 Character",
                  },
                ]}
              >
                <Input placeholder="Enter Collection Name" onChange={handleCollectionName} />
              </Form.Item>
              <Form.Item
                label={<Title level={5}>Description :</Title>}
                name="description"
                wrapperCol={{ span: 23 }}
                rules={[
                  {
                    required: true,
                    message: "Description is Required",
                  },
                  {
                    min: 5,
                    message: "Description must be minimum 5 Character",
                  },
                ]}
              >
                <Input.TextArea
                  placeholder="Enter Description For Collection"
                  onChange={handleDescription}
                />
              </Form.Item>
              {disableMerge && (
                <span style={{ textAlign: "center" }}>
                  <Text strong style={{ color: "red" }}>
                    *Collection limit is of 3000, Please remove some collections
                  </Text>
                </span>
              )}

              <Form.Item
                wrapperCol={{
                  offset: 20,
                  span: 16,
                }}
              >
                <Button
                  type="primary"
                  loading={loading}
                  disabled={disableMerge}
                  htmlType="submit"
                >
                  Merge
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </Layout>
    </>
  );
};

export default AllCollection;
