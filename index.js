const endpoints = {
    "index.html": "topstories",
    "news.html": "newstories",
    "jobs.html": "jobstories",
};

const [currentPath] = window.location.pathname.split('/').slice(-1);
console.log(currentPath);
const endpoint = endpoints[currentPath] || "topstories";

let currentIdx = 0;
const storiesPerPage = 30;

async function getStories() {
    try {
        // fetch stories
        const response = await fetch(
            `https://hacker-news.firebaseio.com/v0/${endpoint}.json?print=pretty`
        );
        const storyIds = await response.json();

        // slice to top 10 stories for now
        const topstories = storyIds.slice(
            currentIdx,
            currentIdx + storiesPerPage
        );

        // fetch each stories details
        for (const storyId of topstories) {
            const storyResponse = await fetch(
                `https://hacker-news.firebaseio.com/v0/item/${storyId}.json?print=pretty`
            );
            const storyData = await storyResponse.json();

            // title, url, and author
            const title = storyData.title || "No Title";
            const url = storyData.url || "#";
            const user = storyData.by || "Unknown";
            const time = storyData.time || 0;
            const score = storyData.score || 0;
            const formattedTime = dateFns.formatDistanceToNow(
                new Date(time * 1000)
            );

            // create bootstrap list
            const card = document.createElement("div");
            card.classList.add("col");
            card.innerHTML = `
                <div class="card border border-3 border-dark-subtle rounded-4 shadow">
                    <a href="${url}" target="_blank">    
                        <div class="card-body">
                            <h5 class="card-title">${title}</h5>
                        </div>
                        <p class="blockquote-footer m-3 text-end">${user}</p>
                    </a>
                    <div class="card-footer d-flex justify-content-between">
                        <span>
                            ${score} points
                        </span>
                        <span>
                            ${formattedTime} ago
                        </span>
                    </div>
                </div>
            `;

            document.querySelector("main .container .row").appendChild(card);
        }

        currentIdx += storiesPerPage;

        if (currentIdx >= storyIds.length) {
            document.querySelector(".load-more button").style.display = "none";
        }
    } catch (error) {
        console.error("Error fecthing Hacker News storiess:", error);
    }
}

document
    .querySelector(".load-more button")
    .addEventListener("click", getStories);

window.onload = getStories;
