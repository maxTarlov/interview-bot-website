// Javascript for bot interface

window.addEventListener("load", () => {

    function feedbackHandlerFactory(good) {
        async function result() {
            if(good) {
                feedbackPositive.disabled = true;
                feedbackNegative.disabled = false;
            }
            else {
                feedbackPositive.disabled = false;
                feedbackNegative.disabled = true;
            }

            const feedbackData = {
                "id": await logID,
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
    
    async function handleResponse(data) {
        form['user-question'].value = data['user_question'];
        responseArea.textContent = data['bot_answer'];
        form['user-question'].disabled = false;
        submitButton.disabled = false;
        enableSuggestionLinks(data['suggestions']);
        logID = await data['id'];
        serverReady = true;
        enableFeedbackButtons();
        console.log("Cloud function response:");
        console.log(data);
    }

    function warmUpCloudFunction() {
        console.log("Warming up cloud function");
        let warmUpID = fetch(backEndURL)
            .then((response) => response.json())
            .then((data) => data['id']);
        let pre_load_data = {
            "user_question": "Tell me about yourself.",
            "bot_answer": "I am a chatbot designed to answer common interview questions\
                           naturalistically. My author created me to learn more about\
                           different AI technologies and get hands-on experience with\
                           deploying a machine learning model.",
            "suggestions": [
                "What are your strengths",
                "What are your weaknesses",
                "What three character traits would your friends use to describe you?"
            ],
            "id": warmUpID
        }
        handleResponse(pre_load_data);
        return warmUpID;
    }

    async function sendData() {
        await logID;  // waits for server to be warm
        console.log("Sending user question");
        fetch(`${backEndURL}?q=${encodeURIComponent(form['user-question'].value)}`)
            .then((response) => response.json())
            .then(handleResponse);
    }

    function handleSubmit() {
        form['user-question'].disabled = true;
        submitButton.disabled = true;
        responseArea.textContent = "Loading...";
        disableFeedbackButtons();
        disableSuggestionLinks();
        sendData();
    }

    const backEndURL = "http://localhost:8080"//"https://handle-question-irwuk7yqaq-uw.a.run.app";

    const suggestionLinks = document.getElementById("suggestion-list").children;
    const form = document.getElementById("bot-ui-form");
    const submitButton = document.getElementById("submit-button");
    const responseArea = document.getElementById("response-text");

    const feedbackPositive = document.getElementById("feedback-positive");
    const feedbackNegative = document.getElementById("feedback-negative");

    let logID = warmUpCloudFunction();

    feedbackPositive.addEventListener("click", feedbackHandlerFactory(true));
    feedbackNegative.addEventListener("click", feedbackHandlerFactory(false)); 

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        handleSubmit();
    });
});
