const ffmpeg = require('ffmpeg-static');
const { exec } = require('child_process');

let recordingProcess;

const startRecording = (data) => {
  stopRecording();
  const command = `${ffmpeg} -f avfoundation  -framerate 30 -video_size 1280x720 -pix_fmt uyvy422 -isync 0 -i "${data.video}:${data.audio}" -c:v h264_videotoolbox -profile:v main -realtime true -coder cavlc -b:v 1200k -bf 0 -force_key_frames "expr:gte(t,n_forced*2)" -c:a aac -b:a 256k -ar 44100 -f flv "rtmp://localhost/live/test"`;
  recordingProcess = exec(command);
}

const stopRecording = () => {
  if (recordingProcess) {
      recordingProcess.kill('SIGINT');
      recordingProcess = null;
  }
}

const getRecording = () => {
  return recordingProcess
}

const filterDevices = (data) => {
  const finalArr = [];
  for (let i = 0; i < data.length; i += 1) {
    let str = data[i];
    if (str.includes('[AVFoundation indev @')) {
      str = str.replace(/\[AVFoundation indev \@/g, '');
      const fulldata = str.split('[');
      if (fulldata.length > 1) {
        const final = fulldata[1].split(']');
        finalArr.push({id: final[0], title: final[1]})
      }
    }
  }
  return finalArr;
}

const getDevices = async () => {
  return new Promise(function (resolve, reject) { 
    const command = `${ffmpeg} -f avfoundation -list_devices true -i ""`;
    exec(command, (err, stdout, stderr) => { 
      const fullData = stderr.split('AVFoundation video devices:');
      const validData = fullData[1].split('AVFoundation audio devices:');
      let videoData = validData[0].trim().split('\n');
      let audioData = validData[1].trim().split('\n');
      const videoDevice = filterDevices(videoData);
      const audioDevice = filterDevices(audioData)
      resolve({videoDevice, audioDevice})
    });
  })
}

module.exports = {
  startRecording,
  stopRecording,
  getRecording,
  getDevices,
};