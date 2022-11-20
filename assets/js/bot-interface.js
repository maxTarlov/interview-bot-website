// Javascript for bot interface

window.addEventListener("load", () => {

    const backEndURL = "https://handle-question-irwuk7yqaq-uw.a.run.app/";
    
    function handleResponse(data) {
        form['user-question'].value = data['user-question'];
        responseArea.textContent = data['bot-answer'];
        form['user-question'].disabled = false;
        submitButton.disabled = false;
        console.log("Cloud function response:");
        console.log(data);
    }

    function warmUpCloudFunction() {
        console.log("Warming up cloud function");
        fetch(backEndURL)
            .then((response) => response.json())
            .then(handleResponse);
    }

    function sendData() {
        responseArea.textContent = "Loading...";
        console.log("Sending user question");
        fetch(`${backEndURL}?q=${encodeURIComponent(form['user-question'].value)}`)
            .then((response) => response.json())
            .then(handleResponse);
    }

    const form = document.getElementById("bot-ui-form");
    const submitButton = document.getElementById("submit-button");
    const responseArea = document.getElementById("response-text");

    warmUpCloudFunction();

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        form['user-question'].disabled = true;
        submitButton.disabled = true;
        sendData();
    });
});
