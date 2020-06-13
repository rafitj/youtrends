import logging

from flask import abort, jsonify, request

from app import app, models, db


@app.route("/videos", methods=['GET'])
def getAllVideos():
    videos = models.Video.query.all()
    return jsonify([video.serialize() for video in videos])


@app.route("/video", methods=['POST'])
def insertVideo():
    title = request.form.get('title')
    id = request.form.get('id')
    video = models.Video(id=id, title=title)
    db.session.add(video)
    db.session.commit()
    return jsonify(video.serialize())
