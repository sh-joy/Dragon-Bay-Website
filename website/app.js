'use strict';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
let toastTimer;
function notify(message) {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('visible'), 2600);
}

// Logo controls always point to prepared files; preview backgrounds stay separate.
const logoState = { layout: 'horizontal', version: 'primary', background: 'light', monochrome: false };
function resolveLogo(state) {
  const secondaryAvailable = ['horizontal', 'stacked', 'wordmark'].includes(state.layout);
  const version = secondaryAvailable ? state.version : 'primary';
  const base = state.layout === 'symbol' ? 'symbol' : `${state.layout}-${version}`;
  const darkField = ['dark', 'red', 'blue'].includes(state.background);
  let treatment = darkField ? 'white' : 'original';
  if (state.monochrome && !darkField) treatment = 'black';
  return { id: `${base}-${treatment}`, treatment, version, secondaryAvailable };
}
const logoFileMap = {
  'horizontal-primary-original': 'Dragon Bay-Horizontal-Logo-Primary',
  'horizontal-primary-white': 'Dragon Bay-Horizontal-Logo-Primary-White',
  'horizontal-primary-black': 'Dragon Bay-Horizontal-Logo-Primary-Black',
  'horizontal-secondary-original': 'Dragon Bay-Horizontal-Logo-Secondary',
  'horizontal-secondary-white': 'Dragon Bay-Horizontal-Logo-Secondary-White',
  'horizontal-secondary-black': 'Dragon Bay-Horizontal-Logo-Secondar-Black',
  'stacked-primary-original': 'Dragon Bay-Vertical-Logo-Primary',
  'stacked-primary-white': 'Dragon Bay-Vertical-Logo-Primary-White',
  'stacked-primary-black': 'Dragon Bay-Vertical-Logo-Primary-Black',
  'stacked-secondary-original': 'Dragon Bay-Verical-Logo-Secondary',
  'stacked-secondary-white': 'Dragon Bay-Verical-Logo-Secondary-White',
  'stacked-secondary-black': 'Dragon Bay-Verical-Logo-Secondary-Black',
  'wordmark-primary-original': 'Dragon Bay-Wordmark-Primary',
  'wordmark-primary-white': 'Dragon Bay-Wordmark-Primary-White',
  'wordmark-primary-black': 'Dragon Bay-Wordmark-Primary-Black',
  'wordmark-secondary-original': 'Dragon Bay-Wordmark-Secondary',
  'wordmark-secondary-white': 'Dragon Bay-Wordmark-Secondary-White',
  'wordmark-secondary-black': 'Dragon Bay-Wordmark-Secondary-Black',
  'symbol-original': 'Dragon Bay-Logomark-Primary',
  'symbol-white': 'Dragon Bay-Logomark-White',
  'symbol-black': 'Dragon Bay-Logomark-Black'
};

function renderLogo() {
  const { id, treatment, version, secondaryAvailable } = resolveLogo(logoState);
  const filename = logoFileMap[id] || id;
  const preview = $('#logo-preview');
  preview.dataset.background = logoState.background;
  preview.classList.toggle('is-stacked', logoState.layout === 'stacked');
  preview.classList.toggle('is-symbol', logoState.layout === 'symbol');
  $('#preview-logo').src = `assets/logos/SVG/${filename}.svg`;
  $('#preview-logo').alt = `Dragon Bay ${logoState.layout} ${logoState.layout === 'symbol' ? '' : version + ' '}${treatment} logo`;
  $('#preview-label').textContent = `${logoState.layout} ${logoState.layout === 'symbol' ? '' : version}`.trim().toUpperCase();
  $('#preview-file-label').textContent = `${treatment === 'original' ? 'ORIGINAL COLOR' : treatment.toUpperCase()} · VECTOR ARTWORK`;
  $('#logo-version').disabled = !secondaryAvailable;
  $('#logo-version').value = version;
  const forcedWhite = ['dark', 'red', 'blue'].includes(logoState.background);
  $('#monochrome').disabled = forcedWhite;
  $('#monochrome').checked = forcedWhite || logoState.monochrome;
  for (const format of ['svg', 'png']) {
    const link = $(`#preview-${format}`);
    const folder = format.toUpperCase();
    link.href = `assets/logos/${folder}/${filename}.${format}`;
    link.download = `${filename}.${format}`;
  }
}
$$('[data-layout]').forEach(button => button.addEventListener('click', () => {
  logoState.layout = button.dataset.layout;
  $$('[data-layout]').forEach(item => {
    const selected = item === button;
    item.classList.toggle('selected', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  renderLogo();
}));
$('#logo-version').addEventListener('change', event => { logoState.version = event.target.value; renderLogo(); });
$$('button[data-background]').forEach(button => button.addEventListener('click', () => {
  logoState.background = button.dataset.background;
  $$('button[data-background]').forEach(item => {
    const selected = item === button;
    item.classList.toggle('selected', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  renderLogo();
}));
$('#monochrome').addEventListener('change', event => { logoState.monochrome = event.target.checked; renderLogo(); });

const colors = {
  red: { name: 'Vivid Red', hex: '#E01E25', rgb: '224, 30, 37', cmyk: '0, 87, 83, 12' },
  blue: { name: 'Strong Blue', hex: '#1163BD', rgb: '17, 99, 189', cmyk: '91, 48, 0, 26' },
  light: { name: 'Light Grayish Blue', hex: '#F5F7FA', rgb: '245, 247, 250', cmyk: '2, 1, 0, 2' },
  dark: { name: 'Darker Gray', hex: '#0D0D0D', rgb: '13, 13, 13', cmyk: '0, 0, 0, 95' }
};
let colorFormat = 'hex';
function formatColor(color, format) {
  if (format === 'hex') return color.hex;
  if (format === 'rgb') return `rgb(${color.rgb})`;
  return color.cmyk.split(', ').map(value => `${value}%`).join(' / ');
}
function renderColors() {
  $$('[data-color]').forEach(card => {
    const color = colors[card.dataset.color];
    const value = formatColor(color, colorFormat);
    $('.color-value', card).textContent = value;
    card.setAttribute('aria-label', `Copy ${color.name} ${colorFormat.toUpperCase()} ${value}`);
  });
}
$$('[data-format]').forEach(button => button.addEventListener('click', () => {
  colorFormat = button.dataset.format;
  $$('[data-format]').forEach(item => {
    const selected = item === button;
    item.classList.toggle('selected', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  renderColors();
}));
async function copyText(text) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const field = document.createElement('textarea');
    field.value = text;
    field.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.append(field);
    field.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* A manual copy remains possible. */ }
    field.remove();
    return copied;
  }
}
$$('[data-color]').forEach(card => card.addEventListener('click', async () => {
  const value = formatColor(colors[card.dataset.color], colorFormat);
  const copied = await copyText(value);
  notify(copied ? `${value} copied` : `Copy this value: ${value}`);
  card.focus({ preventScroll: true });
}));
function luminance(hex) {
  const channels = hex.replace('#', '').match(/.{2}/g).map(value => parseInt(value, 16) / 255)
    .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrastRatio(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
const pairings = [
  { foreground: '#FFFFFF', background: colors.red.hex, label: 'White on red' },
  { foreground: '#FFFFFF', background: colors.blue.hex, label: 'White on blue' },
  { foreground: colors.dark.hex, background: colors.light.hex, label: 'Dark on light' },
  { foreground: colors.light.hex, background: colors.dark.hex, label: 'Light on dark' }
];
for (const pairing of pairings) {
  const sample = document.createElement('div');
  sample.className = 'contrast-sample';
  sample.style.color = pairing.foreground;
  sample.style.background = pairing.background;
  const letters = document.createElement('b'); letters.textContent = 'Aa';
  const label = document.createElement('span'); label.textContent = pairing.label;
  const ratio = document.createElement('span');
  const score = contrastRatio(pairing.foreground, pairing.background);
  ratio.textContent = `${score.toFixed(2)}:1 · ${score >= 4.5 ? 'Regular text' : 'Large text only'}`;
  sample.append(letters, label, ratio);
  $('#contrast-grid').append(sample);
}

function resizeTypePreview() {
  const field = $('#type-preview');
  field.style.height = 'auto';
  field.style.height = `${Math.min(520, Math.max(160, field.scrollHeight + 3))}px`;
}
function updateType() {
  const size = $('#type-size').value;
  const weight = $('#type-weight').value;
  $('#type-preview').style.fontSize = `${size}px`;
  $('#type-preview').style.fontWeight = weight;
  $('#size-output').textContent = `${size}px`;
  $('.type-hint span:last-child').textContent = `HELVETICA NEUE / ${{400:'REGULAR',500:'MEDIUM',700:'BOLD'}[weight]}`;
  resizeTypePreview();
}
$('#type-size').addEventListener('input', updateType);
$('#type-weight').addEventListener('change', updateType);
$('#type-preview').addEventListener('input', resizeTypePreview);
$('#type-reset').addEventListener('click', () => {
  $('#type-size').value = window.innerWidth < 641 ? '48' : '64';
  $('#type-weight').value = '500';
  $('#type-preview').value = 'The leader of global logistics.';
  updateType();
  notify('Type preview reset');
});
if (window.innerWidth < 641) $('#type-size').value = '48';
updateType();

const menu = $('.menu-toggle');
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  $('#navigation').classList.toggle('open', expanded);
});
$$('#navigation a').forEach(link => link.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', 'false');
  $('#navigation').classList.remove('open');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    menu.setAttribute('aria-expanded', 'false');
    $('#navigation').classList.remove('open');
    menu.focus();
  }
});
const sections = $$('main > section[id]');
let scrollQueued = false;
function updateReadingPosition() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  $('#reading-progress').style.width = `${total > 0 ? Math.min(100, window.scrollY / total * 100) : 0}%`;
  const marker = window.innerWidth < 981 ? 140 : 180;
  let current = sections[0].id;
  for (const section of sections) if (section.getBoundingClientRect().top <= marker) current = section.id;
  $$('nav a').forEach(link => {
    const active = link.getAttribute('href') === `#${current}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scrollQueued = false;
}
window.addEventListener('scroll', () => {
  if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateReadingPosition); }
}, { passive: true });
window.addEventListener('resize', () => { updateReadingPosition(); resizeTypePreview(); });

let applications = [];
let galleryExpanded = false;
let applicationIndex = 0;
const dialog = $('#application-dialog');
function renderDialog() {
  const item = applications[applicationIndex];
  if (!item) return;
  $('#dialog-title').textContent = item.title;
  $('#dialog-image').src = item.image || `assets/applications/${item.id}.webp`;
  $('#dialog-image').alt = item.alt || `Dragon Bay ${item.title.toLowerCase()}`;
  $('#dialog-caption').textContent = item.caption || (item.page ? `Original brand guide / Page ${item.page}` : 'Dragon Bay brand application');
  $('#dialog-count').textContent = `${String(applicationIndex + 1).padStart(2, '0')} / ${applications.length}`;
}
function openApplication(index) {
  applicationIndex = index;
  renderDialog();
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}
function renderApplications() {
  $('#application-grid').replaceChildren();
  applications.slice(0, galleryExpanded ? applications.length : 6).forEach((item, index) => {
    const figure = document.createElement('figure'); figure.className = 'application-card';
    const button = document.createElement('button');
    button.setAttribute('aria-label', `Enlarge ${item.title.toLowerCase()}`);
    const image = document.createElement('img');
    image.src = item.thumbnail || item.image || `assets/applications/${item.id}.webp`;
    image.alt = item.alt || `Dragon Bay ${item.title.toLowerCase()}`;
    image.width = 760; image.height = 570; image.loading = 'lazy'; image.decoding = 'async';
    button.append(image);
    button.addEventListener('click', () => openApplication(index));
    const caption = document.createElement('figcaption');
    caption.append(document.createTextNode(item.title));
    const number = document.createElement('span'); number.textContent = String(index + 1).padStart(2, '0');
    caption.append(number);
    figure.append(button, caption); $('#application-grid').append(figure);
  });
  $('#gallery-more').textContent = galleryExpanded ? 'Show fewer applications −' : `View all ${applications.length} applications +`;
  $('#gallery-more').setAttribute('aria-expanded', String(galleryExpanded));
}
$('#gallery-more').addEventListener('click', () => {
  galleryExpanded = !galleryExpanded;
  renderApplications();
  if (!galleryExpanded) $('#applications').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
});
$('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
function stepApplication(delta) {
  if (!applications.length) return;
  applicationIndex = (applicationIndex + delta + applications.length) % applications.length;
  renderDialog();
}
$('#dialog-prev').addEventListener('click', () => stepApplication(-1));
$('#dialog-next').addEventListener('click', () => stepApplication(1));
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); stepApplication(1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); stepApplication(-1); }
});
function updateDownload() {
  const id = $('#download-asset').value;
  const format = $('#download-format').value;
  if (!id) return;
  const folder = format.toUpperCase();
  $('#single-download').href = `assets/logos/${folder}/${id}.${format}`;
  $('#single-download').download = `${id}.${format}`;
}
$('#download-asset').addEventListener('change', updateDownload);
$('#download-format').addEventListener('change', updateDownload);

async function loadResources() {
  const results = await Promise.allSettled([
    fetch('assets/catalog.json').then(response => { if (!response.ok) throw new Error('Asset list unavailable'); return response.json(); }),
    fetch('assets/applications.json').then(response => { if (!response.ok) throw new Error('Gallery unavailable'); return response.json(); })
  ]);
  if (results[0].status === 'fulfilled') {
    const catalog = results[0].value;
    const groupLabels = { Logo: 'Logo exports', Profile: 'Profile images', Pattern: 'Pattern graphics' };
    for (const group of ['Logo', 'Profile', 'Pattern']) {
      const options = document.createElement('optgroup'); options.label = groupLabels[group] || group;
      catalog.filter(item => item.group === group).forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.title}${item.treatment ? ` / ${item.treatment}` : ''}`;
        options.append(option);
      });
      $('#download-asset').append(options);
    }
    $('#download-asset').value = 'Dragon Bay-Horizontal-Logo-Primary';
    updateDownload();
  } else {
    const option = document.createElement('option'); option.value = 'Dragon Bay-Horizontal-Logo-Primary'; option.textContent = 'Horizontal / Primary / Original';
    $('#download-asset').append(option);
    notify('The asset list could not load. The complete brand kit is still available.');
  }
  if (results[1].status === 'fulfilled') {
    applications = results[1].value;
    renderApplications();
  } else {
    const message = document.createElement('p');
    message.textContent = 'The gallery could not load. View all applications in the brand PDF.';
    $('#application-grid').append(message);
    $('#gallery-more').hidden = true;
  }
  updateReadingPosition();
}
renderLogo();
renderColors();
updateReadingPosition();
loadResources();
