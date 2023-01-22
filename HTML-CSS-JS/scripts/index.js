import { MIN_SIZE, SUGGESTED_MAX_SIZE, DEFAULT_SIZE } from "./consts.js";

const form = document.getElementById("create-game-form");

const sizeInputs = form.querySelectorAll("input.size");
const boardSizeInputs = form.querySelectorAll("input.size.board-size");
const winConditionInput = form.querySelector("input.size#win-condition");

const winConstionExplanation = form.querySelector("#explanation");

// only allow valid input
sizeInputs.forEach((input) => {
	input.setAttribute("min", MIN_SIZE);
	input.setAttribute("max", SUGGESTED_MAX_SIZE);

	input.addEventListener("keypress", (event) => {
		// if key is not a number of the number is to long ignore key press
		if (!/\d/.test(event.key) || event.target.value.length >= event.target.getAttribute("max").toString().length) {
			event.preventDefault();
			return false;
		}
	});
	
	input.addEventListener("input", updateWinCondtionSettings);
});

boardSizeInputs.forEach((input) => {
	input.setAttribute("value", DEFAULT_SIZE);
});

updateWinCondtionSettings()

function updateWinCondtionSettings() {
	const maxPossibleWinCondition = getMaxInput(boardSizeInputs);
	winConditionInput.setAttribute("max", maxPossibleWinCondition);

	if (maxPossibleWinCondition < winConditionInput.value) {
		winConstionExplanation.innerText = `Impossible to get ${winConditionInput.value} in a row with current board sizes.`;
	} else if (winConditionInput.value) {
		winConstionExplanation.innerText = `Get ${winConditionInput.value} in a row to win.`;
	} else {
		winConstionExplanation.innerText = `Get all the way across to win.`;
	}
};

function getMaxInput(inputElements) {
	let max = -Infinity;
	inputElements.forEach((el) => {
		if (el.value > max) max = el.value;
	});
	return max;
}
