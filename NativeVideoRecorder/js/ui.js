$( document ).ready(function() {
  console.log("Document ready.");

  // window controls
  if (chrome.app.window.current().isMaximized() || chrome.app.window.current().isFullscreen() ) {
      $("#window img").attr("src","assets/restore32.png");
    } else {
      $("#window img").attr("src","assets/win32.png");
    }
  $("#minimize").on("click",function(){
    chrome.app.window.current().minimize();
  });
  $("#window").on("click",function(){
    console.log("click");
    if (chrome.app.window.current().isMaximized() || chrome.app.window.current().isFullscreen() ) {
      chrome.app.window.current().restore();
      $("#window img").attr("src","assets/win32.png");
    } else {
      chrome.app.window.current().maximize();
      $("#window img").attr("src","assets/restore32.png");
    }
  });
  $("#exit").on("click",function(){
    chrome.app.window.current().close();
  });
  
});