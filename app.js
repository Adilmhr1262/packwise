/* PackWise — Personal Packing List Manager.
   Static, offline-first. IndexedDB for lists, items and settings. No backend, no network calls. */
'use strict';

var DB_NAME = 'packwise';
var DB_VERSION = 1;
var LIST_CATEGORIES = ['Trip', 'University', 'Gym', 'Work', 'Everyday', 'Other'];
var ITEM_CATEGORIES = ['Clothing', 'Electronics', 'Toiletries', 'Documents', 'Essentials', 'Food', 'Other'];

/* Five built-in templates. They are constants: a list made from one is a copy,
   so editing the list never changes the template. */
var TEMPLATES = [
  {
    id: 'weekend-trip', name: 'Weekend Trip', category: 'Trip',
    desc: 'Two nights away: the basics, nothing extra.',
    items: [
      { name: 'T-shirts', qty: 2, category: 'Clothing' },
      { name: 'Jeans', qty: 1, category: 'Clothing' },
      { name: 'Underwear', qty: 3, category: 'Clothing' },
      { name: 'Socks', qty: 3, category: 'Clothing' },
      { name: 'Sleepwear', qty: 1, category: 'Clothing' },
      { name: 'Toothbrush', qty: 1, category: 'Toiletries' },
      { name: 'Toothpaste', qty: 1, category: 'Toiletries' },
      { name: 'Deodorant', qty: 1, category: 'Toiletries' },
      { name: 'Shampoo', qty: 1, category: 'Toiletries' },
      { name: 'Phone charger', qty: 1, category: 'Electronics' },
      { name: 'Power bank', qty: 1, category: 'Electronics' },
      { name: 'ID card', qty: 1, category: 'Documents' },
      { name: 'Cash and cards', qty: 1, category: 'Documents' }
    ]
  },
  {
    id: 'international-travel', name: 'International Travel', category: 'Trip',
    desc: 'Flying abroad: documents first, then everything else.',
    items: [
      { name: 'Passport', qty: 1, category: 'Documents' },
      { name: 'Visa / entry documents', qty: 1, category: 'Documents' },
      { name: 'Boarding pass', qty: 1, category: 'Documents' },
      { name: 'Travel insurance papers', qty: 1, category: 'Documents' },
      { name: 'Local currency', qty: 1, category: 'Documents' },
      { name: 'T-shirts', qty: 4, category: 'Clothing' },
      { name: 'Trousers', qty: 2, category: 'Clothing' },
      { name: 'Underwear', qty: 5, category: 'Clothing' },
      { name: 'Socks', qty: 5, category: 'Clothing' },
      { name: 'Jacket', qty: 1, category: 'Clothing' },
      { name: 'Sleepwear', qty: 1, category: 'Clothing' },
      { name: 'Universal travel adapter', qty: 1, category: 'Electronics' },
      { name: 'Phone charger', qty: 1, category: 'Electronics' },
      { name: 'Headphones', qty: 1, category: 'Electronics' },
      { name: 'Laptop charger', qty: 1, category: 'Electronics' },
      { name: 'Toothbrush', qty: 1, category: 'Toiletries' },
      { name: 'Toothpaste', qty: 1, category: 'Toiletries' },
      { name: 'Deodorant', qty: 1, category: 'Toiletries' },
      { name: 'Medications', qty: 1, category: 'Essentials' },
      { name: 'Water bottle', qty: 1, category: 'Essentials' },
      { name: 'Snacks', qty: 2, category: 'Food' }
    ]
  },
  {
    id: 'gym-bag', name: 'Gym Bag', category: 'Gym',
    desc: 'Everything for a workout session, packed the night before.',
    items: [
      { name: 'Gym shirt', qty: 1, category: 'Clothing' },
      { name: 'Shorts', qty: 1, category: 'Clothing' },
      { name: 'Socks', qty: 1, category: 'Clothing' },
      { name: 'Training shoes', qty: 1, category: 'Clothing' },
      { name: 'Towel', qty: 1, category: 'Toiletries' },
      { name: 'Deodorant', qty: 1, category: 'Toiletries' },
      { name: 'Shower gel', qty: 1, category: 'Toiletries' },
      { name: 'Shampoo', qty: 1, category: 'Toiletries' },
      { name: 'Earbuds', qty: 1, category: 'Electronics' },
      { name: 'Phone charger', qty: 1, category: 'Electronics' },
      { name: 'Water bottle', qty: 1, category: 'Essentials' },
      { name: 'Padlock', qty: 1, category: 'Essentials' },
      { name: 'Snack bar', qty: 1, category: 'Food' }
    ]
  },
  {
    id: 'university-day', name: 'University Day', category: 'University',
    desc: 'A full day of classes: study gear and the daily essentials.',
    items: [
      { name: 'Student ID', qty: 1, category: 'Documents' },
      { name: 'Notebook', qty: 1, category: 'Documents' },
      { name: 'Pens', qty: 2, category: 'Documents' },
      { name: 'Textbooks', qty: 1, category: 'Documents' },
      { name: 'Laptop', qty: 1, category: 'Electronics' },
      { name: 'Laptop charger', qty: 1, category: 'Electronics' },
      { name: 'Phone charger', qty: 1, category: 'Electronics' },
      { name: 'Water bottle', qty: 1, category: 'Essentials' },
      { name: 'Lunch or snack', qty: 1, category: 'Food' },
      { name: 'Umbrella', qty: 1, category: 'Essentials' },
      { name: 'Keys', qty: 1, category: 'Essentials' }
    ]
  },
  {
    id: 'business-trip', name: 'Business Trip', category: 'Work',
    desc: 'Two days of meetings: sharp clothes, charged devices, papers ready.',
    items: [
      { name: 'Formal shirt', qty: 2, category: 'Clothing' },
      { name: 'Trousers', qty: 1, category: 'Clothing' },
      { name: 'Blazer', qty: 1, category: 'Clothing' },
      { name: 'Tie', qty: 1, category: 'Clothing' },
      { name: 'Dress shoes', qty: 1, category: 'Clothing' },
      { name: 'Sleepwear', qty: 1, category: 'Clothing' },
      { name: 'ID card', qty: 1, category: 'Documents' },
      { name: 'Business cards', qty: 1, category: 'Documents' },
      { name: 'Meeting notes', qty: 1, category: 'Documents' },
      { name: 'Laptop', qty: 1, category: 'Electronics' },
      { name: 'Laptop charger', qty: 1, category: 'Electronics' },
      { name: 'Phone charger', qty: 1, category: 'Electronics' },
      { name: 'Travel adapter', qty: 1, category: 'Electronics' },
      { name: 'Toothbrush', qty: 1, category: 'Toiletries' },
      { name: 'Toothpaste', qty: 1, category: 'Toiletries' },
      { name: 'Deodorant', qty: 1, category: 'Toiletries' },
      { name: 'Shaving kit', qty: 1, category: 'Toiletries' }
    ]
  }
];

var db = null;
var currentView = 'dashboard';
var currentListId = null;
var itemFilter = 'all';
var editingItemId = null;
var editingListId = null;
var confirmResolve = null;

/* ---------- helpers ---------- */
function $(id) { return document.getElementById(id); }
function uid() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function todayLocal() {
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function parseLocalDate(iso) {
  if (!iso) return null;
  var p = iso.split('-');
  if (p.length !== 3) return null;
  var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  if (isNaN(d.getTime())) return null;
  if (d.getFullYear() !== Number(p[0]) || d.getMonth() !== Number(p[1]) - 1 || d.getDate() !== Number(p[2])) return null;
  return d;
}
function fmtDate(iso) {
  var d = parseLocalDate(iso);
  if (!d) return '';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
function daysUntil(iso) {
  var d = parseLocalDate(iso);
  if (!d) return null;
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((d - today) / 86400000);
}
function toast(msg) {
  var t = $('toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(function () { t.hidden = true; }, 3200);
}
function askConfirm(title, text, okLabel) {
  $('confirmTitle').textContent = title;
  $('confirmText').textContent = text;
  $('confirmOkBtn').textContent = okLabel || 'Delete';
  var dlg = $('confirmDialog');
  dlg.showModal();
  return new Promise(function (resolve) { confirmResolve = resolve; });
}
function store(name, mode) { return db.transaction(name, mode).objectStore(name); }
function reqToPromise(req) {
  return new Promise(function (resolve, reject) {
    req.onsuccess = function () { resolve(req.result); };
    req.onerror = function () { reject(req.error); };
  });
}
function txComplete(tx) {
  return new Promise(function (resolve, reject) {
    tx.oncomplete = function () { resolve(); };
    tx.onerror = function () { reject(tx.error); };
    tx.onabort = function () { reject(tx.error || new Error('Transaction aborted')); };
  });
}

/* ---------- database ---------- */
function openDB() {
  return new Promise(function (resolve, reject) {
    var req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = function () {
      var d = req.result;
      if (!d.objectStoreNames.contains('lists')) d.createObjectStore('lists', { keyPath: 'id' });
      if (!d.objectStoreNames.contains('items')) {
        var items = d.createObjectStore('items', { keyPath: 'id' });
        items.createIndex('listId', 'listId', { unique: false });
      }
      if (!d.objectStoreNames.contains('settings')) d.createObjectStore('settings', { keyPath: 'key' });
    };
    req.onsuccess = function () { resolve(req.result); };
    req.onerror = function () { reject(req.error); };
  });
}
function getAllLists() { return reqToPromise(store('lists', 'readonly').getAll()); }
function getAllItems() { return reqToPromise(store('items', 'readonly').getAll()); }
function getList(id) { return reqToPromise(store('lists', 'readonly').get(id)); }
function getItemsOfList(listId) {
  return reqToPromise(store('items', 'readonly').index('listId').getAll(listId));
}
function getSetting(key) {
  return reqToPromise(store('settings', 'readonly').get(key)).then(function (row) {
    return row ? row.value : null;
  });
}
function setSetting(key, value) {
  var tx = db.transaction('settings', 'readwrite');
  tx.objectStore('settings').put({ key: key, value: value });
  return txComplete(tx);
}

/* ---------- validation ---------- */
function isNonEmptyStr(v, max) {
  return typeof v === 'string' && v.trim().length > 0 && v.trim().length <= (max || 120);
}
function isValidList(l) {
  return l && typeof l === 'object' && typeof l.id === 'string' && l.id.length > 0 &&
    isNonEmptyStr(l.name, 120) &&
    (!l.category || LIST_CATEGORIES.indexOf(l.category) !== -1) &&
    (l.departureDate === '' || l.departureDate === null || l.departureDate === undefined || parseLocalDate(l.departureDate) !== null) &&
    (l.notes === undefined || typeof l.notes === 'string');
}
function isValidItem(it) {
  return it && typeof it === 'object' && typeof it.id === 'string' && it.id.length > 0 &&
    typeof it.listId === 'string' && it.listId.length > 0 &&
    isNonEmptyStr(it.name, 120) &&
    Number.isInteger(it.quantity) && it.quantity >= 1 && it.quantity <= 999 &&
    ITEM_CATEGORIES.indexOf(it.category) !== -1 &&
    typeof it.packed === 'boolean' &&
    Number.isFinite(it.ord) &&
    (it.notes === undefined || typeof it.notes === 'string');
}
function validateBackup(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return 'Backup must be a JSON object.';
  if (data.app !== undefined && data.app !== 'packwise') return 'This file is not a PackWise backup.';
  if (!Array.isArray(data.lists) || !Array.isArray(data.items)) return 'Backup must contain "lists" and "items" arrays.';
  var listIds = {};
  for (var i = 0; i < data.lists.length; i++) {
    var l = data.lists[i];
    if (!isValidList(l)) return 'Invalid list at position ' + (i + 1) + '.';
    if (listIds[l.id]) return 'Duplicate list id in backup.';
    listIds[l.id] = true;
  }
  var itemIds = {};
  for (var j = 0; j < data.items.length; j++) {
    var it = data.items[j];
    if (!isValidItem(it)) return 'Invalid item at position ' + (j + 1) + '.';
    if (itemIds[it.id]) return 'Duplicate item id in backup.';
    if (!listIds[it.listId]) return 'Item "' + it.name + '" refers to a list that is not in the backup.';
    itemIds[it.id] = true;
  }
  if (data.settings !== undefined && data.settings !== null) {
    if (typeof data.settings !== 'object' || Array.isArray(data.settings)) return 'Invalid settings in backup.';
    if (data.settings.theme !== undefined && data.settings.theme !== 'light' && data.settings.theme !== 'dark') return 'Invalid theme in backup settings.';
  }
  return null;
}

/* ---------- navigation ---------- */
function showView(name) {
  currentView = name;
  ['dashboard', 'lists', 'checklist', 'templates', 'settings'].forEach(function (v) {
    $('view-' + v).hidden = v !== name;
  });
  document.querySelectorAll('.nav-btn[data-view]').forEach(function (b) {
    if (b.dataset.view === name) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
  if (name === 'dashboard') renderDashboard();
  if (name === 'lists') renderLists();
  if (name === 'templates') renderTemplates();
  if (name === 'settings') renderSettings();
  if (name === 'checklist' && currentListId) renderChecklist();
  $('main').scrollTop = 0;
  window.scrollTo(0, 0);
}
function listProgress(listId, items) {
  var mine = items.filter(function (it) { return it.listId === listId; });
  var packed = mine.filter(function (it) { return it.packed; }).length;
  return { total: mine.length, packed: packed, pct: mine.length ? Math.round(packed / mine.length * 100) : 0 };
}
function listCardHTML(list, prog) {
  var dep = '';
  if (list.departureDate) {
    var du = daysUntil(list.departureDate);
    var label = du === 0 ? 'Departs today' : du === 1 ? 'Departs tomorrow' : du > 1 ? 'Departs in ' + du + ' days' : 'Departed ' + Math.abs(du) + ' day' + (Math.abs(du) === 1 ? '' : 's') + ' ago';
    dep = '<span>' + escapeHtml(label) + ' · ' + escapeHtml(fmtDate(list.departureDate)) + '</span>';
  }
  return '<article class="list-card">' +
    '<div><h3>' + escapeHtml(list.name) + '</h3></div>' +
    '<div class="meta"><span class="tag">' + escapeHtml(list.category || 'Other') + '</span>' + dep + '</div>' +
    (list.notes ? '<p class="meta">' + escapeHtml(list.notes) + '</p>' : '') +
    '<div><div class="progress-line"><span>' + prog.packed + ' of ' + prog.total + ' packed</span><span>' + prog.pct + '%</span></div>' +
    '<div class="progress-track"><div class="progress-fill" style="width:' + prog.pct + '%"></div></div></div>' +
    '<div class="card-actions">' +
      '<button type="button" class="btn btn-primary btn-small" data-act="open" data-id="' + escapeHtml(list.id) + '">Open checklist</button>' +
      '<button type="button" class="btn btn-small" data-act="edit" data-id="' + escapeHtml(list.id) + '">Edit</button>' +
      '<button type="button" class="btn btn-small" data-act="duplicate" data-id="' + escapeHtml(list.id) + '">Duplicate</button>' +
      '<button type="button" class="btn btn-small" data-act="delete" data-id="' + escapeHtml(list.id) + '">Delete</button>' +
    '</div></article>';
}

/* ---------- dashboard ---------- */
function renderDashboard() {
  return Promise.all([getAllLists(), getAllItems()]).then(function (res) {
    var lists = res[0], items = res[1];
    var fully = 0, active = 0, remaining = 0;
    lists.forEach(function (l) {
      var p = listProgress(l.id, items);
      if (p.total > 0 && p.packed === p.total) fully++;
      else active++;
      remaining += p.total - p.packed;
    });
    $('statTotal').textContent = String(lists.length);
    $('statActive').textContent = String(active);
    $('statPacked').textContent = String(fully);
    $('statItems').textContent = String(remaining);
    var upcoming = lists.filter(function (l) {
      var du = l.departureDate ? daysUntil(l.departureDate) : null;
      return du !== null && du >= 0 && du <= 14;
    }).sort(function (a, b) { return a.departureDate < b.departureDate ? -1 : 1; });
    var up = $('upcomingList');
    up.innerHTML = '';
    $('upcomingEmpty').hidden = upcoming.length > 0;
    upcoming.forEach(function (l) {
      var p = listProgress(l.id, items);
      var wrap = document.createElement('div');
      wrap.innerHTML = listCardHTML(l, p);
      up.appendChild(wrap.firstChild);
    });
    var dl = $('dashLists');
    dl.innerHTML = '';
    $('dashEmpty').hidden = lists.length > 0;
    lists.slice().sort(function (a, b) { return (b.updatedAt || '') < (a.updatedAt || '') ? -1 : 1; }).forEach(function (l) {
      var p = listProgress(l.id, items);
      var wrap = document.createElement('div');
      wrap.innerHTML = listCardHTML(l, p);
      dl.appendChild(wrap.firstChild);
    });
  }).catch(function (e) { toast('Could not load dashboard: ' + e.message); });
}

/* ---------- my lists ---------- */
function renderLists() {
  return Promise.all([getAllLists(), getAllItems()]).then(function (res) {
    var lists = res[0], items = res[1];
    var q = $('listSearch').value.trim().toLowerCase();
    var cat = $('listCategoryFilter').value;
    var filtered = lists.filter(function (l) {
      return (!q || l.name.toLowerCase().indexOf(q) !== -1) &&
        (!cat || (l.category || 'Other') === cat);
    }).sort(function (a, b) { return (b.updatedAt || '') < (a.updatedAt || '') ? -1 : 1; });
    var box = $('allLists');
    box.innerHTML = '';
    $('listsEmpty').hidden = filtered.length > 0;
    filtered.forEach(function (l) {
      var p = listProgress(l.id, items);
      var wrap = document.createElement('div');
      wrap.innerHTML = listCardHTML(l, p);
      box.appendChild(wrap.firstChild);
    });
  }).catch(function (e) { toast('Could not load lists: ' + e.message); });
}

/* ---------- checklist ---------- */
function renderChecklist(focusItemId) {
  if (!currentListId) return Promise.resolve();
  return Promise.all([getList(currentListId), getItemsOfList(currentListId)]).then(function (res) {
    var list = res[0], items = res[1];
    if (!list) { showView('lists'); toast('That list no longer exists.'); return; }
    items.sort(function (a, b) { return a.ord - b.ord; });
    $('checkTitle').textContent = list.name;
    var meta = [list.category || 'Other'];
    if (list.departureDate) meta.push('Departs ' + fmtDate(list.departureDate));
    if (list.notes) meta.push(list.notes);
    $('checkMeta').textContent = meta.join(' · ');
    var total = items.length;
    var packed = items.filter(function (it) { return it.packed; }).length;
    var pct = total ? Math.round(packed / total * 100) : 0;
    $('checkCounts').textContent = packed + ' of ' + total + ' items packed';
    $('checkPct').textContent = pct + '%';
    $('checkProgressFill').style.width = pct + '%';
    $('checkProgress').setAttribute('aria-valuenow', String(pct));
    $('readyBanner').hidden = !(total > 0 && packed === total);
    var groups = $('checkGroups');
    groups.innerHTML = '';
    $('checkEmpty').hidden = total > 0;
    var visible = items.filter(function (it) {
      return itemFilter === 'all' || (itemFilter === 'packed' ? it.packed : !it.packed);
    });
    ITEM_CATEGORIES.forEach(function (cat) {
      var inCat = visible.filter(function (it) { return it.category === cat; });
      if (!inCat.length) return;
      var h = document.createElement('h3');
      h.className = 'group-title';
      h.textContent = cat + ' (' + inCat.filter(function (it) { return it.packed; }).length + '/' + inCat.length + ')';
      groups.appendChild(h);
      inCat.forEach(function (it, idx) {
        var row = document.createElement('div');
        row.className = 'item-row' + (it.packed ? ' is-packed' : '');
        var qty = it.quantity > 1 ? ' × ' + it.quantity : '';
        var sub = it.category + (it.notes ? ' · ' + it.notes : '');
        row.innerHTML =
          '<input type="checkbox" class="item-check" data-id="' + escapeHtml(it.id) + '" ' + (it.packed ? 'checked' : '') + ' aria-label="Mark ' + escapeHtml(it.name) + ' as ' + (it.packed ? 'unpacked' : 'packed') + '">' +
          '<div class="item-body"><div class="item-name">' + escapeHtml(it.name) + escapeHtml(qty) + '</div>' +
          '<div class="item-sub">' + escapeHtml(sub) + '</div></div>' +
          '<div class="item-actions">' +
            '<button type="button" class="icon-btn" data-act="up" data-id="' + escapeHtml(it.id) + '" aria-label="Move ' + escapeHtml(it.name) + ' up" ' + (idx === 0 ? 'disabled' : '') + '>&uarr;</button>' +
            '<button type="button" class="icon-btn" data-act="down" data-id="' + escapeHtml(it.id) + '" aria-label="Move ' + escapeHtml(it.name) + ' down" ' + (idx === inCat.length - 1 ? 'disabled' : '') + '>&darr;</button>' +
            '<button type="button" class="icon-btn" data-act="edit-item" data-id="' + escapeHtml(it.id) + '" aria-label="Edit ' + escapeHtml(it.name) + '">&#9998;</button>' +
            '<button type="button" class="icon-btn danger" data-act="del-item" data-id="' + escapeHtml(it.id) + '" aria-label="Delete ' + escapeHtml(it.name) + '">&times;</button>' +
          '</div>';
        groups.appendChild(row);
      });
    });
    if (focusItemId) {
      var cb = groups.querySelector('.item-check[data-id="' + CSS.escape(focusItemId) + '"]');
      if (cb) cb.focus();
    }
  }).catch(function (e) { toast('Could not load checklist: ' + e.message); });
}
function openChecklist(listId) {
  currentListId = listId;
  itemFilter = 'all';
  editingItemId = null;
  resetItemForm();
  document.querySelectorAll('.chip[data-filter]').forEach(function (c) {
    c.classList.toggle('is-active', c.dataset.filter === 'all');
  });
  showView('checklist');
  $('checkTitle').focus();
}
function resetItemForm() {
  $('itemFormTitle').textContent = 'Add an item';
  $('itemName').value = '';
  $('itemQty').value = '1';
  $('itemCategory').value = 'Clothing';
  $('itemNotes').value = '';
  $('itemSubmitBtn').textContent = 'Add item';
  $('itemCancelEdit').hidden = true;
  $('itemFormError').hidden = true;
  editingItemId = null;
}

/* ---------- templates ---------- */
function renderTemplates() {
  var grid = $('templateGrid');
  grid.innerHTML = '';
  TEMPLATES.forEach(function (t) {
    var card = document.createElement('article');
    card.className = 'template-card';
    var preview = t.items.slice(0, 6).map(function (it) {
      return '<li>' + escapeHtml(it.name) + (it.qty > 1 ? ' × ' + it.qty : '') + '</li>';
    }).join('');
    if (t.items.length > 6) preview += '<li>…and ' + (t.items.length - 6) + ' more</li>';
    card.innerHTML = '<h3>' + escapeHtml(t.name) + '</h3>' +
      '<p>' + escapeHtml(t.desc) + '</p>' +
      '<span class="tag">' + escapeHtml(t.category) + ' · ' + t.items.length + ' items</span>' +
      '<ul class="template-items">' + preview + '</ul>' +
      '<button type="button" class="btn btn-primary" data-template="' + escapeHtml(t.id) + '">Use this template</button>';
    grid.appendChild(card);
  });
}
function useTemplate(templateId) {
  var t = TEMPLATES.find(function (x) { return x.id === templateId; });
  if (!t) return;
  var listId = uid();
  var now = new Date().toISOString();
  var list = { id: listId, name: t.name, category: t.category, departureDate: '', notes: '', createdAt: now, updatedAt: now };
  var items = t.items.map(function (it, i) {
    return { id: uid(), listId: listId, name: it.name, quantity: it.qty, category: it.category, notes: '', packed: false, ord: i + 1 };
  });
  var tx = db.transaction(['lists', 'items'], 'readwrite');
  tx.objectStore('lists').add(list);
  var is = tx.objectStore('items');
  items.forEach(function (it) { is.add(it); });
  txComplete(tx).then(function () {
    toast('List created from "' + t.name + '".');
    openChecklist(listId);
  }).catch(function (e) { toast('Could not create list: ' + e.message); });
}

/* ---------- settings ---------- */
function renderSettings() {
  Promise.all([getAllLists(), getAllItems()]).then(function (res) {
    $('storageLists').textContent = String(res[0].length);
    $('storageItems').textContent = String(res[1].length);
  }).catch(function () { $('storageLists').textContent = '?'; $('storageItems').textContent = '?'; });
  if (navigator.storage && navigator.storage.estimate) {
    navigator.storage.estimate().then(function (est) {
      if (est.usage === undefined || est.usage === null) { $('storageUsed').textContent = 'Unknown'; return; }
      $('storageUsed').textContent = est.usage < 1048576
        ? Math.round(est.usage / 1024) + ' KB'
        : (est.usage / 1048576).toFixed(2) + ' MB';
    }).catch(function () { $('storageUsed').textContent = 'Unknown'; });
  }
}

/* ---------- list create / edit / duplicate / delete ---------- */
function openListDialog(list) {
  editingListId = list ? list.id : null;
  $('listDialogTitle').textContent = list ? 'Edit packing list' : 'New packing list';
  $('listSubmitBtn').textContent = list ? 'Save changes' : 'Create list';
  $('listName').value = list ? list.name : '';
  $('listCategory').value = list ? (list.category || 'Trip') : 'Trip';
  $('listDeparture').value = list ? (list.departureDate || '') : '';
  $('listNotes').value = list ? (list.notes || '') : '';
  $('listFormError').hidden = true;
  $('listDialog').showModal();
  $('listName').focus();
}
function saveListForm() {
  var name = $('listName').value.trim();
  var category = $('listCategory').value;
  var dep = $('listDeparture').value;
  var notes = $('listNotes').value.trim();
  var err = $('listFormError');
  if (!isNonEmptyStr(name, 120)) { err.textContent = 'Give the list a name.'; err.hidden = false; return; }
  if (dep && parseLocalDate(dep) === null) { err.textContent = 'That departure date is not valid.'; err.hidden = false; return; }
  if (LIST_CATEGORIES.indexOf(category) === -1) category = 'Other';
  var now = new Date().toISOString();
  if (editingListId) {
    getList(editingListId).then(function (old) {
      if (!old) { toast('That list no longer exists.'); return; }
      old.name = name; old.category = category; old.departureDate = dep; old.notes = notes; old.updatedAt = now;
      var tx = db.transaction('lists', 'readwrite');
      tx.objectStore('lists').put(old);
      return txComplete(tx);
    }).then(function () {
      $('listDialog').close();
      toast('List updated.');
      var done = [];
      if (currentView === 'checklist') done.push(renderChecklist()); else done.push(renderLists());
      if (currentView === 'dashboard') done.push(renderDashboard());
      var savedId = editingListId;
      var viewEl = currentView === 'dashboard' ? $('view-dashboard') : $('view-lists');
      Promise.all(done).then(function () {
        /* Scope to the visible view: the same list card also exists in the
           hidden dashboard/lists section, and focus() on a hidden element
           silently does nothing. */
        var btn = viewEl.querySelector('[data-act="edit"][data-id="' + CSS.escape(savedId) + '"]');
        if (btn) btn.focus();
      });
    }).catch(function (e) { err.textContent = 'Could not save: ' + e.message; err.hidden = false; });
  } else {
    var list = { id: uid(), name: name, category: category, departureDate: dep, notes: notes, createdAt: now, updatedAt: now };
    var tx = db.transaction('lists', 'readwrite');
    tx.objectStore('lists').add(list);
    txComplete(tx).then(function () {
      $('listDialog').close();
      toast('List created.');
      if (currentView === 'dashboard') renderDashboard(); else renderLists();
      openChecklist(list.id);
    }).catch(function (e) { err.textContent = 'Could not save: ' + e.message; err.hidden = false; });
  }
}
function duplicateList(listId) {
  Promise.all([getList(listId), getItemsOfList(listId)]).then(function (res) {
    var list = res[0], items = res[1];
    if (!list) { toast('That list no longer exists.'); return; }
    var now = new Date().toISOString();
    var copy = {
      id: uid(), name: list.name + ' (copy)', category: list.category,
      departureDate: list.departureDate || '', notes: list.notes || '',
      createdAt: now, updatedAt: now
    };
    var copyItems = items.slice().sort(function (a, b) { return a.ord - b.ord; }).map(function (it) {
      return { id: uid(), listId: copy.id, name: it.name, quantity: it.quantity, category: it.category, notes: it.notes || '', packed: false, ord: it.ord };
    });
    var tx = db.transaction(['lists', 'items'], 'readwrite');
    tx.objectStore('lists').add(copy);
    var is = tx.objectStore('items');
    copyItems.forEach(function (it) { is.add(it); });
    return txComplete(tx).then(function () {
      toast('Duplicated as "' + copy.name + '" — all items reset to unpacked.');
      renderLists();
      if (currentView === 'dashboard') renderDashboard();
    });
  }).catch(function (e) { toast('Could not duplicate: ' + e.message); });
}
function deleteList(listId) {
  getList(listId).then(function (list) {
    if (!list) { toast('That list no longer exists.'); return; }
    return askConfirm('Delete this list?', '"' + list.name + '" and all its items will be deleted.', 'Delete list')
      .then(function (ok) {
        if (!ok) return;
        return getItemsOfList(listId).then(function (items) {
          var tx = db.transaction(['lists', 'items'], 'readwrite');
          items.forEach(function (it) { tx.objectStore('items').delete(it.id); });
          tx.objectStore('lists').delete(listId);
          return txComplete(tx);
        }).then(function () {
          toast('List deleted.');
          if (currentListId === listId) { currentListId = null; showView('lists'); $('listsTitle').focus(); }
          else {
            var done = [renderLists()];
            if (currentView === 'dashboard') done.push(renderDashboard());
            Promise.all(done).then(function () {
              if (currentView === 'lists') $('listsTitle').focus();
              else if (currentView === 'dashboard') $('dashTitle').focus();
            });
          }
        });
      });
  }).catch(function (e) { toast('Could not delete: ' + e.message); });
}

/* ---------- items ---------- */
function saveItemForm() {
  var name = $('itemName').value.trim();
  var qty = Number($('itemQty').value);
  var category = $('itemCategory').value;
  var notes = $('itemNotes').value.trim();
  var err = $('itemFormError');
  if (!isNonEmptyStr(name, 120)) { err.textContent = 'Give the item a name.'; err.hidden = false; return; }
  if (!Number.isInteger(qty) || qty < 1 || qty > 999) { err.textContent = 'Quantity must be a whole number from 1 to 999.'; err.hidden = false; return; }
  if (ITEM_CATEGORIES.indexOf(category) === -1) category = 'Other';
  err.hidden = true;
  if (editingItemId) {
    reqToPromise(store('items', 'readonly').get(editingItemId)).then(function (old) {
      if (!old || old.listId !== currentListId) { toast('That item no longer exists.'); resetItemForm(); renderChecklist(); return; }
      old.name = name; old.quantity = qty; old.category = category; old.notes = notes;
      var tx = db.transaction('items', 'readwrite');
      tx.objectStore('items').put(old);
      return txComplete(tx).then(function () {
        toast('Item updated.');
        resetItemForm();
        renderChecklist(old.id);
      });
    }).catch(function (e) { err.textContent = 'Could not save: ' + e.message; err.hidden = false; });
  } else {
    getItemsOfList(currentListId).then(function (items) {
      var maxOrd = items.reduce(function (m, it) { return Math.max(m, it.ord || 0); }, 0);
      var item = { id: uid(), listId: currentListId, name: name, quantity: qty, category: category, notes: notes, packed: false, ord: maxOrd + 1 };
      var tx = db.transaction('items', 'readwrite');
      tx.objectStore('items').add(item);
      return txComplete(tx).then(function () {
        toast('Item added.');
        resetItemForm();
        renderChecklist(item.id);
      });
    }).catch(function (e) { err.textContent = 'Could not save: ' + e.message; err.hidden = false; });
  }
}
function toggleItem(itemId, packed) {
  reqToPromise(store('items', 'readonly').get(itemId)).then(function (it) {
    if (!it) return;
    it.packed = packed;
    var tx = db.transaction('items', 'readwrite');
    tx.objectStore('items').put(it);
    return txComplete(tx).then(function () { renderChecklist(itemId); });
  }).catch(function (e) { toast('Could not update item: ' + e.message); });
}
function moveItem(itemId, dir) {
  getItemsOfList(currentListId).then(function (items) {
    items.sort(function (a, b) { return a.ord - b.ord; });
    var idx = items.findIndex(function (it) { return it.id === itemId; });
    if (idx < 0) return;
    var group = items.filter(function (it) { return it.category === items[idx].category; });
    var gi = group.findIndex(function (it) { return it.id === itemId; });
    var swap = group[gi + dir];
    if (!swap) return;
    var a = group[gi], b = swap;
    var tmp = a.ord; a.ord = b.ord; b.ord = tmp;
    var tx = db.transaction('items', 'readwrite');
    tx.objectStore('items').put(a);
    tx.objectStore('items').put(b);
    return txComplete(tx).then(function () { renderChecklist(itemId); });
  }).catch(function (e) { toast('Could not reorder: ' + e.message); });
}
function deleteItem(itemId) {
  reqToPromise(store('items', 'readonly').get(itemId)).then(function (it) {
    if (!it) return;
    return askConfirm('Delete this item?', '"' + it.name + '" will be removed from the list.', 'Delete item')
      .then(function (ok) {
        if (!ok) return;
        var tx = db.transaction('items', 'readwrite');
        tx.objectStore('items').delete(itemId);
        return txComplete(tx).then(function () { toast('Item deleted.'); return renderChecklist().then(function () { $('checkTitle').focus(); }); });
      });
  }).catch(function (e) { toast('Could not delete item: ' + e.message); });
}
function editItem(itemId) {
  reqToPromise(store('items', 'readonly').get(itemId)).then(function (it) {
    if (!it) return;
    editingItemId = it.id;
    $('itemFormTitle').textContent = 'Edit item';
    $('itemName').value = it.name;
    $('itemQty').value = String(it.quantity);
    $('itemCategory').value = it.category;
    $('itemNotes').value = it.notes || '';
    $('itemSubmitBtn').textContent = 'Save changes';
    $('itemCancelEdit').hidden = false;
    $('itemName').focus();
  }).catch(function (e) { toast('Could not load item: ' + e.message); });
}
function resetPacking() {
  getList(currentListId).then(function (list) {
    if (!list) return;
    return askConfirm('Reset packing?', 'Every item in "' + list.name + '" will be marked unpacked. The list and its items stay.', 'Reset packing')
      .then(function (ok) {
        if (!ok) return;
        return getItemsOfList(currentListId).then(function (items) {
          var tx = db.transaction('items', 'readwrite');
          items.forEach(function (it) { it.packed = false; tx.objectStore('items').put(it); });
          return txComplete(tx).then(function () { toast('Packing reset.'); return renderChecklist().then(function () { $('checkTitle').focus(); }); });
        });
      });
  }).catch(function (e) { toast('Could not reset: ' + e.message); });
}

/* ---------- export / import / delete-all ---------- */
function exportData() {
  Promise.all([getAllLists(), getAllItems(), getSetting('theme')]).then(function (res) {
    var data = { app: 'packwise', version: 1, exportedAt: new Date().toISOString(), lists: res[0], items: res[1], settings: { theme: res[2] === 'dark' ? 'dark' : 'light' } };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'packwise-backup-' + todayLocal() + '.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    toast('Backup downloaded.');
  }).catch(function (e) { toast('Could not export: ' + e.message); });
}
function importData(file) {
  var errEl = $('importError'), okEl = $('importOk');
  errEl.hidden = true; okEl.hidden = true;
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function () {
    var data;
    try { data = JSON.parse(String(reader.result)); }
    catch (e) { errEl.textContent = 'That file is not valid JSON. Nothing was changed.'; errEl.hidden = false; return; }
    var problem = validateBackup(data);
    if (problem) { errEl.textContent = 'Invalid backup: ' + problem + ' Nothing was changed.'; errEl.hidden = false; return; }
    askConfirm('Replace all data?', 'This will replace every list and item with the ' + data.lists.length + ' lists and ' + data.items.length + ' items from the backup.', 'Replace data')
      .then(function (ok) {
        if (!ok) return;
        var tx = db.transaction(['lists', 'items', 'settings'], 'readwrite');
        tx.objectStore('lists').clear();
        tx.objectStore('items').clear();
        data.lists.forEach(function (l) { tx.objectStore('lists').add(l); });
        data.items.forEach(function (it) { tx.objectStore('items').add(it); });
        var importedTheme = data.settings && data.settings.theme;
        if (importedTheme) tx.objectStore('settings').put({ key: 'theme', value: importedTheme });
        return txComplete(tx).then(function () {
          okEl.textContent = 'Backup imported: ' + data.lists.length + ' lists, ' + data.items.length + ' items.';
          okEl.hidden = false;
          if (importedTheme) { applyTheme(importedTheme); $('themeSelect').value = importedTheme; }
          renderSettings();
          if (currentView === 'dashboard') renderDashboard();
        });
      }).catch(function (e) { errEl.textContent = 'Import failed: ' + e.message + ' Nothing was changed.'; errEl.hidden = false; });
  };
  reader.onerror = function () { errEl.textContent = 'Could not read that file. Nothing was changed.'; errEl.hidden = false; };
  reader.readAsText(file);
}
function deleteAll() {
  askConfirm('Delete all saved data?', 'Every list and item will be erased. This cannot be undone.', 'Delete everything')
    .then(function (ok) {
      if (!ok) return;
      var tx = db.transaction(['lists', 'items', 'settings'], 'readwrite');
      tx.objectStore('lists').clear();
      tx.objectStore('items').clear();
      tx.objectStore('settings').clear();
      return txComplete(tx).then(function () {
        currentListId = null;
        applyTheme('light');
        $('themeSelect').value = 'light';
        toast('All data deleted.');
        renderSettings();
        showView('dashboard');
      });
    }).catch(function (e) { toast('Could not delete: ' + e.message); });
}

/* ---------- theme ---------- */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
}
function initTheme() {
  getSetting('theme').then(function (t) {
    var theme = t === 'dark' ? 'dark' : 'light';
    applyTheme(theme);
    $('themeSelect').value = theme;
  }).catch(function () { applyTheme('light'); });
}

/* ---------- wiring ---------- */
function wire() {
  document.querySelectorAll('[data-view]').forEach(function (b) {
    b.addEventListener('click', function () { showView(b.dataset.view); });
  });
  $('dashNewBtn').addEventListener('click', function () { openListDialog(null); });
  $('listsNewBtn').addEventListener('click', function () { openListDialog(null); });
  $('backToLists').addEventListener('click', function () { currentListId = null; showView('lists'); });
  $('listCancelBtn').addEventListener('click', function () { $('listDialog').close(); });
  $('listForm').addEventListener('submit', function (e) { e.preventDefault(); saveListForm(); });
  $('confirmCancelBtn').addEventListener('click', function () {
    $('confirmDialog').close();
    if (confirmResolve) { var r = confirmResolve; confirmResolve = null; r(false); }
  });
  $('confirmDialog').addEventListener('close', function () {
    if (confirmResolve) { var r = confirmResolve; confirmResolve = null; r($('confirmDialog').returnValue === 'ok'); }
  });
  $('listSearch').addEventListener('input', renderLists);
  $('listCategoryFilter').addEventListener('change', renderLists);
  document.querySelectorAll('.chip[data-filter]').forEach(function (c) {
    c.addEventListener('click', function () {
      itemFilter = c.dataset.filter;
      document.querySelectorAll('.chip[data-filter]').forEach(function (x) { x.classList.toggle('is-active', x === c); });
      renderChecklist();
    });
  });
  $('itemForm').addEventListener('submit', function (e) { e.preventDefault(); saveItemForm(); });
  $('itemCancelEdit').addEventListener('click', resetItemForm);
  $('resetPackingBtn').addEventListener('click', resetPacking);
  $('checkGroups').addEventListener('change', function (e) {
    if (e.target.classList.contains('item-check')) toggleItem(e.target.dataset.id, e.target.checked);
  });
  $('checkGroups').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-act]');
    if (!btn) return;
    var id = btn.dataset.id;
    if (btn.dataset.act === 'up') moveItem(id, -1);
    if (btn.dataset.act === 'down') moveItem(id, 1);
    if (btn.dataset.act === 'edit-item') editItem(id);
    if (btn.dataset.act === 'del-item') deleteItem(id);
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-template]');
    if (t) { useTemplate(t.dataset.template); return; }
    var b = e.target.closest('[data-act]');
    if (!b || !b.closest('.list-card')) return;
    var id = b.dataset.id;
    if (b.dataset.act === 'open') openChecklist(id);
    if (b.dataset.act === 'edit') getList(id).then(function (l) { if (l) openListDialog(l); });
    if (b.dataset.act === 'duplicate') duplicateList(id);
    if (b.dataset.act === 'delete') deleteList(id);
  });
  $('themeSelect').addEventListener('change', function () {
    var theme = $('themeSelect').value === 'dark' ? 'dark' : 'light';
    applyTheme(theme);
    setSetting('theme', theme).catch(function () {});
  });
  $('exportBtn').addEventListener('click', exportData);
  $('importBtn').addEventListener('click', function () { $('importFile').click(); });
  $('importFile').addEventListener('change', function () {
    importData($('importFile').files[0]);
    $('importFile').value = '';
  });
  $('deleteAllBtn').addEventListener('click', deleteAll);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && editingItemId) resetItemForm();
  });
}

/* ---------- boot ---------- */
openDB().then(function (d) {
  db = d;
  initTheme();
  wire();
  showView('dashboard');
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
}).catch(function (e) {
  document.body.innerHTML = '<main style="padding:32px;font-family:sans-serif"><h1>PackWise could not start</h1>' +
    '<p>Your browser blocked local storage (IndexedDB): ' + escapeHtml(e.message || e) +
    '. PackWise needs IndexedDB to save your lists. Try allowing storage for this site, or use a different browser.</p></main>';
});
