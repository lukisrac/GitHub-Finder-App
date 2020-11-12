const searchForm = document.getElementById('searchForm');
const clearButton = document.getElementById('clear-results');
const resultsSection = document.getElementById('section-results');
const resultsContainer = document.querySelector('.section-results .row');
const singleUserSection = document.getElementById('section-single-result');
const spinnerLoader = document.getElementById('spinner-loader');

const requestOptions = {
  method: 'GET',
  headers: {
    Authorization: `${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
};

// Render results
const renderResults = (data) => {
  const template = `
    <div class="col">
      <div class="card user">
        <div class="card-body text-center">
          <img src="${data.avatar_url}" alt="Avatar" class="user__image">
          <p class="user__name my-3 font-weight-bold">${data.login}</p>
          <button type="button" data-href="${data.url}" class="btn btn-dark user__more-info">Detail</button>
        </div>
      </div>
    </div>
  `;

  resultsContainer.innerHTML += template;
  clearButton.classList.remove('d-none');
};

// Search for user
searchForm.addEventListener('submit', (e) => {
  // Prevent default form submit
  e.preventDefault();

  spinnerLoader.classList.toggle('d-none');
  resultsContainer.innerHTML = '';
  if (resultsSection.classList.contains('d-none')) {
    resultsSection.classList.remove('d-none');
    singleUserSection.classList.add('d-none');
  }
  const userValue = searchForm.querySelector('#search').value;
  const searchUserURL = `https://api.github.com/search/users?q=${userValue}&per_page=20`;

  fetch(searchUserURL, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      let results = data.items;
      //console.log(results);
      results.forEach((results) => {
        renderResults(results);
      });
      searchForm.reset();
      spinnerLoader.classList.toggle('d-none');
      getSingleUser();
    })
    .catch((err) => console.log(err));
});

// Clear search form and results and hide this button
const clearResults = () => {
  searchForm.reset();
  clearButton.classList.add('d-none');
  resultsSection.classList.remove('d-none');
  resultsContainer.innerHTML = '';
  singleUserSection.classList.add('d-none');
};
clearButton.addEventListener('click', clearResults);

// Render page to display info of a single user
const renderUser = (data) => {
  const avatar = document.querySelector('.user__avatar');
  const fullname = document.querySelector('.user__fullname');
  const twitter = document.querySelector('.user__twitter');
  const followBtn = document.querySelector('.user__follow-btn');
  const bio = document.querySelector('.user__bio');
  const company = document.querySelector('.user__company .text');
  const location = document.querySelector('.user__location .text');
  const website = document.querySelector('.user__website a');
  const repositories = document.getElementById('user__repositories');
  const followers = document.getElementById('user__followers');
  const following = document.getElementById('user__following');
  const gists = document.getElementById('user__gists');

  avatar.setAttribute('src', data.avatar_url);
  fullname.textContent = data.name;
  twitter.textContent = `@${data.twitter_username}`;
  followBtn.setAttribute('href', data.html_url);
  bio.textContent = data.bio;
  company.textContent = data.company;
  location.textContent = data.location;
  website.textContent = data.blog;
  website.setAttribute('href', data.blog);
  repositories.textContent = data.public_repos;
  followers.textContent = data.followers;
  following.textContent = data.following;
  gists.textContent = data.public_gists;
};

const getSingleUser = () => {
  let userButtons = document.querySelectorAll('.user__more-info');
  userButtons.forEach((button) => {
    button.addEventListener('click', () => {
      resultsSection.classList.add('d-none');
      spinnerLoader.classList.toggle('d-none');
      //singleUserSection.classList.remove('d-none');

      const userURL = button.getAttribute('data-href');

      fetch(userURL, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          //console.log(data);
          renderUser(data);
          singleUserSection.classList.remove('d-none');
          spinnerLoader.classList.toggle('d-none');
        })
        .catch((err) => console.log(err));
    });
  });
};
