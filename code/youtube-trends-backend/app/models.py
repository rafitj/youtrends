import json

from app import db
from sqlalchemy import String, Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

class Video(db.Model):
    id = Column(Integer, primary_key=True)
    title = Column(String(80), nullable=False)
    # category_id = Column(Integer)
    # channel = Column(Integer)
    # publish_time = Column(String(80))
    # tags = Column(String(80))
    # likes= Column(Integer)
    # views = Column(Integer)
    # dislikes = Column(Integer)
    # channel_title = Column(String(80))

    def serialize(self):
         return {
            'id': self.id,
            'title': self.title,
        }

    def __repr__(self):
        return '<Video %r>' % self.id


class User(db.Model):
    id = Column(Integer, primary_key=True)
    first_name = Column(String(80), nullable=False)
    last_name = Column(String(80))

    def serialize(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name
        }

    def __repr__(self):
        return '<User %r>' % self.id

class Playlist(db.Model):
    id = Column(Integer, primary_key=True)
    title = Column(String(80), nullable=False)
    user_id = Column(Integer, ForeignKey(User.id))
    
    user = relationship('User', foreign_keys='Playlist.user_id')


    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'user_id': self.user_id,
        }

    def __repr__(self):
        return '<Playlist %r>' % self.id


class PlaylistVideo(db.Model):
    id = Column(Integer, primary_key=True)
    playlist_id = Column(Integer, ForeignKey(Playlist.id))
    video_id = Column(Integer, ForeignKey(Video.id))
    
    video = relationship('Video', foreign_keys='PlaylistVideo.video_id')
    playlist = relationship('Playlist', foreign_keys='PlaylistVideo.playlist_id')

    def serialize(self):
        return {
            'playlist_id': self.playlist_id,
            'video_id': self.video_id,
        }

    def __repr__(self):
        return '<PlaylistVideo %r>' % self.playlist_id
