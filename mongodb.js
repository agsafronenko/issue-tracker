const mongoose = require("mongoose");
const db = mongoose
  .connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((connection) => {
    console.log(`Connected to Mongo database "${connection.connections[0].name}"`);
  })
  .catch((error) => {
    console.error("error connecting to mongo");
    console.error;
  });

module.exports = db;
