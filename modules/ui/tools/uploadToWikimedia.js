export{
    login,
    upload
};

var apiURL = "http://richeza.me:3000/"

function login(){
    fetch(apiURL + "login")
    .then(function(response) {console.log(response)});
}

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
        // = shortenURL
        document.getElementById('preset-input-image').value += (',' + response.statusText);
        alert('Upload successful');
    });
}
