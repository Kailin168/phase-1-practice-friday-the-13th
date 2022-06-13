// const { formatPropWrapperFunctions } = require("eslint-plugin-react/lib/util/propWrapper");
const movieNameAndYearToWatchedStatus = {};
const watchedStatusStorageBox = {};
const bloodAmountStorageBox = {};

fetch('http://localhost:3000/movies')
  .then((response) => response.json())
  // .then(data => data.forEach((element) => {})) // one line body function
  .then((data) => {
    const firstMovieImage = document.querySelector('#detail-image');
    const firstTitleBar = document.querySelector('#title');
    const firstReleaseDate = document.querySelector('#year-released');
    const firstDescription = document.querySelector('#description');
    const firstBloodAmount = document.querySelector('#amount');
    const bloodAmountFormBox = document.querySelector('#blood-form');
    const inputNumber = document.querySelector('#blood-amount');
    const amountOfBlood = document.querySelector('#amount');
    const watchedButton = document.querySelector('#watched');
    let eventFunction; // =undefined; (alternative way of seeing it)

    updateUiWithElementData(data[0]);

    data.forEach((element) => {
      const imageNavBar = document.querySelector('#movie-list');
      const movieImageOnNav = document.createElement('img');
      movieImageOnNav.src = element.image;
      imageNavBar.appendChild(movieImageOnNav);
      movieNameAndYearToWatchedStatus[element.title + element.release_year] = element.watched;
      watchedStatusStorageBox[element.title + element.release_year] = element.watched;
      bloodAmountStorageBox[element.title + element.release_year] = element.blood_amount;

      movieImageOnNav.addEventListener('click', (event) => {
        updateUiWithElementData(element);
      });
    });

    function updateUiWithElementData(element) {
      firstMovieImage.src = element.image;
      firstTitleBar.innerText = element.title;
      firstReleaseDate.innerText = element.release_year;
      firstDescription.innerText = element.description;

      if (movieNameAndYearToWatchedStatus[element.title + element.release_year] === false) {
        watchedButton.textContent = 'Unwatched';
      } else {
        watchedButton.textContent = 'watched';
      }
      if (bloodAmountStorageBox[element.title + element.release_year]) {
        firstBloodAmount.innerText = bloodAmountStorageBox[element.title + element.release_year];
      } else {
        firstBloodAmount.innerText = element.blood_amount;
      }

      bloodAmountFormBox.removeEventListener('submit', eventFunction);

      eventFunction = (event) => {
        event.preventDefault();
        amountOfBlood.innerText = parseInt(bloodAmountStorageBox[element.title + element.release_year], 10) + parseInt(inputNumber.value, 10); // value for input box so not innertext
        bloodAmountStorageBox[element.title + element.release_year] = amountOfBlood.textContent;
        inputNumber.value = '';

        fetch(`http://localhost:3000/movies/${element.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ blood_amount: parseInt(amountOfBlood.innerText, 10) }),
        })
          .then((response) => response.json());
      };

      bloodAmountFormBox.addEventListener('submit', eventFunction);
    }

    watchedButton.addEventListener('click', (event) => {
      if (event.target.textContent === 'WATCHED') {
        event.target.textContent = 'UNWATCHED';
        movieNameAndYearToWatchedStatus[firstTitleBar.textContent + firstReleaseDate.textContent] = false;
        watchedStatusStorageBox[firstTitleBar.textContent + firstReleaseDate.textContent] = movieNameAndYearToWatchedStatus[firstTitleBar.textContent + firstReleaseDate.textContent];
      } else {
        event.target.textContent = 'WATCHED';
        movieNameAndYearToWatchedStatus[firstTitleBar.textContent + firstReleaseDate.textContent] = true;
        watchedStatusStorageBox[firstTitleBar.textContent + firstReleaseDate.textContent] = movieNameAndYearToWatchedStatus[firstTitleBar.textContent + firstReleaseDate.textContent];
      }
    });
  });
