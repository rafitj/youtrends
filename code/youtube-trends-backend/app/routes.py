import logging
import uuid

from flask import abort, jsonify, request

from app import app, models, db


@app.route("/videos", methods=['GET'])
def getAllVideos():
    videos = models.Video.query.all()
    return jsonify([video.serialize() for video in videos])


@app.route("/playlists", methods=['GET'])
def getUserPlaylists():
    playlists = models.Playlist.query.all()
    return jsonify([playlist.serialize() for playlist in playlists])


@app.route("/playlist-videos", methods=['GET'])
def getPlaylistVideos():
    id = request.args.get('id')
    playlistVideos = models.PlaylistVideo.query.filter_by(playlist_id=id)
    videos = []
    for video in playlistVideos:
        v = models.Video.query.filter_by(id=video.video_id).first()
        videos.append(v)
    return jsonify([video.serialize() for video in videos])

# TODO: Use Youtube API to create playlists (with API generated ids)
# @app.route("/playlist", methods=['POST'])
# def createPlaylist():
#     pass


@app.route("/playlist", methods=['DELETE'])
def deletePlaylist():
    id = request.args.get('id')
    models.Playlist.query.filter_by(id=id).delete()
    db.session.commit()
    return "Successfully deleted playlist"


@app.route("/playlist-video", methods=['POST'])
def addPlaylistVideo():
    playlist_id = request.form.get('playlist_id')
    video_id = request.form.get('video_id')
    playlistVideo = models.PlaylistVideo(
        id=uuid.uuid1(),
        video_id=video_id, playlist_id=playlist_id)
    db.session.add(playlistVideo)
    db.session.commit()
    return "Successfully added video to playlist"


@app.route("/playlist-video", methods=['DELETE'])
def removePlaylistVideo():
    id = request.args.get('id')
    models.PlaylistVideo.query.filter_by(id=id).delete()
    db.session.commit()
    return "Success removed video from playlist"

# TODO: Use Youtube API to dynamically insert videos
# @app.route("/video", methods=['POST'])
# def insertVideo():
#     pass
