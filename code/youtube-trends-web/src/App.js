import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

function getVideoIDList(list) {
  console.log(list)
  return list.map(i => 
    <ul>Title: {i.title}, By: {i.channel_title}</ul>
  );
}

function App() {
  
  const [queryResult, setResult ] = useState([])
  const [limitNumber, setLimit ] = useState(15)

  function queryDB() {
    fetch('https://cs348-project-279101.uc.r.appspot.com/getVideos', {
      params: {
        limit: limitNumber
      }
    })
    .then(response => response.json())
    .then(response => setResult(response.data))
    .catch(err => console.error(err))
  }

  useEffect(() => {
    queryDB()
  }, [])

  return (
    <div className="App">
      <p style = {{margin:"15px"}}>Choose the number of results you want returned from the database</p>
      <input style = {{margin:"15px"}} type="number" min = "1" max = "300" onChange = {e => setLimit(e.target.value)}/>
      <Button variant="primary" onClick = { () => queryDB()}>Submit</Button>
      <h2 style = {{marginTop:"20px"}}>Results</h2>
      {getVideoIDList(queryResult)}
    </div>
  );
}

export default App;
