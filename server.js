const express = require('express');
const http = require('http');
const websocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new websocket.Server({ server });

let documents = "lmjoijoijo";

wss.on('connection', (ws) => {
    console.log('Ada yang masuk');

    ws.send(JSON.stringify({ type: 'init', data: documents }));

    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.type === 'update') {
                console.log(`Data: ${parsedMessage.type} ${parsedMessage.data}`);
                documents = parsedMessage.data;
                wss.clients.forEach((client) => {
                    if (client.readyState === websocket.OPEN) {
                        client.send(JSON.stringify({ type: 'update', data: documents || '' }));
                    }
                });
            }
        } catch (error) {
            console.error('pesan eror:', error);
        }
    });
    ws.on('close', () => {
        console.log('Ada yang keluar');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});