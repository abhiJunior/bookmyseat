import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const SpinComponent = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="flex flex-col items-center justify-center space-y-6">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 48, color: "#ef4444" }} spin />}
          size="large"
        />
        <p className="text-gray-300 text-lg font-semibold tracking-wide">
          Signing you in...
        </p>
      </div>
    </div>
  );
};

export default SpinComponent;
