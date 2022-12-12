---
layout: default
permalink: /how
---

## How did you make this?

The interview bot uses embeddings to compare user questions to questions I have already written answers to. If the bot is confident that your question is semantically similar to one of the "golden" questions, it responds with the answer to that golden question. Otherwise, it returns a fallback answer.

To fully explain the process of how I created this chatbot, I have compiled a [Google Colab notebook](https://colab.research.google.com/drive/1lnJYEYMWxr5dPkYaOuagFOhJyfeGNW5q?usp=sharing) which you can read and run in order to create and deploy your own version of the interview bot API. While the notebook itself is [protected by copyright](/copyright), I have provided a copy of the source code under the MIT License on [GitHub](https://github.com/maxTarlov/interview-bot-source).

In the coming months, I will post a follow-up that adds a spelling correction feature to the chatbot, similar to how Google Search identifies and corrects typos when you mispell a search term.
