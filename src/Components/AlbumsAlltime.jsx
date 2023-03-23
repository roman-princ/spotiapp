import React, { useState } from "react";
import Cookies from 'js-cookie';
import "../index.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const AlbumsAlltime = () => {
    const [token] = useState(Cookies.get('spotifyAuthToken'));
    const [count, setCount] = useState(0);
    const [topalbums, setTopAlbums] = useState();
    const [albumDictSortedpublic, setAlbumDictSorted] = useState();
    const GetTop10Albums = (albums) => {
        let albumDict = {};
        let tops = [];
        for (let i = 0; i < albums.length; i++) {
            if (albumDict[albums[i]]) {
                albumDict[albums[i]] += 1;
            }
            else {
                albumDict[albums[i]] = 1;
            }
        }
        console.log(albumDict);
        // sort the albumdict by value
        // the albumdictsorted will be an dictionary with key as id and value as count
        // the albumdictsorted will be sorted by value

        let albumDictSorted = Object.keys(albumDict).sort(function (a, b) { return albumDict[b] - albumDict[a] });
        setAlbumDictSorted(albumDictSorted);

        // let albumDictSorted = Object.keys(albumDict).sort(function (a, b) { return albumDict[b] - albumDict[a] });


        for (let i = 0; i < albumDictSorted.length; i++) {
            axios.get('https://api.spotify.com/v1/albums/' + albumDictSorted[i], {
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
                .then((res) => {
                    if (res.data.album_type === "album") {
                        tops.push(res.data);
                    }
                    else console.log("excluding:" + res.data);
                })
        }

        // sort the tops to have the same order as the albumdictsorted
        // tops have property id that matches ids in albumdictsorted
        // sort tops by id
        tops.sort(function (a, b) {
            return albumDictSorted.indexOf(a.id) - albumDictSorted.indexOf(b.id);
        });
        console.log(tops);
        //after this is done, render the html
        setTimeout(() => {
            setTopAlbums(tops);
        }, 500);



    }
    const GetTrackIds = (props) => {

        if (props !== undefined) {
            let albums = [];
            for (let i = 0; i < props.length; i++) {
                albums.push(props[i].album.id);
            }
            console.log(albums)
            GetTop10Albums(albums);
        }
        else {
            setTimeout(GetTrackIds, 100);
        }

    }

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
                    GetTrackIds(res.data.items);
                    // console.log(res.data.items);
                })
            setCount(10);
        }
    }



    AxiosTracks();


    return (
        <>
            <h2>All-time</h2>
            <div className="card-container" onLoad={TextColor}>{topalbums === undefined ? <h1>Loading...</h1> : topalbums.map((album, ind) => {
                return (
                    <div key={ind} className="card">
                        <a className="linkto" href={album.external_urls.spotify}>
                            <div className="card-img-track">
                                <img src={album.images[0].url} />
                            </div>
                        </a>
                        <div className="card-body">
                            <h4 className="card-title">{ind + 1}. {album.name}</h4>
                            <h5 className="card-subtitle">{album.artists[0].name}</h5>
                            <Link className="info-link" to={album.id}>See more</Link>
                        </div>
                    </div>
                )
            })}</div >
        </>
    )
}

export default AlbumsAlltime;