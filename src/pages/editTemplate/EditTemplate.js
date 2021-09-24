import React, { useEffect, useState } from "react";
import { Layout, Breadcrumb, Typography, Row, Col, Table, Button, Affix,Modal } from "antd";
import { sortableContainer, sortableElement, sortableHandle } from "react-sortable-hoc";
import {
  HomeFilled,
  MenuOutlined,
  EditOutlined,
  DeleteFilled,
  PlusOutlined,
} from "@ant-design/icons";
import arrayMove from "array-move";
import "./editTemplate.css";
import Sidebar from "../../components/sidebar/Sidebar";
import templateImg from "../../assets/img/imgplace.png";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  getAllViews,
  saveSortedViews,
  sortViews,
  deleteViewModalVisible,
  deleteView,
} from "../../redux/slices/editTemplateSlice";
import InitialPopup from "../../components/initialPopup/InitialPopup";
const { Header, Content } = Layout;
const { Title } = Typography;

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: "grab", color: "#999" }} />
));

const TemplateImageDiv = () => {
  return (
    <div>
      <img src={templateImg} alt="template_avatar" className="template-image" />
    </div>
  );
};

const ViewInfoDiv = ({ viewId, viewName }) => {
  return (
    <div>
      <Row gutter={16} style={{ marginBottom: "0.3rem" }}>
        <Col className="gutter-row" span={13}>
          <Title level={5}>{viewName}</Title>
        </Col>
      </Row>
      <Row>
        <Col className="gutter-row" span={8}>
          <Row> View ID : {viewId}</Row>
        </Col>
        <Col className="gutter-row" span={12}>
          <Row>View Type : {viewName}</Row>
        </Col>
      </Row>
    </div>
  );
};

const editTemplateInlineStyles = {
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

  btnRow: {
    marginBottom: "1rem",
  },

  saveBtn: {
    width: "140px",
    height: "40px",
    padding: "0",
    display: " inline-block",
    lineHeight: "40px",
    textAlign: "center",
    fontSize: "1.3rem",
    borderRadius: "3px",
  },

  publishBtn: {
    width: "200px",
    height: "40px",
    padding: "0",
    display: " inline-block",
    lineHeight: "40px",
    textAlign: "center",
    fontSize: "1.3rem",
    marginLeft: "1.8rem",
    borderRadius: "3px",
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

const EditTemplate = () => {
  const [showSaveBtn, setShowSaveBtn] = useState(false);
  const [viewUniqueId, setViewUniqueId] = useState(null);
  const [deleteViewName, setDeleteViewName] = useState(null);
  const { templateId } = useParams();
  const dispatch = useDispatch();

  const {
    allViewsArr: allViews,
    panelLoading,
    deleteViewModal: deleteModalVisible,
  } = useSelector((state) => state.editTemplate);


  useEffect(() => {
    dispatch(
      getAllViews({
        templateId,
      })
    );
  }, [templateId, dispatch]);

 
  const showDeleteModal = (viewUnique, viewName) => {
    dispatch(deleteViewModalVisible({ modal: true }));
    setDeleteViewName(viewName);
    setViewUniqueId(viewUnique);
  };

  //* Method To Close the DeleteView Modal
  const handleDeleteCancel = () => {
    dispatch(deleteViewModalVisible({ modal: false }));
  };

  const handleDeleteView = () => {
    dispatch(deleteView({ templateId, viewUnique: viewUniqueId }));
  };

  const columns = [
    {
      key: "imgs",
      width: 60,
      render: () => <TemplateImageDiv />,
    },
    {
      key: "viewUnique",
      dataIndex: ["viewId", "viewTag"],
      render: (key, obj) => <ViewInfoDiv viewId={obj.viewId} viewName={obj.viewTag} />,
    },
    {
      key: "edit",
      dataSource: ["viewUnique"],
      width: 60,
      render: (key, obj) => (
        <EditOutlined
          className="edit-icon"
          style={editTemplateInlineStyles.editIcon}
          // onClick={() => handleEditTemplate(obj.templateId)}
        />
      ),
    },
    {
      key: "delete",
      dataIndex: ["viewUnique", "viewTag"],
      width: 60,
      render: (key, obj) => (
        <DeleteFilled
          className="delete-icon"
          style={editTemplateInlineStyles.deleteIcon}
          onClick={() => showDeleteModal(obj.viewUnique, obj.viewTag)}
        />
      ),
    },
    {
      dataIndex: "sort",
      width: 60,
      className: "drag-visible",
      render: () => <DragHandle />,
    },
  ];

  const SortableItem = sortableElement((props) => <tr {...props} />);
  const SortableContainer = sortableContainer((props) => <tbody {...props} />);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(allViews), oldIndex, newIndex).filter(
        (el) => !!el
      );

      dispatch(
        sortViews({
          sortedViews: newData,
        })
      );
      setShowSaveBtn(true);
    }
  };

  const draggableContainer = (props) => (
    <SortableContainer
      useDragHandle
      // disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const draggableBodyRow = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = allViews.findIndex((x) => x.viewUnique === restProps["data-row-key"]);
    return <SortableItem index={index} {...restProps} />;
  };

  const handleSave = (editTemplateId) => {
    dispatch(saveSortedViews({ templateId: editTemplateId }));
    setShowSaveBtn(false);
  };

  return (
    <>
      <Sidebar />
      <Layout className="site-layout">
        <Header style={editTemplateInlineStyles.header}>
          <Title level={2} style={editTemplateInlineStyles.title}>
            Edit Common App Template
            <Breadcrumb style={editTemplateInlineStyles.breadcrumb}>
              <Breadcrumb.Item>
                <a href="">
                  <HomeFilled /> Home
                </a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <a href="">Templates</a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <a href="">Edit Template</a>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Title>
        </Header>
        <Row>
          <Col span={16}>
            <Content style={{ margin: "1.3rem 0.5rem" }}>
              <Table
                pagination={false}
                dataSource={allViews}
                columns={columns}
                rowKey="viewUnique"
                showHeader={false}
                loading={panelLoading}
                scroll={{ y: 600 }}
                components={{
                  body: {
                    wrapper: draggableContainer,
                    row: draggableBodyRow,
                  },
                }}
              />
            </Content>
          </Col>
          <Col span={8}>
            <InitialPopup />
          </Col>
        </Row>
        <div>
          <Affix offsetBottom={15}>
            <Row style={editTemplateInlineStyles.btnRow}>
              <Col span={3} offset={12}>
                {showSaveBtn && (
                  <Button
                    style={editTemplateInlineStyles.saveBtn}
                    onClick={() => handleSave(templateId)}
                  >
                    Save
                  </Button>
                )}
              </Col>

              <Col span={3}>
                <Button type="primary" style={editTemplateInlineStyles.publishBtn}>
                  Publish Changes
                </Button>
              </Col>
            </Row>
          </Affix>
        </div>

        {/* Delete View Modal */}
        <Modal
          title="Delete View"
          visible={deleteModalVisible}
          footer={null}
          onCancel={handleDeleteCancel}
          maskClosable={false}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: "2.5rem" }}>
              <Title level={4}>
                Do you really want to delete{" "}
                <strong style={{ color: "#FD4D4F" }}> “ {deleteViewName} ” </strong>{" "}
                View permanently
              </Title>
            </div>
            <Button
              type="danger"
              loading={panelLoading}
              onClick={handleDeleteView}
              style={editTemplateInlineStyles.btn}
            >
              Delete
            </Button>
          </div>
        </Modal>
      </Layout>
    </>
  );
};

export default EditTemplate;
