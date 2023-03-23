import React, { useState } from "react";
import Cookies from 'js-cookie';
import "../index.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import SpotifyLogo from "../Images/Spotify_Logo_CMYK_Black.png"
import ColorThief from 'colorthief';

const TrackInfo = () => {
    const trackid = useParams();
    const [token] = useState(Cookies.get('spotifyAuthToken'));
    const [count, setCount] = useState(0);
    const [track, setTrack] = useState();
    const [trackprops, setTrackprops] = useState();
    const [recommendations, setRecommendations] = useState();
    const [color, setColor] = useState();
    const colorThief = new ColorThief();

    function GetColor() {
        let image = document.getElementById('artistImage');
        if (image) {
            let color = colorThief.getColor(image);
            setColor(color);
            image.style.boxShadow = "0px 20px 20px 0px rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
        }
        else {
            setTimeout(GetColor, 100);
        }

    }


    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }
    function convertMsToTime(milliseconds) {
        let seconds = Math.floor(milliseconds / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);

        seconds = seconds % 60;
        minutes = minutes % 60;


        hours = hours % 24;

        return `${padTo2Digits(minutes)}:${padTo2Digits(
            seconds,
        )}`;
    }
    const GetTrackInfo = () => {
        if (count < 1) {
            axios.get('https://api.spotify.com/v1/audio-features/' + trackid.id, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
                .then((res) => {
                    setTrack(res.data);
                    console.log(res.data);
                })
            axios.get('https://api.spotify.com/v1/tracks/' + trackid.id, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
                .then((res) => {
                    setTrackprops(res.data);
                })
            axios.get('https://api.spotify.com/v1/recommendations?seed_tracks=' + trackid.id, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
                .then((res) => {
                    setRecommendations(res.data.tracks);
                })

            GetColor();
            setCount(count + 1)
        }
    }

    const KeyConverter = (key) => {
        switch (key) {
            case 0:
                return "C";
            case 1:
                return "C#";
            case 2:
                return "D";
            case 3:
                return "D#";
            case 4:
                return "E";
            case 5:
                return "F";
            case 6:
                return "F#";
            case 7:
                return "G";
            case 8:
                return "G#";
            case 9:
                return "A";
            case 10:
                return "A#";
            case 11:
                return "B";
            case 12:
                return "C'";
            default:
                return "Error";
        }
    }

    GetTrackInfo();

    const Danceability = (danceability) => {
        if (danceability < 0.33) {
            return "Low";
        }
        if (danceability < 0.66 && danceability > 0.33) {
            return "Medium";
        }
        if (danceability < 1 && danceability > 0.66) {
            return "High";
        }
    }
    const GetEmotion = (energy, valence) => {
        if (energy < 0.5 && valence < 0.5) {
            return "Sad";
        }
        if (energy < 0.5 && valence > 0.5) {
            return "Relaxed";
        }
        if (energy > 0.5 && valence < 0.5) {
            return "Energetic";
        }
        if (energy > 0.5 && valence > 0.5) {
            return "Happy";
        }
    }
    const GetLoudness = (loudness) => {
        //loudness is in db in the range -60 to 0
        if (loudness < -30) {
            return "Loud";
        }
        if (loudness < -10 && loudness > -30) {
            return "Medium";
        }
        if (loudness < 0 && loudness > -10) {
            return "Soft";
        }
    }

    return (
        <div className="track-info-div">
            {trackprops !== undefined && track !== undefined ? (
                <div className="TrackInfo">
                    <img src={trackprops.album.images[0].url} alt="Album Cover" className="TrackInfo-AlbumCover" id="artistImage" crossOrigin="anonymous" />
                    <div className="TrackInfo-Header-Text">
                        <h1 className="TrackInfo-Header-Text-Title">{trackprops.name}</h1>
                    </div>
                </div>
            ) : null
            }


            <div className="track-features-div">
                {track !== undefined ? (
                    <>
                        <div className="track-features">
                            <div className="track-features-item">
                                <h4>Duration</h4>
                                <p>{convertMsToTime(track.duration_ms)}</p>
                            </div>
                            <div className="track-features-item">
                                <h4>Acousticness</h4>
                                <p>{Danceability(track.acousticness)}</p>
                            </div>
                            <div className="track-features-item">
                                <h4>Danceability</h4>
                                <p>{Danceability(track.danceability)}</p>
                            </div>
                            <div className="track-features-item">
                                <h4>Emotion</h4>
                                <p>{GetEmotion(track.energy, track.valence)}</p>
                            </div>
                            <div className="track-features-item">
                                <h4>Presence of vocals</h4>
                                <p>{Danceability(track.instrumentalness)}</p>
                            </div>
                            <div className="track-features-item">
                                <h4>Liveness</h4>
                                <p>{Danceability(track.liveness)}</p>
                            </div>
                            <div className="track-features-item">
                                <h4>Overal Loudness</h4>
                                <p>{GetLoudness(track.loudness)}</p>
                            </div>
                            <div className="track-features-item">
                                <h4>Speechiness</h4>
                                <p>{Danceability(track.speechiness)}</p>
                            </div>
                            <div className="track-features-item">
                                <h4>BPM</h4>
                                <p>{Math.floor(track.tempo)}</p>
                            </div>
                            <div className="track-features-item">
                                <h4>Key</h4>
                                <p>{KeyConverter(track.key)}</p>
                            </div>
                            <div className="track-features-item">
                                <h4>Mode</h4>
                                <p>{track.mode === 0 ? "Minor" : "Major"}</p>
                            </div>
                            <div className="track-features-item">
                                <h4>Time Signature</h4>
                                <p>{track.time_signature}/4</p>
                            </div>

                        </div>
                        <div className="top-today-div">
                            <div className="top-today" >
                                <h2 className="top-today-header">Similiar Tracks</h2>
                                <div className="top-today-tracks">
                                    {recommendations !== undefined ? recommendations.map((track) => {
                                        return (
                                            <a href={track.external_urls.spotify} style={{ textDecoration: 'none' }}>
                                                <div className="card-img-track" style={{ backgroundImage: `url(${track.album.images[0].url})` }} >
                                                    <div className="card-img-overlay">
                                                        <p className="card-track-name">{track.name}</p>
                                                        <p className="card-track-album">{track.artists[0].name}</p>
                                                    </div>
                                                </div>
                                            </a>

                                        )
                                    }) : <h1>Loading...</h1>}
                                </div>

                            </div>
                        </div>
                        <div className="listen-on-spotify-div">
                            <a href={track.uri} target="_blank" rel="noreferrer">
                                Open in&nbsp;<img src={SpotifyLogo} alt="Spotify Logo" className="listen-on-spotify" />
                            </a>
                        </div>
                    </>
                ) : <h1>Loading...</h1>

                }

            </div>
        </div>
    )
}

export default TrackInfo;