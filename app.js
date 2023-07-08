//global variables
const movieListEl = document.querySelector(".movie__list");
let movieList = [];
let filteredList = [];
let search = "";

//searches moves when form is submitted
async function searchMovies(event) {
  event.preventDefault();
  possibleNewSearch = event.target[0].value;

  //if there's a new search, load the spinner
  if (search != possibleNewSearch) {
          
    movieListEl.innerHTML = `<i class="fas fa-spinner movies__loading--spinner"></i>`
    movieListEl.classList += " movies__loading";
    await timeout(1000);

    //search is now new search
    search = possibleNewSearch;

    //fetch api promise
    const movies = await fetch(
      `http://www.omdbapi.com/?i=tt3896198&apikey=49913df9&s=${search}`
    );

    //grab json data
    const moviesData = await movies.json();

    movieListEl.classList.remove("movies__loading");
    movieList = moviesData.Search;
    console.log(movieList)

    //if no movies were found (if movieList is empty or falsy)
    if(!movieList){
      movieListEl.innerHTML = `<p class="no__movies">No movies found...</p>`
      return
    }

    

    //else, call filter function with no filter argument to set movieListEl.innerHTML
    movieListFilter(null);
  }
}

//"stops" execution inside getMovies() and also makes loading screen delay possible
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//applies filters to movieList if given
function movieListFilter(filter) {
  //if there's a filter, apply it
  if (filter) {
    //first creates sorted list by old to new
    filteredList = movieList.sort((a, b) => {
      if (a.Year > b.Year) return 1;
      if (b.Year > a.Year) return -1;
      return 0;
    });

    //if user requests old to new, assign sorted list to movieList
    if (filter === "Old to New") {
      movieList = filteredList;
    } else {
      // "New to Old" : return sorted list in reverse to movieList
      movieList = filteredList.reverse();
    }
  }

  //set innerHTML
  movieListEl.innerHTML = movieList.map((movie) => movieHTML(movie)).join("");
}

//template for each movie inside movieList
function movieHTML(movie) {
  return `<div class="movie">
  <div class="movie__img--wrapper">
  <img src="${movie.Poster}"
   alt="Movie Poster Not Available!" class="movie__img">
   </div>
   <div class="movie__description">
   <p class="movie__title"> ${movie.Title} </p>
   <p class="movie__year"> ${movie.Year} </p>
   </div>
</div>`;
}

//takes in filter when select is used
function filterMovie(event) {
  let filter = event.target.value;

  movieListFilter(filter);
}
