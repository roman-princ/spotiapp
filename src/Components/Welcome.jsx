import React, { useState } from "react";
import Cookies from 'js-cookie';
import "../index.css";
import axios from "axios";
import { Link } from "react-router-dom";

const Welcome = () => {
    const [token] = useState(Cookies.get('spotifyAuthToken'));
    const [topTracks, setTopTracks] = useState();
    const [currentSong, setCurrentSong] = useState();
    const [activeDevice, setActiveDevice] = useState();
    const [lastPlayed, setLastPlayed] = useState();
    const [count, setCount] = useState(0);
    const [user, setUser] = useState();

    const GetCurrentSong = () => {
        axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then((response) => {
            setCurrentSong(response.data)
        })
        axios.get("https://api.spotify.com/v1/me/player/devices", {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then((response) => {
            //chceck if the device is active
            response.data.devices.forEach(dev => {
                if (dev.is_active) {
                    setActiveDevice(dev)
                }
            });
        })
        axios.get("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then((response) => {
            setLastPlayed(response.data.items[0])
        })
    }

    const GetUser = () => {
        axios.get('https://api.spotify.com/v1/me', {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then((response) => {
            setUser(response.data);

        })
        GetCurrentSong();
    }


    const FetchData = () => {
        if (count < 1) {
            axios.get('https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M/tracks', {
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
                .then((res) => {
                    //take 10 tracks from the playlist
                    setTopTracks(res.data.items.slice(0, 10));

                })
            GetUser();
            setCount(count + 1)
        }
    }




    FetchData();


    return (
        <div className="main-div" >
            <div className="welcome-div">
                <h1 className="welcome-text">Welcome back {user?.display_name}!</h1>
            </div>
            <div className="player-div">
                {currentSong ? (
                    <>
                        <h2 className="top-today-header">Currently playing</h2>
                        <div className="player">
                            <img src={currentSong?.item.album.images[0].url} alt={currentSong.item.album.name} />
                            <div className="player-info">
                                <p>{currentSong?.item.name}</p>
                                <p>{currentSong?.item.artists[0].name}</p>
                                <div className="player-device">
                                    <div className="sound-wave">
                                        <i className="bar"></i>
                                        <i className="bar"></i>
                                        <i className="bar"></i>
                                    </div>
                                    <p>{activeDevice?.name}</p>
                                </div>
                            </div>

                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="top-today-header">Last played</h2>
                        <div className="player">
                            {lastPlayed ? (
                                <div className="player">
                                    <img src={lastPlayed?.track.album.images[0].url} alt={lastPlayed.track.album.name} />
                                    <div className="player-info">
                                        <p>{lastPlayed?.track.name}</p>
                                        <p>{lastPlayed?.track.artists[0].name}</p>
                                    </div>
                                </div>
                            ) : (
                                <h1>Loading...</h1>
                            )}
                        </div>
                    </>
                )}
            </div>
            <div className="top-today-div">
                <div className="top-today" >
                    <h2 className="top-today-header">Global Top 10 Today</h2>
                    <div className="top-today-tracks">
                        {topTracks !== undefined ? topTracks.map((track) => {
                            return (
                                <div className="card-img-track" style={{ backgroundImage: `url(${track.track.album.images[0].url})` }} >
                                    <div className="card-img-overlay">
                                        <p className="card-track-name">{track.track.name}</p>
                                        <Link to={`/track/${track.track.id}`} className="linkto">See more</Link>
                                    </div>
                                </div>
                            )
                        }) : <h1>Loading...</h1>}
                    </div>

                </div>
            </div>
        </div >


    )
}

export default Welcome;