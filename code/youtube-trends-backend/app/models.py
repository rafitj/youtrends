import json

from app import db


class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return '<Video %r>' % self.id
