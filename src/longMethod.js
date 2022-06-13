// const { formatPropWrapperFunctions } = require("eslint-plugin-react/lib/util/propWrapper");
const movieNameAndYearToWatchedStatus = {};
const watchedStatusStorageBox = {};
const bloodAmountStorageBox = {};

/*

function name(param) {}
const name = function(param) {}
const name = (param) => {}
data => data.json()
(data, test) => data.json()
(data) => { data.json(); data.something(); }


function multipleByTwo(x) {
  return x * 2;
}

// response
let info = 10;
function getValue() {
  return info * 2;
}

getValue() // 20


//

multipleByTwo(5) // 10
multipleByTwo(10) // 20
multipleByTwo(7)
multipleByTwo(721)
*/


fetch('http://localhost:3000/movies')
  .then((response) => response.json())
  .then((data) => {
    const firstMovieImage = document.querySelector('#detail-image');
    firstMovieImage.src = data[0].image;
    const firstTitleBar = document.querySelector('#title');
    firstTitleBar.innerText = data[0].title;
    const firstReleaseDate = document.querySelector('#year-released');
    firstReleaseDate.innerText = data[0].release_year;
    const firstDescription = document.querySelector('#description');
    firstDescription.innerText = data[0].description;
    const firstBloodAmount = document.querySelector('#amount');
    firstBloodAmount.innerText = data[0].blood_amount;
    let eventFunction; // =undefined; (alternative way of seeing it)
    const bloodAmountFormBox = document.querySelector('#blood-form');
    const inputNumber = document.querySelector('#blood-amount');
    const amountOfBlood = document.querySelector('#amount');
    const watchedButton = document.querySelector('#watched');
    // watchedButton.textContent = data.watched;
    if (data[0].watched === false) {
      watchedButton.textContent = 'Unwatched';
    } else {
      watchedButton.textContent = 'watched';
    }


    eventFunction = (event) => {
      event.preventDefault();
      amountOfBlood.innerText = parseInt(bloodAmountStorageBox[data[0].title + data[0].release_year], 10) + parseInt(inputNumber.value, 10); // value for input box so not innertext
      bloodAmountStorageBox[data[0].title + data[0].release_year] = amountOfBlood.textContent;
      inputNumber.value = '';

      fetch(`http://localhost:3000/movies/${data[0].id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blood_amount: parseInt(amountOfBlood.innerText, 10) }),
      })
        .then((response) => response.json());
    };
    bloodAmountFormBox.addEventListener('submit', eventFunction);

    data.forEach((element) => {
      const imageNavBar = document.querySelector('#movie-list');
      const movieImageOnNav = document.createElement('img');
      movieImageOnNav.src = element.image;
      imageNavBar.appendChild(movieImageOnNav);
      movieNameAndYearToWatchedStatus[element.title + element.release_year] = element.watched;
      watchedStatusStorageBox[element.title + element.release_year] = element.watched;
      bloodAmountStorageBox[element.title + element.release_year] = element.blood_amount;

      movieImageOnNav.addEventListener('click', () => {
        firstMovieImage.src = element.image;
        firstTitleBar.innerText = element.title;
        firstReleaseDate.innerText = element.release_year;
        firstDescription.innerText = element.description;
        firstBloodAmount.innerText = element.blood_amount;
        if (movieNameAndYearToWatchedStatus[element.title + element.release_year] === false) {
          watchedButton.textContent = 'Unwatched';
        } else {
          watchedButton.textContent = 'watched';
        }
        firstBloodAmount.innerText = bloodAmountStorageBox[element.title + element.release_year]

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
      });
    });

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
