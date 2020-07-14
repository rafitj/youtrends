import logging
import uuid

from flask import abort, jsonify, request, redirect, url_for, session, make_response

from app import app, models, db, oauth, youtube_api, decorators


@app.route("/")
def home():
    session_dict = dict(session)
    if 'profile' in session_dict and 'email' in session_dict['profile']:
        email = dict(session)['profile']['email']
        return f'Hello {email}! Try route videosByViews'
    return 'Hi! Please login.'


@app.route('/login')
def login():
    google = oauth.create_client('google')  # create the google oauth client
    redirect_uri = url_for('authorize', _external=True)
    return google.authorize_redirect(redirect_uri)


@app.route('/authorize')
def authorize():
    google = oauth.create_client('google')
    token = google.authorize_access_token()
    resp = google.get('userinfo')
    user_info = resp.json()
    user = oauth.google.userinfo()
    session['profile'] = user_info
    profile = session['profile']
    session.permanent = True
    # store in database
    user = models.User(
        id=profile['id'], first_name=profile['given_name'], last_name=profile['family_name'])
    db.session.merge(user)
    db.session.commit()
    redirecturl = f'http://localhost:3000/authorize?id=' + \
        profile["id"] + '&name=' + profile["name"]
    return redirect(redirecturl)


@app.route('/logout')
def logout():
    for key in list(session.keys()):
        session.pop(key)
    return redirect('/')


@app.route("/load-videos", methods=['GET'])
def loadYoutubeVideos():
    youtube_api.getVideos()
    return "Success"


@app.route("/videos", methods=['GET'])
def getAllVideos():
    videos = models.Video.query.limit(50)
    return jsonify([video.serialize() for video in videos])


@app.route("/videosByViews", methods=['GET'])
def getVideosByViews():
    videos = models.Video.query.order_by(models.Video.views.desc()).all()
    return jsonify([video.serialize() for video in videos])


@app.route("/playlists", methods=['GET'])
@decorators.auth_required
def getUserPlaylists():
    session_dict = dict(session)
    user_id = session_dict['profile']['id']
    playlists = models.Playlist.query.filter(
        models.Playlist.user_id == user_id)
    return jsonify([playlist.serialize() for playlist in playlists])


@app.route("/playlist-videos", methods=['GET'])
@decorators.auth_required
def getPlaylistVideos():
    playlist_id = request.args.get('id')
    videos = models.Video.query.join(models.PlaylistVideo, models.Video.id ==
                                     models.PlaylistVideo.video_id).add_column(models.PlaylistVideo.id).filter(models.PlaylistVideo.playlist_id == playlist_id).all()

    seralized_videos = [video[0].serialize() for video in videos]

    for vid in videos:
        seralized_videos[0].update({"playlist_video_id": vid[1]})

    return jsonify(seralized_videos)


@app.route("/playlist", methods=['POST'])
@decorators.auth_required
def createPlaylist():
    title = request.form.get('title')
    # TODO: Use Youtube API to create playlists (with API generated ids)
    id = uuid.uuid1()
    user_id = request.form.get('user_id')
    playlist = models.Playlist(id=id, title=title, user_id=user_id)
    db.session.add(playlist)
    db.session.commit()
    return "Successfully created new playlist"


@app.route("/playlist", methods=['DELETE'])
@decorators.auth_required
def deletePlaylist():
    # TODO: Make sure user can only delete their own playlist
    id = request.args.get('id')
    models.Playlist.query.filter_by(id=id).delete()
    db.session.commit()
    return "Successfully deleted playlist"


@app.route("/playlist-video", methods=['POST'])
@decorators.auth_required
def addPlaylistVideo():
    # TODO: Make sure user can only add to their own playlist
    playlist_id = request.form.get('playlist_id')
    video_id = request.form.get('video_id')
    id = uuid.uuid1()
    playlistVideo = models.PlaylistVideo(id=id,
                                         video_id=video_id, playlist_id=playlist_id)
    db.session.add(playlistVideo)
    db.session.commit()
    return "Successfully added video to playlist"


@app.route("/playlist-video", methods=['DELETE'])
@decorators.auth_required
def removePlaylistVideo():
    # TODO: Make sure user can only remove from their own playlist
    id = request.args.get('id')
    models.PlaylistVideo.query.filter_by(id=id).delete()
    db.session.commit()
    return "Successfully removed video from playlist"
