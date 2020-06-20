import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";

function getVideoIDList(list) {
    console.log(list);
    return list.map((i) => (
        <ul>
            Title: {i.channel_title} - Release Date: {i.title}
        </ul>
    ));
}

function App() {
    const [queryResult, setResult] = useState([]);
    var video_id = "fh0a5KyyUQg";
    var video_filter;
    function queryDB() {
        fetch("http://localhost:5000/videos")
            .then((response) => { console.log(response) })
            .then((response) => setResult(response.data))
            .catch((err) => console.error(err));
    }


    // add keyword to filter
    function setFilter(filter) {
        console.log(filter)
        video_filter = filter;
        // idk fetch for the type or something
    }

    // add video playlist
    function addToPlaylist(id) {
        
    }

    useEffect(() => {
        queryDB();
    }, []);

    return (
        <div className="App">
            {/* filters  */}
            <p style={{ margin: "15px" }}>
                Click these to filter to the type of videos you like
            </p>
            <div id = "filters">
                <Button variant="primary" onClick={() => setFilter("Filter1")}>
                    Filter1
                </Button>
                <Button variant="primary" onClick={() => setFilter("Filter2")}>
                    Filter2
                </Button>
            </div>

            <p style={{ margin: "15px" }}>
                Click the button to get a new list of videos
            </p>
            <Button variant="primary" onClick={() => queryDB()}>
                Update
            </Button>
            <h2 style={{ marginTop: "20px" }}>Results</h2>
            {getVideoIDList(queryResult)}

            

            {/* player displays the first video of a fetched playlist */}
            <div id="player">
                <iframe width="400" height="300" src="https://www.youtube.com/embed/fh0a5KyyUQg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <Button variant="primary" onClick={() => addToPlaylist()}>
                Add To Playlist
            </Button>

            <p style={{ margin: "15px" }}>
                My Playlist Table
            </p>

            {/* table as saved playlist (?) */}
            <Table striped bordered hover responseive>
                        <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Action (delete)</th>
                </tr>
                </thead>
                {/* data goes here */}
                </Table>
        </div>
    );
}

export default App;
