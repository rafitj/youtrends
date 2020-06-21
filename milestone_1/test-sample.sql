-- We used Flask SQLAlchemy as our application ORM 
-- We have translated our code into raw SQL syntax

-- DESCRIPTION: get all videos
-- SQL ALCHEMY: videos = models.Video.query.all()
SELECT * FROM video;

-- DESCRIPTION: get all videos ordered by views in descending order
-- SQL ALCHEMY: videos = models.Video.query.order_by(models.Video.views.desc()).all()
SELECT * FROM video ORDER BY video.views DESC;

-- DESCRIPTION: get all playlists 
-- SQL ALCHEMY: playlists = models.Playlist.query.all()
SELECT * FROM playlist;

-- DESCRIPTION: get the videos of a playlist given the playlist id
-- SQL ALCHEMY: 
--     videos = models.Video.query\
--     .join(PlaylistVideo, models.Video.id == models.PlaylistVideo.video_id)
--     .filter_by(PlaylistVideo.playlist_id == id)
SELECT video.* FROM playlist_video 
JOIN video ON playlist_video.video_id=video.id
WHERE playlist_video.playlist_id='<PLAYLIST_ID>'; 


-- DESCRIPTION: create a new playlist given id, title and user_id
-- SQL ALCHEMY:  
    -- playlist = models.Playlist(id=id, title=title, user_id=user_id)
    -- db.session.add(playlist
INSERT INTO playlist (id,title,user_id) VALUES('<PLAYLIST_ID>','<TITLE>','<USER_ID>');

-- DESCRIPTION: delete a playlist given id
-- SQL ALCHEMY:  
    -- models.Playlist.query.filter_by(id=id).delete()
DELETE FROM playlist WHERE id='<PLAYLIST_ID>';

-- DESCRIPTION: add video to a playlist given id, playlist_id and
-- SQL ALCHEMY:  
    --  playlistVideo = models.PlaylistVideo(id=id,video_id=video_id, playlist_id=playlist_id)
    --  db.session.add(playlistVideo)
INSERT INTO playlist_video (id,video_id,playlist_id) 
VALUES('<PLAYLISTVIDEO_ID>','<VIDEO_ID>','<PLAYLIST_ID>');
    
-- DESCRIPTION: remove a video from a playlist given id
-- SQL ALCHEMY:  
    -- models.PlaylistVideo.query.filter_by(id=id).delete()
DELETE FROM playlist_video WHERE id='<PLAYLISTVIDEO_ID>';