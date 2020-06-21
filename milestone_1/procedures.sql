-- The following are some few basic query procedures

-- Get all videos
CREATE PROCEDURE SelectAllVideos AS
SELECT * FROM Video ORDER BY views DESC;
GO;

-- Get all playlists
CREATE PROCEDURE SelectAllPlaylist AS
SELECT * FROM Playlist
GO;

-- Get all users
CREATE PROCEDURE SelectAllUser AS
SELECT * FROM User
GO;