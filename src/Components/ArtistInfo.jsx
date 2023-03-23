import React, { useState } from "react";
import Cookies from 'js-cookie';
import "../index.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import SpotifyLogo from "../Images/Spotify_Logo_CMYK_Black.png"
import ColorThief from 'colorthief';
import { Link } from 'react-router-dom';

const ArtistInfo = () => {
    const artistid = useParams();
    const [token] = useState(Cookies.get('spotifyAuthToken'));
    const [count, setCount] = useState(0);
    const [artist, setArtist] = useState();
    const [topTracks, setTopTracks] = useState();
    const [color, setColor] = useState();
    const colorThief = new ColorThief();

    const GetTopTracks = () => {

        axios.get('https://api.spotify.com/v1/artists/' + artistid.id + '/top-tracks?market=US', {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then((res) => {
                setTopTracks(res.data.tracks);
                console.log(res.data.tracks);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    function GetColor() {
        let image = document.getElementById('artistImage');
        if (image) {
            let color = colorThief.getColor(image);
            setColor(color);
            let div = document.getElementById("artistimagediv");
            div.style.boxShadow = "0px 20px 20px 0px rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
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
    const GetArtistInfo = () => {
        if (count < 1) {
            axios.get('https://api.spotify.com/v1/artists/' + artistid.id, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
                .then((res) => {
                    setArtist(res.data);
                })
            GetColor();
            GetTopTracks()
            setCount(count + 1)

        }
    }
    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    GetArtistInfo();

    return (
        <>
            {
                artist ? (
                    <>
                        <div className="TrackInfo">
                            <div className="image-artist-div" id="artistimagediv">
                                <img src={artist.images[0].url} alt="Album Cover" crossOrigin="anonymous" className="TrackInfo-AlbumCover" id="artistImage" />
                            </div>
                            <div className="TrackInfo-Header-Text">
                                <h1 className="TrackInfo-Header-Text-Title">{artist.name}</h1>
                            </div>
                        </div>
                        <div className="track-info-div">

                            <div className="artist-info">

                                <div className="artist-features-item">
                                    <h4>Popularity</h4>
                                    <p>{artist?.popularity / 10}/10</p>
                                </div>
                                <div className="artist-features-item">
                                    <h4>Followers</h4>
                                    <p>{numberWithCommas(artist?.followers.total)}</p>
                                </div>
                                <div className="artist-features-item">
                                    <h4>Main genre</h4>
                                    <p>{artist?.genres[0]}</p>
                                </div>
                            </div>
                        </div>
                        <div className="top-today-div">
                            <div className="top-today" >
                                <h2 className="top-today-header">Top 10 Tracks</h2>
                                <div className="top-today-tracks">
                                    {topTracks !== undefined ? topTracks.map((track) => {
                                        return (
                                            <div className="card-img-track" style={{ backgroundImage: `url(${track.album.images[0].url})` }} >
                                                <div className="card-img-overlay">
                                                    <p className="card-track-name">{track.name}</p>
                                                    <p className="card-track-album">{track.album.name}</p>
                                                </div>
                                            </div>
                                        )
                                    }) : null}
                                </div>

                            </div>
                        </div>
                        <div className="listen-on-spotify-div">
                            <a href={artist.external_urls.spotify} target="_blank" rel="noreferrer">
                                Open in&nbsp;<img src={SpotifyLogo} alt="Spotify Logo" className="listen-on-spotify" />
                            </a>
                        </div>
                    </>
                ) : (
                    <div className="artist-info-container">
                        <h1>Loading...</h1>
                    </div >
                )
            }


        </>
    )
}

export default ArtistInfo;