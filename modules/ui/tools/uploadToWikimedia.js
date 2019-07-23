export{
    login,
    upload
};

// This file is called by an eventHandler when you request to upload an image to wikimedia (by pressing the add image button)

// API URL, it works, up and running but you cannot upload a picture right now because we have been banned from wikimedia because of our testing
// You can download the `backend` at https://github.com/oSoc19/Open-Yesterday-iD-Backend / the documentation about the API is in the README.md file of this repository
var apiURL = "http://richeza.me:3000/"

// This function is used to login into wikimedia
function login(){
    fetch(apiURL + "login")
    .then(function(response) {/*console.log(response)*/}); // You can print the response for testing purposes
}

// This function is used to upload a picture to wikimedia, for this we send the picture + the name associated to the place the picture will be added
function upload(pictures, name){
    var formData = new FormData();
    formData.append('file', pictures);
    formData.append('name', name);
    fetch(apiURL + "upload", {
        method: 'POST',
        mode: 'cors',
        body: formData
    })
    .then(function(response){
        // We receive a shorten url from bitly that directly links to the picture hosted by wikimedia.
        // = shortenURL
        document.getElementById('preset-input-image').value += (',' + response.statusText);
        if (response.status == 200) alert('Upload successful');
        else if (response.status == 404) alert('You have to select a picture');
        else if (response.status == 406) alert('You cannot upload to wikimedia, please contact an administrator');
    });
}
