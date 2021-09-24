import { useState } from "react";
import { Layout, Row, Col, Typography, Affix, Breadcrumb, Button } from "antd";
import { HomeFilled } from "@ant-design/icons";
import Sidebar from "../../components/sidebar/Sidebar";
import ProductList from "../../components/productList/ProductList";
import { useHistory, Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleCollectionSummaryModal } from "../../redux/slices/collectionSlice";

const { Header } = Layout;
const { Title } = Typography;

const viewCollectionStyles = {
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

  editCollectionBtn: {
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

  submitCollectionBtn: {
    width: "250px",
    height: "40px",
    margin: "0 auto",
    padding: "0",
    display: " inline-block",
    backgroundColor: "#4a87f5",
    lineHeight: "30px",
    textAlign: "center",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
};

const ViewEditCollection = () => {
  const [showSubmitBtn, setShowSubmitBtn] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();
  const { collectionId } = useParams();

  //? Retrieve Data from Store
  const { collectionName, description, filteredProducts, filterDisplay, productCount } =
    useSelector((state) => state.allCollections);

  const handleOpenModal = () => {
    dispatch(toggleCollectionSummaryModal({ modal: true }));
  };

  return (
    <>
      <Sidebar trigger="collections" />

      <Layout className="site-layout">
        <Header style={viewCollectionStyles.header}>
          <Row>
            <Col span={13}>
              <Title level={2} style={viewCollectionStyles.title}>
                {collectionName} ({productCount})
                <Breadcrumb style={viewCollectionStyles.breadcrumb}>
                  <Breadcrumb.Item>
                    <a href="">
                      <HomeFilled /> Home
                    </a>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Link to="/collections"> Collections</Link>
                  </Breadcrumb.Item>

                  <Breadcrumb.Item>{collectionName}</Breadcrumb.Item>
                </Breadcrumb>
              </Title>
            </Col>
            <Col offset={4}>
              {filteredProducts.length !== 0 && (
                <Affix offsetTop={10}>
                  {showSubmitBtn ? (
                    <Button
                      type="primary"
                      style={viewCollectionStyles.submitCollectionBtn}
                      onClick={handleOpenModal}
                    >
                      Submit Collection
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      ghost
                      style={viewCollectionStyles.editCollectionBtn}
                      onClick={() => setShowSubmitBtn(true)}
                    >
                      Edit Collection
                    </Button>
                  )}
                </Affix>
              )}
            </Col>
          </Row>
        </Header>
        <ProductList
          collectionId={collectionId}
          collectionName={collectionName}
          description={description}
          filterToDisplay={filterDisplay}
          editCollection
          showCheckbox={showSubmitBtn}
          productsToDisplay={filteredProducts}
        />
      </Layout>
    </>
  );
};

export default ViewEditCollection;
