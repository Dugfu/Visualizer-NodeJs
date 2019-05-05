// Check for BlobURL support
var blob = window.URL || window.webkitURL;
if (!blob) {
  console.log('Your browser does not support Blob URLs :(');
}
const audio = document.getElementById("myAudio");
const progress = document.getElementsByClassName("progress")[0];
const play = document.getElementById("play");
const mute = document.getElementById("mute");
const progressBar = document.getElementById("progress-bar");
const soundRange = document.getElementById("soundRange");
let progressFunc;
let visuFunc;

//Event
play.addEventListener("click", function(){
  if(audio.paused)
  audio.play();
  else
  audio.pause();
});


progress.addEventListener("click", function(e){
  let clickPos = e.offsetX;
  console.log(clickPos);
  let length = this.clientWidth;
  console.log(length);
  let percent = (clickPos*100)/length;
  console.log(percent);
  let duration = audio.duration;
  console.log(duration);
  let seek = (clickPos * duration)/length;
  console.log(seek);
  progressBar.style.width = percent + "%";
  audio.currentTime = seek;
})
soundRange.addEventListener("change",function(){
  audio.volume = this.value/100;
})
mute.addEventListener("click",function(e){
  if(audio.muted){
    audio.muted = false;
    soundRange.value = audio.volume * 100;
  }
  else{
    audio.muted = true;
    soundRange.value = 0;
  }
})
audio.addEventListener("play", function(){
  progressFunc = setInterval('progessBarSong();',100);
  // visuFunc = setInterval('Visualizer();',100);
})
audio.addEventListener("pause", function(){
  clearInterval(progressFunc);
  // clearInterval(visuFunc);
})

//Functions

//Add Listener on input file
function selectFile()
{
  let inputs = document.getElementsByClassName("inputfile");
  for(let i=0; i<inputs.length; i++)
  {
    let input = inputs[i];
    // console.log([input]);
    let label	 = input.labels[0],
    labelVal = label.innerHTML;
    let p = input.nextSibling;
    input.addEventListener( 'change', function( e )
    {
      let fileName = '';
      if( this.files && this.files.length > 1 )
      fileName = this.files.length + " files selected";
      else
      fileName = "1 file selected";
      if( fileName )
      label.innerHTML = fileName;
      else
      label.innerHTML = labelVal;

      let allFileName = '';
      let files = input.files;
      for(let c=0; c<files.length; c++)
      {
        if(c>0)
        allFileName += " / ";
        allFileName += files[c].name;
      }
      p.innerHTML = allFileName;
      let file = input.files[0],
      fileURL = blob.createObjectURL(file);
      console.log(file);
      console.log('File name: '+file.name);
      console.log('File type: '+file.type);
      console.log('File BlobURL: '+ fileURL);
      // document.getElementById("myAudio").src = fileURL;
      audio.src = fileURL;
      // audio.controls = true;
      audio.volume = 0.5;
      soundRange.value = 50;
      audio.play();
      // document.getElementById("center").appendChild(audio);
      console.log(audio);
    });
  }
}

//Progress Bar
function progessBarSong() {
  if(!audio.paused){
    let current = audio.currentTime;
    let length = audio.duration;
    let result = (current * 100)/length;
    progressBar.style.width = result + "%";
  }
}


//Load
setTimeout('selectFile();',1);
