import React, { useEffect, useState } from 'react';
import './App.css';
import './navbar.css'
import Home from "./Images/home.svg"
import { BrowserRouter, Routes, Route, Link, } from 'react-router-dom';
import Artists from './Components/Artists';
import Cookies from 'js-cookie'
import Songs from './Components/Songs';
import Categories from './Components/Categories';
import Welcome from './Components/Welcome';
import { SpotifyAuth, Scopes } from 'react-spotify-auth';
import { SpotifyApiContext, User } from 'react-spotify-api'
import RecentlyPlayed from './Components/RecentlyPlayed';
import Songs4Weeks from './Components/Songs4Weeks';
import Songs4AllTime from './Components/SongsAllTime';
import Artists4Weeks from './Components/Artists4Weeks';
import ArtistsAllTime from "./Components/ArtistsAllTime";
import axios from 'axios';
import Genres4weeks from './Components/Genres4weeks';
import Genres6Months from './Components/Genres6Months';
import GenresAllTime from './Components/GenresAllTime';
import "./soundwave.css";
import TrackInfo from './Components/TrackInfo';
import ArtistInfo from './Components/ArtistInfo';
import searchicon from "./Images/search.svg";
import Search from './Components/Search';
import Albums4weeks from './Components/Albums4weeks';
import Albums6months from './Components/Albums6months';
import AlbumsAlltime from './Components/AlbumsAlltime';
import AlbumInfo from './Components/AlbumInfo';

function App() {
  const [token, setToken] = useState(Cookies.get("spotifyAuthToken"));
  const [searchparams, setSearchParams] = useState("");
  const Logout = () => {
    Cookies.remove("spotifyAuthToken")
    setToken(null)
  }




  if (!token) {
    document.getElementsByClassName("welcome")[0].style.display = "block";
    document.getElementsByClassName("welcome")[1].style.display = "block";
  }
  const openNav = () => {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }

  const closeNav = () => {
    document.getElementById("mySidebar").style.width = "0";
  }


  if (token) {
    document.getElementsByClassName("welcome")[0].style.display = "none";
    document.getElementsByClassName("welcome")[1].style.display = "none";

  }
  return (
    <BrowserRouter>
      {token ? (
        <SpotifyApiContext.Provider value={token}>
          <User>
            {({ data, loading, error }) => {
              if (data) return (
                <div className='navbar-whole'>
                  <div className="sidebar-menu">
                    <button className="openbtn" onClick={openNav}>&#9776;</button>
                    <div className="searchBar">
                      <input id="searchQueryInput" type="text" name="searchQueryInput" placeholder="Search" onChange={e => setSearchParams(e.target.value)} />
                      <Link id="searchQuerySubmit" to={"search/" + searchparams}>
                        <img src={searchicon}></img>
                      </Link>
                    </div>
                    <div id="mySidebar" className="sidebar">
                      <div className="navbar-top">
                        <div className="navbar-img">
                          <img src={data.images.length == 0 ? "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,h_250,q_auto:good,w_250/v1/gcs/platform-data-pendo/contentbuilder/Avatar_9CkJ8GG.png" : data.images[0].url} />
                        </div>
                        <a href="/" className='home'>
                          <img src={Home} />
                        </a>
                        <a className="closebtn" onClick={closeNav}>&times;</a>
                      </div>


                      <h2 className='h2-nav'>Top Artists</h2>
                      <Link to="artists/4weeks" onClick={() => closeNav()}>Past 4 weeks</Link>
                      <Link to="artists/6months" onClick={() => closeNav()}>Past 6 months</Link>
                      <Link to="artists/alltime" onClick={() => closeNav()}>All-time</Link>
                      <h2 className='h2-nav'>Top Tracks</h2>
                      <Link to="songs/4weeks" onClick={() => closeNav()}>Past 4 weeks</Link>
                      <Link to="songs/6months" onClick={() => closeNav()}>Past 6 months</Link>
                      <Link to="songs/alltime" onClick={() => closeNav()}>All-time</Link>
                      <Link to="recent" onClick={() => closeNav()}>Recently played</Link>
                      <h2 className='h2-nav'>Top Albums{" (BETA)"}</h2>
                      <Link to="albums/4weeks" onClick={closeNav}>Past 4 weeks</Link>
                      <Link to="albums/6months" onClick={closeNav}>Past 6 months</Link>
                      <Link to="albums/alltime" onClick={closeNav}>All-time</Link>
                      <h2 className='h2-nav'>Top Genres</h2>
                      <Link to="genres/4weeks" onClick={() => closeNav()}>Past 4 weeks</Link>
                      <Link to="genres/6months" onClick={() => closeNav()}>Past 6 months</Link>
                      <Link to="genres/alltime" onClick={() => closeNav()}>All-time</Link>

                      <button className="button-black" onClick={Logout}>Logout</button>
                    </div>
                  </div>
                </div>
              )
              else return null
            }}
          </User>
          <Routes>
            <Route path="/artists/6months" element={<Artists />} />
            <Route path="/artists/4weeks" element={<Artists4Weeks />} />
            <Route path="/artists/alltime" element={<ArtistsAllTime />} />
            <Route path='/albums/4weeks' element={<Albums4weeks />} />
            <Route path='/albums/6months' element={<Albums6months />} />
            <Route path='/albums/alltime' element={<AlbumsAlltime />} />
            <Route path="/songs/6months" element={<Songs />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/recent" element={<RecentlyPlayed />} />
            <Route path="/songs/4weeks" element={<Songs4Weeks />} />
            <Route path="/songs/alltime" element={<Songs4AllTime />} />
            <Route path="genres/4weeks" element={<Genres4weeks />} />
            <Route path="genres/6months" element={<Genres6Months />} />
            <Route path="genres/alltime" element={<GenresAllTime />} />
            <Route path="songs/4weeks/:id" element={<TrackInfo />} />
            <Route path="songs/6months/:id" element={<TrackInfo />} />
            <Route path="songs/alltime/:id" element={<TrackInfo />} />
            <Route path='/albums/4weeks/:id' element={<AlbumInfo />} />
            <Route path='/albums/6months/:id' element={<AlbumInfo />} />
            <Route path='/albums/alltime/:id' element={<AlbumInfo />} />
            <Route path="track/:id" element={<TrackInfo />} />
            <Route path="/artists/6months/:id" element={<ArtistInfo />} />
            <Route path="/artists/4weeks/:id" element={<ArtistInfo />} />
            <Route path="/artists/alltime/:id" element={<ArtistInfo />} />
            <Route path="/search/:query" element={<Search />} />
            <Route path="/search/artist/:id" element={<ArtistInfo />} />
            <Route path="/search/track/:id" element={<TrackInfo />} />
            <Route path="/search/album/:id" element={<AlbumInfo />} />
            <Route path="*" element={<Welcome />} />
          </Routes>
        </SpotifyApiContext.Provider>
      ) : (
        <div className="login" >
          <SpotifyAuth
            redirectUri='https://spotiapp.com/welcome'
            clientID='4cd50dd4dd7c4bc28b56fa3b3fbc06b0'
            scopes={[Scopes.userReadPrivate, 'user-top-read', 'user-read-recently-played', 'user-read-playback-state', 'user-read-currently-playing']} // either style will work
            onAccessToken={(token) => setToken(token)}
            title='Login via Spotify'
            btnClassName='SpotifyButton'
            noLogo={true}
          />
        </div>
      )
      }

    </BrowserRouter >


  );
}

export default App;
