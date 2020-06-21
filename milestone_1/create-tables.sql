-- The following are queries to create our 4 existing tables:

-- Video table:
CREATE TABLE video 
  ( 
     title            VARCHAR(255) NOT NULL, 
     id               VARCHAR(255) NOT NULL PRIMARY KEY, 
     category_id      INT NULL, 
     channel_id       VARCHAR(255) NULL, 
     publish_time     DATETIME NOT NULL, 
     tags             VARCHAR(255) NULL, 
     views            INT NOT NULL, 
     likes            INT NOT NULL, 
     dislikes         INT NOT NULL, 
     trending_country VARCHAR(255) NULL 
  ); 

  -- User table
  CREATE TABLE USER 
  ( 
     id         VARCHAR(255) NOT NULL PRIMARY KEY, 
     last_name  VARCHAR(255) NULL, 
     first_name VARCHAR(255) NULL 
  ); 

  -- Playlist table
  CREATE TABLE playlist 
  ( 
     id      VARCHAR(255) NOT NULL PRIMARY KEY, 
     title   VARCHAR(255) NOT NULL, 
     user_id VARCHAR(255) NOT NULL, 
     FOREIGN KEY (user_id) REFERENCES USER (id) 
  ); 

  -- PlaylistVideo table
  CREATE TABLE playlist_video 
  ( 
     id          VARCHAR(255) NOT NULL PRIMARY KEY, 
     playlist_id VARCHAR(255) NULL, 
     video_id    VARCHAR(255) NULL, 
     FOREIGN KEY (playlist_id) REFERENCES playlist (id), 
     FOREIGN KEY (video_id) REFERENCES video (id) 
  ); 