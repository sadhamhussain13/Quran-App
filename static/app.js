const elements = {
    surahSelect: document.getElementById("surahSelect"),
    ayahSelect: document.getElementById("ayahSelect"),
    loadAyahButton: document.getElementById("loadAyah"),
    clearReadButton: document.getElementById("clearRead"),
    searchInput: document.getElementById("searchInput"),
    searchButton: document.getElementById("searchButton"),
    clearButton: document.getElementById("clearButton"),
    searchSurah: document.getElementById("searchSurah"),
    surahInfo: document.getElementById("surahInfo"),
    verses: document.getElementById("verses"),
    searchResults: document.getElementById("searchResults"),
    readModeButton: document.getElementById("readModeButton"),
    searchModeButton: document.getElementById("searchModeButton"),
    readPanel: document.getElementById("readPanel"),
    searchPanel: document.getElementById("searchPanel")
};

const state = {
    currentVerses: [],
    currentSearchPage: 1
};

function showLoading(container, message) {
    container.innerHTML = `
        <div class="loading-state">
            <div class="loader" aria-hidden="true"></div>
            <p>${message}</p>
        </div>
    `;
}

function showMessage(container, message, type = "empty") {
    container.innerHTML = `
        <div class="${type}-state">
            <p>${message}</p>
        </div>
    `;
}

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
}

async function getJson(url) {
    const response = await fetch(url);
    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        throw new Error(data.error || "Request failed.");
    }

    return data;
}

async function loadSurahs() {
    try {
        const surahs = await getJson("/api/surahs");

        elements.surahSelect.innerHTML =
            '<option value="">Select a Surah</option>';
        elements.searchSurah.innerHTML =
            '<option value="">All Surahs</option>';

        surahs.forEach((surah) => {
            const readOption = document.createElement("option");
            readOption.value = surah.number;
            readOption.textContent =
                `${surah.number}. ${surah.english} - ${surah.arabic}`;
            elements.surahSelect.appendChild(readOption);

            const searchOption = document.createElement("option");
            searchOption.value = surah.number;
            searchOption.textContent =
                `${surah.number}. ${surah.english}`;
            elements.searchSurah.appendChild(searchOption);
        });
    } catch (error) {
        showMessage(
            elements.readContent,
            `Unable to load Surahs: ${escapeHtml(error.message)}`,
            "error"
        );
    }
}

async function loadSurah(surahNumber) {
    resetAyahSelect();

    if (!surahNumber) {
        state.currentVerses = [];
        elements.surahInfo.innerHTML = "";
        elements.verses.innerHTML = "";
        return;
    }

    elements.ayahSelect.disabled = true;
    showLoading(elements.verses, "Loading Surah...");

    try {
        const verses = await getJson(`/api/surah/${surahNumber}`);
        state.currentVerses = Array.isArray(verses) ? verses : [];

        if (!state.currentVerses.length) {
            showMessage(elements.verses, "No verses found for this Surah.");
            return;
        }

        const firstVerse = state.currentVerses[0];

        elements.surahInfo.innerHTML = `
            <h2>${escapeHtml(firstVerse.surah_arabic)}</h2>
            <h3>${escapeHtml(firstVerse.surah_english)}</h3>
        `;

        state.currentVerses.forEach((verse) => {
            const option = document.createElement("option");
            option.value = verse.ayah_number;
            option.textContent = `Ayah ${verse.ayah_number}`;
            elements.ayahSelect.appendChild(option);
        });

        elements.ayahSelect.disabled = false;
        displayVerses(state.currentVerses, elements.verses);
    } catch (error) {
        showMessage(
            elements.verses,
            escapeHtml(error.message),
            "error"
        );

        elements.verses.insertAdjacentHTML(
            "beforeend",
            `<button id="retrySurah" type="button">Try Again</button>`
        );

        document.getElementById("retrySurah").addEventListener(
            "click",
            () => loadSurah(surahNumber)
        );
    }
}

function displayVerses(verses, container) {
    container.innerHTML = "";

    verses.forEach((verse) => {
        const verseElement = document.createElement("article");
        verseElement.className = "verse";

        verseElement.innerHTML = `
            <div class="ayah-number">
                Surah ${escapeHtml(verse.surah_number)}
                -
                ${escapeHtml(verse.surah_english)}
                |
                Ayah ${escapeHtml(verse.ayah_number)}
            </div>

            <div class="arabic" lang="ar">
                ${escapeHtml(verse.arabic)}
            </div>

            <div class="english">
                ${escapeHtml(verse.english)}
            </div>
        `;

        container.appendChild(verseElement);
    });
}

async function searchQuran(page = 1) {
    const query = elements.searchInput.value.trim();

    if (!query) {
        showMessage(
            elements.searchResults,
            "Please enter a search term.",
            "error"
        );
        return;
    }

    state.currentSearchPage = page;
    showLoading(elements.searchResults, "Searching the Qur'an...");

    try {
        const params = new URLSearchParams({
            q: query,
            page: page,
            surah: elements.searchSurah.value
        });

        const data = await getJson(`/api/search?${params.toString()}`);
        const results = Array.isArray(data.results) ? data.results : [];

        if (!results.length) {
            showMessage(elements.searchResults, "No matching verses found.");
            return;
        }

        elements.searchResults.innerHTML = "";

        const resultInfo = document.createElement("p");
        resultInfo.className = "result-info";
        resultInfo.textContent = `${data.total} matching verses found`;
        elements.searchResults.appendChild(resultInfo);

        results.forEach((verse) => {
            const result = document.createElement("article");
            result.className = "verse";

            result.innerHTML = `
                <div class="ayah-number">
                    ${escapeHtml(verse.surah_number)}.
                    ${escapeHtml(verse.surah_english)}
                    —
                    Ayah ${escapeHtml(verse.ayah_number)}
                </div>

                <div class="arabic" lang="ar">
                    ${escapeHtml(verse.arabic)}
                </div>

                <div class="english">
                    ${escapeHtml(verse.english)}
                </div>
            `;

            elements.searchResults.appendChild(result);
        });

        renderPagination(data);
    } catch (error) {
        showMessage(
            elements.searchResults,
            escapeHtml(error.message),
            "error"
        );

        elements.searchResults.insertAdjacentHTML(
            "beforeend",
            `<button id="retrySearch" type="button">Try Again</button>`
        );

        document.getElementById("retrySearch").addEventListener(
            "click",
            () => searchQuran(page)
        );
    }
}

function renderPagination(data) {
    const totalPages = Number(data.total_pages) || 1;
    const currentPage = Number(data.page) || 1;

    if (totalPages <= 1) {
        return;
    }

    const pagination = document.createElement("div");
    pagination.className = "pagination";

    const previousButton = document.createElement("button");
    previousButton.textContent = "Previous";
    previousButton.disabled = currentPage <= 1;

    const pageText = document.createElement("span");
    pageText.textContent = `Page ${currentPage} of ${totalPages}`;

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage >= totalPages;

    previousButton.addEventListener(
        "click",
        () => searchQuran(currentPage - 1)
    );

    nextButton.addEventListener(
        "click",
        () => searchQuran(currentPage + 1)
    );

    pagination.append(
        previousButton,
        pageText,
        nextButton
    );

    elements.searchResults.appendChild(pagination);
}

function resetAyahSelect() {
    elements.ayahSelect.innerHTML =
        '<option value="">Select an Ayah</option>';
    elements.ayahSelect.disabled = true;
}

function clearReadSection() {
    elements.surahSelect.value = "";
    resetAyahSelect();
    state.currentVerses = [];
    elements.surahInfo.innerHTML = "";
    elements.verses.innerHTML = "";
}

function clearSearch() {
    elements.searchInput.value = "";
    elements.searchSurah.value = "";
    elements.searchResults.innerHTML = "";
    state.currentSearchPage = 1;
}

function switchMode(mode) {
    const isRead = mode === "read";

    elements.readPanel.classList.toggle("active-panel", isRead);
    elements.searchPanel.classList.toggle("active-panel", !isRead);

    elements.readModeButton.classList.toggle("active", isRead);
    elements.searchModeButton.classList.toggle("active", !isRead);
}

elements.surahSelect.addEventListener("change", () => {
    loadSurah(elements.surahSelect.value);
});

elements.loadAyahButton.addEventListener("click", () => {
    const ayahNumber = Number(elements.ayahSelect.value);

    if (!ayahNumber) {
        displayVerses(state.currentVerses, elements.verses);
        return;
    }

    const selectedVerse = state.currentVerses.find(
        (verse) => Number(verse.ayah_number) === ayahNumber
    );

    if (selectedVerse) {
        displayVerses([selectedVerse], elements.verses);
    }
});

elements.clearReadButton.addEventListener("click", clearReadSection);

elements.searchButton.addEventListener("click", () => searchQuran(1));

elements.searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchQuran(1);
    }
});

elements.clearButton.addEventListener("click", clearSearch);

elements.readModeButton.addEventListener(
    "click",
    () => switchMode("read")
);

elements.searchModeButton.addEventListener(
    "click",
    () => switchMode("search")
);

loadSurahs();
