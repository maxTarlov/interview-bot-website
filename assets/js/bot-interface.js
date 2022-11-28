// Javascript for bot interface

window.addEventListener("load", () => {

    function feedbackHandlerFactory(good) {
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
                    console.log(`Feedback status: ${response.status}`);
                    console.log(response);
                });
        }
        
        return result
    }

    function enableFeedbackButtons() {
        feedbackPositive.disabled = false;
        feedbackNegative.disabled = false;
    }

    function disableFeedbackButtons() {
        feedbackPositive.disabled = true;
        feedbackNegative.disabled = true;
    }

    function suggestionHandlerFactory(suggestedQuestion) {
        function result() {
            form['user-question'].value = suggestedQuestion;
            handleSubmit();
        }
        return result
    }

    function enableSuggestionLinks(suggestions) {
        for(let i = 0; i < suggestionLinks.length; i++) {
            let currLI = suggestionLinks[i];
            console.assert(currLI.children.length == 1);
            let oldChild = currLI.children[0];
            let link = document.createElement("a");
            link.textContent = suggestions[i];
            link.addEventListener("click", suggestionHandlerFactory(suggestions[i]));
            currLI.replaceChild(link, oldChild);
            console.assert(currLI.children.length == 1);
        }
    }

    function disableSuggestionLinks() {
        for(let i = 0; i < suggestionLinks.length; i++) {
            let currLI = suggestionLinks[i];
            let oldChild = currLI.children[0];
            console.assert(currLI.children.length == 1);
            let span = document.createElement("span");
            span.textContent = "Loading...";
            currLI.replaceChild(span, oldChild);
            console.assert(currLI.children.length == 1);
        }
    }
    
    function handleResponse(data) {
        form['user-question'].value = data['user_question'];
        responseArea.textContent = data['bot_answer'];
        form['user-question'].disabled = false;
        submitButton.disabled = false;
        enableSuggestionLinks(data['suggestions']);
        logID = data['id'];
        enableFeedbackButtons();
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

    function handleSubmit() {
        form['user-question'].disabled = true;
        submitButton.disabled = true;
        disableFeedbackButtons();
        disableSuggestionLinks();
        sendData();
    }

    const backEndURL = "https://handle-question-irwuk7yqaq-uw.a.run.app";

    const suggestionLinks = document.getElementById("suggestion-list").children;
    const form = document.getElementById("bot-ui-form");
    const submitButton = document.getElementById("submit-button");
    const responseArea = document.getElementById("response-text");

    const feedbackPositive = document.getElementById("feedback-positive");
    const feedbackNegative = document.getElementById("feedback-negative");

    let logID;

    warmUpCloudFunction();

    feedbackPositive.addEventListener("click", feedbackHandlerFactory(true));
    feedbackNegative.addEventListener("click", feedbackHandlerFactory(false)); 

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        handleSubmit();
    });
});
