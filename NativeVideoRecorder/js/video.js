/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/

// This code is adapted from
// https://rawgit.com/Miguelao/demos/master/mediarecorder.html

'use strict';

/* globals MediaRecorder */

var mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
var mediaRecorder;
var recordedBlobs;
var sourceBuffer;
var stream;

var gumVideo = document.querySelector('video#gum') ;
var recordButton = document.querySelector('button#record');
var downloadButton = document.querySelector('button#download');
recordButton.onclick = toggleRecording;
downloadButton.onclick = download;

var aw = window.screen.availWidth;
var ah = window.screen.availHeight;
var scw;
var sch;
var vw;
var vh;


var res320 = {
  audio: true,
  video: true,
  video: {width: {exact: 320}, height: {exact: 240}}
};
var res400 = {
  audio: true,
  video: true,
  video: {width: {exact: 400}, height: {exact: 300}}
};
var res640 = {
  audio: true,
  video: true,
  video: {width: {exact: 640}, height: {exact: 480}}
};
var res800 = {
  audio: true,
  video: true,
  video: {width: {exact: 800}, height: {exact: 600}}
};
var res1280 = {
  audio: true,
  video: true,
  video: {width: {exact: 1280}, height: {exact: 720}}
};
var res1920 = {
  audio: true,
  video: true,
  video: {width: {exact: 1920}, height: {exact: 1080}}
};

// took out secure origin check, we're giving permissions in the manifest


// Use old-style gUM to avoid requirement to enable the
// Enable experimental Web Platform features flag in Chrome 49

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

getMedia(res320);
setscreen(620,410,320,240);



//navigator.getUserMedia(constraints, successCallback, errorCallback);


function getMedia(constraints) {
  if (stream) {
    stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
  setTimeout(function() {
    navigator.getUserMedia(constraints, successCallback, errorCallback);
  }, (stream ? 200 : 0));
}

function successCallback(stream) {
  console.log('getUserMedia() got stream: ', stream);
  window.stream = stream;
  if (window.URL) {
    gumVideo.src = window.URL.createObjectURL(stream);
  } else {
    gumVideo.src = stream;
  }
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}


function handleSourceOpen(event) {
  console.log('MediaSource opened');
  sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
  console.log('Source buffer: ', sourceBuffer);
}

function handleDataAvailable(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function handleStop(event) {
  console.log('Recorder stopped: ', event);
}

function setscreen (scw,sch,vw,vh) {
  aw = Number(aw);
  scw = Number(scw);
  ah = Number(ah);
  sch = Number(sch);
  if ( (aw - scw > 0)  &&  (ah - sch > 0) ) {
    chrome.app.window.current().innerBounds.width = scw;
    chrome.app.window.current().innerBounds.height = sch;
    $("#gum").width(vw).height(vh);
  }
}




$("#settings").change(function () {
  if ( $(".resolution:checked").val() == "r320" ) {
    getMedia(res320);
    setscreen(620,410,320,240);
  } else if ( $(".resolution:checked").val() == "r400" ) {
    getMedia(res400);
    setscreen(680,470,400,300);
  } else if ( $(".resolution:checked").val() == "r640" ) {
    getMedia(res640);
    setscreen(924,648,640,480);
  } else if ( $(".resolution:checked").val() == "r800" ) {
    getMedia(res800);
    setscreen(1084,764,800,600);
  } else if ( $(".resolution:checked").val() == "r1280" ) {
    getMedia(res1280);
    setscreen(1560,880,1280,720);
  } else if ( $(".resolution:checked").val() == "r1920" ) {
    getMedia(res1920);
    setscreen(2200,1240,1920,1080);
  } else {
    getMedia(res320);
    setscreen(610,406,320,240);
  }
});

function toggleRecording() {
  if (recordButton.dataset.recording === 'false') {
    startRecording();
    recordButton.dataset.recording = 'true';
    $("#record img").attr("src","assets/record48g3.png");
    $("#record span").text("Stop Recording");
    $("#download img").attr("src","assets/save48bw.png");
    downloadButton.disabled = true;
    $("#settings").find("input").attr('disabled',true);
  } else {
    stopRecording();
    recordButton.dataset.recording = 'false';
    $("#record img").attr("src","assets/record48.png");
    $("#record span").text("Start Recording");
    $("#download img").attr("src","assets/save48.png");
    downloadButton.disabled = false;    
    $("#settings").find("input").attr('disabled',false);
  }
}


var blinker = setInterval(blink, 1000);

function blink() {
  console.log("blink");
  if (recordButton.dataset.recording === 'true') {
    if( $("#record img").attr("src") == "assets/record48g3.png"){
        $("#record img").attr("src","assets/record48g2.png")
    }else{
        $("#record img").attr("src","assets/record48g3.png")
    }
  }
}

// The nested try blocks will be simplified when Chrome 47 moves to Stable
function startRecording() {
  var options = {mimeType: 'video/webm'};
  recordedBlobs = [];
  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e0) {
    console.log('Unable to create MediaRecorder with options Object: ', e0);
    try {
      options = {mimeType: 'video/webm,codecs=vp9'};
      mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e1) {
      console.log('Unable to create MediaRecorder with options Object: ', e1);
      try {
        options = 'video/vp8'; // Chrome 47
        mediaRecorder = new MediaRecorder(window.stream, options);
      } catch (e2) {
        console.log('MediaRecorder is not supported by this browser. Try Firefox 29 or later, or Chrome 47 or later, with Enable experimental Web Platform features enabled from chrome://flags.');
        console.error('Exception while creating MediaRecorder:', e2);
        return;
      }
    }
  }
  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  recordButton.dataset.recording = 'false';
  // fix labels and image
  downloadButton.disabled = true;
  mediaRecorder.onstop = handleStop;
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start(10); // collect 10ms of data
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
  console.log('Recorded Blobs: ', recordedBlobs);
}

function download() {
  var blob = new Blob(recordedBlobs, {type: 'video/webm'});
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'recording.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(function() {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}
