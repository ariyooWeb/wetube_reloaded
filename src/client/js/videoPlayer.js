const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

//마우스가 밖으로 나갈때 timeout(초 세기) 시작. timeout이 시작되면 controlsTimeout가 숫자로 나타남
let controlsTimeout = null;
//timeout이 시작되면 controlsMovementTimeout은 숫자(아이디가 숫자로 나타남)가 되므로 null이 아니게 된다.
//마우스가 비디오 영역 안에서 움직일때마다 timeout시작된다.
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handleVideoClick = (e) => {
    if(video.paused) {
        video.play();
    }else{
        video.pause();
    }
}

const handleSpaceKeydown = (event) => {
    if(event.keyCode == 32){
        handleVideoClick();
    }
}

const handlePlayClick = (e) => {
    if(video.paused){
        video.play();
    }else{
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fa-solid fa-play" : "fa-solid fa-pause";
}

const handleEnded = () => {
    // const id = videoContainer.dataset.id
    const { id } = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`,{
        method:"POST",
    })
}

const handleMute = (e) => {
    if(video.muted){
        video.muted = false;
    }else{
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high";
    volumeRange.value = video.muted? 0 : volumeValue;
}

const handleVolumeChange = (event) => {
    const {
        target: 
        {value}
    } = event;
    
    if(video.muted) {
        video.muted = false;
    }
    
    volumeValue = value;
    video.volume = value;
    
    muteBtnIcon.classList = value == 0 ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high";
}

const formatTime = (seconds) =>
    new Date(seconds * 1000).toISOString().substring(11, 19);

const handleLoadedmetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
}

const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
}

const handleTimelineChange = (event) => {
    const {
        target: 
        {value}
    } = event;
    video.currentTime = value;
}

const handleFullscreen = () => {
    const fullscreen = document.fullscreenElement;
    if(fullscreen){
        document.exitFullscreen();
        fullScreenIcon.classList = "fa-solid fa-expand"
    }else{
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fa-solid fa-compress"
    } 
}

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
    //controlsTimeout은 마우스가 비디오 바깥영역으로 나갔을때 시작된 timeout을 다시 마우스가 비디오 영역으로 들어왔을때 cleartimeout해 준다.
    if(controlsTimeout){
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if(controlsMovementTimeout){
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    //controlsMovementTimeout변수로 setTimout의 아이디를 return받을 수 있다. 셋타임아웃이 시작되기 전에는 null이고 시작되고 나서는 아이디(숫자)이다.
    //마우스를 움직이기 시작했을때 controlsMovementTimeout이 곧 clearTimeout이 된다. 그러나 마우스를 멈췄을때는 생성된 controlsMovementTimeout을 clearTimeout해줄 수 없다는 점!!!
    //코드의 순서가 취소->생성 이라는점 명심하기!  
    controlsMovementTimeout = setTimeout(hideControls, 2000);
}

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls,500) 
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("click", handleVideoClick);
// video.addEventListener("loadedmetadata", handleLoadedmetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
window.addEventListener("keydown",handleSpaceKeydown);
video.readyState
  ? handleLoadedmetadata()
  : video.addEventListener("loadedmetadata", handleLoadedmetadata);