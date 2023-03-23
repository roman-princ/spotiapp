import React, { useState } from "react";
import Cookies from 'js-cookie';
import "../index.css";
import axios from "axios";

const Genres6Months = () => {
    const [token] = useState(Cookies.get('spotifyAuthToken'));
    const [artists, setArtists] = useState();
    const [genreDict, setGenreDict] = useState({});
    const [count, setCount] = useState(0);
    const orderAndTake20Top = () => {
        // Sort the dictionary by value
        const sorted = Object.fromEntries(
            Object.entries(genreDict).sort(([, a], [, b]) => b - a)
        );
        // Take the top 20
        const top20 = Object.entries(sorted).slice(0, 20);
        // Return the top 20
        setGenreDict(top20);

    }
    const getGenres = () => {

        artists.map((artist) => {
            artist.genres.map((genre) => {
                if (genreDict[genre] === undefined) {
                    genreDict[genre] = 1;
                } else {
                    genreDict[genre] += 1;
                }
            })
        })
        orderAndTake20Top();

    }
    const AxiosTracks = () => {
        if (count < 1) {
            axios.get('https://api.spotify.com/v1/me/top/artists?limit=50&time_range=medium_term', {
                headers: {
                    Authorization: 'Bearer ' + token
                },
                params: {
                    limit: 50
                }
            })
                .then((res) => {
                    setArtists(res.data.items)
                })
            if (artists !== undefined) {
                setCount(count + 1)
                getGenres();
            }



        }
    }
    AxiosTracks();

    return (
        <>
            <h2>6 months</h2>
            <div className="genre-div">
                {genreDict === undefined ? <h1>Loading...</h1> : Object.entries(genreDict).map((genre, ind) => {
                    return (
                        <div key={ind} className="genre-div-item">
                            <h4 className="genre-title">{ind + 1}. {genre[1][0]}</h4>
                            <div className="genre-bar" style={{ width: `${genre[1][1] * 5}px` }}></div>
                        </div>
                    )
                })}
            </div>
            <div class="holidAds widescreen"></div>
        </>


    )
}

export default Genres6Months;