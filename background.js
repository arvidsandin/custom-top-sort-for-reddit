(chrome ? chrome : browser).runtime.onMessage.addListener(function(message) {
  switch (message.action) {
    case "openOptionsPage":
      openOptionsPage();
      break;
    default:
      break;
  }
});

function openOptionsPage(){
  (chrome ? chrome : browser).runtime.openOptionsPage();
}
