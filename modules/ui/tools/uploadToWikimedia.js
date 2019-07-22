// everything is asynchronous
// this should be automatically called when you call the popup (the faster you get the login token the quicker you can login)

export { getLoginToken, login, doApiCall };

var apiURL = 'https://commons.wikimedia.org/w/api.php';
var CSRFToken;
var jsonLogInfo;
var loginToken;

// send a fetch request to get the login token
function getLoginToken() {
    var params = 'action=query&meta=tokens&format=json&type=login';

    fetch(apiURL + '?' + params, {
        credentials: 'include'
    })
        .then(function(response) {
            response.json();
        })
        .then(function(data) {
            loadJson(function(response) {
                jsonLogInfo = JSON.parse(response);
                loginToken = data.query.tokens.logintoken;
            });
        });
}
// permits to get a CSRF token needed for the uploading (automatically called after the login)
function getCSRFToken(pictures) {
    var params = 'action=query&meta=tokens&format=json';
    fetch(apiURL + '?' + params, {
        credentials: 'include'
    })
        .then(function(response) {
            response.json();
        })
        .then(function(data) {
            CSRFToken = data.query.tokens.csrftoken;
        })
        .then(function() {
            doApiCall(pictures);
        });
}

// permits to login to wikimedia commons, login credentials are in a local file
function login(pictures) {
    if (!loginToken)
        alert('No login token, please wait or check the internet connection');
    var formData = new FormData();
    formData.append('action', 'login');
    formData.append('lgname', jsonLogInfo.loginInfo.lgname);
    formData.append('lgpassword', jsonLogInfo.loginInfo.lgpassword);
    formData.append('lgtoken', loginToken);
    formData.append('format', 'json');

    var query = new URLSearchParams(formData);

    fetch(apiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        credentials: 'include',
        body: query
    })
        .then(function(response) {
            response.json();
        })
        .then(function() {
            getCSRFToken(pictures);
        });
}

// send the picutre to wikimedia commons
function doApiCall(pictures) {
    if (CSRFToken == undefined) {
        alert('CSRFToken not defined, please wait');
        return;
    }

    var formData = new FormData();
    formData.append('action', 'upload');
    formData.append('format', 'json');
    // TODO: replace the filename with the actual name of the building
    formData.append(
        'filename',
        'OpenYesterday' + Math.floor(Math.random() * Math.floor(214748364))
    );
    // TODO: get the file from the used library
    formData.append('file', pictures.files[0]);
    formData.append('token', CSRFToken);
    formData.append('ignorewarnings', 1);

    fetch(apiURL, {
        method: 'POST',
        credentials: 'include',
        body: formData
    })
        .then(function(response) {
            response.json();
        })
        .then(function(response) {
            console.log(response.upload.imageinfo.descriptionurl);
        });
}

// loads json login credentials file
function loadJson(callback) {
    var xhObj = new XMLHttpRequest();
    xhObj.overrideMimeType('application/json');
    xhObj.open('GET', '../bot.json');
    xhObj.onreadystatechange = function() {
        if (xhObj.readyState == 4 && xhObj.status == 200) {
            callback(xhObj.responseText);
        }
    };
    xhObj.send(null);
}

// function logout(csrfToken){
//     if(!csrfToken) alert('WAIT');
//     let formData = new FormData();
//     formData.append('action', 'logout');
//     formData.append('token', csrfToken);
//     formData.append('format', 'json');
//     let data = new URLSearchParams(formData);
//     fetch(encodeURI(apiURL),{
//         method: 'POST',
//         credentials: 'include',
//         body: data
//     })
// }
