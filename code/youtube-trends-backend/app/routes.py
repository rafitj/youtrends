import logging

from flask import abort, jsonify

from app import app, models


@app.route("/")
def home():
    x = models.Video.query.all()
    return jsonify([i.id for i in x])
