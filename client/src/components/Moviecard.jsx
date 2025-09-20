import React from "react";
import { Tag } from "antd";
import { StarFilled, LikeOutlined } from "@ant-design/icons";

export default function MovieCard({
  title,
  thumbnail,
  rating,
  votes,
  likes,
  languages,
  certificate,
  promoted,
}) {
  return (
    <div className="w-60 cursor-pointer">
      {/* Image + overlay */}
      <div className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300">
        {promoted && (
          <Tag
            color="red"
            className="absolute top-2 right-2 z-10 text-xs font-semibold"
          >
            PROMOTED
          </Tag>
        )}
        <img
          src={thumbnail}
          alt={`${title} Thumbnail`}
          className="w-full h-90 object-cover"
        />

        {/* Bottom overlay bar (rating / likes) */}
        <div className="absolute bottom-0 w-full bg-black/70 text-white px-2 py-1 flex items-center justify-start space-x-2 text-xs">
          {rating ? (
            <>
              <StarFilled className="text-red-500 " />
              <span>{rating}/10</span>
              <span className="ml-1 opacity-80">{votes} Votes</span>
            </>
          ) : (
            <>
              <LikeOutlined className="text-green-500" />
              <span>{likes} Likes</span>
            </>
          )}
        </div>
      </div>

      {/* Title + details */}
      <div className="mt-2">
        <h3 className="text-medium font-semibold truncate">{title}</h3>
        <p className="text-xs text-gray-500">{certificate}</p>
        <p className="text-xs text-gray-400 truncate">{languages?.join(", ")}</p>
      </div>
    </div>
  );
}
