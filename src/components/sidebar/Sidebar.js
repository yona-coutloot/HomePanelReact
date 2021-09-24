import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { FileOutlined, HomeOutlined, AppstoreAddOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import "./sidebar.css";

const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar = ({ trigger }) => {
  const [collapse, setCollapse] = useState(false);
  const history = useHistory();

  return (
    <Sider collapsible collapsed={collapse} onCollapse={() => setCollapse(!collapse)}>
      <div className="logo" />
      <Menu theme="dark" defaultSelectedKeys={[trigger]} mode="inline">
      
        {/* <SubMenu key="sub1" icon={<HomeOutlined />} title="Template">
          <Menu.Item key="allTemplates" onClick={() => history.push("/allTemplates")}>
            All Templates
          </Menu.Item>
          <Menu.Item key="2">Gloabal View</Menu.Item>
          <Menu.Item key="3">Schedule View History</Menu.Item>
        </SubMenu> */}

        <SubMenu key="sub2" icon={<FileOutlined />} title="Deals">
          <Menu.Item key="deals" onClick={() => history.push("/deals")}>
            Deals
          </Menu.Item>
        </SubMenu>

        <Menu.Item
          key="collections"
          icon={<AppstoreAddOutlined />}
          onClick={() => history.push("/collections")}
        >
          Collections
        </Menu.Item>
        {/* <SubMenu key="sub4" icon={<FileOutlined />} title="Collection">
          
          <Menu.Item key="6">Team 2</Menu.Item>
        </SubMenu> */}

        <SubMenu key="sub3" icon={<FileOutlined />} title="Flash Sale">
          <Menu.Item key="7">Team 1</Menu.Item>
          <Menu.Item key="8">Team 2</Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
