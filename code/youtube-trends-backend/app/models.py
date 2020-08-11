import json

from app import db, utils
from sqlalchemy import String, Column, Integer, ForeignKey, Date, func
from sqlalchemy.orm import Session, relationship


class Video(db.Model):
    id = Column(String(255), primary_key=True)
    title = Column(String(255), nullable=False)
    category_id = Column(Integer)
    channel_id = Column(String(255), nullable=False)
    publish_time = Column(Date, nullable=False)
    tags = Column(String(255))
    likes = Column(Integer, nullable=False)
    views = Column(Integer, nullable=False)
    dislikes = Column(Integer, nullable=False)
    trending_country = Column(String(255))
    thumbnail = Column(String(255), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'category_id': self.category_id,
            'channel_id': self.channel_id,
            'publish_time': self.publish_time,
            'tags': self.tags,
            'views': self.views,
            'likes': self.likes,
            'dislikes': self.dislikes,
            'trending_country': self.trending_country,
            'url': utils.videoUrl(self.id),
            'thumbnail': self.thumbnail
        }

    def __repr__(self):
        return '<Video %r>' % self.id


class User(db.Model):
    id = Column(String(255), primary_key=True)
    first_name = Column(String(255))
    last_name = Column(String(255))

    def serialize(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name
        }

    def __repr__(self):
        return '<User %r>' % self.id


class Playlist(db.Model):
    id = Column(String(255), primary_key=True)
    title = Column(String(255), nullable=False)
    user_id = Column(String(255), ForeignKey(User.id))

    user = relationship('User', foreign_keys='Playlist.user_id')

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'user_id': self.user_id,
            'url': utils.playlistUrl(self.id)
        }

    def __repr__(self):
        return '<Playlist %r>' % self.id


class PlaylistVideo(db.Model):
    id = Column(String(255), primary_key=True)
    playlist_id = Column(String(255), ForeignKey(Playlist.id))
    video_id = Column(String(255), ForeignKey(Video.id))

    video = relationship('Video', foreign_keys='PlaylistVideo.video_id')
    playlist = relationship(
        'Playlist', foreign_keys='PlaylistVideo.playlist_id')

    def serialize(self):
        return {
            'id': self.id,
            'playlist_id': self.playlist_id,
            'video_id': self.video_id,
            'url': utils.playlistVideoUrl(self.video_id, self.playlist_id)
        }

    def __repr__(self):
        return '<PlaylistVideo %r>' % self.playlist_id
