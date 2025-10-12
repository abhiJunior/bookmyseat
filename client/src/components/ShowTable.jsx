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
  Image,
} from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const ShowTable = () => {
  const url = "https://bookmyseat-backend.onrender.com";
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingShowId, setEditingShowId] = useState(null);
  const [form] = Form.useForm();

  // AntD message hook
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch shows
  const fetchShows = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${url}/api/show/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ use Bearer token from localStorage
        },
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

  // Fetch movies
  const fetchMovies = async () => {

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${url}/api/movie/list`, {
        method: "GET",
        headers:{
            Authorization : `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        credentials: "include",
      });
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      messageApi.error("Failed to load movies ❌");
    }
  };

  // Fetch theatres
  const fetchTheatres = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${url}/api/theatre`, {
        method: "GET",
        headers:{
            Authorization : `Bearer ${token}`,
            "Content-Type": "application/json"
          },
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

  // Open modal & fetch movies & theatres
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

  // Table columns
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

  // Delete Show
  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken")
    try {
      const response = await fetch(`${url}/api/show/${id}`, {
        method: "DELETE",
        headers:{
          Authorization : `Bearer ${token}`,
          "Content-Type": "application/json"
          
        },
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

  // Form submit handler
  const handleFinish = async (values) => {
    const token = localStorage.getItem("authToken")
    try {
      const payload = {
        ...values,
        time: values.time.toISOString(),
      };

      const urlEndpoint = editing
        ? `${url}/api/show/${editingShowId}`
        : `${url}/api/show`;

      const method = editing ? "PUT" : "POST";

      const response = await fetch(urlEndpoint, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization : `Bearer ${token}`,

        },
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
      {contextHolder}

      {/* Add Show Button */}
      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={() => openModal()}>
          + Add Show
        </Button>
      </div>

      {/* Mobile Card view */}
      <div className="grid grid-cols-1 gap-4 p-2 md:hidden">
        {shows.map((show) => (
          <div
            key={show._id}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <div className="font-semibold text-lg mb-2">
              {show.movie?.title || "No Title"}
            </div>
            <div className="mb-1">
              <strong>Theatre:</strong> {show.theatre?.name} (
              {show.theatre?.location})
            </div>
            <div className="mb-1">
              <strong>Time:</strong> {dayjs(show.time).format("YYYY-MM-DD HH:mm")}
            </div>
            <div className="mb-1">
              <strong>Language:</strong> {show.language}
            </div>
            <div className="mb-1">
              <strong>Total Seats:</strong> {show.totalseats}
            </div>
            <div className="mb-3">
              <strong>Available Seats:</strong> {show.availableseats}
            </div>
            <Space>
              <Button type="primary" onClick={() => openModal(show)}>
                Update
              </Button>
              <Button danger onClick={() => handleDelete(show._id)}>
                Delete
              </Button>
            </Space>
          </div>
        ))}
      </div>

      {/* Desktop & Tablet Table view */}
      <div className="hidden md:block">
        <Table
          columns={columns}
          dataSource={shows}
          bordered
          scroll={{ x: "max-content" }}
          pagination={{ pageSize: 10 }}
        />
      </div>

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
          <Form.Item label="Movie" name="movie" rules={[{ required: true }]}>
            <Select placeholder="Select a movie">
              {movies.map((movie) => (
                <Option key={movie._id} value={movie._id}>
                  {movie.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Theatre" name="theatre" rules={[{ required: true }]}>
            <Select placeholder="Select a theatre">
              {theatres.map((theatre) => (
                <Option key={theatre._id} value={theatre._id}>
                  {theatre.name} ({theatre.location})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Time" name="time" rules={[{ required: true }]}>
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Language" name="language" rules={[{ required: true }]}>
            <Select>
              <Option value="English">English</Option>
              <Option value="Hindi">Hindi</Option>
              <Option value="Tamil">Tamil</Option>
            </Select>
          </Form.Item>

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
