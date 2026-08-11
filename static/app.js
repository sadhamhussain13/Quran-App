const surahSelect =
    document.getElementById("surahSelect");

const ayahSelect =
    document.getElementById("ayahSelect");

const loadAyahButton =
    document.getElementById("loadAyah");


const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const clearButton =
    document.getElementById("clearButton");

const searchSurah =
    document.getElementById("searchSurah");


const surahInfo =
    document.getElementById("surahInfo");

const versesContainer =
    document.getElementById("verses");

const searchResults =
    document.getElementById("searchResults");


// --------------------------------
// Application state
// --------------------------------

let currentVerses = [];

let currentSearchPage = 1;


// --------------------------------
// Load Surahs
// --------------------------------

async function loadSurahs() {

    try {

        const response =
            await fetch("/api/surahs");


        const surahs =
            await response.json();


        surahs.forEach((surah) => {

            // -------------------------
            // Read dropdown
            // -------------------------

            const readOption =
                document.createElement("option");


            readOption.value =
                surah.number;


            readOption.textContent =
                `${surah.number}. ${surah.english} - ${surah.arabic}`;


            surahSelect.appendChild(
                readOption
            );


            // -------------------------
            // Search dropdown
            // -------------------------

            const searchOption =
                document.createElement("option");


            searchOption.value =
                surah.number;


            searchOption.textContent =
                `${surah.number}. ${surah.english}`;


            searchSurah.appendChild(
                searchOption
            );

        });


    } catch (error) {

        console.error(
            "Error loading Surahs:",
            error
        );

    }
}


// --------------------------------
// Load selected Surah
// --------------------------------

async function loadSurah(surahNumber) {

    if (!surahNumber) {

        ayahSelect.innerHTML =
            '<option value="">Select an Ayah</option>';

        ayahSelect.disabled = true;

        currentVerses = [];

        surahInfo.innerHTML = "";

        versesContainer.innerHTML = "";

        return;
    }


    try {

        const response =
            await fetch(
                `/api/surah/${surahNumber}`
            );


        currentVerses =
            await response.json();


        if (currentVerses.length === 0) {

            return;
        }


        const firstVerse =
            currentVerses[0];


        surahInfo.innerHTML = `

            <h2>
                ${firstVerse.surah_arabic}
            </h2>

            <h3>
                ${firstVerse.surah_english}
            </h3>

        `;


        // -------------------------
        // Populate Ayah dropdown
        // -------------------------

        ayahSelect.innerHTML =
            '<option value="">Select an Ayah</option>';


        currentVerses.forEach((verse) => {

            const option =
                document.createElement("option");


            option.value =
                verse.ayah_number;


            option.textContent =
                `Ayah ${verse.ayah_number}`;


            ayahSelect.appendChild(
                option
            );

        });


        ayahSelect.disabled = false;


        // Show complete Surah

        displayVerses(
            currentVerses
        );


    } catch (error) {

        console.error(
            "Error loading Surah:",
            error
        );

    }
}


// --------------------------------
// Display verses
// --------------------------------

function displayVerses(verses) {

    versesContainer.innerHTML = "";


    verses.forEach((verse) => {

        const verseElement =
            document.createElement("div");


        verseElement.className =
            "verse";


        verseElement.innerHTML = `

            <div class="ayah-number">

                Surah ${verse.surah_number}
                -
                ${verse.surah_english}

                |

                Ayah ${verse.ayah_number}

            </div>


            <div class="arabic">

                ${verse.arabic}

            </div>


            <div class="english">

                ${verse.english}

            </div>

        `;


        versesContainer.appendChild(
            verseElement
        );

    });
}


// --------------------------------
// Search Qur'an
// --------------------------------

async function searchQuran(page = 1) {

    const query =
        searchInput.value.trim();


    if (!query) {

        searchResults.innerHTML =
            "<p>Please enter a search term.</p>";

        return;
    }


    currentSearchPage = page;


    const selectedSurah =
        searchSurah.value;


    try {

        searchResults.innerHTML =
            "<p>Searching...</p>";


        const url =
            `/api/search?q=${encodeURIComponent(query)}&page=${page}&surah=${selectedSurah}`;


        const response =
            await fetch(url);


        const data =
            await response.json();


        if (data.results.length === 0) {

            searchResults.innerHTML = `

                <p>
                    No matching verses found.
                </p>

            `;

            return;
        }


        searchResults.innerHTML = "";


        // -------------------------
        // Result count
        // -------------------------

        const resultInfo =
            document.createElement("p");


        resultInfo.className =
            "result-info";


        resultInfo.textContent =
            `${data.total} matching verses found`;


        searchResults.appendChild(
            resultInfo
        );


        // -------------------------
        // Display results
        // -------------------------

        data.results.forEach((verse) => {

            const result =
                document.createElement("div");


            result.className =
                "verse";


            result.innerHTML = `

                <div class="ayah-number">

                    ${verse.surah_number}.
                    ${verse.surah_english}

                    —

                    Ayah ${verse.ayah_number}

                </div>


                <div class="arabic">

                    ${verse.arabic}

                </div>


                <div class="english">

                    ${verse.english}

                </div>

            `;


            searchResults.appendChild(
                result
            );

        });


        // -------------------------
        // Pagination
        // -------------------------

        const pagination =
            document.createElement("div");


        pagination.className =
            "pagination";


        pagination.innerHTML = `

            <button
                id="previousPage"
                ${data.page <= 1 ? "disabled" : ""}
            >
                Previous
            </button>


            <span>

                Page ${data.page}
                of
                ${data.total_pages}

            </span>


            <button
                id="nextPage"
                ${data.page >= data.total_pages ? "disabled" : ""}
            >
                Next
            </button>

        `;


        searchResults.appendChild(
            pagination
        );


        // -------------------------
        // Previous
        // -------------------------

        document
            .getElementById("previousPage")
            .addEventListener(
                "click",
                () => {

                    searchQuran(
                        data.page - 1
                    );

                }
            );


        // -------------------------
        // Next
        // -------------------------

        document
            .getElementById("nextPage")
            .addEventListener(
                "click",
                () => {

                    searchQuran(
                        data.page + 1
                    );

                }
            );


    } catch (error) {

        console.error(
            "Search error:",
            error
        );


        searchResults.innerHTML =
            "<p>Something went wrong.</p>";

    }
}


// --------------------------------
// Clear everything
// --------------------------------

function clearSearch() {

    searchInput.value = "";

    searchSurah.value = "";

    searchResults.innerHTML = "";

    currentSearchPage = 1;

}


// --------------------------------
// Surah changed
// --------------------------------

surahSelect.addEventListener(
    "change",
    () => {

        loadSurah(
            surahSelect.value
        );

    }
);


// --------------------------------
// Read selected Ayah
// --------------------------------

loadAyahButton.addEventListener(
    "click",
    () => {

        const ayahNumber =
            Number(ayahSelect.value);


        if (!ayahNumber) {

            displayVerses(
                currentVerses
            );

            return;
        }


        const selectedVerse =
            currentVerses.find(
                (verse) =>
                    verse.ayah_number === ayahNumber
            );


        if (selectedVerse) {

            displayVerses([
                selectedVerse
            ]);

        }

    }
);


// --------------------------------
// Search button
// --------------------------------

searchButton.addEventListener(
    "click",
    () => {

        searchQuran(1);

    }
);


// --------------------------------
// Enter key search
// --------------------------------

searchInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            searchQuran(1);

        }

    }
);


// --------------------------------
// Clear button
// --------------------------------

clearButton.addEventListener(
    "click",
    clearSearch
);


// --------------------------------
// Start application
// --------------------------------

loadSurahs();