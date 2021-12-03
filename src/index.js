const express = require('express');

const app = express();
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Rutas
app.use(require('./routes/index'));
app.listen(5000, () => {
  console.log('server has started on port 5000');
});
