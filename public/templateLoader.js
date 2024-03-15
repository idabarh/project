function loadTemplate (aTemplateID, aDestElement, aEmptyElement = false){

const tl = document.getElementById(aTemplateID);
if(tl.content){
    const clone = tl.content.cloneNode();
    if (aEmptyElement){
        emptyContainerElement(aDestElement);
    }
    aDestElement.appendChild(clone);

}else{
    console("your browser does not support templates!")
}
}

function emptyContainerElement(aElement){
    let child = aElement.Firstchild();
    while(child){
        aElement.removeChild(child);
        child = aElement.Firstchild();
    }
}