import React, { useState } from "react";
import Cookies from 'js-cookie'
import "../index.css";
import axios from "axios";
import arrow_down from '../Images/arrow_down.svg';


const RecentlyPlayed = () => {
    const [token] = useState(Cookies.get('spotifyAuthToken'));
    const [recentlyPlayed, setRecentlyPlayed] = useState();
    const [count, setCount] = useState(0);
    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    function convertToDateAndTime(ISOformat) {
        console.log(ISOformat)
        let date = ISOformat.split('T')[0];
        let year = date.split('-')[0];
        let month = date.split('-')[1];
        let day = date.split('-')[2];
        let time = ISOformat.split('T')[1];
        let hour = time.split(':')[0];
        let minute = time.split(':')[1];
        return `${day}/${month}/${year} ${hour}:${minute}`;

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

    const ShowHideInfo = (ind) => {
        const infodiv = document.getElementById(`cardinfo${ind}`);
        infodiv.style.height = infodiv.style.height === "0px" ? "100px" : "0px";

    }

    const AxiosTracks = () => {

        if (count < 1) {
            axios.get('https://api.spotify.com/v1/me/player/recently-played', {
                headers: {
                    Authorization: 'Bearer ' + token
                },
                params: {
                    limit: 50
                }
            })
                .then((res) => {
                    setRecentlyPlayed(res.data.items)
                })
            setCount(count + 1)

        }

    }
    AxiosTracks();
    return (
        <div className="recently-played-div">{recentlyPlayed === undefined ? <h1>Loading...</h1> : recentlyPlayed.map((recentlyPlayed, ind) => {
            return (
                <div key={ind} className="recently-played-card">
                    <div className="recently-played-title">
                        <a className="songhref" href={recentlyPlayed.track.external_urls.spotify}><p>{recentlyPlayed.track.name}</p></a>
                        <div className="recently-played-card-right-side">
                            <p className="played-date">{convertToDateAndTime(recentlyPlayed.played_at)}</p>
                            <a onClick={() => ShowHideInfo(ind)}><img src={arrow_down}></img></a>
                        </div>
                    </div>
                    <div className="recently-played-info" id={"cardinfo" + ind}>
                        <p>Artist: {recentlyPlayed.track.artists[0].name}</p>
                        <p>Duration: {convertMsToTime(recentlyPlayed.track.duration_ms)}</p>
                    </div>
                </div>
            )
        })}</div >

    )
}


export default RecentlyPlayed;