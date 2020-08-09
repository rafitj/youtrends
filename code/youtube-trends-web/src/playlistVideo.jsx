import React from "react";
import "./CSS/App.css";
import "./CSS/bootstrap.css";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from "react-bootstrap/Button";
import axios from 'axios'
import { url } from "./App.jsx"

function removeVideoFromPlaylist(playlistVideoID) {
    axios.delete(url + "/playlist-video",{
        params: {
            id: playlistVideoID
        }
    })
        .then(response => console.log(response))
        .catch(err => console.error(err))
}

function PlaylistVideo(thumbnail, title, views, date, ID, playlistVideoID, likes) {
    var urlYT = "https://youtube.com/watch?v=" + ID
    return (
        <Grid container xs={3} spacing={2} className="video" justify="center" style={{padding: "8px", margin: "20px" }}>
            <Grid item>
                <a href={urlYT}>
                    <ButtonBase>
                        <div className="imageBox">
                            <img alt="complex" src={thumbnail} className="videoImage" />
                        </div>
                    </ButtonBase>
                </a>
            </Grid>
            <Grid item>
                <Grid direction="column" spacing={2}>
                    <Grid item xs>
                        <Typography gutterBottom variant="h5">
                            {title.substring(0,20)}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {"Views: " + views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {"Published: " + date.substring(0, date.indexOf("00:00") - 1)}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {"Likes " + likes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Typography>
                        <Button variant="dark" className="videoButton" onClick={() => removeVideoFromPlaylist(playlistVideoID)}>Remove</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default PlaylistVideo;
