const dropdownChoice = document.querySelector(".select-box");
const restartbtn = document.querySelector("#restart");
const textbtn = document.querySelector("#new-text");
const text = document.querySelector("#typing-box");
const wpmHTML = document.querySelector(".WPM");
const cpmHTML = document.querySelector(".CPM");
const timer = document.querySelector(".timer");

var elem = document.getElementById("myBar");

let testText = document.querySelector("#quote-api");
let APIurl = " "; // change the API url to request from based on user input
let minutes = 0, seconds = 0, ms = 0; // starting value for the timer
let alertMessage = "Congratulations, you completed the test in "  + minutes + " minutes and " + seconds + "." + ms + " seconds";
let interval;
let completeRandomText = "";
let APItextData = "abc";
let spanArray = [];
let letterArray = [];
let WPM = 0;
let CPM = 0;
let numWords = 0;
let letterIndex = 0; 
let wordIndex = 0;
let numberOfMistakes = 0;
let randomLetter; 
let randomWordsString = "";
let errorState;
if(localStorage.getItem("prog") == null || localStorage.getItem("prog")== undefined)
{
	localStorage.setItem("prog", 0);
}
const p = document.getElementById("num");
p.innerHTML = localStorage.getItem("prog");
function dropdownSelection() {	
	switch(dropdownChoice.value){
		case 'easy':
			APIurl = "https://baconipsum.com/api/?type=all-meat&sentences=1&start-with-lorem=1";
			break;
		case 'difficult':	
			APIurl = "https://baconipsum.com/api/?type=all-meat&paras=2&start-with-lorem=1";
			break;
		// case 'difficult':
		// 	APIurl = "https://baconipsum.com/api/?type=all-meat&paras=3&start-with-lorem=1&format=html";
		// 	break;
		
	}
}


function displayZero(time){
	if(time <= 9) {
		time = "0" + time;
	}
	return time;
}

function runTimer(){ 
	timer.innerHTML = displayZero(minutes) + ":" + displayZero(seconds) + ":" + displayZero(ms);
	ms++;

	displayWPM_and_CPM(minutes, seconds, ms);
	createHTML();

	// time conversions
	if(seconds == "60"){
		seconds = "0";
		minutes++;
	}

	if(ms === 100){
		ms=0;
		seconds++;
	}
}


function startTimer(){
	let textLength = text.value.length;

	if(textLength === 0){
		interval = setInterval(runTimer, 10) 
	}
}


function restartTest(){
	clearInterval(interval);
	timer.innerHTML = "00:00:00";
	text.value = "";
	minutes = 0; seconds = 0; ms = 0;
	text.style.border = "6px solid grey";
	wpmHTML.innerHTML = "WPM: 00";
	cpmHTML.innerHTML = "CPM: 00";
	letterIndex = 0;
	wordIndex = 0;
	WPM = 0;
	CPM = 0;
	numWords = 0;
	numberOfMistakes = 0;
	
	spanArray.map(char => {
		char.style.background = 'lightblue';
		char.style.color = 'black';
	});
}


function countWords(){
	let textLength = text.value.length;	
	if(text.value.substring((textLength-1), textLength) == " ")
		numWords++;
}

function displayWPM_and_CPM(mins, secs, ms){
	let totalSeconds = (mins*60) + secs + (ms/100);
	let textInput = text.value;
	let numChars = textInput.length;
	let wpmHTML2 = "CPM: " + CPM;
	let cpmHTML2 = "WPM: " + WPM;
	CPM = Math.floor((numChars / totalSeconds) * 60); 
	WPM = Math.floor((numWords / totalSeconds) * 60); 
	wpmHTML.innerHTML = wpmHTML2;
	cpmHTML.innerHTML = cpmHTML2;	
}

function checkStringEquality() {
	let textInput = text.value;
	let completeTestText;
	let parsedTestText;

	// if(dropdownChoice.value == 'alphanumeric'){
	// 	completeTestText = completeRandomText;
	// 	parsedTestText = completeRandomText.substring(0, textInput.length);
	// }
	// else {
		completeTestText = APItextData;
		parsedTestText = APItextData.substring(0, textInput.length);
	// }

	// check for equality to input
	console.log(completeTestText.length);
	console.log(parsedTestText.length);


	
    var width = 0;
	width = (parsedTestText.length/completeTestText.length)*100;
	elem.style.width = width + "%";


	//move();
	if(textInput == completeTestText){
		text.style.border = "8px solid green";
		clearInterval(interval);
		alert(("Congratulations! You completed the " + dropdownChoice.value + " test in " + minutes + " minutes and " + seconds + "." + ms + " seconds!"));
		alert(("You made " + numberOfMistakes + " mistakes."));
		ctr = parseInt(localStorage.getItem("prog"))+1;
		localStorage.setItem("prog" , ctr);
		//graph( numberOfMistakes)
	} else if(textInput == parsedTestText){
		errorState = false;
		text.style.border = "8px solid lightblue";
	} else{
		if(!errorState)
			numberOfMistakes++;
		errorState = true;
		text.style.border = "8px solid pink";
	}
}
function highlightWords(){
	console.log(text.value)
	let textInput = text.value;
	let textLength = textInput.length;
	let inputLetter = textInput.substring((textLength - 1), textLength);

	// dont listen for shift and ctrl
	if(event.which != 16 && event.which != 17){
		if(dropdownChoice.value == 'alphanumeric'){
			if(event.which == 8){
				letterArray[(letterIndex-1)].style.background = "lightblue";
				letterIndex = letterIndex-2;
			}
			let completeTestText = completeRandomText;
			let parsedTestText = completeRandomText.substring(0, textLength);

			if(textInput == parsedTestText){
				letterArray[letterIndex].style.background = "lightgreen";
				letterIndex++;
			}
			else{
				letterArray[letterIndex].style.background = "pink";				
				letterIndex++;
			}
		}

		// non-alphanumeric tests
		else{
			if(letterArray[letterIndex] == inputLetter){
				letterIndex++;
				spanArray[wordIndex].style.background = "green";
				spanArray[wordIndex].style.borderRadius = "5px";
				if(letterArray[letterIndex] == " "){
					spanArray[wordIndex].style.background = "lightgreen";
					spanArray[wordIndex].style.color = "white";
					spanArray[wordIndex].style.borderRadius = "5px";
					wordIndex++;
				}
			}
			else {
				spanArray[wordIndex].style.background = "red";
				spanArray[wordIndex].style.borderRadius = "5px";
			}
		}
	}
}
function createLetterArray(){
	for(let i = 0; i < spanArray.length; i++){
		let separatedWord = spanArray[i].innerHTML;
		separatedLetter = separatedWord.split("");
		for(let j = 0; j < separatedWord.length; j++){
			letterArray.push(separatedLetter[j]);
		}
	}
}

function createRandomText() {
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    testText.innerHTML = "";
    letterArray = [];
    completeRandomText = "";
  
    for (let i = 0; i < 50; i++) {
            let randomChar = possible.charAt(Math.floor(Math.random() * possible.length));
            completeRandomText += randomChar;
            let separatedRandomChar = document.createElement("span");
            let node = document.createTextNode(randomChar);
            separatedRandomChar.appendChild(node);
            letterArray.push(separatedRandomChar);
            testText.appendChild(separatedRandomChar);
      }
  }

  function createHTML(APIdata, isAPItext){
	// only create the HTML elements if data is from an API call
	if(isAPItext){
		let testTextValue = APIdata;
		let separatedText = testTextValue.split(" ");
		// reset the contents of the array to store new data when called again
		spanArray = [];
		letterArray = []; 
		testText.innerHTML = ""; // reset current html for appendage below

		for(let i = 0; i < separatedText.length; i++){
			let separatedWord = document.createElement("span");
			let node = document.createTextNode((separatedText[i] + " "));
			separatedWord.appendChild(node);
			spanArray.push(separatedWord); 
			testText.appendChild(separatedWord);
		}
		createLetterArray();
	}
}

function createRandomWordsString(){
	randomWordsString = "";

	for(let i = 6; i < 60; i++)
		randomWordsString = APItextData[i].word + " " + randomWordsString;
}

function changeTestText() {
	restartTest();
	let isAPItext;

	// if(dropdownChoice.value == 'words'){
	// 	createRandomWordsString();
	// }

	// changes innerHTML based on what is selected from the dropdown menu
	if(dropdownChoice.value == 'easy'){
        isAPItext = true;
		APItextData = APItextData[0];
		createHTML(APItextData, isAPItext);
		// isAPItext = true;
		// APItextData = APItextData.easy;
		// createHTML(APItextData, isAPItext);
	}
	else if(dropdownChoice.value == 'difficult'){
		isAPItext = true;
		APItextData = APItextData[0];
		createHTML(APItextData, isAPItext);
	}
	// else if(dropdownChoice.value == 'words'){
	// 	APItextData = randomWordsString;
	//   	isAPItext = true;
	// 	createHTML(APItextData, isAPItext);
	// }
}

function APIcall(callback){
	let possibleChars = "abcdefghijklmnopqrstuvwxyz";
	randomLetter = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
	dropdownSelection();

	let AJAXrequest = new XMLHttpRequest();
	AJAXrequest.onreadystatechange = () => {
		if (AJAXrequest.readyState == XMLHttpRequest.DONE) {
			APItextData = JSON.parse(AJAXrequest.responseText);
			console.log(APItextData);
			callback();
		}
		else if (AJAXrequest.status >= 400){
			console.log('Error 400');
		} 
	};
	AJAXrequest.onerror = () => {
		alert('Please check your internet connection!');
	}
	AJAXrequest.open('GET', APIurl);
	AJAXrequest.send();
}

text.addEventListener("keyup", checkStringEquality, false);
text.addEventListener("keydown", highlightWords, false);
text.addEventListener("keypress", startTimer, false);
text.addEventListener("keyup", countWords, false);
textbtn.addEventListener("click", () => { APIcall(changeTestText) });
restartbtn.addEventListener("click", restartTest, false);



// function graph(mis)
// {


		// let mistake1 = mis;
		// google.charts.load('current', {'packages':['corechart']});
		// google.charts.setOnLoadCallback(drawChart);


		// function drawChart() {



		// 	let crr = [];
		// 		crr.push(['Result' , 'Results'])
		// 		crr.push([ "mistake" , mistake1 ])
		// 		crr.push([ "correct" , 100-mistake1 ])
				
		// 		console.log(crr)
		// 		var data = google.visualization.arrayToDataTable(crr);
			
		


		// 	var options = {'title':'Results', 'width':550, 'height':300};

			
		// 	var chart = new google.visualization.PieChart(document.getElementById('piechart'));
		// 	chart.draw(data, options);

		
			
		// }
// }