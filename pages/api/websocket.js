import WebSocket from "ws";

export default function handler(req, res) {
	if (req.method === "GET") {
		const wss = new WebSocket.Server({ noServer: true });

		wss.on("connection", (ws) => {
			ws.on("message", (message) => {
				// Handle incoming messages (e.g., new user input)
				ws.send(`Received message: ${message}`);
			});
		});

		res.socket.server.on("upgrade", (request, socket, head) => {
			wss.handleUpgrade(request, socket, head, (ws) => {
				wss.emit("connection", ws, request);
			});
		});

		res.end();
	}
}
