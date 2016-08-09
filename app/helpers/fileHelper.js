module.exports = {
  generateRandomFileName: (fileName) => {
    const extRegex = /(?:\.([^.]+))?$/;
    const fileExtension = extRegex.exec(fileName)[1];
    const now = new Date().getTime();
    const charBank = 'abcdefghijklmnopqrstuvwxyz';
    var fstring = '';
    for (var i = 0; i < 15; i++) {
      fstring += charBank[parseInt(Math.random() * 26, 10)];
    }
    return (fstring += now + '.' + fileExtension);
  }
};
