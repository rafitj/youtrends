def videoUrl(id):
    return 'https://www.youtube.com/watch?v=' + id


def playlistUrl(id):
    return 'https://www.youtube.com/playlist?list=' + id


def playlistVideoUrl(video_id, playlist_id):
    return 'https://www.youtube.com/watch?v=' + video_id + 'list=' + playlist_id
