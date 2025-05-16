import React from "react";
import { Layout, Skeleton } from "antd";
import "./LayoutSkeleton.css";

const { Header, Sider, Content, Footer } = Layout;

const LayoutSkeleton = () => {
  return (
    <Layout style={{ minHeight: "100vh" }} className="skeleton-layout">
      <Header className="skeleton-header">
        <Skeleton.Input active style={{ width: 200, height: 32 }} />
      </Header>
      <Layout>
        <Sider width={200} className="skeleton-sider">
          <div style={{ padding: "20px" }}>
            {[...Array(5)].map((_, idx) => (
              <Skeleton.Input key={idx} style={{ margin: "16px 0", width: "100%" }} active />
            ))}
          </div>
        </Sider>
        <Layout style={{ padding: "24px" }}>
          <Content>
            <Skeleton active paragraph={{ rows: 6 }} />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            <Skeleton.Input active style={{ width: 300 }} />
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LayoutSkeleton;
