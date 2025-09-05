const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Parse JSON POST requests
app.use(bodyParser.json());

// Webhook endpoint
app.post('/bunny-webhook', (req, res) => {
    console.log('Webhook received:');
    console.log(req.body);

    // You can handle different statuses here
    const { VideoLibraryId, VideoGuid, Status } = req.body;
    if (Status === 3) {
        console.log(`Video ${VideoGuid} finished processing!`);
    }

    // Respond 200 OK to Bunny.net
    res.status(200).send('OK');
});

// Start server
const PORT = 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
