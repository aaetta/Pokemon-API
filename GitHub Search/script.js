const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");
const errorMessage = document.getElementById("errorMessage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const paginationContainer = document.querySelector(".pagination");

let currentPage = 1;
let lastSearchTerm = "";

async function fetchRepos(query, page = 1) {
    const url = `https://api.github.com/search/repositories?q=${query}&per_page=3&page=${page}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        displayResults(data.items);

        if (data.items.length > 0) {
            paginationContainer.classList.remove("hidden");
            prevBtn.disabled = page === 1;
            nextBtn.disabled = data.items.length < 3;
        } else {
            paginationContainer.classList.add("hidden");
        }
    } catch (error) {
        showError(error.message);
    }
}

function displayResults(repos) {
    resultsDiv.innerHTML = "";
    errorMessage.textContent = "";

    if (repos.length === 0) {
        showError("No repositories found!");
        return;
    }

    repos.forEach(repo => {
        const repoCard = document.createElement("div");
        repoCard.classList.add("repo-card");

        repoCard.innerHTML = `
            <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
            <p>${repo.description || "No description available"}</p>
            <p>⭐ Stars: ${repo.stargazers_count}</p>
            <p>📝 Language: ${repo.language || "Not specified"}</p>
        `;
        resultsDiv.appendChild(repoCard);
    });
}

function showError(message) {
    errorMessage.textContent = message;
    resultsDiv.innerHTML = "";
    paginationContainer.classList.add("hidden");
}

// Event Listeners
searchBtn.addEventListener("click", () => {
    lastSearchTerm = searchInput.value.trim();
    if (lastSearchTerm) {
        currentPage = 1;
        fetchRepos(lastSearchTerm, currentPage);
    } else {
        showError("Please enter a search term!");
    }
});

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        fetchRepos(lastSearchTerm, currentPage);
    }
});

nextBtn.addEventListener("click", () => {
    currentPage++;
    fetchRepos(lastSearchTerm, currentPage);
});
