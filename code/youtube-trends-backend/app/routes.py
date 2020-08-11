import logging
import uuid
from datetime import datetime

from flask import abort, jsonify, request, redirect, url_for, session, make_response

from app import app, models, db, oauth, youtube_api, decorators


@app.route("/")
def home():
    session_dict = dict(session)
    if 'profile' in session_dict and 'email' in session_dict['profile']:
        email = dict(session)['profile']['email']
        return f'Hello {email}! Try route videosByViews'
    return 'Hi! Please login.'


@app.route('/search')
def search():
    query = "%" + request.args.get('query') + "%"
    videos = models.Video.query.filter(
        (models.Video.title.like(query)) | (models.Video.id == query)).all()
    print(videos)
    return jsonify([video.serialize() for video in videos])


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


@app.route("/videosByLikes", methods=['GET'])
def getVideosByLikes():
    videos = models.Video.query.order_by(models.Video.likes.desc()).all()
    return jsonify([video.serialize() for video in videos])

# @app.route("/videosByLikesRatio", methods=['GET'])
# def getVideosByLikeRatio():
#     videos = models.Video.query.order_by(models.Video.likes.desc()).all()
#     return jsonify([video.serialize() for video in videos])

# Filter by country then views - filter by trending status if possible?


@app.route("/videosTrendingByCountry", methods=['GET'])
def getVideosByCountry():
    country = request.args.get('country')
    videos = models.Video.query.filter(
        models.Video.trending_country == country).order_by(models.Video.likes.desc()).all()
    return jsonify([video.serialize() for video in videos])

# TODO: Parse date? Verify date format from frontend


@app.route("/videosOnDate", methods=['GET'])
def getVideosOnDate():
    date = request.args.get('date')
    fmt = '%a, %d %b %Y %H:%M:%S'
    print("the date provided is ", datetime.strptime(date[:-4], fmt))
    videos = models.Video.query.filter(models.Video.publish_time == datetime.strptime(
        date[:-4], fmt)).order_by(models.Video.likes.desc()).all()
    return jsonify([video.serialize() for video in videos])

# Data visualization routes


@app.route("/playlistvids-vs-views", methods=['GET'])
def commonPlaylistVids():
    result = db.session.query(db.func.count(models.PlaylistVideo.video_id).label('vidCount'), models.PlaylistVideo.video_id.label(
        'vidID')).group_by(models.PlaylistVideo.video_id).order_by(db.func.count(models.PlaylistVideo.video_id).desc()).limit(20).all()
    data = [{'x': vid, 'y': views} for (vid, views) in result]
    return jsonify(data)


@app.route("/countries-vs-views", methods=['GET'])
def countriesVsViews():
    result = db.session.query(models.Video.trending_country.label('countryX'), db.func.sum(
        models.Video.views).label('total views')).group_by(models.Video.trending_country).all()
    data = [{'x': country, 'y': int(views)} for (country, views) in result]
    return jsonify(data)


@app.route("/channel-vs-views", methods=['GET'])
def channelVsViews():
    result = db.session.query(models.Video.channel_id.label('channelX'), db.func.sum(
        models.Video.views).label('total views')).group_by(models.Video.channel_id).limit(20).all()
    data = [{'x': channel, 'y': int(views)} for (channel, views) in result]
    return jsonify(data)

# playlist routes


@app.route("/playlists", methods=['GET'])
def getUserPlaylists():
    user_id = request.args.get('user_id')
    playlists = models.Playlist.query.filter(
        models.Playlist.user_id == user_id)
    return jsonify([playlist.serialize() for playlist in playlists])


@app.route("/playlist-videos", methods=['GET'])
def getPlaylistVideos():
    playlist_id = request.args.get('id')
    videos = models.Video.query.join(models.PlaylistVideo, models.Video.id ==
                                     models.PlaylistVideo.video_id).add_column(models.PlaylistVideo.id).filter(models.PlaylistVideo.playlist_id == playlist_id).all()
    seralized_videos = [video[0].serialize() for video in videos]

    for i, vid in enumerate(videos):
        seralized_videos[i].update({"playlist_video_id": vid[1]})

    return jsonify(seralized_videos)


@app.route("/playlist", methods=['POST'])
def createPlaylist():
    # TODO: Use Youtube API to create playlists (with API generated ids)
    title = request.get_json().get('title')
    id = uuid.uuid1()
    user_id = request.get_json().get('user_id')
    playlist = models.Playlist(id=id, title=title, user_id=user_id)
    db.session.add(playlist)
    db.session.commit()
    return jsonify(playlist_id=id)


@app.route("/playlist", methods=['DELETE'])
def deletePlaylist():
    # TODO: Make sure user can only delete their own playlist
    id = request.args.get('id')
    models.Playlist.query.filter_by(id=id).delete()
    db.session.commit()
    return "Successfully deleted playlist"


@app.route("/playlist-video", methods=['POST'])
def addPlaylistVideo():
    # TODO: Make sure user can only add to their own playlist
    playlist_id = request.get_json().get('playlist_id')
    video_id = request.get_json().get('video_id')
    id = uuid.uuid1()
    playlistVideo = models.PlaylistVideo(id=id,
                                         video_id=video_id, playlist_id=playlist_id)
    db.session.add(playlistVideo)
    db.session.commit()
    return "Successfully added video to playlist"


@app.route("/playlist-video", methods=['DELETE'])
def removePlaylistVideo():
    # TODO: Make sure user can only remove from their own playlist
    id = request.args.get('id')
    models.PlaylistVideo.query.filter_by(id=id).delete()
    db.session.commit()
    return "Successfully removed video from playlist"
