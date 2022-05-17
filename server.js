const express = require("express");
const res = require("express/lib/response");
const { google } = require('googleapis');

const simba = google.youtube({
    version: 'v3',
    auth: 'AIzaSyD9jsK33LPEyUpoOD9axlqz1Z1QFpE4OxU'
});

// console.log("Here: ", tr);

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

        // .then(async (videos)  => {
            // return await Promise.resolve("<h1>another one</h1>");
            // console.log("DATA is here:", videos);
            // return Promise.resolve({
            //     videos: videos.data.items
            // });
            //     `
            //         <h1>${videoTitle}</h1>
            //         <ol>
            //             ${videos.data.items.map((vid) => `
            //                 <li style="padding: 1rem">    
            //                     <a href="https://www.youtube.com/watch?v=${vid.id.videoId}">${vid.snippet.title}</a>
            //                     <p>${vid.snippet.description}<p>
            //                 </li>
            //             `).join("")}
            //         </ol>
            //     `;
            // }); ;
};

app.use(`/simba/get-videos`, async (req, res) => {
    // console.log(req.query.videoTitle);
    getVideos(req.query.videoTitle, req.query.numVideos)
        .then(val => {
            console.log(val);
            res.send(
                `
                    <h1>${req.query.videoTitle}</h1>
                    <ol>
                        ${val.data.items.map((vid) => `
                            <li style="padding: 1rem">    
                                <a href="https://www.youtube.com/watch?v=${vid.id.videoId}">${vid.snippet.title}</a>
                                <p>${vid.snippet.description}<p>
                            </li>
                        `).join("")}
                    </ol>
                `
            );
        });
    // res.send(_getVideos.then(val => {
    //     console.log("Val: -->\n", val);
    //     return val;
    // }));
    // simba.search.list({
    //     "part": [
    //       "snippet",
          
    //     ],
    //     "maxResults": 25,
    //     "q": req.query.videoTitle
    // })
    //     // .then(res => res.json())
    //     .then(data  => {
    //         console.log("DATA is here:", data);
    //         res.send(
    //             `
    //                 <h1>${req.query.videoTitle}</h1>
    //                 <ol>
    //                     ${data.data.items.map((vid) => `
    //                         <li style="padding: 1rem">    
    //                             <a href="https://www.youtube.com/watch?v=${vid.id.videoId}">${vid.snippet.title}</a>
    //                             <p>${vid.snippet.description}<p>
    //                         </li>
    //                     `).join("")}
    //                 </ol>
    //             `
    //         );
    //     });
});

app.use("/", (req, res) => {
    res.send(
        `
        <form action="/simba/get-videos" method="GET">
            <label>Video Title</label>
            <input name="videoTitle" id="videoTitle" type="text" placeholder="Video title..." />

            <br />
            <label>Number of Videos</label>
            <input name="numVideos" numVideos="numVideos" type="text" placeholder="Number of videos to return..." />

            <br />
            <button type="submit">Submit</submit>
        </form>
        `
    );
});


app.listen(PORT, () => console.log(`Successful and listening on ${PORT}.`));
