const express = require("express");
const { google } = require('googleapis');

const simba = google.youtube({
    version: 'v3',
    auth: 'AIzaSyD9jsK33LPEyUpoOD9axlqz1Z1QFpE4OxU'
});

const app = express();
const PORT = 3000;

const getVideos = async (videoTitle, numVideos=25) => {
    const search = simba.search.list({
        "part": [
          "snippet"
        ],
        "maxResults": numVideos,
        "q": videoTitle
    });
    return search;
};

app.use(`/simba/get-videos`, async (req, res) => {
    getVideos(req.query.videoTitle, req.query.numVideos)
        .then(val => {
            const videos = [];
            val.data.items.map(video => {
                videos.push({
                    videoIframe: `<iframe width="480" height="360" src="https://www.youtube.com/watch?v=${video.id.videoId}"></iframe>`,
                    videoURL: `https://www.youtube.com/watch?v=${video.id.videoId}`,
                    videoID: video.id.videoId,
                    videoTitle: video.snippet.title,
                    videoDescription: video.snippet.description,
                    videoThumbnail: {
                        image: video.snippet.thumbnails.high.url,
                        width: video.snippet.thumbnails.high.width,
                        height: video.snippet.thumbnails.high.height
                    }
                });
            });

            res.json(videos);
        });
});


app.listen(PORT, () => console.log(`Successful and listening on ${PORT}.`));
