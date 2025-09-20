import React, { useEffect, useState } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
} from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const ShowTable = () => {
  const url = "https://bookmyseat-backend.onrender.com"
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingShowId, setEditingShowId] = useState(null);
  const [form] = Form.useForm();

  // ✅ AntD message hook
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch Shows
  const fetchShows = async () => {
    try {
      const response = await fetch(`${url}/api/show/all`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch shows");

      const data = await response.json();
      setShows(data.map((show, idx) => ({ ...show, key: idx })));
    } catch (error) {
      console.error("Error fetching shows:", error);
      messageApi.error("Failed to load shows ❌");
    }
  };

  // Fetch Movies
  const fetchMovies = async () => {
    try {
      const response = await fetch(`${url}/api/movie/list`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      messageApi.error("Failed to load movies ❌");
    }
  };

  // Fetch Theatres
  const fetchTheatres = async () => {
    try {
      const response = await fetch(`${url}/api/theatre`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setTheatres(data);
    } catch (error) {
      console.error("Error fetching theatres:", error);
      messageApi.error("Failed to load theatres ❌");
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  // Open modal (fetch movies + theatres too)
  const openModal = (record = null) => {
    fetchMovies();
    fetchTheatres();

    if (record) {
      setEditing(true);
      setEditingShowId(record._id);
      form.setFieldsValue({
        movie: record.movie?._id,
        theatre: record.theatre?._id,
        time: dayjs(record.time),
        language: record.language,
        totalseats: record.totalseats,
      });
    } else {
      setEditing(false);
      setEditingShowId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Table Columns
  const columns = [
    {
      title: "Movie",
      dataIndex: ["movie", "title"],
      key: "movie",
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Theatre",
      dataIndex: ["theatre", "name"],
      key: "theatre",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (time) => dayjs(time).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
    },
    {
      title: "Total Seats",
      dataIndex: "totalseats",
      key: "totalseats",
    },
    {
      title: "Available Seats",
      dataIndex: "availableseats",
      key: "availableseats",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => openModal(record)}>
            Update
          </Button>
          <Button danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${url}/api/show/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setShows((prev) => prev.filter((show) => show._id !== id));
        messageApi.success("Show deleted successfully ✅");
      } else {
        messageApi.error("Failed to delete show ❌");
      }
    } catch (error) {
      console.error("Error deleting show:", error);
      messageApi.error("Error deleting show ❌");
    }
  };

  // Handle Form Submit
  const handleFinish = async (values) => {
    try {
      const payload = {
        ...values,
        time: values.time.toISOString(),
      };

      const url = editing
        ? `${url}/api/show/${editingShowId}`
        : `${url}/api/show`;

      const method = editing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        messageApi.success(editing ? "Show updated ✅" : "Show added ✅");
        setIsModalVisible(false);
        form.resetFields();
        setEditing(false);
        setEditingShowId(null);
        fetchShows();
      } else {
        messageApi.error("Failed to save show ❌");
      }
    } catch (error) {
      console.error("Error saving show:", error);
      messageApi.error("Something went wrong ❌");
    }
  };

  return (
    <div>
      {/* ✅ Message container */}
      {contextHolder}

      {/* Add Show Button */}
      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={() => openModal()}>
          + Add Show
        </Button>
      </div>

      <Table columns={columns} dataSource={shows} bordered />

      {/* Add/Update Show Modal */}
      <Modal
        title={editing ? "Update Show" : "Add New Show"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditing(false);
          setEditingShowId(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          {/* Movie Select */}
          <Form.Item label="Movie" name="movie" rules={[{ required: true }]}>
            <Select placeholder="Select a movie">
              {movies.map((movie) => (
                <Option key={movie._id} value={movie._id}>
                  {movie.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Theatre Select */}
          <Form.Item label="Theatre" name="theatre" rules={[{ required: true }]}>
            <Select placeholder="Select a theatre">
              {theatres.map((theatre) => (
                <Option key={theatre._id} value={theatre._id}>
                  {theatre.name} ({theatre.location})
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Time Picker */}
          <Form.Item label="Time" name="time" rules={[{ required: true }]}>
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          {/* Language */}
          <Form.Item label="Language" name="language" rules={[{ required: true }]}>
            <Select>
              <Option value="English">English</Option>
              <Option value="Hindi">Hindi</Option>
              <Option value="Tamil">Tamil</Option>
            </Select>
          </Form.Item>

          {/* Total Seats */}
          <Form.Item label="Total Seats" name="totalseats" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editing ? "Update Show" : "Add Show"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ShowTable;
