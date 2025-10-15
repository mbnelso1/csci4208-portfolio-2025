import * as http from './http.js';
import * as view from './view.js'; 

const GET_TRIVIA = `https://opentdb.com/api.php?amount=1&difficulty=easy`; 
const BIN_ID = '68f0107bd0ea881f40a52b78'; 
const GET_LEADERBOARD = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;
const PUT_LEADERBOARD = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const state = {
	score: 0,
	timer: 20,
	intervalId: null,
	trivia: null,
	topScores: []
};

window.playGame = async () => { 
	const json = await http.sendGETRequest(GET_TRIVIA); 
	[ state.trivia ] = json.results; 
	view.PlayScene(state);  
}

window.start = async () => { 
	const leaderboardJSON = await http.sendGETRequest(GET_LEADERBOARD); 
	state.topScores = leaderboardJSON.record; 
	console.log(state.topScores); 
	state.score = 0; 
	state.timer = 20; 
	view.StartMenu(state);  
}

window.addEventListener('load', start); 

const countdown = () => { 
	if (state.timer){ 
		state.timer--; 
		view.PlayScene(state); 
	}
	else{ 
		clearInterval( state.intervalId ); 
		view.GameoverScene(state); 
	}
}

window.createGame = () => { 
	state.timer = 20; 
	state.intervalId = setInterval(countdown, 1000); 
	playGame(); 
}

window.checkAnswer = (attempt) => { 
	const answer = state.trivia.correct_answer; 
	if (attempt == answer){ 
		state.score += state.timer; 
		state.timer += 10; 
		playGame(); 
}
	else { 
		clearInterval( state.intervalId ); 
		view.GameoverScene(state); 
	}
}

const getTop5 = async (newScore) => {
	const leaderboardJSON = await http.sendGETRequest(GET_LEADERBOARD);
	const top5 = leaderboardJSON.record;
	top5.push( newScore );
	top5.sort( (a,b) => b.score - a.score );
	top5.pop();
	return top5
}

window.updateLeaderboard = async () => {
	const name = document.getElementById('name').value;
	const currentScore = {name:name, score: state.score};
	const top5 = await getTop5(currentScore);
	await http.sendPUTRequest(PUT_LEADERBOARD, top5);
	start();
}