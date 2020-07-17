import React from "react";
import "./CSS/App.css";
import "./CSS/bootstrap.css";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from "react-bootstrap/Button";
import axios from 'axios'
import Cookies from "universal-cookie";

const url = "http://127.0.0.1:5000"
const cookies = new Cookies()

function addVideoToPlaylist(videoID) {
    if (!cookies.get('playlist_ID')) {
        return
    }

    axios.post(url + "/playlist-video",
        {
            playlist_id: cookies.get('playlist_ID'),
            video_id: videoID
        })
        .then(response => console.log(response))
        .catch(err => console.error(err))
}

function Video(thumbnail, title, views, date, ID, likes) {
    var url = "https://youtube.com/watch?v=" + ID
    return (
        <Grid container xs={3} spacing={2} className="video" justify="center" style={{padding: "8px", margin: "20px" }}>
            <Grid item>
                <a href={url}>
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
                        <Button variant="dark" className="videoButton" onClick={() => addVideoToPlaylist(ID)}>Add to Playlist</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Video;
