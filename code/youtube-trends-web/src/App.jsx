import React, { useState, useEffect } from "react";
import "./CSS/App.css";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import "./CSS/bootstrap.css";
import axios from 'axios'
import NavBar from "./Navbar.jsx"
import Video from "./video.jsx"
import defaultThumbnail from "./Assets/defaultVideo.png"
import Grid from '@material-ui/core/Grid';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import PlaylistVideo from './playlistVideo.jsx'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import 'query-string'
import { parse } from "query-string";
import Cookies from 'universal-cookie';
import '../node_modules/react-vis/dist/style.css';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineMarkSeries, ChartLabel, VerticalGridLines } from 'react-vis';

const cookies = new Cookies()

// export const url = "http://127.0.0.1:5000"
export const url = "https://cs348-project-279101.uc.r.appspot.com"

function displayVideos(videos) {
    if (!Array.isArray(videos)) {
        return
    }

    return videos.map((video) => (
        Video(video.thumbnail.includes(".jpg") ? video.thumbnail : defaultThumbnail, video.title, video.views, video.publish_time, video.id, video.likes)
    )).slice(0, 50);
}

function displayPlaylistVideos(videos) {
    if (!Array.isArray(videos)) {
        return
    }

    return videos.map((video) => (
        PlaylistVideo(video.thumbnail.includes(".jpg") ? video.thumbnail : defaultThumbnail, video.title, video.views, video.publish_time, video.id, video.playlist_video_id, video.likes)
    ));
}

function createLineGraph(data, xLabel, yLabel) {
    return <div style={{ marginLeft: 300, marginTop: 50, paddingBottom: 20 }}>
        <XYPlot width={700} height={500} >
            <HorizontalGridLines />
            <VerticalGridLines />
            <XAxis />
            <YAxis />
            <ChartLabel
                text={xLabel}
                className="alt-x-label"
                xPercent={0.5}
                yPercent={0.92}
            />

            <ChartLabel
                text={yLabel}
                className="alt-y-label"
                xPercent={0.015}
                yPercent={0.5}
                style={{
                    transform: 'rotate(-90)',
                  }}
            />
            <LineMarkSeries
                className="linemark-series-example"
                style={{
                    strokeWidth: '3px'
                }}
                lineStyle={{ stroke: 'red' }}
                markStyle={{ stroke: 'blue' }}
                data={data}
            />
        </XYPlot>
    </div>
}

function App() {
    const [videos, setVideos] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [playlistVideos, setPlaylistVideos] = useState([]);
    const [startDate, setDate] = useState(new Date());
    const [query, setQuery] = useState("");

    function getVideos() {
        axios.get(url + "/videos")
            .then(response => setVideos(response.data))
            .catch(err => console.error(err))
    }

    function getVideosByViews() {
        axios.get(url + "/videosByViews")
            .then(response => setVideos(response.data))
            .catch(err => console.error(err))
    }

    // Sorting by Likes
    function getVideosByLikes() {
        axios.get(url + "/videosByLikes")
            .then(response => setVideos(response.data))
            .catch(err => console.error(err))
    }

    // Sorting by likes ratio
    function getVideosByLikesRatio() {
        axios.get(url + "/videosByLikesRatio")
            .then(response => setVideos(response.data))
            .catch(err => console.error(err))
    }

    // Sorting by Country with key being the string of the country
    function getVideosByCountry(key) {
        axios.get(url + "/videosTrendingByCountry", {
            params: {
                country: key
            }
        })
            .then(response => setVideos(response.data))
            .catch(err => console.error(err))
    }

    function getVideosByDate(key) {
        key.setHours(-4) //To convert hour to midnight
        axios.get(url + "/videosOnDate", {
            params: {
                date: key.toUTCString()
            }
        })
            .then(response => setVideos(response.data))
            .catch(err => console.error(err))
    }

    function search() {
        axios.get(url + "/search", {
            params: {
                query: query
            }
        })
            .then(response => setVideos(response.data))
            .catch(err => console.error(err))
    }

    function getPlaylistVideos() {
        //If playlist_ID is set, get the videos from it
        if (cookies.get('playlist_ID')) {
            axios.get(url + "/playlist-videos", {
                params: {
                    id: cookies.get('playlist_ID')
                }
            })
                .then(response => setPlaylistVideos(response.data))
                .catch(err => console.error(err))
            return
        }

        //Otherwise if user is logged in, check for their playlists
        if (cookies.get('user_name') && cookies.get('user_id')) {
            axios.get(url + "/playlists")
                .then(response => setPlaylists(response.data))
                .catch(err => console.error(err))
        } else {
            return
        }

        //If they have a playlist, get videos, otherwise make a playlist and set playlist_ID
        if (Array.isArray(playlists) && playlists.length > 0) {
            cookies.set('playlist_ID', playlists[0].id)
            axios.get(url + "/playlist-videos", {
                params: {
                    id: cookies.get('playlist_ID')
                }
            })
                .then(response => setPlaylistVideos(response.data))
                .catch(err => console.error(err))
        } else {
            axios.post(url + "/playlist",
                {
                    title: "Default Playlist Title, Milestone 2",
                    user_id: cookies.get('user_id')
                })
                .then(response => cookies.set('playlist_ID', response.data))
                .catch(err => console.error(err))
        }
    }

    function updateDBWithYoutubeAPI() {
        axios.get(url + "/load-videos")
            .catch(err => console.error(err))
    }

    useEffect(() => {
        getVideos();
        getPlaylistVideos();
        //query for analytics
    }, []);

    function videosPage() {
        return (
            <div>
                <div className="filters">
                    <h3>Filters</h3>
                    <Grid container xs={3} sm spacing={1}>
                        <Grid item>
                            <Button variant="dark" className="filterButton" onClick={() => getVideos()}>Unsorted</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="dark" className="filterButton" onClick={() => getVideosByViews()}>Sort by Views</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="dark" className="filterButton" onClick={() => getVideosByLikes()}>Sort by Likes</Button>
                        </Grid>
                        <Grid item>
                            {/* <Button variant="dark" className="filterButton" onClick={() => getVideosByLikesRatio()}>Sort by Likes Ratio</Button> */}
                        </Grid>
                        <Grid item>
                            <Button variant="warning" className="filterButton" onClick={() => updateDBWithYoutubeAPI()}>Update DB with Youtube API</Button>
                        </Grid>
                        <Grid item>
                            <Dropdown>
                                <Dropdown.Toggle variant="dark" id="dropdown-basic" >
                                    Sort By Trending Country
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => getVideosByCountry("US")}>US</Dropdown.Item>
                                    <Dropdown.Item onClick={() => getVideosByCountry("CA")}>Canada</Dropdown.Item>
                                    <Dropdown.Item onClick={() => getVideosByCountry("JP")}>Japan</Dropdown.Item>
                                    <Dropdown.Item onClick={() => getVideosByCountry("RU")}>Russia</Dropdown.Item>
                                    <Dropdown.Item onClick={() => getVideosByCountry("MX")}>Mexico</Dropdown.Item>
                                    <Dropdown.Item onClick={() => getVideosByCountry("KR")}>South Korea</Dropdown.Item>
                                    <Dropdown.Item onClick={() => getVideosByCountry("IN")}>India</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Grid>
                        <Grid item>
                            <DayPickerInput placeholder={"Sort By Publish Date"} onDayChange={formattedVal => getVideosByDate(formattedVal)} />
                        </Grid>
                        <Grid item>
                            <input type="text" placeholder="Search" onChange={s => setQuery(s.target.value)} />
                        </Grid>
                        <Grid item>
                            <Button variant="dark" className="filterButton" onClick={() => search()}>Search</Button>
                        </Grid>
                    </Grid>
                </div>
                <div className="videosCollection">
                    <Grid container xs={3} sm spacing={2} style={{ padding: "8px", marginLeft: "16px" }}>
                        {displayVideos(videos)}
                    </Grid>
                </div>
            </div>
        );
    }

    const data = new Array(20).fill(0).reduce((prev, curr) => [...prev, {
        x: Math.random() * 20,
        y: Math.random() * 20
    }], []);

    function analyticsPage() {
        return (
            <div>
                <div className="playlist">
                    <h2>analytics</h2>
                </div>
                <div className="statsText">
                    <h3>Subscribers vs Date</h3>
                    {createLineGraph([{ x: 1, y: 10 }, { x: 2, y: 5 }, { x: 3, y: 15 }], "Date", "Subscribers")}
                </div>
                <div className="statsText">
                    <h3>Viewers vs Date</h3>
                    {createLineGraph([{ x: 1, y: 10 }, { x: 2, y: 5 }, { x: 3, y: 15 }], "Date", "Viewers")}
                </div>
                <div className="statsText">
                    <h3>Likes vs Date</h3>
                    {createLineGraph([{ x: 1, y: 10 }, { x: 2, y: 5 }, { x: 3, y: 15 }], "Date", "Likes")}
                </div>
            </div>
        );
    }

    function playlistPage() {
        return (
            <div>
                <div className="playlist">
                    <h3>Playlist</h3>
                    <Button variant="dark" className="playlistButton" onClick={() => getPlaylistVideos()}>Update</Button>
                </div>
                <div className="videosCollection">
                    <Grid container xs={3} sm spacing={2} style={{ padding: "8px", marginLeft: "16px" }}>
                        {displayPlaylistVideos(playlistVideos)}
                    </Grid>
                </div>
            </div>
        );
    }

    function auth() {
        let user_data = parse(window.location.search)
        if (user_data.id && user_data.name) {
            cookies.set('user_id', user_data.id);
            cookies.set('user_name', user_data.name);
        }
        return <Redirect to='/' />
    }

    return (
        <div className="App">
            <NavBar />
            <Router>
                <Switch>
                    <Route exact path="/videos">
                        {videosPage()}
                    </Route>
                    <Route exact path="/playlist">
                        {playlistPage()}
                    </Route>
                    <Route exact path="/authorize">
                        {auth()}
                    </Route>
                    <Route path="/analytics">
                        {analyticsPage()}
                    </Route>
                    <Route path="/">
                        {videosPage()}
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
