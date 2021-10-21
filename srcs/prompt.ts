
import readline from 'readline';
import { getSynonym, injectSynonym } from './seeder/synonyms';
import { removeWord, seedWord } from './seeder/words';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false,
	history: []
});


const prompt = () => {
	process.stdout.write("cli> ");
}

prompt()


rl.on('line', async (line) => {
	
	const args = line.split(' ')

	if (args[0] == "seed") {
		if (!args[1])
			console.log("Missing parameter")

		switch (args[1]) {
			case "words": await seedWord(); break;
			case "syn": await injectSynonym(); break;
		}
	}

	if (args[0] == "db") {
		if (!args[1])
			console.log("Missing parameter")
		switch (args[1]) {
			case "drop":
				if (!args[2])
					console.log("Missing what to drop")
				switch (args[2]) {
					case "words": await removeWord(); break;
				}
				break;
		}
	}

	prompt()
})

rl.on('close', () => {
	console.log("clse")
})