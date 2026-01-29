const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('injurybot dev server running');
});

app.listen(3000, () => {
  console.log('injurybot running on port 3000');
});
