import logging

from flask import abort, jsonify

from app import app, models


@app.route("/videos", methods=['GET'])
def getAllVideos():
    videos = models.Video.query.all()
    return jsonify([video.serialize() for video in videos])
