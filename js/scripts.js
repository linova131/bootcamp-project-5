
const body = document.querySelector('body');
const search = document.querySelector('search-container');
const gallery = document.getElementById('gallery');
let cards = [];
let modalButton;
let modalContainer;
let users = [];

// Fetch random users

fetch('https://randomuser.me/api/?results=12&nat=us')
  .then(data => data.json())
  .then(results => {
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
    const cardCollection = document.getElementsByClassName('card');
    
    for (let i=0; i<cardCollection.length; i++) {
      cards.push(cardCollection[i]);
    };
  })
  .then(() => {
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        const index = cards.indexOf(card);
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
    </div>`;
  gallery.insertAdjacentHTML('afterend', modalHTML);
  modalButton = document.getElementById('modal-close-btn');
  modalContainer = document.getElementsByClassName('modal-container');
}

//Event Listeners

document.addEventListener('click', (e) => {
  if (e.target.nodeName === 'STRONG') {
    body.removeChild(modalContainer[0]);
  };
});

