const searchInput = document.getElementById("search");
const searchForm = document.getElementById("searchForm");
const clearButton = document.getElementById("clearSearch");

const result = document.getElementById("result");
const emptyState = document.getElementById("emptyState");

const satelliteCards = [
    ...document.querySelectorAll(".sat-card")
];

const frequencyCards = [
    ...document.querySelectorAll(".frequency-card")
];

const satelliteCount = document.getElementById("satelliteCount");
const frequencyCount = document.getElementById("frequencyCount");


// تبدیل حروف و ارقام برای جست‌وجوی بهتر
function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[۰-۹]/g, digit =>
            "۰۱۲۳۴۵۶۷۸۹".indexOf(digit)
        )
        .replace(/[٠-٩]/g, digit =>
            "٠١٢٣٤٥٦٧٨٩".indexOf(digit)
        )
        .replace(/ي/g, "ی")
        .replace(/ك/g, "ک")
        .replace(/[°º]/g, "")
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();
}


// شمارش اولیه اطلاعات
function updateStatistics() {
    satelliteCount.textContent = satelliteCards.length;
    frequencyCount.textContent = frequencyCards.length;
}

updateStatistics();


// انجام جست‌وجو
function performSearch() {
    const query = normalizeText(searchInput.value);

    let matchedSatellites = 0;
    let matchedFrequencies = 0;

    clearButton.hidden = query.length === 0;

    satelliteCards.forEach(satellite => {
        const summary = satellite.querySelector("summary");

        const frequencies = [
            ...satellite.querySelectorAll(".frequency-card")
        ];

        const satelliteText = normalizeText(
            summary.innerText
        );

        // آیا عبارت جست‌وجو در نام ماهواره است؟
        const satelliteNameMatches =
            query !== "" && satelliteText.includes(query);

        let visibleFrequencyCount = 0;

        frequencies.forEach(card => {
            const frequencyText = normalizeText(
                card.innerText
            );

            const frequencyMatches =
                query === "" ||
                satelliteNameMatches ||
                frequencyText.includes(query);

            card.hidden = !frequencyMatches;

            if (frequencyMatches) {
                visibleFrequencyCount++;
            }
        });

        const shouldShowSatellite =
            query === "" ||
            satelliteNameMatches ||
            visibleFrequencyCount > 0;

        satellite.hidden = !shouldShowSatellite;

        if (shouldShowSatellite) {
            matchedSatellites++;
            matchedFrequencies += visibleFrequencyCount;

            if (query !== "") {
                satellite.open = true;
            }
        } else if (query !== "") {
            satellite.open = false;
        }

        // در حالت عادی تمام فرکانس‌ها نمایش داده می‌شوند.
        if (query === "") {
            frequencies.forEach(card => {
                card.hidden = false;
            });
        }
    });

    // پیام نتیجه
    if (query === "") {
        result.textContent =
            "تمام ماهواره‌ها و فرکانس‌های ثبت‌شده نمایش داده می‌شوند.";
    } else {
        result.textContent =
            `${matchedSatellites} ماهواره و ` +
            `${matchedFrequencies} فرکانس مطابق جست‌وجو پیدا شد.`;
    }

    emptyState.hidden = matchedSatellites !== 0;
}


// جست‌وجو با کلیک روی دکمه
searchForm.addEventListener("submit", event => {
    event.preventDefault();
    performSearch();
});


// جست‌وجو هنگام تایپ
searchInput.addEventListener("input", performSearch);


// پاک کردن جست‌وجو
clearButton.addEventListener("click", () => {
    searchInput.value = "";
    performSearch();
    searchInput.focus();
});

