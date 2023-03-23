import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie'
import "../index.css";
import axios from "axios";
import arrow_down from '../Images/arrow_down.svg';
import { useParams } from "react-router-dom";



const Search = () => {
    const [token] = useState(Cookies.get('spotifyAuthToken'));
    const params = useParams("");
    const [artists, setArtists] = useState();
    const [tracks, setTracks] = useState();
    const [albums, setAlbums] = useState();
    useEffect(() => {
        params.query.replace(" ", "%20");
        GetArtists();
        GetTracks();
        GetAlbums();
    }, [params])



    const GetTracks = () => {
        axios.get('https://api.spotify.com/v1/search?q=' + params.query + '&type=track&limit=5', {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then((response) => {
            setTracks(response.data);
        })
    }

    const GetArtists = () => {
        axios.get('https://api.spotify.com/v1/search?q=' + params.query + '&type=artist&limit=3', {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then((response) => {
            setArtists(response.data);
        })

    }

    const GetAlbums = () => {
        axios.get('https://api.spotify.com/v1/search?q=' + params.query + '&type=album&limit=4', {
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then((response) => {
            setAlbums(response.data);
            console.log(response.data);
        })
    }
    return (

        <div className="search-container" >
            <div className="tracks-search-container">
                {artists ? artists.artists.items.map((item) => {
                    return (
                        <a href={"artist/" + item.id} style={{ textDecoration: "none" }}>
                            <div className="track-search-item">
                                <img className="search-img" src={item.images.length > 0 ? item.images[0].url : "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Square_gray.svg/1200px-Square_gray.svg.png"} />
                                <div className="item-info">
                                    <h3>{item.name}</h3>
                                    <p>Artist</p>
                                </div>
                            </div>
                        </a>

                    )
                }) : null}
            </div>
            <div className="tracks-search-container">
                {albums ? albums.albums.items.map((item) => {
                    return (
                        <a href={"album/" + item.id} style={{ textDecoration: "none" }}>
                            <div className="track-search-item">
                                <img className="search-img" src={item.images.length > 0 ? item.images[0].url : "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Square_gray.svg/1200px-Square_gray.svg.png"} />
                                <div className="item-info">
                                    <h3>{item.name}</h3>
                                    <p>Album • {item.artists.map((artist) => {
                                        if (item.artists.indexOf(artist) === item.artists.length - 1) {
                                            return artist.name
                                        } else {
                                            return artist.name + ", ";
                                        }
                                    })}</p>
                                </div>
                            </div>
                        </a>

                    )
                }) : null}
            </div>
            <div className="tracks-search-container">
                {tracks ? tracks.tracks.items.map((item) => {
                    return (
                        <a href={"track/" + item.id} style={{ textDecoration: "none" }}>
                            <div className="track-search-item">
                                <img className="search-img" src={item.album.images.length > 0 ? item.album.images[0].url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmyuZHnZNaoLKny8d3jVRVuzDcHRyQ9h60qP6fDZM&s"} alt="" />
                                <div className="item-info">
                                    <h3>{item.name}</h3>
                                    <p>Track • {item.artists.map((artist) => {
                                        if (item.artists.indexOf(artist) === item.artists.length - 1) {
                                            return artist.name
                                        } else {
                                            return artist.name + ", ";
                                        }
                                    })}</p>
                                </div>
                            </div>
                        </a>

                    );
                }) : null}
            </div>
        </div >
    );
}


export default Search;