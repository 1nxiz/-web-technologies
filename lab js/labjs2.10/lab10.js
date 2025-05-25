
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const tabs = document.querySelectorAll('.tab');
const forms = document.querySelectorAll('.form');
const messageContainer = document.getElementById('messageContainer');
const authContainer = document.getElementById('authContainer');
const userApp = document.getElementById('userApp');

function showMessage(msg, success = true) {
  messageContainer.textContent = msg;
  messageContainer.style.backgroundColor = success ? '#23d160' : '#ff3860';
  messageContainer.classList.add('show');
  setTimeout(() => messageContainer.classList.remove('show'), 3000);
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    forms.forEach(form => form.classList.remove('active'));
    document.getElementById(`${tab.dataset.tab}Form`).classList.add('active');
  });
});

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const user = loginForm.loginUsername.value.trim();
  const pass = loginForm.loginPassword.value;
  if (user && pass.length >= 6) {
    localStorage.setItem('user', JSON.stringify({ user }));
    startApp();
  } else {
    showMessage('Некоректні дані входу', false);
  }
});

registerForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = registerForm.firstName.value.trim();
  const email = registerForm.email.value.trim();
  const pass = registerForm.password.value;
  const confirm = registerForm.confirmPassword.value;
  if (name && email && pass.length >= 6 && pass === confirm) {
    localStorage.setItem('user', JSON.stringify({ user: name }));
    startApp();
  } else {
    showMessage('Заповніть всі поля правильно', false);
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('user');
  location.reload();
});

function startApp() {
  authContainer.style.display = 'none';
  userApp.style.display = 'block';
  fetchAndRenderUsers();
}


const debounce = (fn, delay = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

function getURLParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get('search') || '',
    sort: params.get('sort') || '',
    page: parseInt(params.get('page')) || 1,
    favorite: params.get('favorite') === 'true'  
  };
}


function updateURL({ search, sort, page, favorite }) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (sort) params.set('sort', sort);
  if (page) params.set('page', page);
  if (favorite) params.set('favorite', 'true');  
  history.pushState(null, '', '?' + params.toString());
}


const userList = document.getElementById('userList');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

let currentPage = 1;
const USERS_PER_PAGE = 30;
const MAX_PAGES = 4; // максимум 4 сторінки
let loading = false;

function fetchAndRenderUsers() {
  fetch('https://randomuser.me/api/?results=120&nat=us,ca,gb')
    .then(res => res.json())
    .then(data => {
      allUsers = data.results;
      applyFilters();
    })
    .catch(() => showMessage('Не вдалося завантажити користувачів', false));
}

document.getElementById('toggleFiltersBtn').addEventListener('click', () => {
  const filtersContainer = document.getElementById('filtersContainer');
  filtersContainer.style.display = filtersContainer.style.display === 'none' ? 'block' : 'none';
});

function applyFilters() {
  const { search, sort, page, favorite } = getURLParams();
  currentPage = page;
  showOnlyFavorites = favorite;

  let sourceUsers = allUsers;
  if (showOnlyFavorites) {
    const favs = getFavorites();
    sourceUsers = allUsers.filter(u => favs.includes(u.login.uuid));
  }

  filteredUsers = sourceUsers.filter(user => {
    const name = `${user.name.first} ${user.name.last}`.toLowerCase();
    const email = user.email.toLowerCase();
    const location = `${user.location.city} ${user.location.country}`.toLowerCase();
    const birthYear = new Date(user.dob.date).getFullYear();

    const filterName = document.getElementById('filterName')?.value.toLowerCase() || '';
    const filterEmail = document.getElementById('filterEmail')?.value.toLowerCase() || '';
    const filterLocation = document.getElementById('filterLocation')?.value.toLowerCase() || '';
    const filterAge = parseInt(document.getElementById('filterAge')?.value);
    const filterYear = parseInt(document.getElementById('filterYear')?.value);

    return (
      (!filterName || name.includes(filterName)) &&
      (!filterEmail || email.includes(filterEmail)) &&
      (!filterLocation || location.includes(filterLocation)) &&
      (!filterAge || user.dob.age === filterAge) &&
      (!filterYear || birthYear === filterYear)
    );
  });

  if (sort === 'name_asc') filteredUsers.sort((a, b) => a.name.first.localeCompare(b.name.first));
  if (sort === 'name_desc') filteredUsers.sort((a, b) => b.name.first.localeCompare(a.name.first));
  if (sort === 'age_asc') filteredUsers.sort((a, b) => a.dob.age - b.dob.age);
  if (sort === 'age_desc') filteredUsers.sort((a, b) => b.dob.age - a.dob.age);
  if (sort === 'reg_asc') filteredUsers.sort((a, b) => new Date(a.registered.date) - new Date(b.registered.date));
  if (sort === 'reg_desc') filteredUsers.sort((a, b) => new Date(b.registered.date) - new Date(a.registered.date));

  renderUsers();
  renderPagination();
  favoriteToggleBtn.textContent = showOnlyFavorites ? 'Показати всіх' : 'Показати улюблених';
}

function renderUsers() {
  const start = 0;
  const end = currentPage * USERS_PER_PAGE;
  const usersToShow = filteredUsers.slice(start, end);
  userList.innerHTML = usersToShow.map(user => createUserCard(user)).join('');
}

function renderPagination() {
  const totalPages = Math.min(Math.ceil(filteredUsers.length / USERS_PER_PAGE), MAX_PAGES);
  pagination.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.classList.toggle('active', i === currentPage);
    btn.onclick = () => {
      updateURL({ ...getURLParams(), page: i });
      currentPage = i;
      renderUsers();
      renderPagination();
    };
    pagination.appendChild(btn);
  }
}

function createUserCard(user) {
  const id = user.login.uuid;
  const isFav = getFavorites().includes(id);
  return `
    <div class="user-card">
      <img src="${user.picture.large}" alt="${user.name.first}">
      <h3>${user.name.first} ${user.name.last}</h3>
      <p>Вік: ${user.dob.age}</p>
      <p>Email: ${user.email}</p>
      <p>Країна: ${user.location.country}</p>
      <button class="favorite-btn ${isFav ? 'saved' : ''}" onclick="toggleFavorite('${id}')">
        ${isFav ? '★ Улюблений' : '☆ Додати'}
      </button>
    </div>
  `;
}

function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function toggleFavorite(id) {
  let favs = getFavorites();
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }
  localStorage.setItem('favorites', JSON.stringify(favs));
  applyFilters();
}

searchInput.addEventListener('input', debounce(e => {
  updateURL({ ...getURLParams(), search: e.target.value, page: 1 });
  applyFilters();
}, 300));

sortSelect.addEventListener('change', e => {
  updateURL({ ...getURLParams(), sort: e.target.value, page: 1 });
  applyFilters();
});

document.getElementById('applyFilters').addEventListener('click', () => {
  updateURL({ ...getURLParams(), page: 1 });
  currentPage = 1;
  applyFilters();
});

window.addEventListener('popstate', () => {
  applyFilters();
});

if (localStorage.getItem('user')) {
  startApp();
}

const favoriteToggleBtn = document.createElement('button');
favoriteToggleBtn.textContent = 'Показати улюблених';
favoriteToggleBtn.className = 'btn logout-btn';
favoriteToggleBtn.style.marginLeft = '10px';
let showOnlyFavorites = false;

favoriteToggleBtn.addEventListener('click', () => {
  showOnlyFavorites = !showOnlyFavorites;
  updateURL({ ...getURLParams(), page: 1, favorite: showOnlyFavorites });
  applyFilters();
});

document.getElementById('clearFilters').addEventListener('click', () => {
  document.getElementById('filterName').value = '';
  document.getElementById('filterEmail').value = '';
  document.getElementById('filterLocation').value = '';
  document.getElementById('filterAge').value = '';
  document.getElementById('filterYear').value = '';
  updateURL({ ...getURLParams(), page: 1 });
  applyFilters();
});


document.querySelector('.header').appendChild(favoriteToggleBtn);


window.addEventListener('scroll', () => {
  const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
  const totalPages = Math.min(Math.ceil(filteredUsers.length / USERS_PER_PAGE), MAX_PAGES);
  if (bottom && !loading && currentPage < totalPages) {
    currentPage++;
    loading = true;
    renderUsers();
    renderPagination();
    loading = false;
  }
});
