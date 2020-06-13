import logging

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
    p_id = request.args.get('id')
    playlistVideos = models.PlaylistVideo.query.filter_by(playlist_id=p_id)
    videos = []
    for video in playlistVideos:
        v = models.Video.query.filter_by(id=video.video_id).first()
        videos.append(v)
    return jsonify([video.serialize() for video in videos])


@app.route("/playlist", methods=['POST'])
def createPlaylist():
    pass


@app.route("/playlist", methods=['DELETE'])
def deletePlaylist():
    pass


@app.route("/playlist", methods=['PUT'])
def updatePlaylist():
    pass


@app.route("/playlist", methods=['POST'])
def addPlaylisVideo():
    pass


@app.route("/playlist", methods=['DELETE'])
def removePlaylistVideo():
    pass


# @app.route("/video", methods=['POST'])
# def insertVideo():
#     title = request.form.get('title')
#     id = request.form.get('id')
#     video = models.Video(id=id, title=title)
#     db.session.add(video)
#     db.session.commit()
#     return jsonify(video.serialize())
