const express = require('express'),
      app = express();
const path = require('path');

// const port = process.env.PORT || 3000;
const port = 3000;

app.listen(port, () => {
  console.log('listening on port ' + port);
})


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, req.url));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
