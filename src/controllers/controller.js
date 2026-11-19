const getHome = (req, res) => {
  res.send('Hello from Node backend!');
};

module.exports = { getHome };