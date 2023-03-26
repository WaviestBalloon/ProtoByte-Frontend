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
let firstTime = false;

window.addEventListener("load", () => {
	document.getElementById("live-status").innerHTML = `<div class="circle" style="background-color: rgb(107, 154, 255); box-shadow: 0 0 35px 2.5px rgb(107, 154, 255);"></div> <i style="color: rgba(107, 154, 255);">Connecting to backend server</i>`;
	
	const ws = new WebSocket("wss://protobyte-backend.wav.blue:443");
	
	ws.onopen = () => {
		console.log("Connected to server successfully");

		document.getElementById("command-count").innerHTML = "0";
		document.getElementById("message-count").innerHTML = "0";
		document.getElementById("guild-count").innerHTML = "0";
		document.getElementById("user-count").innerHTML = "0";
		document.getElementById("live-status").innerHTML = `<div class="livecircle"></div> <i style="color: rgb(255, 89, 89);">Live</i>`;

		ws.onclose = () => {
			console.log("Connection to server closed");
			document.getElementById("live-status").innerHTML = `<div class="circle" style="background-color: rgb(255, 89, 89); box-shadow: 0 0 35px 2.5px rgb(255, 89, 89);"></div> <i style="color: rgb(255, 89, 89);">Connection to backend server lost</i>`;
		}

		ws.onmessage = (event) => {
			console.log(`Received JSON: ${event.data}`);
			const data = JSON.parse(event.data);
			
			animateCounter(data.commandCount, 1000, document.getElementById("command-count"));
			animateCounter(data.messageCount, 1000, document.getElementById("message-count"));
			animateCounter(data.guildCount, 1000, document.getElementById("guild-count"));
			animateCounter(data.userCount, 1000, document.getElementById("user-count"));
		};
	}
	ws.onerror = () => {
		console.log("Connection to server closed due to a error");
		document.getElementById("live-status").innerHTML = `<div class="circle" style="background-color: rgb(255, 89, 89); box-shadow: 0 0 35px 2.5px rgb(255, 89, 89);"></div> <i style="color: rgb(255, 89, 89);">Failed to establish connection with backend server</i>`;
	}
});
