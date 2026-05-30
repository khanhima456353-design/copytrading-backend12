"use strict";

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
global.io = io;

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/', (_req, res) => res.send('Placeholder server running.'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('disconnect', () => console.log('socket disconnected', socket.id));
});

// Small notice to assist future merges
console.log('server.js replaced by minimal startup bootstrap (conflict cleanup)');

module.exports = { app, server };
