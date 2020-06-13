import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
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
    function queryDB() {
        fetch("http://localhost:5000/videos")
            .then((response) => { console.log(response) })
            .then((response) => setResult(response.data))
            .catch((err) => console.error(err));
    }

    useEffect(() => {
        queryDB();
    }, []);

    return (
        <div className="App">
            <p style={{ margin: "15px" }}>
                Click the button to get a new list of videos
      </p>
            <Button variant="primary" onClick={() => queryDB()}>
                Update
      </Button>
            <h2 style={{ marginTop: "20px" }}>Results</h2>
            {getVideoIDList(queryResult)}
        </div>
    );
}

export default App;
