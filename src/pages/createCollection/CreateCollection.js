import { Layout, Row, Col, Typography, Affix, Breadcrumb, Button } from "antd";
import { HomeFilled } from "@ant-design/icons";
import Sidebar from "../../components/sidebar/Sidebar";
import ProductList from "../../components/productList/ProductList";
import { useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleCollectionSummaryModal } from "../../redux/slices/collectionSlice";

const { Header } = Layout;
const { Title } = Typography;

const createCollectionStyles = {
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

  createCollectionBtn: {
    width: "250px",
    height: "40px",
    margin: "0 auto",
    padding: "0",
    display: " inline-block",
    lineHeight: "30px",
    backgroundColor: "orange",
    textAlign: "center",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
};

const CreateCollection = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  //? Retrieve Data from Store
  const {
    collectionName,
    description,
    filterObj,
    filteredProducts,
    filterDisplay,
    productCount,
  } = useSelector((state) => state.allCollections);

  if (!collectionName) history.push("/collections");

  const handleOpenModal = () => {
    dispatch(toggleCollectionSummaryModal({ modal: true }));
  };

  return (
    <>
      <Sidebar trigger="collections" />
      <Layout className="site-layout">
        <Header style={createCollectionStyles.header}>
          <Row>
            <Col span={10}>
              <Title level={2} style={createCollectionStyles.title}>
                {collectionName} ({productCount})
                <Breadcrumb style={createCollectionStyles.breadcrumb}>
                  <Breadcrumb.Item>
                    <a href="">
                      <HomeFilled /> Home
                    </a>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Link to="/collections"> Collections</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Link to="/collections/filters"> Filter </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>{collectionName}</Breadcrumb.Item>
                </Breadcrumb>
              </Title>
            </Col>
            <Col offset={8}>
              {filteredProducts.length !== 0 && (
                <Affix offsetTop={10}>
                  <Button
                    type="primary"
                    style={createCollectionStyles.createCollectionBtn}
                    onClick={handleOpenModal}
                  >
                    Create Collection
                  </Button>
                </Affix>
              )}
            </Col>
          </Row>
        </Header>
        <ProductList
          collectionName={collectionName}
          description={description}
          filterObj={filterObj}
          filterToDisplay={filterDisplay}
          productsToDisplay={filteredProducts}
          showCheckbox
          productChecked={true}
        />
        
      </Layout>
    </>
  );
};

export default CreateCollection;
