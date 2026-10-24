// ===== 1. TOAST ONLINE ORDERING LINK =====
// Paste the café's actual Toast public ordering link between these quotes.
// Example only: https://order.toasttab.com/online/YOUR-RESTAURANT
// Leaving it blank keeps Order Online buttons in preview mode.
const TOAST_ORDER_URL = '';
// Display-only menu samples. Live pricing and checkout are handled by Toast.

// ===== 2. SAMPLE COFFEE MENU =====
// These are example drinks for this preview. The live order menu comes from Toast.
const products = [
    { id: 'latte', name: 'Honey Oat Latte', tag: 'House favorite', category: 'espresso', description: 'Smooth espresso, velvety oat milk, and a touch of honey.', art: 'honey oat latte.jpg' },
    { id: 'espresso', name: 'Classic Espresso', tag: 'The essentials', category: 'espresso', description: 'Rich, balanced, and made for the coffee purist.', art: 'classic espresso.jpg' },
    { id: 'coldbrew', name: 'Slow Cold Brew', tag: 'Served chilled', category: 'cold', description: 'Steeped slowly for a soft, smooth finish.', art: 'slow cold brew.jpg' },
    { id: 'vanilla', name: 'Vanilla Iced Latte', tag: 'Ice-cold favorite', category: 'cold', description: 'Bold espresso, fresh milk, and mellow vanilla.', art: 'vanilla iced latte.jpg' },
    { id: 'cappuccino', name: 'Warm Cappuccino', tag: 'Cozy classic', category: 'espresso', description: 'Espresso under a cloud of softly textured milk.', art: 'warm capuccino.jpg' },
    { id: 'chai', name: 'Spiced Chai Latte', tag: 'No coffee needed', category: 'more', description: 'Fragrant chai spices blended with steamed milk.', art: 'spiced Chai latte.jpg' }
];

// ===== 3. SHORTCUT FOR FINDING HTML ELEMENTS =====
// $("#products") selects the element with id="products".
const $ = selector => document.querySelector(selector);

// ===== 4. CHECK WHETHER THE TOAST LINK IS VALID =====
// Only accepts a secure https website address; returns null if not configured.
function configuredToastUrl() {
    try {
        const url = new URL(TOAST_ORDER_URL.trim());
        if (url.protocol === 'https:' && url.hostname.includes('.'))
            return url.href;
    }
    catch (e) { }
    return null;
}

// ===== 5. CONNECT ORDER BUTTONS TO TOAST =====
// Sets every Order Online link and displays whether ordering is connected.
function configureToastLinks() {
    const url = configuredToastUrl();
    document.querySelectorAll('.toast-order-link').forEach(link => {
        link.href = url || '#coffee';
        link.setAttribute('aria-label', url ? 'Open the café online ordering page in a new tab' : 'Online ordering not yet connected');
    });
    const status = $('#toast-order-status');
    status.textContent = url ? 'Ordering opens on the café’s secure Toast page.' : 'Preview only — add the café’s Toast public ordering URL in index.html to activate the buttons.';
    status.classList.toggle('is-ready', Boolean(url));
}

// ===== 6. CREATE COFFEE MENU CARDS =====
// Filters sample drinks by category and generates their HTML cards.
function renderProducts(category = 'all') {
    const visible = products.filter(p => category === 'all' || p.category === category);
    $('#products').innerHTML = visible.map(p => `<article class="product"><div class="product-media"><img src="assets/${p.art}" alt="Illustration of ${p.name}"><span class="product-tag">${p.tag}</span></div><div class="product-content"><div class="product-row"><h3>${p.name}</h3></div><p class="product-desc">${p.description}</p><a class="add-button toast-order-link" href="#coffee" target="_blank" rel="noopener noreferrer" aria-label="Explore the online menu in Toast"><span>View menu & order</span><span aria-hidden="true">↗</span></a></div></article>`).join('');
    configureToastLinks();
}

// ===== 7. POPUP CONFIRMATION MESSAGES =====
// Shows a brief popup to inform the visitor about an action.
let toastTimeout;
function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => el.classList.remove('visible'), 3000);
}
// Prevent misleading checkout behavior until the genuine Toast ordering link is supplied.

// ===== 8. PREVENT FAKE CHECKOUT =====
// If there is no valid Toast URL, stop clicks and display a warning.
document.addEventListener('click', event => {
    const link = event.target.closest('.toast-order-link');
    if (link && !configuredToastUrl()) {
        event.preventDefault();
        toast('Online ordering is not connected yet — add the café’s Toast URL first.');
    }
});

// ===== 9. COFFEE MENU FILTER BUTTONS =====
// Highlights the selected category and reloads matching drink cards.
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(item => { item.classList.remove('active'); item.setAttribute('aria-pressed', 'false'); });
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    renderProducts(button.dataset.category);
}));

// ===== 10. OPEN AND CLOSE EVENT INQUIRY =====
// Shows or hides the event inquiry window.
function openModal() {
    $('#modal').classList.add('open');
    $('#modal').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('#close-modal').focus();
}
function closeModal() {
    $('#modal').classList.remove('open');
    $('#modal').setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// ===== 10B. OPEN & CLOSE WEDDING PACKAGES MODAL =====
const weddingModal = document.getElementById('wedding-modal');
const openWeddingBtn = document.getElementById('open-wedding-modal');
const closeWeddingBtn = document.getElementById('close-wedding-modal');
const weddingInquiryBtn = document.getElementById('wedding-inquiry-btn');

function openWeddingModal(e) {
    if (e) e.preventDefault();
    if (weddingModal) {
        weddingModal.classList.add('open');
        weddingModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

function closeWeddingModal() {
    if (weddingModal) {
        weddingModal.classList.remove('open');
        weddingModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

if (openWeddingBtn) openWeddingBtn.addEventListener('click', openWeddingModal);
if (closeWeddingBtn) closeWeddingBtn.addEventListener('click', closeWeddingModal);

if (weddingModal) {
    weddingModal.addEventListener('click', event => {
        if (event.target === weddingModal) closeWeddingModal();
    });
}

if (weddingInquiryBtn) {
    weddingInquiryBtn.addEventListener('click', () => {
        closeWeddingModal();
        openModal();
    });
}

// ===== 10C. OPEN & CLOSE COMMUNITY & SPECIAL MODALS =====
const communityModal = document.getElementById('community-modal');
const openCommunityBtn = document.getElementById('open-community-modal');
const closeCommunityBtn = document.getElementById('close-community-modal');
const communityInquiryBtn = document.getElementById('community-inquiry-btn');

const specialModal = document.getElementById('special-modal');
const openSpecialBtn = document.getElementById('open-special-modal');
const closeSpecialBtn = document.getElementById('close-special-modal');
const specialInquiryBtn = document.getElementById('special-inquiry-btn');

function openCommunityModal(e) {
    if (e) e.preventDefault();
    if (communityModal) {
        communityModal.classList.add('open');
        communityModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

function closeCommunityModal() {
    if (communityModal) {
        communityModal.classList.remove('open');
        communityModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

function openSpecialModal(e) {
    if (e) e.preventDefault();
    if (specialModal) {
        specialModal.classList.add('open');
        specialModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

function closeSpecialModal() {
    if (specialModal) {
        specialModal.classList.remove('open');
        specialModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

if (openCommunityBtn) openCommunityBtn.addEventListener('click', openCommunityModal);
if (closeCommunityBtn) closeCommunityBtn.addEventListener('click', closeCommunityModal);

if (openSpecialBtn) openSpecialBtn.addEventListener('click', openSpecialModal);
if (closeSpecialBtn) closeSpecialBtn.addEventListener('click', closeSpecialModal);

if (communityModal) {
    communityModal.addEventListener('click', event => {
        if (event.target === communityModal) closeCommunityModal();
    });
}

if (specialModal) {
    specialModal.addEventListener('click', event => {
        if (event.target === specialModal) closeSpecialModal();
    });
}

if (communityInquiryBtn) {
    communityInquiryBtn.addEventListener('click', () => {
        closeCommunityModal();
        openModal();
    });
}

if (specialInquiryBtn) {
    specialInquiryBtn.addEventListener('click', () => {
        closeSpecialModal();
        openModal();
    });
}

// ===== 11. COPY A DRAFT INTO THE CLIPBOARD =====
// Copies the event inquiry text so a visitor can paste it somewhere else.
function copyText(text) {
    if (navigator.clipboard && window.isSecureContext)
        return navigator.clipboard.writeText(text);
    const input = document.createElement('textarea');
    input.value = text;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    let copied = false;
    try {
        copied = document.execCommand('copy');
    }
    catch (e) { }
    input.remove();
    return copied ? Promise.resolve() : Promise.reject(new Error('Clipboard unavailable'));
}

// ===== 12. EVENT BUTTONS AND FORM =====
// Handles opening, closing, and copying the event inquiry.
$('#event-inquiry').addEventListener('click', openModal);
$('#close-modal').addEventListener('click', closeModal);
$('#modal').addEventListener('click', event => { if (event.target === $('#modal'))
    closeModal(); });
$('#copy-summary').addEventListener('click', () => {
    const name = $('#order-name').value.trim();
    const notes = $('#order-notes').value.trim();
    const lines = ['THE HOUSE — DRAFT EVENT INQUIRY', name ? 'Name: ' + name : '', notes ? 'Event details: ' + notes : '', 'Draft only — not sent.'].filter(Boolean);
    copyText(lines.join('\n')).then(() => toast('Event inquiry copied')).catch(() => toast('Unable to copy automatically in this browser'));
});

// ===== 13. ESCAPE KEY =====
// Closes the event popup or mobile menu when Escape is pressed.
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        closeModal();
        closeWeddingModal();
        closeCommunityModal();
        closeSpecialModal();
        $('#site-nav').classList.remove('open');
        $('#mobile-toggle').setAttribute('aria-expanded', 'false');
        $('#mobile-toggle').textContent = '☰';
    }
});

// ===== 14. MOBILE HAMBURGER MENU =====
// Opens and closes navigation links on small screens.
$('#mobile-toggle').addEventListener('click', () => {
    const open = $('#site-nav').classList.toggle('open');
    $('#mobile-toggle').setAttribute('aria-expanded', String(open));
    $('#mobile-toggle').textContent = open ? '×' : '☰';
});

// ===== 15. CLOSE MOBILE MENU AFTER SELECTING A LINK =====
// Hides the mobile menu after a visitor chooses a section.
document.querySelectorAll('.site-nav a').forEach(link => link.addEventListener('click', () => {
    $('#site-nav').classList.remove('open');
    $('#mobile-toggle').setAttribute('aria-expanded', 'false');
    $('#mobile-toggle').textContent = '☰';
}));

// ===== 16. START THE WEBSITE =====
// Updates copyright year and loads the first set of coffee cards.
$('#year').textContent = new Date().getFullYear();
renderProducts();