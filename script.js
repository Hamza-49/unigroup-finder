let translations = {};
let currentLang = 'ar';
const MAX_GROUPS = 50;
const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-\']+$/; // English + accented French letters only

/* ---------------- Loading screen ---------------- */
const MIN_LOADER_MS = 700;
const loaderStart = Date.now();

function hideLoader() {
    const overlay = document.getElementById('loaderOverlay');
    if (!overlay || overlay.classList.contains('hidden')) return;
    const elapsed = Date.now() - loaderStart;
    const wait = Math.max(0, MIN_LOADER_MS - elapsed);
    setTimeout(() => overlay.classList.add('hidden'), wait);
}

// filet de sécurité: يخبي الـ loader بعد 4s فكل الحالات، حتى لو fetch(lang.json) تعطل
setTimeout(hideLoader, 4000);

document.addEventListener('DOMContentLoaded', () => {
    fetch('lang.json')
        .then(response => response.json())
        .then(data => {
            translations = data;
            checkTheme();
            const savedLang = localStorage.getItem('lang') || 'ar';
            updateLanguage(savedLang);
            initOnboarding();
            hideLoader();
        })
        .catch(err => {
            console.error('Error loading translations:', err);
            hideLoader();
        });

    initStepper();
    initHamburger();
    initCountInput();
});

/* ---------------- Theme ---------------- */
function updateLogo(theme) {
    const logoImg = document.getElementById('main-logo');
    if (logoImg) {
        logoImg.src = theme === 'dark' ? '/assets/logo/logo.PNG' : '/assets/logo/logo.PNG';
    }
}

function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('theme-toggle');

    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        btn.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
        updateLogo('dark');
    } else {
        btn.textContent = '🌙';
        localStorage.setItem('theme', 'light');
        updateLogo('light');
    }
}

function checkTheme() {
    const savedTheme = localStorage.getItem('theme');
    const btn = document.getElementById('theme-toggle');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (btn) btn.textContent = '☀️';
        updateLogo('dark');
    } else {
        updateLogo('light');
    }
}

/* ---------------- Hamburger menu (single source of truth, no double-toggle) ---------------- */
function initHamburger() {
    const btn = document.getElementById('hamburgerBtn');
    const nav = document.getElementById('mobileNav');
    const backdrop = document.getElementById('mobileNavBackdrop');
    const closeBtn = document.getElementById('mobileNavClose');

    let open = false;

    function setOpen(next) {
        open = next;
        nav.classList.toggle('active', open);
        backdrop.classList.toggle('active', open);
        btn.setAttribute('aria-expanded', String(open));
    }

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        setOpen(!open);
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setOpen(false);
    });

    backdrop.addEventListener('click', () => setOpen(false));

    nav.addEventListener('click', (e) => e.stopPropagation());

    window.closeMobileMenu = () => setOpen(false);
}

/* ---------------- Language ---------------- */
function setLang(lang) {
    localStorage.setItem('lang', lang);
    updateLanguage(lang);
}

function updateLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];
    if (!t) return;

    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    document.querySelectorAll('.lang-btn, .mobile-lang-opts button').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) element.textContent = t[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (t[key]) element.placeholder = t[key];
    });

    updateDynamicPlaceholders();
}

/* ---------------- Group count input: instant stepper + typing + validation ---------------- */
function initStepper() {
    const input = document.getElementById('group-count');
    const minus = document.getElementById('countMinus');
    const plus = document.getElementById('countPlus');

    minus.addEventListener('click', () => {
        const current = parseInt(input.value, 10) || 0;
        setCountValue(Math.max(1, current - 1));
    });

    plus.addEventListener('click', () => {
        const current = parseInt(input.value, 10) || 0;
        setCountValue(Math.min(MAX_GROUPS, current + 1));
    });
}

function initCountInput() {
    const input = document.getElementById('group-count');
    input.addEventListener('input', () => {
        // Strip anything non-digit as the user types
        input.value = input.value.replace(/[^0-9]/g, '');
        validateCountInput(false);
    });
    input.addEventListener('blur', () => validateCountInput(true));
}

function setCountValue(value) {
    const input = document.getElementById('group-count');
    input.value = String(value);
    validateCountInput(true);
}

function validateCountInput(showClamp) {
    const input = document.getElementById('group-count');
    const errorEl = document.getElementById('count-error');
    const t = translations[currentLang] || {};
    const raw = input.value.trim();

    if (raw === '') {
        errorEl.textContent = '';
        return null;
    }

    let num = parseInt(raw, 10);

    if (isNaN(num) || num < 1) {
        errorEl.textContent = t.error_num || 'Please enter a valid number';
        if (showClamp) input.value = '1';
        return null;
    }

    if (num > MAX_GROUPS) {
        errorEl.textContent = (t.error_max || 'Maximum is') + ' ' + MAX_GROUPS;
        if (showClamp) input.value = String(MAX_GROUPS);
        return null;
    }

    errorEl.textContent = '';
    return num;
}

/* ---------------- Generate group range fields ---------------- */
function generateFields() {
    const t = translations[currentLang] || {};
    const count = validateCountInput(true);
    const container = document.getElementById('dynamic-groups-container');
    const step2 = document.getElementById('step-2');

    if (!count) {
        document.getElementById('group-count').focus();
        return;
    }

    container.innerHTML = '';

    for (let i = 1; i <= count; i++) {
        const div = document.createElement('div');
        div.className = 'group-block';
        div.innerHTML = `
            <span class="group-label">G${i}</span>
            <div class="group-inputs">
                <input type="text" placeholder="${t.placeholder_start || ''}" id="start-${i}" class="dyn-start" maxlength="30">
                <input type="text" placeholder="${t.placeholder_end || ''}" id="end-${i}" class="dyn-end" maxlength="30">
            </div>
            <p class="field-error" id="range-error-${i}"></p>
        `;
        container.appendChild(div);

        const startEl = div.querySelector(`#start-${i}`);
        const endEl = div.querySelector(`#end-${i}`);
        [startEl, endEl].forEach(el => {
            el.addEventListener('blur', () => validateRangeField(i));
        });
    }
    step2.style.display = 'block';
}

function validateRangeField(i) {
    const t = translations[currentLang] || {};
    const startEl = document.getElementById(`start-${i}`);
    const endEl = document.getElementById(`end-${i}`);
    const errorEl = document.getElementById(`range-error-${i}`);
    if (!startEl || !endEl || !errorEl) return true;

    const startVal = startEl.value.trim();
    const endVal = endEl.value.trim();

    if (startVal === '' && endVal === '') {
        errorEl.textContent = '';
        return true;
    }

    const invalidStart = startVal !== '' && !NAME_REGEX.test(startVal);
    const invalidEnd = endVal !== '' && !NAME_REGEX.test(endVal);

    if (invalidStart || invalidEnd) {
        errorEl.textContent = t.error_letters_only || 'Letters only (A-Z, French accents), no symbols or numbers';
        return false;
    }

    errorEl.textContent = '';
    return true;
}

function updateDynamicPlaceholders() {
    const t = translations[currentLang];
    if (t) {
        document.querySelectorAll('.dyn-start').forEach(el => el.placeholder = t.placeholder_start);
        document.querySelectorAll('.dyn-end').forEach(el => el.placeholder = t.placeholder_end);
    }
}

/* ---------------- Search ---------------- */
function findMyGroup() {
    const t = translations[currentLang] || {};
    const studentNameEl = document.getElementById('student-name');
    const studentName = studentNameEl.value.trim().toUpperCase();
    const count = parseInt(document.getElementById('group-count').value, 10) || 0;

    if (!studentName) {
        showResult(t.error_name, 'error');
        return;
    }

    let allRangesValid = true;
    for (let i = 1; i <= count; i++) {
        if (!validateRangeField(i)) allRangesValid = false;
    }
    if (!allRangesValid) {
        showResult(t.error_letters_only || 'Please fix the highlighted range fields', 'error');
        return;
    }

    let foundGroup = null;

    for (let i = 1; i <= count; i++) {
        const startEl = document.getElementById(`start-${i}`);
        const endEl = document.getElementById(`end-${i}`);
        if (!startEl || !endEl) continue;

        const startVal = startEl.value.trim().toUpperCase();
        const endVal = endEl.value.trim().toUpperCase();

        if (startVal === '' || endVal === '') continue;

        if (studentName.localeCompare(startVal) >= 0 &&
            studentName.localeCompare(endVal + 'ZZZZ') <= 0) {
            foundGroup = i;
            break;
        }
    }

    if (foundGroup) {
        showResult(`${t.success_msg} ${foundGroup}`, 'success');
    } else {
        showResult(t.fail_msg, 'error');
    }
}

function showResult(text, type) {
    const resultArea = document.getElementById('result-area');
    resultArea.style.display = 'block';
    resultArea.className = type;
    resultArea.textContent = text;
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ---------------- Onboarding modal ---------------- */
function initOnboarding() {
    const backdrop = document.getElementById('onboardingBackdrop');
    const startBtn = document.getElementById('onboardingStartBtn');
    const dontShow = document.getElementById('dontShowAgain');

    if (localStorage.getItem('onboardingDismissed') !== 'true') {
        backdrop.classList.add('active');
    }

    startBtn.addEventListener('click', () => {
        if (dontShow.checked) {
            localStorage.setItem('onboardingDismissed', 'true');
        }
        backdrop.classList.remove('active');
    });
}

