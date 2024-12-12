var image = null;
var innerImageURL = null;
var fullMarkerURL = null;

// this function will be called when the user clicked the upload image button
function uploadimage() {
    // the uploaded image will be assigned to a var named fileinput
    var fileinput = document.getElementById("upload");
    image = new SimpleImage(fileinput);

    // the canvas in html will be the area to display the image uploaded
    var canvas = document.getElementById("can1");
    image.drawTo(canvas);
}

// this function will be called when the user uploaded the image onto the website
document.querySelector('#upload').addEventListener('change', function() {
    var file = this.files[0];
    imageName = file.name

    // this line will remove the file 
    imageName = imageName.substring(0, imageName.lastIndexOf('.')) || imageName

    var reader = new FileReader();
    reader.onload = function(event){
        innerImageURL = event.target.result
        updateFullMarkerImage()
    };
    reader.readAsDataURL(file);
})

// this function will be called when the user clicked on the greyscale button 
function greyscale() {
    // this function will check if the image is already uploaded or not
    if (image == null) {
        alert('Please Upload Image First...');
    }

    // this function will convert each pixel in the image into greyscale
    else {
        for (var pixel of image.values()) {
            var avg = (pixel.getRed()+pixel.getGreen()+pixel.getBlue())/3;
            pixel.setRed(avg);
            pixel.setGreen(avg);
            pixel.setBlue(avg);
        }

        // the canvas in html will be the area to display the image uploaded
        var canvas = document.getElementById("can2");
        image.drawTo(canvas);
    }
}

// tracking image
var gui = new dat.GUI();

// this function will be called when the user clicked on the button to generate the features
function detectfeature() {
    window.fastThreshold = 10;
    var canvas = document.getElementById("can3");
    var context = canvas.getContext('2d');
    var image = document.getElementById('can2');
    var width = image.clientWidth;
    var height = image.clientHeight;

    canvas.width = width;
    canvas.height = height;

    var findFeature = function() {
    tracking.Fast.THRESHOLD = window.fastThreshold;
    context.drawImage(image, 0, 0, width, height);

    var imageData = context.getImageData(0, 0, width, height);
    var gray = tracking.Image.grayscale(imageData.data, width, height);
    var corners = tracking.Fast.findCorners(gray, width, height);

    for (var i = 0; i < corners.length; i += 2) {
        context.fillStyle = '#00ffff';
        context.fillRect(corners[i], corners[i + 1], 3, 3);
    }
    };

    findFeature();

    gui.add(window, 'fastThreshold', 0, 100).onChange(findFeature);
}

// this function will be called after the user upload the image
// so that the new marker will be paste onto the container declared in the html file
function updateFullMarkerImage() {

    var patternRatio = 50/100
    var imageSize = 512
    var borderColor = 'black'

    // this function is to build the marker form the image uploaded
    THREEx.ArPatternFile.buildFullMarker(innerImageURL, patternRatio, imageSize, borderColor, function onComplete(markerUrl){
        fullMarkerURL = markerUrl

        var fullMarkerImage = document.createElement('img');
        fullMarkerImage.setAttribute('class', "img-fluid");
        fullMarkerImage.src = fullMarkerURL;

        // put fullMarkerImage into #imageContainer
        var container = document.querySelector('#imageContainer4');
        while (container.firstChild) container.removeChild(container.firstChild);
            container.appendChild(fullMarkerImage);
    })
}

// this event will be triggered when the user click the button to download the patt file of the marker
document.querySelector('#patt').addEventListener('click', function() {
    if( innerImageURL === null ) {
        alert('Please Upload Image First...')
        return
    }
    console.assert(innerImageURL)
    THREEx.ArPatternFile.encodeImageURL(innerImageURL, function onComplete(patternFileString){
        THREEx.ArPatternFile.triggerDownload(patternFileString, "pattern-" + ("marker") + ".patt")
    })
})

// this event will be triggered when the user click the button to download the png file of the marker
document.querySelector('#png').addEventListener('click', function() {
    if( innerImageURL === null ){
        alert('Please Upload Image First...')
        return
    }

    var domElement = window.document.createElement('a');
    domElement.href = fullMarkerURL;
    domElement.download = "pattern-" + (imageName || 'marker') + '.png';
    document.body.appendChild(domElement)
    domElement.click();
    document.body.removeChild(domElement)
})

const gradient = document.querySelector(".gradient");

function onMouseMove(event) {
    gradient.style.backgroundImage = 'radial-gradient(at ' + event.clientX + 'px ' + event.clientY + 'px, rgba(159,0,191,.9) 0, #4D4FA7 70%)';
}

document.addEventListener("mousemove", onMouseMove);