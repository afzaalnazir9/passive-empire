import React, { useEffect, useRef, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate()
  const currentGame = useSelector((state) => state.game.selectedGame);
  const [zoombtn, setZoombtn] = useState(true);

  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: currentGame?.web_build_loader,
    dataUrl: currentGame?.web_build_data,
    frameworkUrl: currentGame?.web_build_framework,
    codeUrl: currentGame?.web_build_wasm,
  });

  useEffect(() => {
    if (!currentGame || Object.keys(currentGame).length === 0) {
      navigate("/games");
    }
  }, [currentGame, navigate]);


  const unityContainerRef = useRef(null);
  const unityFooterRef = useRef(null);

  useEffect(() => {
    const toggleFullScreen = () => {
      if (!document.fullscreenElement) {
        setZoombtn(false);
        document.documentElement.requestFullscreen();
        document.querySelector(".header").classList.add("hidden");
        document
          .querySelector(".root-container")
          .classList.add("full-container");
        unityContainerRef.current.classList.add("unity-container-full");
      } else {
        if (document.exitFullscreen) {
          setZoombtn(true);
          document.exitFullscreen();
          document.querySelector(".header").classList.remove("hidden");
          document
            .querySelector(".root-container")
            .classList.remove("full-container");
          unityContainerRef.current.classList.remove("unity-container-full");
        }
      }
    };

    const requestAnimationFrameCallback = () => {
      const unityFooter = unityFooterRef.current;
      if (unityFooter) {
        unityFooter.addEventListener("click", toggleFullScreen);
      } else {
        requestAnimationFrame(requestAnimationFrameCallback);
      }
    };

    requestAnimationFrame(requestAnimationFrameCallback);
    const currentUnityFooterRef = unityFooterRef.current;
    return () => {
      if (currentUnityFooterRef) {
        currentUnityFooterRef.removeEventListener("click", toggleFullScreen);
      }
    };
  }, []);
  

  return (
    <>
      <div className="unity-container" ref={unityContainerRef}>
        {isLoaded === false && (
          <div className="loading">
            <div className="loadingText">
              {Math.round(loadingProgression * 100)}%
            </div>
            <div className="loadingBar">
              <div
                className="loadingBarFill"
                style={{ width: `${loadingProgression * 100}%` }}
              />
            </div>
          </div>
        )}


       <Unity unityProvider={unityProvider} className="game"
          style={{
            display: isLoaded ? "block" : "none",
          }} /> 


      </div>
      <div className="unity-footer" ref={unityFooterRef}>
        <img
          style={{ height: "30px", width: "30px" }}
          src={zoombtn ? "/fullscreen-button.png" : "/exitScreen-button.png"}
          alt="Fullscreen"
        />
      </div>
    </>
  );
}

export default Home;
