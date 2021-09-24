import React, { useState } from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Breadcrumb,
  Card,
  Checkbox,
  Image,
  Avatar,
  BackTop,
  Tag,
  Tooltip,
  Spin,
  Button,
  Affix,
  Modal,
} from "antd";
import { HomeFilled } from "@ant-design/icons";
import { useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  addCollection,
  editCollectionThunk,
  fetchCollectionById,
  fetchProducts,
  setProductCount,
  toggleCollectionSummaryModal,
} from "../../redux/slices/collectionSlice";
const { Header, Content } = Layout;
const { Title, Text } = Typography;

const productListStyles = {
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

  message: {
    marginTop: "10vh",
    fontSize: "1.2rem",
    fontWeight: "500",
  },

  imgCheckbox: {
    position: "absolute",
    transform: "scale(1.6)",
    top: "20px",
    left: "30px",
    zIndex: "900",
  },

  sellerDiv: {
    position: "absolute",
    left: "15px",
    bottom: "90px",
    zIndex: "900",
  },

  sellerAvatar: {
    verticalAlign: "middle",
    marginRight: "0.3rem",
  },

  sellerNameText: {
    verticalAlign: "middle",
    color: "#fff",
    fontSize: "12px",
    textShadow: "1px 1px 7px #000000",
  },

  productImg: {
    padding: "8px 8px 3px 8px",
    borderRadius: "18px",
    height: "155px",
    // width:"100%"
  },

  spinner: {
    margin: "20px 0",
    marginBottom: "20px",
    padding: "30px 50px",
    textAlign: "center",
    background: "transparent",
    borderRadius: "4px",
  },

  modalHeadLabel: {
    display: "block",
    color: "#696969",
  },

  modalBodyLabel: {
    display: "block",
    color: "#262626",
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

const ProductList = ({
  collectionId,
  collectionName,
  description,
  filterObj,
  filterToDisplay,
  productsToDisplay,
  showCheckbox,
  productChecked,
  editCollection,
}) => {
  const [deSelectedProducts, setDeSelectedProducts] = useState([]);

  const dispatch = useDispatch();

  //? Retrieve Data from Store
  const { loading, hasMoreProducts, productListLoader, collectionSummaryModal, productCount } =
    useSelector((state) => state.allCollections);

  const handleScollNext = () => {
    if (editCollection) {
      dispatch(fetchCollectionById({ collectionId }));
    } else {
      dispatch(fetchProducts());
    }
  };

  const handleCheckedProducts = (e) => {
    const product = e.target.value;

    const productAvailable = deSelectedProducts.findIndex((val) => val === product);

    if (productAvailable > -1) {
      deSelectedProducts.splice(productAvailable, 1);
      setDeSelectedProducts(deSelectedProducts);
    } else {
      deSelectedProducts.push(product);
      setDeSelectedProducts(deSelectedProducts);
    }
  };

  const handleCancelModal = () => {
    dispatch(toggleCollectionSummaryModal({ modal: false }));
  };

  const handleCreateCollection = () => {
    const collectionToCreate = {
      collectionName,
      description,
      removeProducts: deSelectedProducts,
      filter: filterObj,
      collectionFilter: filterToDisplay,
    };
    console.log(
      "🚀 ~ file: CreateCollection.js ~ line 101 ~ handleCreateCollection ~ collectionToCreate",
      collectionToCreate
    );

    dispatch(addCollection(collectionToCreate));
  };

  const handleEditCollection = () => {
    const collectionToEdit = {
      collectionId: Number(collectionId),
      removeProducts: deSelectedProducts,
    };
    console.log(
      "🚀 ~ file: ProductList.js ~ line 190 ~ handleEditCollection ~ collectionToEdit",
      collectionToEdit
    );

    dispatch(editCollectionThunk(collectionToEdit));
  };

  return (
    <>
      <Content style={{ margin: "1rem 2rem" }}>
        <InfiniteScroll
          dataLength={productsToDisplay.length}
          next={handleScollNext}
          hasMore={hasMoreProducts}
        >
          <Row gutter={[16, 16]}>
            {productsToDisplay.map((val) => (
              <Col style={{ position: "relative" }}>
                {showCheckbox && (
                  <Checkbox
                    style={productListStyles.imgCheckbox}
                    defaultChecked={productChecked}
                    value={val.productId}
                    onChange={handleCheckedProducts}
                  />
                )}

                <Card
                  hoverable
                  style={{ width: 150 }}
                  cover={
                    <Image
                      style={productListStyles.productImg}
                      src={val.images.thumbImages[0]}
                    />
                  }
                >
                  <div style={productListStyles.sellerDiv}>
                    <Avatar
                      src={<Image src={val.sellerDetails.profilePic} />}
                      style={productListStyles.sellerAvatar}
                      size="small"
                    />
                    <Tooltip placement="top" title={val.sellerDetails.name}>
                      <Text style={productListStyles.sellerNameText} strong>
                        {val.sellerDetails.name.length > 7
                          ? val.sellerDetails.name.substring(0, 7) + "...."
                          : val.sellerDetails.name}
                      </Text>
                    </Tooltip>
                  </div>
                  <div
                    style={{
                      marginTop: "-1.5rem",
                      marginBottom: "-1rem",
                      marginLeft: "-1rem",
                    }}
                  >
                    <Row>
                      <Col span={8}>
                        <Text
                          style={{
                            color: "#c9252d",
                            fontSize: "11px",
                            marginRight: "2px",
                          }}
                          strong
                        >
                          ₹{val.details.variants[0].priceDetails.listedPrice}
                        </Text>
                      </Col>
                      <Col span={8}>
                        <Text
                          disabled
                          delete
                          strong
                          style={{ fontSize: "11px", marginRight: "2px" }}
                        >
                          ₹{val.details.variants[0].priceDetails.labelPrice}
                        </Text>
                      </Col>
                      <Col span={8}>
                        <Text
                          strong
                          style={{
                            backgroundColor: "#9EDEC6",
                            color: "#267055",
                            padding: "1px 4px",
                            fontSize: "8px",
                            borderRadius: "4px",
                          }}
                        >
                          {val.details.variants[0].priceDetails.percentOff}% off
                        </Text>
                      </Col>
                    </Row>
                    <Tooltip placement="bottom" title={val.details.title}>
                      <Text style={{ display: "block" }}>
                        {" "}
                        {val.details.title.length > 12
                          ? val.details.title.substring(0, 12) + "...."
                          : val.details.title}
                      </Text>
                    </Tooltip>
                    <div>
                      <Tag>
                        ProductId:<Text strong> {val.productId}</Text>
                      </Tag>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </InfiniteScroll>

        {loading && hasMoreProducts && !editCollection && (
          <div style={productListStyles.spinner}>
            <Spin spinning={loading} size="large" tip="Loading Products" />
          </div>
        )}

        {loading && editCollection && (
          <div style={productListStyles.spinner}>
            <Spin spinning={loading} size="large" tip="Loading Products" />
          </div>
        )}

        <BackTop
          visibilityHeight={300}
          style={{
            marginBottom: "2rem",
            height: 40,
            width: 40,
          }}
        />

        <div>{productsToDisplay.length === 0 && <Title>No Products Available</Title>}</div>

        {/* Collection Summary Modal */}
        <Modal
          title={
            editCollection ? (
              <Title level={4} style={{ marginBottom: "-5px", fontWeight: "500" }}>
                Edit Collection
              </Title>
            ) : (
              <Title level={4} style={{ marginBottom: "-5px", fontWeight: "500" }}>
                Create Collection
              </Title>
            )
          }
          visible={collectionSummaryModal}
          okText="ADD"
          centered
          confirmLoading={loading}
          onCancel={handleCancelModal}
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
                    <Text strong style={productListStyles.modalHeadLabel}>
                      Collection Name :
                    </Text>
                    <Text>{collectionName}</Text>
                  </Col>
                  <Col span={6}>
                    <Text strong style={productListStyles.modalHeadLabel}>
                      Description :
                    </Text>
                    <Text>{description}</Text>
                  </Col>
                  <Col span={6}>
                    <Text strong style={productListStyles.modalHeadLabel}>
                      No Of Products :
                    </Text>
                    <Text>{productCount}</Text>
                  </Col>
                  <Col span={6}>
                    <Text strong style={productListStyles.modalHeadLabel}>
                      Products To be Removed :
                    </Text>
                    <Text>{deSelectedProducts.length}</Text>
                  </Col>
                </Row>
              </div>
            </div>
          </div>

          {filterToDisplay?.categories && (
            <Row style={{ marginTop: "1rem" }}>
              <Col span={23}>
                <Text strong style={productListStyles.modalBodyLabel}>
                  Categories :
                </Text>
                {filterToDisplay?.categories.map((val) => (
                  <Tag>{val.split(":")[0]}</Tag>
                ))}
              </Col>
            </Row>
          )}

          {filterToDisplay?.colors && (
            <Row style={{ marginTop: "1rem" }}>
              <Col span={24}>
                <Text strong style={productListStyles.modalBodyLabel}>
                  Colors :
                </Text>
                <Text>{filterToDisplay?.colors.toString()}</Text>
              </Col>
            </Row>
          )}

          {filterToDisplay?.conditions && (
            <Row style={{ marginTop: "1rem" }}>
              <Col span={24}>
                <Text strong style={productListStyles.modalBodyLabel}>
                  Conditions :
                </Text>
                <Text>{filterToDisplay?.conditions.toString()}</Text>
              </Col>
            </Row>
          )}

          {filterToDisplay?.price && filterToDisplay?.price.minPrice && (
            <Row style={{ marginTop: "1rem" }}>
              <Col span={24}>
                <Text strong style={productListStyles.modalBodyLabel}>
                  Price :
                </Text>
                <Text>
                  ₹{filterToDisplay?.price.minPrice} - ₹{filterToDisplay?.price.maxPrice}
                </Text>
              </Col>
            </Row>
          )}

          {filterToDisplay?.cities && (
            <Row style={{ marginTop: "1rem" }}>
              <Col span={24}>
                <Text strong style={productListStyles.modalBodyLabel}>
                  City :
                </Text>
                <Text>{filterToDisplay?.cities.toString()}</Text>
              </Col>
            </Row>
          )}

          {filterToDisplay?.sellers && (
            <Row style={{ marginTop: "1rem" }}>
              <Col span={23}>
                <Text strong style={productListStyles.modalBodyLabel}>
                  Seller Ids :
                </Text>
                {filterToDisplay?.sellers.map((val) => (
                  <Tag>{val}</Tag>
                ))}
              </Col>
            </Row>
          )}

          <Row>
            <Col offset={8}>
              {productListLoader && (
                <div style={{ zIndex: "3000px", textAlign: "center" }}>
                  <Spin
                    size="large"
                    spinning
                    tip={
                      !editCollection
                        ? "Please Wait Collection is Being Created ..."
                        : "Please Wait Collection is Being Edited ..."
                    }
                  ></Spin>
                </div>
              )}
            </Col>
          </Row>

          <Row>
            <Col offset={16}>
              <Button
                key="back"
                onClick={handleCancelModal}
                size="large"
                disabled={productListLoader}
                style={{ marginTop: "1.5rem", marginRight: "1.5rem" }}
              >
                Cancel
              </Button>
              {editCollection ? (
                <Button
                  key="submit"
                  loading={productListLoader}
                  type="primary"
                  size="large"
                  onClick={handleEditCollection}
                >
                  Edit Collection
                </Button>
              ) : (
                <Button
                  key="submit"
                  loading={productListLoader}
                  type="primary"
                  size="large"
                  onClick={handleCreateCollection}
                >
                  Create Collection
                </Button>
              )}
            </Col>
          </Row>
        </Modal>
      </Content>
    </>
  );
};

export default ProductList;
