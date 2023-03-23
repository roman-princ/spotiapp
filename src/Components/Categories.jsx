import React, { useState } from "react";
import { SpotifyApiContext, BrowseCategories } from 'react-spotify-api';
import Cookies from 'js-cookie'
import "../index.css";
import axios from "axios";

const Categories = () => {
    const [token] = useState(Cookies.get('spotifyAuthToken'));
    const { data } = axios.get('https://api.spotify.com/v1/browse/categories', {
        headers: {
            Authorization: 'Bearer ' + token
        },
        params: {
            limit: 50
        }
    }).then((res) => {
        console.log(res.data.categories.items)
    })

    console.log(data)
    return (
        <div> cau</div >
    )
}

export default Categories;