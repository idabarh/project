function loadTemplate(aTemplateID, aDestinationElement, aEmptyElement = false) {
  const tl = document.getElementById(aTemplateID);
  if (tl.content) {
    //klone den her for den skal være synlig
    const clone = tl.content.cloneNode(true);
    if (aDestinationElement) {
      while (aDestinationElement.firstChild) {
        aDestinationElement.removeChild(aDestinationElement.firstChild);
      }
    }
    aDestinationElement.appendChild(clone);
  } else {
    console.log("Your browser does not support templates!");
  }
}
