import React from "react";
import { Box, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetGamesQuery } from "../slices/gamesSlice";
import { useDispatch } from "react-redux";
import { setSelectedGame } from "../slices/gamesSlice";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

function GamesList() {
  const { data: games } = useGetGamesQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePlayGame = (game) => {
    dispatch(setSelectedGame(game));
    navigate(`/`);
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
        <img
          src="/images/fellow-game.png"
          alt="Fellow Games"
          style={{
            width: "400px",
            height: "195px",
            borderRadius: "8px",
            objectFit: "cover",
          }}
        />
      </Box>

      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          el: ".swiper-pagination",
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {games?.map((game) => (
          <SwiperSlide key={game._id}>
            <Box
              sx={{
                position: "relative",
                width: "250px",
                height: "280px",
                borderRadius: "20px",
                overflow: "hidden",
                border: "4px solid white",
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.02)",
                  transition: "transform 0.2s ease-in-out",
                },
              }}
              onClick={() => handlePlayGame(game)}
            >
              <img
                src={game.logo}
                alt={game.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>

            <Box sx={{ textAlign: "center", mt: 1 }}
              onClick={() => handlePlayGame(game)}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  fontSize: "23px",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.02)",
                    transition: "transform 0.2s ease-in-out",
                    color: "#FFC128"
                  },
                }}
              >
                {game.title}
              </Typography>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className="swiper-pagination"
        style={{
          textAlign: "center",
          position: "relative",
          zIndex: "10",
          bottom: "-2px",
        }}
      ></div>

      <style>
        {`
          .swiper-pagination-bullet {
            background-color: #FFC128 !important; /* Yellow color */
            width: 12px;
            height: 12px;
            opacity: 0.6;
            transition: background-color 0.3s ease;
          }
          .swiper-pagination-bullet-active {
            background-color: #FF5722 !important; /* Orange color for active dot */
            opacity: 1;
          }
          .swiper-pagination-bullet:hover {
            background-color: #FF9800 !important; /* Hover color */
            transform: scale(1.3); /* Enlarge on hover */
            transition: transform 0.3s ease;
          }
        `}
      </style>
    </Container>
  );
}

export default GamesList;
