const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect('mongodb+srv://aircnc:aircnc@aircnc-ssjbp.mongodb.net/aircnc?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const connectedUsers = {};

io.on('connection', socket => {
    //console.log(socket.handshake.query);
    //console.log('Usuário conectado', socket.id);

    const { user_id } = socket.handshake.query;

    connectedUsers[user_id] = socket.id;

    //socket.on('omni', data => {
    //    console.log(data);
    //});
    //socket.emit('hello', 'World');
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
})

app.use(cors());

/*app.use(cors());
cors().corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};*/
  
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..','uploads')));
app.use(routes);

server.listen(3333);