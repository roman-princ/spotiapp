import React, { useState } from "react";
import Cookies from 'js-cookie';
import "../index.css";
import axios from "axios";
import { Link } from "react-router-dom";

const Songs4AllTime = () => {
    const [token] = useState(Cookies.get('spotifyAuthToken'));
    const [tracks, setTracks] = useState();
    const [count, setCount] = useState(0);
    const TextColor = () => {
        const cardstitle = document.getElementsByClassName("card-title");
        const cardsbody = document.getElementsByClassName("card-body");
        cardstitle[0].style.color = "#FFD700";
        cardstitle[1].style.color = "#C0C0C0";
        cardstitle[2].style.color = "#CD7F32";
        cardsbody[0].style.color = "#FFD700";
        cardsbody[1].style.color = "#C0C0C0";
        cardsbody[2].style.color = "#CD7F32";
    }
    const AxiosTracks = () => {

        if (count < 1) {
            axios.get('https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term', {
                headers: {
                    Authorization: 'Bearer ' + token
                },
                params: {
                    limit: 50
                }
            })
                .then((res) => {
                    setTracks(res.data.items)
                })
            setCount(count + 1)

        }

    }
    AxiosTracks();

    return (
        <>
            <h2>All-time</h2>
            <div className="card-container" onLoad={TextColor}>{tracks === undefined ? <h1>Loading...</h1> : tracks.map((track, ind) => {
                return (
                    <div key={ind} className="card">
                        <a className="linkto" href={track.external_urls.spotify}>
                            <div className="card-img-track">
                                <img src={track.album.images[0].url} alt={track.album.title} />
                            </div>
                        </a>
                        <div className="card-body">
                            <h4 className="card-title">{ind + 1}. {track.name}</h4>
                            <h5 className="card-subtitle">{track.artists[0].name}</h5>
                            <Link className="info-link" to={track.id}>See more</Link>
                        </div>
                    </div>
                )
            })}</div >
            <div class="holidAds widescreen"></div>
        </>
    )
}

export default Songs4AllTime;