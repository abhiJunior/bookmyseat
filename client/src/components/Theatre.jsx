import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { DatePicker } from "antd";
import dayjs from "dayjs";

function Theatre() {
  const url = "https://bookmyseat-backend.onrender.com"
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
    <>
      
      <div className="mb-6">
        <h1 className="p-2 font-gilroy font-bold text-2xl mb-3">{title}</h1>

        {/* Ant Design DatePicker */}
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          disabledDate={disabledDate}
          format="YYYY-MM-DD"
          className="border rounded px-3 py-2"
        />
      </div>
      {theatre.length > 0 ? (
        <div className="flex flex-col gap-4">
        {theatre.map((item) => (
          <div
            key={item._id}
            className="flex border-3 border-sky-400 rounded items-center h-28"
          >
            <div className="w-1/3 font-bold font-gilroy text-lg text-slate-900 px-5">
              {item.theatreDetails.name}
            </div>
            <div className="flex gap-5">
              {item.shows.map((show) => (
                <button
                  key={show._id}
                  type="button"
                  className="border-2 border-green-500 p-3 px-4 font-gilroy font-medium text-slate-400 cursor-pointer"
                >
                  <Link to={`/show/${show._id}`}>
                    {format(new Date(show.time), "hh:mm a")}
                  </Link>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      ) :(<div>No Shows for Selected date</div>)}
      
    </>
  );
}

export default Theatre;
