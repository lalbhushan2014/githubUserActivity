const http = require('http');
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
const port = 9000;
const server = http.createServer((req, res) => {
	res.writeHead(200, { "Content-Type": "text/plain" });
	res.end("Server is running...\n");
});

async function fetchData(githubName) {
	try {
		let url = `https://api.github.com/users/${githubName}/events`;
		let response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP Error! Status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error("Fetch Error:", error.message);
		return null; // Return null instead of crashing
	}
}


async function processInput(input) {
	let inputArray = input.trim().split(" ");
	// console.log(inputArray.length);
	if (inputArray.length == 2) {
		let controllerName = inputArray[0];
		let githubName = inputArray[1];
		if (!githubName || !controllerName || controllerName.trim().toLowerCase() != 'git-activity') {
			console.log("Only two words can received can be received as an input where first word will be git-activity and the next word will be gitusername.");
		} else {

			try {
				let responseData = await fetchData(githubName);
				if (responseData === null) {
					return;
				}

				if (responseData.length == 0) {
					console.log(`No activity found for  ${githubName} in github.`);
				} else {
					console.log(responseData);

				}
			}
			catch (err) {
				console.log(err);
			}

		}
	} else {
		console.log("Only two words can received can be received as an input where first word will be git-activity and the next word will be gitusername.");
	}

}

rl.on("line", (input) => {
	processInput(input);
});
server.listen(port, () => {
	console.log(`Server running at`, port);
});