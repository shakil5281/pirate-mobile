"use client"

import React, { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

const EsimVideo = ({
    videoSrc = "https://ik.imagekit.io/foup4kj4v/How%20to%20buy_install%20Pirate%20Mobile%20eSIM%20in%205%20steps.mp4?updatedAt=1754467673717",
    ticketIcon = "/images/home/Phone.png",
    onPlay,
}) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(true);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
                setShowControls(true);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
                setShowControls(false);
                if (onPlay) onPlay();
            }
        }
    };

    const handleVideoClick = () => {
        togglePlay();
    };

    const handleMouseEnter = () => {
        if (isPlaying) {
            setShowControls(true);
        }
    };

    const handleMouseLeave = () => {
        if (isPlaying) {
            setShowControls(false);
        }
    };

    return (
        <div className="container max-w-6xl 2xl:max-w-7xl mx-auto py-12 lg:py-24" style={{ position: 'relative', margin: '0 auto' }}>
            <div className="text-center">
                <h1 className="text-3xl xl:text-5xl font-semibold">
                    How to <span className="text-green-500">Install eSim </span>
                </h1>
            </div>
            <div className="mt-8 xl:mt-10 px-4">
                <div className="flex justify-center items-center">
                    <div
                        className="rounded-2xl overflow-hidden w-full aspect-video relative cursor-pointer"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <video
                            ref={videoRef}
                            src={videoSrc}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover"
                            onClick={handleVideoClick}
                        />

                        {/* Play/Pause Button Overlay */}
                        {showControls && (
                            <div
                                className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300"
                                onClick={handleVideoClick}
                            >
                                <div className="lg:border-14 md:border-10 border-8 border-[#ffffff31] rounded-full ">
                                    <button
                                        className="bg-secondary rounded-full lg:p-8 cursor-pointer p-4 md:p-6"

                                        aria-label={isPlaying ? "Pause video" : "Play video"}
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-6 h-6 lg:w-12 lg:h-12 md:w-10 md:h-10" fill="black" />
                                        ) : (
                                            <Play className="w-6 h-6 lg:w-12 lg:h-12 md:w-10 md:h-10 ml-1" fill="black" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EsimVideo;
