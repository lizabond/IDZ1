function parseDMY(str) {
    if (!str) return null;
    const [y, m, d] = str.split("-");
    const date = new Date(y, m - 1, d);
    return isNaN(date) ? null : date;
}

function formatDate(date) {
    let d = String(date.getDate()).padStart(2, "0");
    let m = String(date.getMonth() + 1).padStart(2, "0");
    let y = date.getFullYear();
    return `${d}.${m}.${y}`;
}

function normalizeHoliday(str) {
    const [dd, mm, yyyy] = str.split(".");
    if (!dd || !mm || !yyyy) return null;
    return `${dd.padStart(2, "0")}.${mm.padStart(2, "0")}.${yyyy}`;
}

function calculate() {
    const startStr = document.getElementById("startDate").value;
    const endStr = document.getElementById("endDate").value;
    const durationStr = document.getElementById("duration").value.trim();
    const holidayStr = document.getElementById("holidays").value.trim();

    const warning = document.getElementById("warning");
    const result = document.getElementById("result");

    warning.textContent = "";
    result.textContent = "";

    const start = parseDMY(startStr);
    const end = parseDMY(endStr);
    const duration = parseInt(durationStr);

    const holidays = holidayStr
        .split(",")
        .map(s => s.trim())
        .map(normalizeHoliday)
        .filter(d => d !== null);

    if (start) if (start.getDay() === 0) warning.textContent += "Увага: дата початку припадає на неділю. ";
    if (end) if (end.getDay() === 0) warning.textContent += "Увага: дата завершення припадає на неділю. ";

    if ((startStr && !start) || (endStr && !end)) {
        result.textContent = "Помилка: введена некоректна дата.";
        return;
    }
    if (durationStr && (isNaN(duration) || duration <= 0)) {
        result.textContent = "Помилка: тривалість має бути додатнім числом.";
        return;
    }

    if (start && duration && !endStr) {
        let current = new Date(start);
        let counted = 1;
        while (counted < duration) {
            current.setDate(current.getDate() + 1);
            if (!holidays.includes(formatDate(current))) counted++;
        }
        result.textContent = "Дата завершення: " + formatDate(current);
        return;
    }

    if (end && duration && !startStr) {
        let current = new Date(end);
        let counted = 1;
        while (counted < duration) {
            current.setDate(current.getDate() - 1);
            if (!holidays.includes(formatDate(current))) counted++;
        }
        result.textContent = "Дата початку: " + formatDate(current);
        return;
    }

    if (start && end && !durationStr) {
        if (end < start) {
            result.textContent = "Помилка: дата завершення не може бути раніше за дату початку.";
            return;
        }
        let current = new Date(start);
        let days = 1;
        while (current < end) {
            current.setDate(current.getDate() + 1);
            if (!holidays.includes(formatDate(current))) days++;
        }
        result.textContent = "Тривалість: " + days + " днів";
        return;
    }

    result.textContent = "Помилка: введіть рівно два параметри.";
}


function resetForm() {
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
    document.getElementById("duration").value = "";
    document.getElementById("holidays").value = "";
    document.getElementById("warning").textContent = "";
    document.getElementById("result").textContent = "";
}
