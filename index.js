var speed = 10;
var block = 20;

var wallPlay = null;
var carPlay = null;
var over = false;
var numOfCar = 2
var currentScore = 0;

window.onload = ()=>{
	document.querySelectorAll("[data-l]").forEach((el)=>{
		el.style.left = parseInt(el.getAttribute("data-l")) + "px";
	})

	document.querySelectorAll("[data-t]").forEach((el)=>{
		el.style.top = parseInt(el.getAttribute("data-t")) + "px";
	})

	document.querySelectorAll("[data-b]").forEach((el)=>{
		el.style.bottom = parseInt(el.getAttribute("data-b")) + "px";
	})

	document.onkeydown = (el)=>{
		if (over) { return }
		if (el.key == "ArrowLeft") leftArrow()
		if (el.key == "ArrowRight") rightArrow()
	}

	document.querySelector("body").ontouchstart = (evt)=>{
		console.log(evt.touches[0].clientX)
		console.log(evt.touches[0].clientY)
		if (over) { return }

		if(evt.touches[0].clientX < 200){
			leftArrow()
		}else if(evt.touches[0].clientX > 200){
			rightArrow()
		}
	}
	
	document.querySelector(".startGame").onclick = ()=>{
		startGame();
	}

	let highScore = getCookie("highScore");
	document.querySelector(".high-score").innerHTML = highScore == "" ? 0 : highScore

	document.querySelector("select").onchange = () => {
		speed = 10 * parseInt(document.querySelector("select").value)
	}
	// startGame();

}

function startGame () {
	// let body = document.querySelector("body")
	// openFullscreen(body)
	playSound("start")
	document.querySelector(".startGame").innerHTML = "RESTART"
	over = false;
	updateScore(true)
	removeCars()
	addNewCar()
	stopCar()
	stopWall()
	setWall(0)
	runWall()
	runCar()
}

function stopGame () {
	over = true
	playSound("over")
	stopCar()
	stopWall()
	document.querySelector(".startGame").innerHTML = "START"
	let highScore = getCookie("highScore");
	if (highScore == "" || currentScore > highScore) {
		setCookie("highScore", currentScore, 100)
		document.querySelector(".high-score").innerHTML = currentScore
	}
}


function moveMyCar(dir=1){
	let carEl = document.querySelector(".car.main")
	let currentLeft = parseInt(carEl.getAttribute("data-l"));
	let newLeft = currentLeft + block * 2 *dir;
	
	if (newLeft < 42 || newLeft > 242) {
		return
	}

	carEl.style.left = newLeft + "px"
	carEl.setAttribute("data-l", newLeft)
}




function leftArrow () {
	moveMyCar(-1)
}

function rightArrow () {
	moveMyCar(1)
}

function setWall(displacement = 0) {
	document.querySelectorAll(".wall").forEach((el)=>{
		let currentTop = el.getAttribute("data-t");
		el.style.top = parseInt(currentTop) + parseInt(displacement) + "px";
	})
}

function setOtherCar(displacement = 0) {
	document.querySelectorAll(".car.other").forEach((el) => {
		let currentTop = el.getAttribute("data-t");
		let newTop = parseInt(currentTop) + parseInt(displacement)
		el.setAttribute("data-t", newTop);
		el.style.top = newTop + "px";
		carLeft = parseInt(el.getAttribute("data-l"))
		el.style.left = carLeft+"px";

		if (newTop > 460) {
			myCarLeft = parseInt(document.querySelector(".car.main").getAttribute("data-l"))

			let distance = Math.abs(carLeft - myCarLeft)
			console.log(distance)
			if (distance < 60) {
				stopGame()
			}
		}

		if (newTop > 570) {
			el.remove()
			addNewCar()
			updateScore()
		}
	})
}


function addNewCar () {
	let car = document.createElement("div")
	car.classList.add("car")
	car.classList.add("other")
	car.setAttribute("data-t", "0")
	let posleft = getRndInteger(42, 242)
	car.setAttribute("data-l", posleft)
	let playingarea = document.querySelector(".playingarea")
	playingarea.appendChild(car)
}

function removeCars () {
	document.querySelectorAll(".car.other").forEach((el)=>{
		el.remove()
	})
}


// Movement related functions

function runWall () {
	let x = 0;
	wallPlay = setInterval(()=>{
		x = x < 5 ? x + 1 : 0;
		setWall(x*block)
	}, 1000/speed)
}

function stopWall () {
	clearInterval(wallPlay)
}

// Movement of car

function runCar () {
	carPlay = setInterval(()=>{
		setOtherCar(block)
	}, 1000/speed)
}

function stopCar () {
	clearInterval(carPlay)
}



function updateScore (reset = false) {
	let scoreEl = document.querySelector(".score")
	currentScore = parseInt(scoreEl.innerHTML)
	newScore = reset ? 0 : currentScore + 1;
	scoreEl.innerHTML = newScore;
	currentScore = newScore;
}


function playSound(name){
	document.querySelector("#"+name).play()
}

// Helper functions

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  let user = getCookie("username");
  if (user != "") {
    alert("Welcome again " + user);
  } else {
    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
      setCookie("username", user, 365);
    }
  }
}


/* When the openFullscreen() function is executed, open the video in fullscreen.
Note that we must include prefixes for different browsers, as they don't support the requestFullscreen method yet */
function openFullscreen(elem) {
	console.log(elem)
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}