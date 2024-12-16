/* eslint-disable jsx-a11y/no-redundant-roles */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Grid, Container } from "@mui/material";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useCreateSubscriptionMutation } from "../slices/usersApiSlice";
import { useGetBundlesQuery } from "../slices/bundlesSlice";
import { useGetUserMutation } from "../slices/usersApiSlice";

const Payment = () => {
  const [getUser] = useGetUserMutation();
  const { data: bundles } = useGetBundlesQuery();
  const [loadingStates, setLoadingStates] = useState({});
  const [createSubscription] = useCreateSubscriptionMutation();
  const [subscription, setSubscribedBundles] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);

      getUser({ userId: parsedUserInfo._id })
        .unwrap()
        .then((updatedUserData) => {
          setSubscribedBundles(updatedUserData.bundles);
          localStorage.setItem("userInfo", JSON.stringify(updatedUserData));
        })
        .catch((err) => {
          console.error("Error fetching user info:", err);
        });
    }
  }, [getUser, setSubscribedBundles]);

  const handleBuyNow = async (bundle) => {
    setLoadingStates((prev) => ({ ...prev, [bundle._id]: true }));

    try {
      const response = await createSubscription({
        userId: userInfo._id,
        bundleId: bundle._id,
      }).unwrap();

      if (response.payment_url) {
        window.open(response.payment_url, '_blank');
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred while processing the subscription.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [bundle._id]: false }));
    }
  };
  return (

    <Container sx={{ mt: 5 }}>
      {/* Hero Image */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <img
          src="/images/fellow-game.png"
          alt="Fellow Games"
          style={{
            width: "400px",
            height: "200px",
            borderRadius: "8px",
            objectFit: "cover",
          }}
        />
      </Box>

      <Grid container spacing={5} sx={{ mt: 2 }}>
        {bundles?.map((bundle) => (
          <Grid item xs={12} sm={4} key={bundle._id}>
            <div style={{ display: "flex", flexDirection: "column", marginBottom: "20px" }}>
              <div
                style={{
                  position: 'relative',
                  background: 'linear-gradient(180deg, #F07F16 0%, #FC5744 100%)',
                  width: '100%',
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: "20px",
                  padding: '0 20px',
                  borderRadius: '10px',
                }}
              >
                <div>
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '16px',
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      zIndex: 2,
                      width: '130px',
                      wordWrap: 'break-word',
                      whiteSpace: 'normal',
                    }}
                  >
                    {bundle.title}
                  </div>
                  <img
                    src="/images/buy-coins.png"
                    alt="Buy Coins"
                    style={{
                      position: 'absolute',
                      right: '-35px',
                      width: '200px',
                      height: '200px',
                      zIndex: 1,
                      top: "-80px"
                    }}
                  />
                </div>
                <div style={{ textAlign: 'center', marginTop: '130px', width: '100%' }}>
                  <div style={{ fontSize: '18px', color: 'white', marginBottom: '10px' }}>
                    {bundle.description}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <span style={{ color: "black" }}>Credits:</span>
                      <span>{bundle.credits}</span>
                    </div>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <span style={{ color: "black" }}>Price:</span>
                      <span>{bundle.price} $</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buy Button */}
              <div style={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <button
                  onClick={() => handleBuyNow(bundle)}
                  disabled={loadingStates[bundle._id]}
                  style={{
                    appearance: 'button',
                    backgroundColor: '#1AA93D',
                    border: 'solid transparent',
                    borderRadius: '16px',
                    borderWidth: '0 0 4px',
                    boxSizing: 'border-box',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    display: 'inline-block',
                    fontFamily: 'din-round, sans-serif',
                    fontSize: '15px',
                    fontWeight: '700',
                    letterSpacing: '.8px',
                    lineHeight: '20px',
                    margin: '0',
                    outline: 'none',
                    overflow: 'visible',
                    padding: '13px 16px',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    touchAction: 'manipulation',
                    transform: 'translateZ(0)',
                    transition: 'filter .2s',
                    userSelect: 'none',
                    Select: 'none',
                    verticalAlign: 'middle',
                    whiteSpace: 'nowrap',
                    width: '60%',
                    position: 'relative',
                  }}
                  role="button"
                >
                  {loadingStates[bundle._id] && (
                    <Loader
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  )}
                  <span>{loadingStates[bundle._id] ? '' : 'Buy Now'}</span>
                  <div
                    style={{
                      backgroundClip: 'padding-box',
                      backgroundColor: '#56E965',
                      border: 'solid transparent',
                      borderRadius: '16px',
                      borderWidth: '0 0 4px',
                      bottom: '-4px',
                      left: '0',
                      position: 'absolute',
                      right: '0',
                      top: '0',
                      zIndex: -1,
                    }}
                  ></div>
                </button>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>

    </Container>


  );
};

export default Payment;
