// Check for BlobURL support
let blob = window.URL || window.webkitURL;
if (!blob) {
  console.log('Your browser does not support Blob URLs :(');
}
const audioVisu = new Audio();
const audio = new Audio();
const progress = document.getElementsByClassName("progress")[0];
const play = document.getElementById("play");
const mute = document.getElementById("mute");
const progressBar = document.getElementById("progress-bar");
const soundRange = document.getElementById("soundRange");
let progressFunc;
let visuFunc;
let ctx, audioSrc, analyser, frequencyData;
audio.volume = 0.02;
soundRange.value = 2;
//Event
play.addEventListener("click", function(){
  if(audio.paused){
    audio.play();
    audioVisu.currentTime= audio.currentTime;
    audioVisu.play();
  }else{
    audio.pause();
     audioVisu.currentTime= audio.currentTime;
    audioVisu.pause();
  }
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
  audioVisu.currentTime =seek;
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
  visuFunc = setInterval('Visualizer()',1);
  // Visualizer();
})
audio.addEventListener("pause", function(){
  clearInterval(progressFunc);
  clearInterval(visuFunc);
  let bars = document.getElementsByClassName("bar");
  for(let i=0; i<bars.length; i++)bars[i].style.height = "0px";
  delete ctx;
  delete audioSrc;
  delete analyser;
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
      // console.log(file);
      // console.log('File name: '+file.name);
      // console.log('File type: '+file.type);
      // console.log('File BlobURL: '+ fileURL);
      // document.getElementById("myAudio").src = fileURL;
      audio.src = fileURL;
      audioVisu.src = fileURL;
      // audio.controls = true;
      // audio.play();
      // document.getElementById("center").appendChild(audio);
      // console.log(audio);
      ctx = new AudioContext();
      audioSrc = ctx.createMediaElementSource(audioVisu);
      analyser = ctx.createAnalyser();
      audioSrc.connect(analyser);
      frequencyData = new Uint8Array(analyser.frequencyBinCount);
      // console.log(frequencyData);
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

function Visualizer() {
   let time = document.getElementById("timer");
   timer.innerHTML = "Audio : " + audio.currentTime + "/ AudioVisu : " + audioVisu.currentTime;
   // audioVisu.currentTime = audio.currentTime;
  // requestAnimationFrame(Visualizer);
  // update data in frequencyData
  analyser.getByteFrequencyData(frequencyData);
  // render frame based on values in frequencyData
  // console.log(frequencyData);
  let offset = 0;
  for(let i=0; i<frequencyData.length; i += 32){
    // console.log('bar-'+i);
    let bar = document.getElementById('bar-'+(i+32));
    bar.style.height = meanFromArray(frequencyData,i,i+31) + "px";
    // console.log(bar);
  }
}

function meanFromArray(array, start, end){
   let length = (end - start)+1;
   // console.log(length);
   let sum = 0, mean;
   for(let i=start; i<=end; i++){
      sum += array[i];
   }
   // console.log(sum);
   mean = sum/length;
   return mean;
}
//Load
setTimeout('selectFile();',1);
