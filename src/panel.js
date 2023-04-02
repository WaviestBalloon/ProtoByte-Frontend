const queries = new URLSearchParams(window.location.search);
const baseUrl = "https://protobyte-backend.wav.blue"; // "http://localhost:8686"
let requestHeaders = new Headers();
let leToken = null;

const kaomojis = [
	//"happy": [
	"(´｡• ω •｡`)",
	"(´｡• ᵕ •｡`)",
	"(´｡• ω •｡`)",
	"\\(★ω★)/",
	"＼(＾▽＾)／",
	"(„• ֊ •„)",
	"o(>ω<)o",
	"(´• ω •`)",
	"( ´ ω ` )",
	"(i am in your basement)",
	"(´｡• ω •｡`)",
	"(≧◡≦)",
	"(⌒ω⌒)",
	"(✧ω✧)",
	"( ´ ▽ ` )",
	"(๑˃ᴗ˂)ﻭ"
]

function randomKaomoji() {
	return kaomojis[Math.floor(Math.random() * kaomojis.length)];
}

async function configGuild(id) {
	await fetch(`${baseUrl}/api/getGuildSettings?guildId=${id}`, {
		headers: {
			"Authorization": `Bearer ${leToken}`
		},
		method: "GET"
	}).then((res) => {
		if (res.status === 200) {
			res.json().then((data) => {
				alert(JSON.stringify(data))
			});
		} else {
			document.getElementById("guilds-status").innerHTML = "An error occurred while trying to get the selected guild settings. :(";
		}
	});
}

window.addEventListener("load", async () => {
	if (queries.get("token")) {
		document.cookie = `token=${queries.get("token")}; path=/;`;
		window.location.href = "https://fur.dev/protobyte/panel";
	} else {
		if (!document.cookie.includes("token")) {
			window.location.href = "https://discord.com/api/oauth2/authorize?client_id=1032717880065802250&redirect_uri=https%3A%2F%2Fprotobyte-backend.wav.blue%2Fapi%2Fauthenticate&response_type=code&scope=identify%20guilds";
		}
		leToken = document.cookie.split("token=")[1].split(";")[0];
	}
	document.getElementById("authbanner").style.display = "none";

	await fetch("https://protobyte-backend.wav.blue/api/status").then((res) => {
		if (res.status === 200) {
			console.log("Backend reachable");
			res.json().then((data) => {
				document.getElementById("apifooter").innerHTML = `Served ${data.served.toLocaleString("en-GB")} requests - Running on <b>wav.blue</b> infrastructure ${randomKaomoji()}`;
			})
		} else {
			console.log("Backend having issues");
		}
	}).catch((err) => {
		console.log("Backend unreachable");
	});

	requestHeaders.append("Authorization", `Bearer ${leToken}`)
	console.log(requestHeaders)
	await fetch(`${baseUrl}/api/getGuilds`, {
		headers: {
			"Authorization": `Bearer ${leToken}`
		},
		method: "GET"
	}).then((res) => {
		if (res.status === 200) {
			let guildAmount = 0;
			document.getElementById("guilds").innerHTML = "";
			res.json().then((data) => {
				data.guilds.forEach((guild) => {
					guildAmount++;
					let guildIcon = guild.iconUrl ? guild.iconUrl : "https://cdn.discordapp.com/embed/avatars/0.png";
					console.log(guildIcon)
					console.log(guild.id)
					
					document.getElementById("guilds").innerHTML += `<div class="guild-panel">
<img src="${guildIcon}" class="guild-icon"> <p><b style="font-size: large;">${guild.name}</b><br>${guild.users.toLocaleString("en-GB")} members</p> <span class="guild-button"><button class="btn shiny" onclick="configGuild('${guild.id}')"><img class="btn-icon" src="../public/security.svg" width="22px" style="margin-right: 5px;"> Configure</button>
</div>`;
					//<button class="btn red" onclick='window.open("about:blank");'>Leave</button></span>
				});

				document.getElementById("guilds-status").innerHTML = `I've found ${guildAmount} guilds for you ${randomKaomoji()}`;
			});
		} else {
			document.getElementById("guilds-status").innerHTML = "An error occurred while fetching your guilds. Please try again later. :(";
		}
	});
});
