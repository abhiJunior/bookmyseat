import React, { useEffect, useState } from "react";
import {
  Table,
  Space,
  Button,
  Image,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
} from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const MovieTable = () => {
  const url = "https://bookmyseat-backend.onrender.com";
  const [movies, setMovies] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // AntD message hook
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch movies from backend
  const fetchMovies = async () => {
    try {
      const response = await fetch(`${url}/api/movie/list`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      setMovies(data.map((movie, idx) => ({ ...movie, key: idx })));
    } catch (error) {
      console.error("Error fetching movies:", error);
      messageApi.error("Failed to load movies ❌");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Table Columns with description trimming style
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 250,
      onCell: () => ({
        style: {
          maxWidth: 250,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }),
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (src) => (
        <Image
          src={src}
          alt="thumbnail"
          width={60}
          height={60}
          className="rounded-md object-cover"
        />
      ),
    },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre",
      render: (genres) => genres?.join(", "),
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      key: "releaseDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Languages",
      dataIndex: "languages",
      key: "languages",
      render: (langs) => langs?.join(", "),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleUpdate(record)}>
            Update
          </Button>
          <Button danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Handle Update (open modal with prefilled values)
  const handleUpdate = (movie) => {
    setEditing(true);
    setEditingMovieId(movie._id);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...movie,
      releaseDate: movie.releaseDate ? dayjs(movie.releaseDate) : null,
    });
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${url}/api/movie/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setMovies((prev) => prev.filter((movie) => movie._id !== id));
        messageApi.success("Movie deleted successfully ✅");
      } else {
        messageApi.error("Failed to delete movie ❌");
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      messageApi.error("Error deleting movie ❌");
    }
  };

  // Handle Add/Update Movie
  const handleMovie = async (values) => {
    try {
      let response;
      if (editing) {
        response = await fetch(`${url}/api/movie/${editingMovieId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
        });
      } else {
        response = await fetch(`${url}/api/movie/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
        });
      }

      if (response.ok) {
        messageApi.success(
          editing ? "Movie updated successfully ✅" : "Movie added successfully ✅"
        );
        setIsModalVisible(false);
        form.resetFields();
        setEditing(false);
        setEditingMovieId(null);
        fetchMovies();
      } else {
        messageApi.error(
          editing ? "Failed to update movie ❌" : "Failed to add movie ❌"
        );
      }
    } catch (error) {
      console.error("Error saving movie:", error);
      messageApi.error("Something went wrong ❌");
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
            setEditingMovieId(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          + Add Movie
        </Button>
      </div>

      {/* Mobile Card view (hidden on md and above) */}
      <div className="grid grid-cols-1 gap-4 p-2 md:hidden">
        {movies.map((movie) => (
          <div key={movie._id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="font-semibold text-lg mb-2">{movie.title}</div>
            <Image
              src={movie.thumbnail}
              alt="thumbnail"
              width={80}
              height={80}
              className="rounded-md object-cover mb-2"
              preview={false}
            />
            <div className="text-sm mb-1">{movie.description}</div>
            <div className="text-sm mb-1">
              <strong>Genre:</strong> {movie.genre?.join(", ")}
            </div>
            <div className="text-sm mb-1">
              <strong>Release Date:</strong>{" "}
              {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : "-"}
            </div>
            <div className="text-sm mb-3">
              <strong>Languages:</strong> {movie.languages?.join(", ")}
            </div>
            <Space>
              <Button type="primary" onClick={() => handleUpdate(movie)}>
                Update
              </Button>
              <Button danger onClick={() => handleDelete(movie._id)}>
                Delete
              </Button>
            </Space>
          </div>
        ))}
      </div>

      {/* Desktop Table view (hidden on smaller screens) */}
      <div className="hidden md:block">
        <Table
          columns={columns}
          dataSource={movies}
          bordered
          scroll={{ x: "max-content" }}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title={editing ? "Update Movie" : "Add New Movie"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditing(false);
          setEditingMovieId(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleMovie}
          initialValues={{
            languages: ["English"],
            genre: ["Action"],
          }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Banner Image" name="bannerImage">
            <Input />
          </Form.Item>

          <Form.Item
            label="Thumbnail"
            name="thumbnail"
            rules={[{ required: true, message: "Thumbnail is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Rating" name="rating">
            <Input type="number" min={0} max={10} />
          </Form.Item>

          <Form.Item
            label="Genre"
            name="genre"
            rules={[{ required: true, message: "Genre is required" }]}
          >
            <Select mode="multiple" allowClear>
              <Option value="Action">Action</Option>
              <Option value="Drama">Drama</Option>
              <Option value="Comedy">Comedy</Option>
              <Option value="Fantasy">Fantasy</Option>
              <Option value="Sci-Fi">Sci-Fi</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Duration (mins)" name="duration">
            <Input type="number" />
          </Form.Item>

          <Form.Item label="Release Date" name="releaseDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Languages" name="languages">
            <Select mode="multiple" allowClear>
              <Option value="English">English</Option>
              <Option value="Hindi">Hindi</Option>
              <Option value="Tamil">Tamil</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Theatre"
            name="theatre"
            rules={[{ required: true, message: "Theatre is required" }]}
          >
            <Input placeholder="Theatre ID" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editing ? "Update Movie" : "Add Movie"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MovieTable;
