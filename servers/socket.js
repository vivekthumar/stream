const socketIO = require('socket.io');
const { startRecording, stopRecording, getDevices } = require('../lib/ffmpeg');

const initSocketServer = async (server) => {
  const io = socketIO(server);
  
  io.on('connection', (socket) => {
    socket.on('getDevices', async () => {
      const data = await getDevices();
      socket.emit('deviceList', data)
    });

    socket.on('startRecording', (data) => {
      startRecording(data);
    });

    socket.on('stopRecording', () => {
      stopRecording();
    });
});
};

module.exports = {
  initSocketServer,
};
