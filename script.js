let translations = {};
let currentLang = 'ar';

document.addEventListener('DOMContentLoaded', () => {

    fetch('lang.json')
        .then(response => response.json())
        .then(data => {
            translations = data;
            updateLanguage('ar');
        })
        .catch(err => console.error('Error loading translations:', err));


    checkTheme();
});

// dark-mode
function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('theme-toggle');
}

function updateLogo(theme) {
    const logoImg = document.getElementById('main-logo');
    if (logoImg) {
        if (theme === 'dark') {
            logoImg.src = 'icon-dark-mood.png'; // صورة الوضع الليلي
        } else {
            logoImg.src = 'icon-light-mood.png';   // صورة الوضع النهاري
        }
    }
}


    body.classList.toggle('dark-mode');


function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('theme-toggle');

    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        btn.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
        updateLogo('dark'); // <-- تحديث الشعار للداكن
    } else {
        btn.textContent = '🌙';
        localStorage.setItem('theme', 'light');
        updateLogo('light'); // <-- تحديث الشعار للفاتح
    }
}

// تعديل دالة فحص الثيم عند فتح الموقع
function checkTheme() {
    const savedTheme = localStorage.getItem('theme');
    const btn = document.getElementById('theme-toggle');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if(btn) btn.textContent = '☀️';
        updateLogo('dark'); // <-- استرجاع شعار الوضع الداكن
    } else {
        updateLogo('light'); // <-- الوضع الافتراضي
    }
}


function toggleMobileMenu() {
    const nav = document.getElementById('mobileNav');
    nav.classList.toggle('active');
}

function setLang(lang) {
    updateLanguage(lang);
}

function updateLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];

    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

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

function generateFields() {
    const count = document.getElementById('group-count').value;
    const container = document.getElementById('dynamic-groups-container');
    const step2 = document.getElementById('step-2');
    const t = translations[currentLang];

    if (count < 1) {
        alert(t.error_num);
        return;
    }

    container.innerHTML = '';

    for (let i = 1; i <= count; i++) {
        const div = document.createElement('div');
        div.className = 'group-inputs';
        div.innerHTML = `
            <span>G${i}</span>
            <input type="text" placeholder="${t.placeholder_start}" id="start-${i}" class="dyn-start">
            <input type="text" placeholder="${t.placeholder_end}" id="end-${i}" class="dyn-end">
        `;
        container.appendChild(div);
    }
    step2.style.display = 'block';
}

function updateDynamicPlaceholders() {
    const t = translations[currentLang];
    if(t) {
        document.querySelectorAll('.dyn-start').forEach(el => el.placeholder = t.placeholder_start);
        document.querySelectorAll('.dyn-end').forEach(el => el.placeholder = t.placeholder_end);
    }
}

function findMyGroup() {
    const studentName = document.getElementById('student-name').value.trim().toUpperCase();
    const count = document.getElementById('group-count').value;
    const t = translations[currentLang];

    if (!studentName) {
        showResult(t.error_name, "error");
        return;
    }

    let foundGroup = null;

    for (let i = 1; i <= count; i++) {
        const startVal = document.getElementById(`start-${i}`).value.trim().toUpperCase();
        const endVal = document.getElementById(`end-${i}`).value.trim().toUpperCase();

        if(startVal === "" || endVal === "") continue;

        if (studentName.localeCompare(startVal) >= 0 &&
            studentName.localeCompare(endVal + "ZZZZ") <= 0) {
            foundGroup = i;
            break;
        }
    }

    if (foundGroup) {
        showResult(`${t.success_msg} ${foundGroup}`, "success");
    } else {
        showResult(t.fail_msg, "error");
    }
}

function showResult(text, type) {
    const resultArea = document.getElementById('result-area');
    resultArea.style.display = 'block';
    resultArea.className = type;
    resultArea.textContent = text;
}