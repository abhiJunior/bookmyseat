// Tab.jsx
import React from "react";
import { Tabs, theme } from "antd";
import StickyBox from "react-sticky-box";
import MovieTable from "./MovieTable";
import TheatreTable from "./TheatreTable";
import ShowTable from "./ShowTable";
const Tab = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const renderTabBar = (props, DefaultTabBar) => (
    <StickyBox offsetTop={64} offsetBottom={20} style={{ zIndex: 1 }}>
      <DefaultTabBar {...props} style={{ background: colorBgContainer }} />
    </StickyBox>
  );

  // ✅ Define your tabs manually
  const items = [
    {
      label: <span className="text-xl font-semibold font-gilroy">Movies</span>,
      key: "movies",
      children: <div><MovieTable/></div>,
    },
    {
      label: <span className="text-xl font-semibold font-gilroy">Theatres</span>,
      key: "theatre",
      children: <div><TheatreTable/></div>,
    },
    {
      label: <span className="text-xl font-semibold font-gilroy">Shows</span>,
      key: "shows",
      children: <div><ShowTable/></div>,
    },
  ];

  return <Tabs defaultActiveKey="movies"  renderTabBar={renderTabBar} items={items} />;
};

export default Tab;
