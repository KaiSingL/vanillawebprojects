// for debug purpose
console.clear();

// define constants
const cinema = { row: 6, col: 8 };
const AVA = 0;
const OCP = 1;
let movieIndex = 0;

/////////////////////
// document query ///
/////////////////////

const container = document.querySelector(".container");
const seats = document.querySelectorAll(".row .seat:not(.occupied)");
const count = document.getElementById("count");
const total = document.getElementById("total");
const menu = document.getElementById("movie");
const info = document.getElementById("purchaseInfo");
const purchaseBtn = document.getElementById("purchaseBtn");
const modal = document.getElementById("myModal");
const modalTicketsInfo = document.getElementById("ticketsInfo");
const modalPrice = document.getElementById("totalPrice");
const confirmBtn = document.getElementById("confirmButton");

//////////////////
// define data  //
//////////////////

// Movie props
function Movie(name, ticketPrice, cinema) {
  this.name = name;
  this.ticketPrice = ticketPrice;
  this.seatArr = createSeatArr(+cinema.row, +cinema.col);
  this.setOccupied = (r, c) => {
    this.seatArr[r][c] = OCP;
  };
  this.isAvailable = (r, c) => {
    return seatArr[r][c] == AVA;
  };

  // seats Array props
  function createSeatArr(r, c) {
    seatArr = Array.from({ length: r }, () => new Array(c));
    // Initialize the 2D array to
    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        seatArr[i][j] = AVA;
      }
    }
    return this.seatArr;
  }
}

// create movies
const movie1 = new Movie("Avengers: Endgame", 10, cinema);
movie1.setOccupied(3, 2);
// movie1.setOccupied(0, 2);
// movie1.setOccupied(4, 6);
// movie1.setOccupied(4, 5);

const movie2 = new Movie("Joker", 12, cinema);
movie2.setOccupied(2, 6);
movie2.setOccupied(0, 4);
// movie2.setOccupied(5, 1);
// movie2.setOccupied(3, 4);

const movie3 = new Movie("Toy Story 4", 8, cinema);
movie3.setOccupied(1, 2);
movie3.setOccupied(4, 6);
movie3.setOccupied(5, 4);
movie3.setOccupied(3, 3);

const movie4 = new Movie("The Lion King", 9, cinema);
movie4.setOccupied(3, 2);
movie4.setOccupied(3, 3);
movie4.setOccupied(2, 6);
movie4.setOccupied(4, 5);

const movieList = [movie1, movie2, movie3, movie4];

// Update total and count
function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll(".row .seat.selected");

  const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));

  localStorage.setItem("selectedSeats", JSON.stringify(seatsIndex));

  const selectedSeatsCount = selectedSeats.length;
  if (selectedSeatsCount === 0) {
    hidePurchaseUI();
  } else {
    displayPurchaseUI();
  }

  count.innerText = selectedSeatsCount;
  total.innerText = selectedSeatsCount * +menu.value;

  // setMovieData(menu.selectedIndex, menu.value);
}

function displayPurchaseUI() {
  info.style.display = "block";
  purchaseBtn.style.display = "block";
}

function hidePurchaseUI() {
  info.style.display = "none";
  purchaseBtn.style.display = "none";
}

function initializeUI(index) {
  initializeOptions(index);
  initializeSeats(index);
}

function initializeOptions(movieIndex) {
  movieList.forEach((movie, index) => {
    const option = document.createElement("option");
    option.value = movie.ticketPrice;
    option.textContent = `${movie.name} ($${movie.ticketPrice})`;
    if (index === movieIndex) {
      option.selected = "selected";
    }
    menu.appendChild(option);
  });
}

function initializeSeats(index) {
  // remove everying inside the container
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  // add row and seats
  const movie = movieList[index];
  let row = movie.seatArr.length;
  let col = movie.seatArr[0].length;
  const numRow = document.createElement("div");
  numRow.classList.add("row");
  container.appendChild(numRow);
  const offset = document.createElement("div");
  offset.classList.add("rowNum");
  numRow.appendChild(offset);
  for (let c = 0; c < col; c++) {
    const colNum = document.createElement("div");
    colNum.classList.add("colNum");
    colNum.innerText = c + 1;
    numRow.appendChild(colNum);
  }
  for (let r = 0; r < row; r++) {
    const row = document.createElement("div");
    row.classList.add("row");
    container.appendChild(row);
    const rowNum = document.createElement("div");
    rowNum.classList.add("rowNum");
    rowNum.innerText = String.fromCodePoint(65 + r);
    row.appendChild(rowNum);
    for (let c = 0; c < col; c++) {
      const seat = document.createElement("div");
      seat.classList.add("seat");
      seat.setAttribute("data-row", r); // Add data-row attribute
      seat.setAttribute("data-col", c); // Add data-col attribute
      if (movie.seatArr[r][c] === OCP) {
        seat.classList.add("occupied");
      }
      row.appendChild(seat);
    }
  }
}

// Get data from localstorage and populate UI
function populateUI() {
  const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));

  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add("selected");
      }
    });
  }

  const selectedMovieIndex = localStorage.getItem("selectedMovieIndex");

  if (selectedMovieIndex !== null) {
    menu.selectedIndex = selectedMovieIndex;
  }
}

function getSelectedSeats() {
  const seatElements = container.querySelectorAll(".seat");
  const selectedSeats = [];

  seatElements.forEach((seat) => {
    if (seat.classList.contains("selected")) {
      const row = parseInt(seat.getAttribute("data-row"), 10);
      const col = parseInt(seat.getAttribute("data-col"), 10);
      selectedSeats.push({ row, col });
    }
  });

  return selectedSeats;
}

function saveMoveData(index) {
  const movie = movieList[index];
  const seats = getSelectedSeats();
  seats.forEach((seat) => {
    movie.setOccupied(seat.row, seat.col);
  });
}

function updateTicketInfo() {
  const seats = getSelectedSeats();
  modalTicketsInfo.innerHTML = "";
  seats.forEach((seat) => {
    const ticket = document.createElement("div");
    ticket.innerText = `${String.fromCodePoint(65 + seat.row)}${
      seat.col + 1
    } - $${menu.value}`;
    ticket.classList.add("ticket");
    modalTicketsInfo.appendChild(ticket);
  });
}

////////////////////
// Event Listener //
////////////////////

// Movie select event
menu.addEventListener("change", () => {
  ticketPrice = +menu.value;
  movieIndex = +menu.selectedIndex;
  initializeSeats(movieIndex);

  updateSelectedCount();
});

// Seat click event
container.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("seat") &&
    !e.target.classList.contains("occupied")
  ) {
    e.target.classList.toggle("selected");

    updateSelectedCount();
  }
});

// purchase click event
purchaseBtn.addEventListener("click", () => {
  modalPrice.innerText = `The total price is $${+total.innerText}`;
  updateTicketInfo();
  // Show the modal
  modal.style.display = "flex";
});

// confirm purchase click event
confirmBtn.addEventListener("click", (e) => {
  saveMoveData(movieIndex);
  modal.style.display = "none";
  initializeSeats(movieIndex);
  window.alert("Thank you for purchase!");
});

// dismiss modal when click outside the modal
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

////////////////////
// Initialization //
////////////////////

initializeUI(movieIndex);
updateSelectedCount();
