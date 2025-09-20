import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { DatePicker } from "antd";
import dayjs from "dayjs";

function Theatre() {
  const url = "https://bookmyseat-backend.onrender.com";
  const [theatre, setTheatre] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs("2025-09-21")); // default 21-09-2025

  const { movieId } = useParams();

  const fetchTheatre = async (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    const response = await fetch(
      `${url}/api/show/list?movieId=${movieId}&date=${formattedDate}`
    );
    const res = await response.json();
    setTheatre(res);
  };

  const fetchMovie = async () => {
    const response = await fetch(`${url}/api/movie/${movieId}`);
    const res = await response.json();
    setTitle(res.title);
  };

  useEffect(() => {
    fetchTheatre(selectedDate);
    fetchMovie();
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // disable past dates
  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Movie title */}
      <h1 className="font-gilroy font-bold text-2xl mb-4">{title}</h1>

      {/* Ant Design DatePicker */}
      <div className="mb-8">
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          disabledDate={disabledDate}
          format="YYYY-MM-DD"
          className="!w-full sm:!w-auto border rounded px-3 py-2"
        />
      </div>

      {/* Theatre list */}
      {theatre.length > 0 ? (
        <div className="flex flex-col gap-6">
          {theatre.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row border-2 border-sky-400 rounded-lg p-4 md:items-center md:justify-between bg-white shadow-sm"
            >
              {/* Theatre name */}
              <div className="font-bold font-gilroy text-lg text-slate-900 mb-3 md:mb-0">
                {item.theatreDetails.name}
              </div>

              {/* Shows */}
              <div className="flex flex-wrap gap-3">
                {item.shows.map((show) => (
                  <Link key={show._id} to={`/show/${show._id}`}>
                    <button
                      type="button"
                      className="border-2 border-green-500 px-4 py-2 rounded-md font-gilroy font-medium text-slate-700 bg-white hover:bg-green-50 hover:text-green-600 transition"
                    >
                      {format(new Date(show.time), "hh:mm a")}
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          No Shows for selected date
        </div>
      )}
    </div>
  );
}

export default Theatre;
