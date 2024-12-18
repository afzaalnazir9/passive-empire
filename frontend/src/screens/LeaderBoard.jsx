import React from "react";
import { Box, Container, Typography, Card, CardContent, Grid } from "@mui/material";

const cardData = [
    { title: "Daily", imgSrc: "/images/calender.png" },
    { title: "Weekly", imgSrc: "/images/calender.png" },
    { title: "Monthly", imgSrc: "/images/calender.png" },
    { title: "Quarterly", imgSrc: "/images/calender.png" },
    { title: "Semi-Annually", imgSrc: "/images/calender.png" },
    { title: "Yearly", imgSrc: "/images/calender.png" },
];

const LeaderBoard = () => {
    return (
        <Container sx={{ mt: 5 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
                <img
                    src="/images/fellow-game.png" 
                    alt="LeaderBoard"
                    style={{
                        width: "400px",
                        height: "200px",
                        borderRadius: "8px",
                        objectFit: "cover",
                    }}
                />
            </Box>

            <Grid container spacing={3}>
                {cardData.map((card, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Card
                            sx={{
                                background: "linear-gradient(180deg, #FEE93E 0%, #F69648 100%)",
                                borderRadius: "8px",
                                width:"280px",
                                height:"120px",
                                boxShadow: 3,
                                position: "relative",
                                overflow: "visible",
                                marginBottom:"40px"
                            }}
                        >
                            <CardContent sx={{ textAlign: "center", position: "relative" }}>
                                <img
                                    src={card.imgSrc}
                                    alt={card.title}
                                    style={{
                                        width: "110px",
                                        position: "absolute",
                                        top: "-60px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                    }}
                                />
                                <Typography variant="h6" component="div" sx={{ mt: 6, fontSize:"24px", color:"whitesmoke" }}>
                                    {card.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default LeaderBoard;