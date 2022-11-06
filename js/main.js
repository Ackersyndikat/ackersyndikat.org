function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function main() {
    // Add onclick handlers for closing elements
    for (const cross_elem of document.getElementsByClassName("cross")) {
        cross_elem.onclick = function closeModal(event) {
            event.target.parentNode.style.display = 'none';
        }
    }

    const captcha_modal = document.getElementById("captcha-modal");
    for (const button of document.getElementsByClassName("captcha-button")) {
        button.onclick = function openModal() {
            captcha_modal.style.display = 'block';
        }
    }
}

ready(main);

var captcha_lambda_endpoint = "https://captcha.morris-frank.dev/ackersyndikat";
var replaceSecrets = function (secrets) {
    for (const key in secrets) {
        for (const root of document.getElementsByClassName("secret-" + key)) {
            let new_root = document.createElement("span");
            new_root.innerHTML = secrets[key].trim();
            root.parentNode.insertBefore(new_root, root);
            root.remove();
        }
    }
}
var onSuccessfullCaptcha = function (token) {
    const XHR = new XMLHttpRequest();
    let data = 'response=' + encodeURIComponent(token);
    XHR.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let secrets = JSON.parse(this.responseText);
            replaceSecrets(secrets);
            document.getElementById("captcha-modal").style.display = "none";
        }
    };
    XHR.open('POST', captcha_lambda_endpoint);
    XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    XHR.send(data);
}

