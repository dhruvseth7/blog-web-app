module.exports.getDate = function() {
    const options = { weekday: 'long', year: 'numeric', month: 'long'};
    let date = new Date().toLocaleDateString('en-US', options);
    let time = new Date().toLocaleTimeString('en-US');
    return date + ", " + time;
}

module.exports.getRandomInt = function(max) {
  return Math.ceil(Math.random() * Math.floor(max));
}
