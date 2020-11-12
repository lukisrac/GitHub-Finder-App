const searchForm = document.getElementById('searchForm');
const clearButton = document.getElementById('clear-results');
const resultsSection = document.getElementById('section-results');
const resultsContainer = document.querySelector('.section-results .row');
const singleUserSection = document.getElementById('section-single-result');

const requestOptions = {
  method: 'GET',
  headers: {
    Authorization: `${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
};

// Render results
const setupResults = (data) => {
  let template = `
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
      console.log(results);
      results.forEach((results) => {
        setupResults(results);
      });
      searchForm.reset();
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
const getSingleUser = () => {
  let userButtons = document.querySelectorAll('.user__more-info');
  userButtons.forEach((button) => {
    button.addEventListener('click', () => {
      resultsSection.classList.add('d-none');
      singleUserSection.classList.remove('d-none');

      const userURL = button.getAttribute('data-href');

      fetch(userURL, requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    });
  });
};
