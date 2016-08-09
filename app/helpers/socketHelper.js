function uploadFinishedPromise(socket) {
  return new Promise((resolve, reject) => {
    socket.emit('status', {'msg': 'Saved !!', 'delay': 3000});
    socket.emit('doUpdate', {});
    resolve();
  });
}

module.exports = {
  uploadFinishedPromise
};
