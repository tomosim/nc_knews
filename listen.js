const app = require("./app");
const PORT = process.env.PORT || 9090;
app.listen(9090, console.log(`app is listening on port ${PORT}`));
