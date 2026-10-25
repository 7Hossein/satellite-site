const searchInput = document.getElementById("search");
const coverageFilter = document.getElementById("coverageFilter");
const statusFilter = document.getElementById("statusFilter");
const cards = Array.from(document.querySelectorAll(".sat-card"));
const satelliteCount = document.getElementById("satelliteCount");
const frequencyCount = document.getElementById("frequencyCount");
const emptyState = document.getElementById("emptyState");

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[۰-۹]/g, digit => "۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
    .replace(/[٠-٩]/g, digit => "٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ")
    .trim();
}

function filterSatellites() {
  const query = normalizeText(searchInput.value);
  const coverage = coverageFilter.value;
  const status = statusFilter.value;
  let visibleCount = 0;

  cards.forEach(card => {
    const searchable = normalizeText(
      `${card.dataset.name} ${card.dataset.position} ${card.innerText}`
    );
    const matchesQuery = !query || searchable.includes(query);
    const matchesCoverage = coverage === "all" || card.dataset.coverage === coverage;
    const matchesStatus = status === "all" || card.dataset.status === status;
    const visible = matchesQuery && matchesCoverage && matchesStatus;

    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  satelliteCount.textContent = String(visibleCount);
  // در این نسخه فرکانسی در داخل سایت به‌صورت مستقل تأیید نشده است.
  // بنابراین عدد ساختگی یا شمارش فرکانس‌های منبع بیرونی نمایش داده نمی‌شود.
  frequencyCount.textContent = "—";
  emptyState.hidden = visibleCount !== 0;
}

searchInput.addEventListener("input", filterSatellites);
coverageFilter.addEventListener("change", filterSatellites);
statusFilter.addEventListener("change", filterSatellites);
filterSatellites();
