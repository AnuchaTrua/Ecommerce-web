//how to run project
//npm start
//nodemon server



//import
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
// auto import all route
const {readdirSync} = require('fs');



//middleware
app.use(morgan('tiny'));
app.use(express.json());
app.use(cors());

// use all route in 1 line
readdirSync("./routes").map((c) => app.use("/api", require("./routes/"+c)));




// run server
app.listen(5000, () => console.log("Server is runnign on port 5000"));