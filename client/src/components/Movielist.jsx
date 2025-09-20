import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import { Spin } from "antd";
import Corousel from "./Corousel";

function Movielist() {
  const url = "http://localhost:5000"
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMoviesData = async () => {
    try {
      const response = await fetch(`${url}/api/movie/list`,{
        method:"GET",
        credentials:"include"
      });
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const result = await response.json();
      setMovies(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoviesData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" tip="Loading movies..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No movies available right now.
      </div>
    );
  }

  return (
    <>
      <Corousel/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-100 mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4    gap-8">
          {movies.map((movie) => (
            <Link to={`/movies/${movie._id}`} >

              <MovieCard
                key={movie._id}
                title={movie.title}
                thumbnail={movie.thumbnail}
                rating={8.5}
                votes="120K"
                languages={["Japanese", "English", "Hindi"]}
                certificate="UA13+"
                
              />

            </Link>
          ))}
        </div>
    </div>
    </>
    
  );
}

export default Movielist;
