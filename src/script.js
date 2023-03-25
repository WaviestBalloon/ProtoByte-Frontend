const ws = new WebSocket("wss://protobyte-backend.wav.blue:443");

function animateCounter(newValue, duration, counterElement) {
	const startTimestamp = performance.now();
	const endTimestamp = startTimestamp + duration;
	let currentValue = parseInt(counterElement.innerText);

	function updateCounter(timestamp) {
		const timeLeft = endTimestamp - timestamp;
		const progress = 1 - timeLeft / duration;

		currentValue = Math.round(progress * (newValue - currentValue) + currentValue);
		counterElement.innerText = currentValue;

		if (timeLeft > 0) {
			requestAnimationFrame(updateCounter);
		}
	}

	requestAnimationFrame(updateCounter);
}

ws.onopen = () => {
	console.log("Connected to server successfully");

	document.getElementById("command-count").innerHTML = "0";
	document.getElementById("message-count").innerHTML = "0";
	document.getElementById("guild-count").innerHTML = "0";
	document.getElementById("user-count").innerHTML = "0";

	ws.onmessage = (event) => {
		console.log(`Received JSON: ${event.data}`);
		const data = JSON.parse(event.data);
		animateCounter(data.commandCount, 1000, document.getElementById("command-count"));
		animateCounter(data.messageCount, 1000, document.getElementById("message-count"));
		animateCounter(data.guildCount, 1000, document.getElementById("guild-count"));
		animateCounter(data.userCount, 1000, document.getElementById("user-count"));
	};
}
