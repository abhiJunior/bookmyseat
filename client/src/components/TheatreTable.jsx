import React, { useEffect, useState } from "react";
import { Table, Space, Button, Modal, Form, Input, message } from "antd";

const TheatreTable = () => {
  const url = "https://bookmyseat-backend.onrender.com";
  const [theatre, setTheatre] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editingTheatreId, setEditingTheatreId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // AntD message hook
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch theatres
  const fetchTheatre = async () => {
    try {
      const response = await fetch(`${url}/api/theatre`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch theatre");
      const data = await response.json();
      setTheatre(data.map((t, idx) => ({ ...t, key: idx })));
    } catch (error) {
      console.error("Error fetching theatres:", error);
      messageApi.error("Failed to load theatres ❌");
    }
  };

  useEffect(() => {
    fetchTheatre();
  }, []);

  // Table Columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Phone No.",
      dataIndex: "phone",
      key: "phone",
      render: (text) => <span className="font-light">{text}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Update
          </Button>
          <Button danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Open modal for edit
  const handleEdit = (theatre) => {
    setEditing(true);
    setEditingTheatreId(theatre._id);
    form.setFieldsValue(theatre);
    setIsModalVisible(true);
  };

  // Delete theatre
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${url}/api/theatre/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setTheatre((prev) => prev.filter((t) => t._id !== id));
        messageApi.success("Theatre deleted successfully ✅");
      } else {
        messageApi.error("Failed to delete theatre ❌");
      }
    } catch (error) {
      console.error("Error deleting theatre:", error);
      messageApi.error("Error deleting theatre ❌");
    }
  };

  // Add / Update theatre
  const handleSubmit = async (values) => {
    try {
      let urlEndpoint = `${url}/api/theatre/`;
      let method = "POST";

      if (editing) {
        urlEndpoint += editingTheatreId;
        method = "PUT";
      }

      const response = await fetch(urlEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });

      if (response.ok) {
        messageApi.success(editing ? "Theatre updated ✅" : "Theatre added ✅");
        setIsModalVisible(false);
        form.resetFields();
        setEditing(false);
        setEditingTheatreId(null);
        fetchTheatre();
      } else {
        messageApi.error("Failed to save theatre ❌");
      }
    } catch (error) {
      console.error("Error saving theatre:", error);
      messageApi.error("Error saving theatre ❌");
    }
  };

  return (
    <div>
      {contextHolder}

      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          onClick={() => {
            setEditing(false);
            setEditingTheatreId(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          + Add Theatre
        </Button>
      </div>

      {/* Add horizontal scroll for table on small screens */}
      <Table
        columns={columns}
        dataSource={theatre}
        bordered
        scroll={{ x: "max-content" }} // enable horizontal scroll for responsiveness
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editing ? "Update Theatre" : "Add New Theatre"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditing(false);
          setEditingTheatreId(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: "Location is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone No."
            name="phone"
            rules={[{ required: true, message: "Phone number is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editing ? "Update Theatre" : "Add Theatre"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TheatreTable;
