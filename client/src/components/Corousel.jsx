import React from "react";
import { Carousel } from "antd";

const carouselItems = [
  {
    id: 1,
    src: "https://assets-in-gm.bmscdn.com/promotions/cms/creatives/1755764418676_21staugplaycarddesktophpc.jpg",
    alt: "Slide 1",
  },
  {
    id: 2,
    src: "https://assets-in-gm.bmscdn.com/promotions/cms/creatives/1756384335478_jurassicworldrebirthweb.jpg",
    alt: "Slide 2",
  },
  {
    id: 3,
    src: "https://cdn.wallpapersafari.com/97/11/SelcCa.jpg",
    alt: "Slide 3",
  },
  {
    id: 4,
    src: "https://animehunch.com/wp-content/uploads/2024/12/Demon-Slayer-Kimetsu-no-Yaiba-Infinity-Castle-Arc-visual1.jpg",
    alt: "Slide 4",
  },

  
];

const Corousel = () => (
  <Carousel autoplay autoplaySpeed={3000} dots draggable>
    {carouselItems.map((item) => (
      <div key={item.id}>
        <img
          src={item.src}
          alt={item.alt}
          style={{
            width: "100%",
            height: "60vh", // responsive height
            objectFit: "cover",
            borderRadius: "12px",
          }}
        />
      </div>
    ))}
  </Carousel>
);

export default Corousel;
