// Javascript for bot interface

window.addEventListener("load", () => {

    function feedbackHandlerFactory(logID, good) {
        function result() {
            if(good) {
                feedbackPositive.disabled = true;
                feedbackNegative.disabled = false;
            }
            else {
                feedbackPositive.disabled = false;
                feedbackNegative.disabled = true;
            }

            const feedbackData = {
                "id": logID,
                "good": good
            }
            
            fetch(backEndURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackData),
                })
                .then((response) => {
                    console.log(`Feedback status: ${response.status}`)
                    console.log(response)
                });
        }
        
        return result
    }

    function enableFeedbackButtons(logID) {
        feedbackPositive.disabled = false;
        feedbackNegative.disabled = false;

        feedbackPositive.addEventListener("click", feedbackHandlerFactory(logID, true));
        feedbackNegative.addEventListener("click", feedbackHandlerFactory(logID, false));   
    }

    function disableFeedbackButtons() {
        feedbackPositive.disabled = true;
        feedbackNegative.disabled = true;
    }
    
    function handleResponse(data) {
        form['user-question'].value = data['user-question'];
        responseArea.textContent = data['bot-answer'];
        form['user-question'].disabled = false;
        submitButton.disabled = false;
        enableFeedbackButtons(data['id']);
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

    const backEndURL = "https://handle-question-irwuk7yqaq-uw.a.run.app/";

    const form = document.getElementById("bot-ui-form");
    const submitButton = document.getElementById("submit-button");
    const responseArea = document.getElementById("response-text");

    const feedbackPositive = document.getElementById("feedback-positive");
    const feedbackNegative = document.getElementById("feedback-negative");

    warmUpCloudFunction();

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        form['user-question'].disabled = true;
        submitButton.disabled = true;
        disableFeedbackButtons();
        sendData();
    });
});
