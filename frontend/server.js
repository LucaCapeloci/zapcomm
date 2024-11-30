//simple express server to run frontend production build;
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
app.use(express.static(path.join(__dirname, "build")));
app.get("/*", function (req, res) {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(port, host);
