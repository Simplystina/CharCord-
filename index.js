const { server } = require("./server")
require("dotenv").config();
const {connect} = require("./Database/index")

connect()

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
