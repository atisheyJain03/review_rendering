var isData = true;
let pageNumber = 1;
let totalPages;
let cardsDiv;
var loading = ` 
<div class="loader">
    <div class="loader loader-1">
    <div class="loader-outter"></div>
    <div class="loader-inner"></div>
    </div>
</div>`;

const pagination = `
<div class="pagination">
  <a class="btn pagination-btn" id = "btn-prev">prev</a>
  <p class="pagination-page-number" >1</p>
  <a class="btn pagination-btn" id = "btn-next">next</a>
</div>
`;

const reviewCard = `<div class="card">
<div class="card-top">
  <div class="name">
    <div class="img one" alt="">NF</div>
    <div>
      <div class="rate">
        {{ratingStar}}
      </div>
        <p>{{full name}}</p>    
    </div>
  </div>
</div>

<div class="card-content">
  <h2 class="card-content-heading">{{heading}}</h2>
  <p>{{description}}</p>
</div>

<div class="card-action">
  <span>{{date}}</span>
</div>
</div>`;

const ratingStarsChecked = '<span class="fa fa-star checked"></span>';
const ratingStarsUnchecked = '<span class="fa fa-star"></span>';

const eventListeners = () => {
  console.log(totalPages);
  document.getElementById("btn-prev").addEventListener("click", (event) => {
    document.getElementById("btn-next").style.visibility = "visible";
    if (pageNumber > 1) {
      pageNumber--;
      if (pageNumber == 1) {
        document.getElementById("btn-prev").style.visibility = "hidden";
      }
      document.querySelector(".pagination-page-number").innerHTML = pageNumber;
      getData();
    } else alert("no more data");
  });

  document.getElementById("btn-next").addEventListener("click", (event) => {
    console.log("btn-next");
    document.getElementById("btn-prev").style.visibility = "visible";
    pageNumber++;
    if (pageNumber >= totalPages) {
      document.getElementById("btn-next").style.visibility = "hidden";
    }
    document.querySelector(".pagination-page-number").innerHTML = pageNumber;
    getData();
  });
};

function init() {
  cardsDiv = document.createElement("DIV");
  cardsDiv.className = "cards";
  document
    .querySelector("body")
    .insertBefore(cardsDiv, document.querySelector("footer"));

  const bodyData = { isPublished: true };

  fetch(`http://127.0.0.1:8080/api/v1/review/reviewCount/www.facebook.com`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(bodyData),
  })
    .then(function (response) {
      if (response.status !== 200) {
        console.log(
          "Looks like there was a problem. Status Code: " + response.status
        );
        return;
      }
      // Examine the text in the response
      response.json().then(function (data) {
        console.log("**************");
        totalPages = Math.ceil(data.length / 5);
        document
          .querySelector("footer")
          .insertAdjacentHTML("beforebegin", pagination);
        getData();
        eventListeners();
      });
    })
    .catch((error) => console.log(error));
}

init();

const createReviewHtml = (reviews) => {
  if (!reviews) {
    isData = false;
    cardsDiv.innerHTML = "<h1>No more Reviews</h1>";
    document.getElementById("btn-next").style.display = "none";
    return;
  }
  cardsDiv.innerHTML = loading;
  let script = "";
  for (let i = 0; i < reviews.length; i++) {
    let review = reviewCard.replace("{{full name}}", reviews[i].customerName);
    let rate = "";

    for (let j = 1; j <= 5; j++) {
      if (j <= reviews[i].rating) rate += ratingStarsChecked;
      else {
        rate += ratingStarsUnchecked;
      }
    }
    review = review.replace("{{ratingStar}}", rate);
    review = review.replace("{{date}}", reviews[i].createdAt);
    review = review.replace("{{description}}", reviews[i].description);
    review = review.replace("{{heading}}", reviews[i].heading);
    script += review;
  }
  cardsDiv.innerHTML = script;
};

const getData = () => {
  cardsDiv.innerHTML = loading;
  fetch(
    `http://127.0.0.1:8080/api/v1/review/fetchReviews/www.facebook.com?page=${pageNumber}&limit=5`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    }
  )
    .then(function (response) {
      if (response.status !== 200) {
        console.log(
          "Looks like there was a problem. Status Code: " + response.status
        );
        return;
      }

      // Examine the text in the response
      response.json().then(function (data) {
        console.log(data.data.reviews);
        createReviewHtml(data.data.reviews);
      });
    })
    .catch((error) => console.log(error));
};
