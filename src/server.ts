import http from "http";
import app from "./app";
import initializeSocket from "./socket/socket";
import { setIo } from "./routes/call.route";

const server = http.createServer(app);
const io = initializeSocket(server);

setIo(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
