-- We used Flask SQLAlchemy as our application ORM 
-- We have translated our code into raw SQL syntax

-- DESCRIPTION: get all videos
-- SQL ALCHEMY: videos = models.Video.query.all()
SELECT * FROM video LIMIT 15;

-- DESCRIPTION: get all videos ordered by views in descending order
-- SQL ALCHEMY: videos = models.Video.query.order_by(models.Video.views.desc()).all()
SELECT * FROM video ORDER BY video.views DESC LIMIT 15;

-- DESCRIPTION: get all playlists 
-- SQL ALCHEMY: playlists = models.Playlist.query.all()
SELECT * FROM playlist LIMIT 15;

SELECT * FROM playlist_video;
-- No need to limit since there is only 1 tuple

-- DESCRIPTION: get the videos of a playlist given the playlist id
-- SQL ALCHEMY: 
--     videos = models.Video.query\
--     .join(PlaylistVideo, models.Video.id == models.PlaylistVideo.video_id)
--     .filter_by(PlaylistVideo.playlist_id == id)
SELECT video.* FROM video, playlist_video 
WHERE video.id=playlist_video.video_id;
-- No need to limit since only 1 is returned in our example