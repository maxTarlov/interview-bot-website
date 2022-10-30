// Javascript for bot interface

window.addEventListener("load", () => {
    function warmUpCloudFunction() {
        console.log("Warming up cloud function");
        fetch("https://handle-question-irwuk7yqaq-uc.a.run.app/")
            .then((response) => response.json())
            .then((data) => {
                form['user-question'].value = data['user-question'];
                responseArea.textContent = data['bot-answer'];
                submitButton.disabled = false;
                console.log("Cloud function response:");
                console.log(data);
            });
    }
    function sendData() {
        console.log(form['user-question'].value);
        console.log("Sending user question");
        fetch(`https://handle-question-irwuk7yqaq-uc.a.run.app/?q=${encodeURIComponent(form['user-question'].value)}`)
            .then((response) => response.json())
            .then((data) => {
                form['user-question'].value = data['user-question'];
                responseArea.textContent = data['bot-answer'];
                submitButton.disabled = false;
                console.log("Cloud function response:");
                console.log(data);
            });
    }

    const form = document.getElementById("bot-ui-form");
    const submitButton = document.getElementById("submit-button");
    const responseArea = document.getElementById("response-text");
    warmUpCloudFunction();
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        sendData();
    });
});
