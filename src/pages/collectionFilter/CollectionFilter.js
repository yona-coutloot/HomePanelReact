import React, { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Breadcrumb,
  Tabs,
  TreeSelect,
  Form,
  Input,
  Tag,
  Tooltip,
  Radio,
  Space,
  Button,
  message,
  Affix,
} from "antd";
import { HomeFilled, UserOutlined, InfoCircleOutlined, KeyOutlined } from "@ant-design/icons";
import Sidebar from "../../components/sidebar/Sidebar";
import axios from "../../axios/axios";
import "./filter.css";
import { useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  addFilterDisplay,
  addFilterObj,
  clearCollectionData,
  fetchProducts,
} from "../../redux/slices/collectionSlice";
const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { SHOW_ALL, SHOW_PARENT } = TreeSelect;

const collectionFilterStyles = {
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
  filterDiv: {
    position: "relative",
  },
  filterCount: {
    position: "fixed",
    right: 25,
  },
  message: {
    marginTop: "10vh",
    fontSize: "1.2rem",
    fontWeight: "500",
  },
  btn: {
    width: "200px",
    height: "40px",
    margin: "0 auto",
    padding: "0",
    display: " inline-block",
    lineHeight: "40px",
    textAlign: "center",
    fontSize: "1.5rem",
  },
};

// ********* CATEGORY FILTER COMPONENT ********************* //

const CategoryComponent = ({ handleCategoryFilter }) => {
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
      console.log("🚀 ~ file: CollectionFilter.js ~ line 112 ~ categoryApi ~ error", error);
    }
  };

  useEffect(() => {
    categoryApi();
  }, []);

  const handleCategory = (value) => {
    setCategory(value);
    const categoriesToSend = value.map((val) => val.split(":")[1]);
    handleCategoryFilter(categoriesToSend.length, categoriesToSend, value);
  };

  const categoryProps = {
    size: "large",
    allowClear: true,
    showSearch: true,
    listHeight: 400,
    treeData,
    value: category,
    onChange: handleCategory,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Please select",
    style: {
      width: "93%",
    },
  };
  return (
    <div>
      <Title level={4}>Please Select Categories : </Title>
      <TreeSelect {...categoryProps} />
    </div>
  );
};

// ****************** COLOR FILTER COMPONENT ********************** //

const ColorComponent = ({ handleColorFilter }) => {
  const [colorSelected, setColorSelected] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const history = useHistory();

  //? Fetch Colors for Filter Color Component
  const colorApi = async () => {
    try {
      const { data } = await axios.get("/miscellaneous/appColors", {});

      const colors = [];

      for (const val in data.data) {
        const treeObj = {
          title: "",
          key: "",
          value: "",
        };

        treeObj.title = val;
        treeObj.key = val;
        treeObj.value = data.data[val].toString();

        colors.push(treeObj);
      }

      setTreeData(colors);
    } catch (error) {
      history.push("/collections");
    }
  };

  const handleColor = (value, label) => {
    setColorSelected(value);
    const colorsList = [];
    for (const list of value) {
      colorsList.push(...list.split(","));
    }
    const colorsToSend = [...new Set(colorsList)];

    handleColorFilter(label.length, colorsToSend, label);
  };

  const colorProps = {
    size: "large",
    allowClear: true,
    showSearch: true,
    listHeight: 400,
    treeData,
    value: colorSelected,
    onChange: handleColor,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Please select Color",
    style: {
      width: "93%",
    },
  };

  useEffect(() => {
    colorApi();
  }, []);

  return (
    <div>
      <Title level={4}>Please Select Colors : </Title>
      <TreeSelect {...colorProps} />
    </div>
  );
};

// ***************** CONDITION FILTER SECTION *********************** //

const ConditionComponent = ({ handleConditionFilter }) => {
  const [condition, setCondition] = useState("New with tag");
  const conditions = ["New with tag", "New without Tag", "Hardly used", "Gently used"];

  const handleCondition = (e) => {
    const productCondition = e.target.value;
    setCondition(productCondition);
    handleConditionFilter(1, [productCondition]);
  };
  return (
    <>
      <Title level={4}>Select Condition : </Title>
      <Radio.Group onChange={handleCondition} value={condition} size="large">
        <Space direction="vertical">
          {conditions.map((val, i) => (
            <Radio value={val} key={i} style={{ fontSize: "1.5rem" }}>
              {val}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </>
  );
};

// ***************** PRICE FILTER SECTION *********************** //

const PriceComponent = ({ handlePriceFilter }) => {
  const [maxPrice, setMaxPrice] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const [formRef] = Form.useForm(); //? Use Form Hook to operate with the form elements.

  const handleMinPrice = (event) => {
    setMinPrice(Number(event.target.value));
  };

  const handleMaxPrice = (event) => {
    setMaxPrice(Number(event.target.value));
  };

  const resetFields = () => {
    formRef.resetFields();
    handlePriceFilter(0, JSON.stringify({}));
  };

  const handleEdit = () => {
    setDisabled(!disabled);
    handlePriceFilter(0, JSON.stringify({}));
  };

  const handlePrice = () => {
    const priceSelected = {
      minPrice,
      maxPrice,
    };
    setDisabled(!disabled);

    handlePriceFilter(1, JSON.stringify(priceSelected));
  };
  return (
    <>
      <Title level={4}>Select Price Range : </Title>
      <Form
        layout="vertical"
        form={formRef}
        requiredMark={false}
        onFinish={handlePrice}
        style={{ marginTop: "2rem" }}
      >
        <Row gutter={20}>
          <Col>
            <Form.Item
              label={<Title level={5}>Minimum Price :</Title>}
              name="minPrice"
              rules={[
                {
                  required: true,
                  message: "Mininum Price is Required",
                },
                {
                  pattern: /^(?:\d*)$/,
                  message: "Price should contain just numbers",
                },
                {
                  pattern: /[1-9]\d{1,}/,
                  message: "Price should be more than 10",
                },
              ]}
            >
              <Input
                placeholder="Enter Minimum Price"
                value={minPrice}
                disabled={disabled}
                onChange={handleMinPrice}
              />
            </Form.Item>
          </Col>
          <Col offset={1}>
            <Form.Item
              label={<Title level={5}>Maximum Price :</Title>}
              name="description"
              rules={[
                {
                  required: true,
                  message: "Maximum Price is Required",
                },
                {
                  pattern: /^(?:\d*)$/,
                  message: "Price should contain just numbers",
                },

                {
                  pattern: /[1-9]\d{1,}/,
                  message: "Price should be more than 10",
                },
              ]}
            >
              <Input
                placeholder="Enter Maximum Price"
                value={maxPrice}
                disabled={disabled}
                onChange={handleMaxPrice}
              />
            </Form.Item>
          </Col>
          {!disabled ? (
            <Col>
              <Form.Item
                wrapperCol={{
                  offset: 15,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Add
                </Button>
              </Form.Item>
            </Col>
          ) : (
            <Col offset={1}>
              <Button type="primary" onClick={handleEdit}>
                Edit
              </Button>
            </Col>
          )}

          <Col offset={1}>
            <Button type="secondary" onClick={resetFields}>
              Reset
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

// ***************** SELLERID FILTER COMPONENT *********************** //

const SellerIdComponent = ({ handleSellerIdFilter }) => {
  //? Variables for SellerId Filter
  const [tags, setTags] = useState([]);
  const [sellerIdText, setSellerIdText] = useState("");

  const [seller, setSeller] = useState("");
  const history = useHistory();

  const handleSellerId = async (value) => {
    const sellerInfo = []; //? When data is fetched add to this array
    for (const val of value) {
      if (val === ";") {
        try {
          const { data } = await axios.get("/collection/fetchSellerInfo", {
            params: {
              sellerId: Number(seller),
            },
          });

          if (data.success === 1) {
            sellerInfo.push(data.data);
            setTags(tags.concat(sellerInfo));
          }
        } catch (error) {
          if (error.success === 0 && error.loggedIn === 0) {
            history.push("/");
          }

          if (error.success === 0) {
            const errorObj = [
              {
                sellerId: Number(seller),
                sellerName: "Not Found",
                productCount: "Not Found",
              },
            ];

            setTags(tags.concat(errorObj));
          }
        }
        setSeller("");
      } else {
        const joinSellerId = seller + val;
        setSeller(joinSellerId);
      }
    }

    setSellerIdText(value.replace(";", "/"));

    //? Read SellerIds from the Input seperated from "/", and then replace each tag because they
    //? created with ";"
    const sellers = value.split("/").map((tag) => Number(tag.replace(";", "")));

    handleSellerIdFilter(sellers.length, sellers);
  };

  const ExtraInfo = () => {
    const info = "Enter sellerIds Seperated by ; (Semicolon)";
    return (
      <Tooltip title={info} placement="topLeft">
        <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
      </Tooltip>
    );
  };

  const handleClosingTags = (e, sellerId) => {
    const newText = tags.filter((key) => key.sellerId !== Number(sellerId));
    setTags(newText);
    setSellerIdText(newText.map((key) => key.sellerId).join("/"));
    const sellerIds = newText.map((tag) => Number(tag.sellerId));
    handleSellerIdFilter(newText.length, sellerIds);
  };

  const resetAll = () => {
    setTags([]);
    setSellerIdText("");
    setSeller("");
    handleSellerIdFilter(0, [], []);
  };

  const sellerInputProps = {
    size: "large",
    placeholder: "Enter Seller Ids",
    value: sellerIdText,
    // allowClear: true,
    prefix: <UserOutlined />,
    suffix: <ExtraInfo />,
    style: { width: "93%" },
  };

  return (
    <>
      <Row>
        <Col span={6}>
          <Title level={4}>Enter SellerIds : </Title>
        </Col>
        <Col offset={14}>
          <Button type="primary" onClick={resetAll}>
            Reset
          </Button>
        </Col>
      </Row>

      <Input {...sellerInputProps} onChange={(e) => handleSellerId(e.target.value)} />
      <div style={{ marginTop: "1rem" }}>
        {tags.map((tag) => {
          return (
            <Tag
              key={tag.sellerId}
              closable
              onClose={(e) => handleClosingTags(e, tag.sellerId)}
              style={{ padding: "8px 8px", marginTop: "0.7rem" }}
            >
              <Text style={{ display: "block", fontSize: "13px" }}>
                <strong>SellerId: </strong>
                {tag.sellerId}{" "}
              </Text>
              <Text style={{ display: "block", fontSize: "13px" }}>
                <strong>SellerName:</strong> {tag.sellerName}
              </Text>
              <Text style={{ display: "block", fontSize: "13px" }}>
                <strong>Product Count:</strong> {tag.productCount}
              </Text>
            </Tag>
          );
        })}
      </div>
    </>
  );
};

// ***************** CITY FILTER COMPONENT *********************** //

const CityComponent = ({ handleCityFilter }) => {
  //? variables for City Filter
  const [cityList, setCityList] = useState([]);
  const [cities, setCities] = useState([]);
  const history = useHistory();

  const handleCity = (value) => {
    setCities(value);
    handleCityFilter(value.length, value);
  };

  //? Fetch Cities for Filter City Component
  const cityApi = async () => {
    try {
      const { data } = await axios.get("/miscellaneous/appCities", {});

      const cityTree = [];

      for (const val in data.data) {
        const stateObj = {
          title: "",
          key: "",
          value: "",
          children: [],
        };
        stateObj.title = val;
        stateObj.key = val;
        stateObj.value = val;

        stateObj.children = data.data[val].map((city, index) => {
          return { title: city, key: city + index, value: city };
        });

        cityTree.push(stateObj);
      }

      setCityList(cityTree);
    } catch (error) {
      history.push("/collections");
      console.log("🚀 ~ file: CollectionFilter.js ~ line 164 ~ cityApi ~ error", error);
    }
  };

  useEffect(() => {
    cityApi();
  }, []);

  const cityProps = {
    size: "large",
    allowClear: true,
    showSearch: true,
    listHeight: 400,
    treeData: cityList,
    value: cities,
    onChange: handleCity,
    treeCheckable: true,
    showCheckedStrategy: SHOW_ALL,
    placeholder: "Please select",
    style: {
      width: "93%",
    },
  };
  return (
    <div>
      <Title level={4}>Please Select Cities : </Title>
      <TreeSelect {...cityProps} />
    </div>
  );
};

// ***************** CUSTOM-KEYWORD FILTER COMPONENT *********************** //

const CustomKeywordComponet = ({ handleCustomKeywordFilter }) => {
  //? Variables for SellerId Filter
  const [Keywords, setKeywords] = useState([]);
  const [customText, setCustomText] = useState("");

  const handleCustomKeyword = (value) => {
    const keywordTag = value.trim().split(";");
    setKeywords(keywordTag);
    setCustomText(value);
    handleCustomKeywordFilter(keywordTag.length);
  };

  const ExtraInfo = () => {
    const info = "Enter keywords Seperated by ; (Semicolon)";
    return (
      <Tooltip title={info} placement="topLeft">
        <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
      </Tooltip>
    );
  };

  const customKeyProps = {
    size: "large",
    placeholder: "Enter Custom Keyword",
    value: customText,
    allowClear: true,
    prefix: <KeyOutlined />,
    suffix: <ExtraInfo />,
    style: { width: "92%" },
  };

  const handleClosingTags = (e, keyword) => {
    const newText = Keywords.filter((key) => key !== keyword);
    setKeywords(newText);
    setCustomText(newText.join(";"));
    handleCustomKeywordFilter(newText.length);
  };

  return (
    <>
      <Title level={4}>Enter Keywords : </Title>
      <Input {...customKeyProps} onChange={(e) => handleCustomKeyword(e.target.value)} />
      <div style={{ marginTop: "1rem" }}>
        {Keywords.map((keyWord) => {
          return (
            <Tag
              key={keyWord}
              closable
              onClose={(e) => handleClosingTags(e, keyWord)}
              style={{ padding: "8px 8px", marginTop: "0.7rem" }}
            >
              <span> {keyWord}</span>
            </Tag>
          );
        })}
      </div>
    </>
  );
};

// const requestProduct = { pageNo: 0 }; //? CREATING THE REQUEST BODY FOR PRODUCTS

const CollectionFilter = () => {
  //? Retrieve Data from Store
  const { collectionName } = useSelector((state) => state.allCollections);

  //? Declaring states for various operations
  const [categoryCount, setCategoryCount] = useState(0);
  const [colorCount, setColorCount] = useState(0);
  const [conditionCount, setConditionCount] = useState(0);
  const [priceCount, setPriceCount] = useState(0);
  const [sellerIdCount, setSellerIdCount] = useState(0);
  const [cityCount, setCityCount] = useState(0);
  const [customCount, setCustomCount] = useState(0);

  const [requestProduct, setRequestProduct] = useState({ pageNo: 0 });
  const [filterDisplay, setFilterDisplay] = useState({});

  const history = useHistory();
  const dispatch = useDispatch();

  if (!collectionName) history.push("/collections");

  useEffect(() => {
    dispatch(clearCollectionData({ type: "CLEAR_PRODUCTS" }));
  }, [dispatch]);

  //? CHANGE CATEGORY COUNT IN FILTER SIDEBAR
  const handleCategoryFilter = (count, categories, categoryInfo) => {
    //! Check categories because the function gets triggered everytime there's a change.

    if (categories.length !== 0) {
      //** When selecting category, add it in the state as well
      setRequestProduct({ ...requestProduct, categoryId: categories });
      setFilterDisplay({ ...filterDisplay, categories: categoryInfo });
    } else {
      //! When deselecting category remove it from state as well.
      delete requestProduct["categoryId"];
      delete filterDisplay["categories"];
      setRequestProduct(requestProduct);
      setFilterDisplay(filterDisplay);
    }
    setCategoryCount(count);
  };

  //? CHANGE COLORS COUNT IN FILTER SIDEBAR
  const handleColorFilter = (count, colors, colorInfo) => {
    //! Check colors because the function gets triggered everytime there's a change.

    if (colors.length !== 0) {
      //** When selecting color, add it in the state as well
      setRequestProduct({ ...requestProduct, color: colors });
      setFilterDisplay({ ...filterDisplay, colors: colorInfo });
    } else {
      //! When deselecting color remove it from state as well.
      delete requestProduct["color"];
      delete filterDisplay["colors"];
      setRequestProduct(requestProduct);
      setFilterDisplay(filterDisplay);
    }
    setColorCount(count);
  };

  //? CHANGE CONDITION COUNT IN FILTER SIDEBAR
  const handleConditionFilter = (count, conditions) => {
    //! Checking condition because the function gets triggered everytime there's a change.

    if (conditions.length !== 0) {
      //** When selecting condition, add it in the state as well
      setRequestProduct({ ...requestProduct, condition: conditions });
      setFilterDisplay({ ...filterDisplay, conditions });
    } else {
      //! When deselecting condition remove it from state as well.
      delete requestProduct["condition"];
      delete filterDisplay["conditions"];

      setRequestProduct(requestProduct);
      setFilterDisplay(filterDisplay);
    }
    setConditionCount(count);
  };

  //? CHANGE PRICE COUNT IN FILTER SIDEBAR
  const handlePriceFilter = (count, price) => {
    const productPrice = Object.keys(JSON.parse(price)).length;

    if (productPrice !== 0) {
      //** When selecting price, add it in the state as well
      setRequestProduct({ ...requestProduct, price: JSON.parse(price) });
      setFilterDisplay({ ...filterDisplay, price: JSON.parse(price) });
    } else {
      //! When deselecting price remove it from state as well.
      delete requestProduct["price"];
      delete filterDisplay["price"];

      setRequestProduct(requestProduct);
      setFilterDisplay(filterDisplay);
    }
    setPriceCount(count);
  };

  //? CHANGE SELLER ID COUNT IN FILTER SIDEBAR
  const handleSellerIdFilter = (count, sellerIds) => {
    if (sellerIds.length !== 0) {
      //** When selecting sellerId, add it in the state as well
      setRequestProduct({ ...requestProduct, sellerId: sellerIds });
      setFilterDisplay({ ...filterDisplay, sellers: sellerIds });
    } else {
      //! When deselecting sellerId remove it from state as well.
      delete requestProduct["sellerId"];
      delete filterDisplay["sellers"];
      setRequestProduct(requestProduct);
      setFilterDisplay(filterDisplay);
    }

    setSellerIdCount(count);
  };

  //? CHANGE COLORS COUNT IN FILTER SIDEBAR
  const handleCityFilter = (count, cities) => {
    if (cities.length !== 0) {
      //** When selecting city, add it in the state as well
      setRequestProduct({ ...requestProduct, city: cities });
      setFilterDisplay({ ...filterDisplay, cities });
    } else {
      //! When deselecting city remove it from state as well.
      delete requestProduct["city"];
      delete requestProduct["cities"];

      setRequestProduct(requestProduct);
      setFilterDisplay(filterDisplay);
    }

    setCityCount(count);
  };

  //? CHANGE COLORS COUNT IN FILTER SIDEBAR
  const handleCustomKeywordFilter = (count) => setCustomCount(count);

  const filterTabs = [
    {
      key: "category",
      tab: "Category",
      count: categoryCount,
      component: <CategoryComponent handleCategoryFilter={handleCategoryFilter} />,
    },
    {
      key: "color",
      tab: "Color",
      count: colorCount,
      component: <ColorComponent handleColorFilter={handleColorFilter} />,
    },
    {
      key: "condition",
      tab: "Condition",
      count: conditionCount,
      component: <ConditionComponent handleConditionFilter={handleConditionFilter} />,
    },
    {
      key: "price",
      tab: "Price",
      count: priceCount,
      component: <PriceComponent handlePriceFilter={handlePriceFilter} />,
    },
    {
      key: "sellerId",
      tab: "Seller Id",
      count: sellerIdCount,
      component: <SellerIdComponent handleSellerIdFilter={handleSellerIdFilter} />,
    },
    {
      key: "city",
      tab: "City",
      count: cityCount,
      component: <CityComponent handleCityFilter={handleCityFilter} />,
    },
    {
      key: "custom",
      tab: "Custom Keyword",
      count: customCount,
      disabled: true,
      component: (
        <CustomKeywordComponet handleCustomKeywordFilter={handleCustomKeywordFilter} />
      ),
    },
  ];

  //? DISPATCH Apply Filter ACTION
  const handleApply = () => {
    //? Atleast one filter should be present excluding the pageNo
    if (Object.keys(requestProduct).length <= 1) {
      return message.error({
        content: "Select Atleast One Filter",
        style: collectionFilterStyles.message,
      });
    }
    console.log("=== PRODUCTS REQUEST ===", requestProduct);
    console.log("=== DISPLAY FILTER ===", filterDisplay);

    dispatch(
      addFilterObj({
        requestProduct,
      })
    );
    dispatch(addFilterDisplay({ filterDisplay }));

    // dispatch(fetchProducts({ pageNo: 0 }));
    dispatch(fetchProducts());

    history.push("/collections/filters/createCollection");
  };

  return (
    <>
      <Sidebar trigger="collections" />
      <Layout className="site-layout">
        <Header style={collectionFilterStyles.header}>
          <Row>
            <Col span={10}>
              <Title level={2} style={collectionFilterStyles.title}>
                {collectionName}
                <Breadcrumb style={collectionFilterStyles.breadcrumb}>
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
          </Row>
        </Header>
        <Content style={{ margin: "1rem 1rem", background: "#fff" }}>
          <Title level={2} style={{ margin: "1rem 1rem" }}>
            Filter
          </Title>
          <Tabs defaultActiveKey="1" tabPosition="left" size="large">
            {filterTabs.map((value) => (
              <TabPane
                disabled={value.disabled}
                tab={
                  <div style={collectionFilterStyles.filterDiv}>
                    <span style={{ marginRight: "2rem" }}>{value.tab}</span>
                    <span style={collectionFilterStyles.filterCount}>{value.count}</span>
                  </div>
                }
                key={value.key}
              >
                {value.component}
              </TabPane>
            ))}
          </Tabs>
          <div style={{ float: "right", marginRight: "1rem" }}>
            <Affix offsetBottom={20}>
              <Button type="primary" style={collectionFilterStyles.btn} onClick={handleApply}>
                Apply
              </Button>
            </Affix>
          </div>
        </Content>
      </Layout>
    </>
  );
};

export default CollectionFilter;
