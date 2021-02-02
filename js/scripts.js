//Project 5 Public API Request
//The purpose of the page is to dynamically retrieve user information and
//display each user as an individual card. There is a search function as well.

// Declaration of Variables
const body = document.querySelector('body');
const search = document.querySelector('.search-container');
const gallery = document.getElementById('gallery');
let searchReturn;
let cards = [];
let index = 0;
let modalClose;
let modalNext;
let modalPrev;
let modalContainer;
let users = [];

// Fetch random users

fetch('https://randomuser.me/api/?results=12&nat=us')
  .then(data => data.json())
  .then(results => {
    // Generating the employee cards
    users = results.results;
    let allCardsHTML = '';
    for (let i = 0; i<users.length; i++) {
      const html = createCard(users[i]);
      allCardsHTML += html;
    }
    return allCardsHTML;
  })
  .then(html => {
    gallery.insertAdjacentHTML('afterbegin', html);
    // Converts HTMLCollection to array that can be accessed later
    const cardCollection = document.getElementsByClassName('card');
    for (let i=0; i<cardCollection.length; i++) {
      cards.push(cardCollection[i]);
    };
  })
  .then(() => {
    // Event listener is added here because it requires the success of the fetch request to function
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        index = cards.indexOf(card);
        createModal(users[index]);
      })
    })
  })
  .catch((err) => {
    console.log(err)
    const errorMessage = `<p>Something went wrong. Please reload page.</p>`
    gallery.insertAdjacentHTML('afterbegin', errorMessage);
  });

// Helper Functions

// createCard() generates the HTML for each employee's card of information
// @user should be a user object that has been parsed from the JSON data 
// provided by the Random User API
function createCard (user) {
  const userHTML = `
    <div class="card">
      <div class="card-img-container">
          <img class="card-img" src=${user.picture.large} alt="profile picture">
      </div>
      <div class="card-info-container">
          <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
          <p class="card-text">${user.email}</p>
          <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
      </div>
  </div>`;
  return userHTML;
}

// createModal() generates the modal window that displays additional user info.
// @user is a user object. The function is called during an event listener.
function createModal (user) {
  const revisedPhone = `${user.phone.slice(0,5)} ${user.phone.slice(6-14)}`;
  const revisedDOB = `${user.dob.date.slice(5,7)}/${user.dob.date.slice(8,10)}/${user.dob.date.slice(0,4)}`
  const modalHTML = `            
    <div class="modal-container">
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src=${user.picture.large} alt="profile picture">
            <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="modal-text">${user.email}</p>
            <p class="modal-text cap">${user.location.city}</p>
            <hr>
            <p class="modal-text">${revisedPhone}</p>
            <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
            <p class="modal-text">Birthday: ${revisedDOB}</p>
        </div>
    </div>
    <div class="modal-btn-container">
      <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
      <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
  </div>`;
  gallery.insertAdjacentHTML('afterend', modalHTML);
  modalClose = document.getElementById('modal-close-btn');
  modalNext = document.getElementById('modal-next');
  modalPrev = document.getElementById('modal-prev');
  modalContainer = document.getElementsByClassName('modal-container');
}

// performSearch(searchInput, users) is accessed via an event listener. It cross references
// the entered search input against the employee names to determine matches.
//@searchInput is the value of the characters currently entered in the search box
//@users is the array of employee objects
function performSearch(searchInput, users) {
  const searchTerm = searchInput.toLowerCase();
  let searchResults = [];
  if (searchInput.length > 0) {
    for (let i=0; i<users.length; i++) {
      let userName = `${users[i].name.first} ${users[i].name.last}`
      userName = userName.toLowerCase();
      if (searchInput.length !==0 && userName.includes(searchTerm)) {
        cards[i].style.display = 'flex';
      } else {
        cards[i].style.display = 'none';
      }
    }
  } else {
    for (let i=0; i<users.length; i++) {
      cards[i].style.display = 'flex';
    }
  }
}

//Page Setup
//Search bar creation and naming the constants for the search box and button
const searchBarHTML = `
  <form action="#" method="get">
      <input type="search" id="search-input" class="search-input" placeholder="Search...">
      <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>
`;
search.insertAdjacentHTML('afterbegin',searchBarHTML);
const searchBox = document.getElementById('search-input');
const searchSubmit = document.getElementById('search-submit');

// Event Listeners

// This listener determines the activity of the three buttons created when a modal window
// is generated. If the close button is selected, the modal window is dynamically removed.
// If the next or previous buttons are selected, the listener examines an index value, which
// determines whether the user is already at the beginning/end of the employees. If not,
// a new modal window is generated for the next user along. If the modal window currently open
// is the first or last employee, the prev and next buttons respectively are disabled to prevent
// console errors.
document.addEventListener('click', (e) => {
  if (e.target === modalClose || e.target.nodeName === 'STRONG') {
    body.removeChild(modalContainer[0]);
  } else if (e.target === modalNext) {
      if(index < users.length-1) {
        body.removeChild(modalContainer[0]);
        index ++
        createModal(users[index]);
      } else if (index === users.length) {
        modalNext.disabled = true;
      };
  } else if (e.target === modalPrev) {
    if (index > 0) {
      body.removeChild(modalContainer[0]);
      index --
      createModal(users[index]);
    } else if (index === 0) {
      modalPrev.disabled = true;
    }
  };
});

// This event listener allows clicking the search button to call the performSearch() function.
searchSubmit.addEventListener('click', (e) => {
  e.preventDefault();
  searchReturn = performSearch(searchBox.value,users);
})

// This event listener allows for dynamic searching, updating the results everytime a key is hit.
searchBox.addEventListener('keyup', () => {
  searchReturn = performSearch(searchBox.value,users);
})
