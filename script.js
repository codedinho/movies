const APIURL =
    "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=03cab8d210313d38cea2863da37f0978&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
    "https://api.themoviedb.org/3/search/movie?&api_key=03cab8d210313d38cea2863da37f0978&query=";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
let popularMovies = []; // Declare popularMovies variable here
let topRatedMovies = []; // Declare popularMovies variable here


// initially get fav movies
getMovies();

async function getMovies() {
    console.log("Fetching movies...");

    // Fetch popular movies
    const popularMoviesUrl =
        "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=03cab8d210313d38cea2863da37f0978&page=1";
    const popularMoviesResponse = await fetch(popularMoviesUrl);
    const popularMoviesData = await popularMoviesResponse.json();
    popularMovies = popularMoviesData.results.slice(0, 25); // Update the global variable

    // Fetch new releases (you can modify the API endpoint accordingly)
    const newReleasesUrl =
        "https://api.themoviedb.org/3/discover/movie?sort_by=release_date.desc&api_key=03cab8d210313d38cea2863da37f0978&page=1";
    let page = 1;
    let newReleases = [];

    // Fetch new releases until you have at least 25 movies
    while (newReleases.length < 25) {
        const newReleasesResponse = await fetch(`${newReleasesUrl}&page=${page}`);
        const newReleasesData = await newReleasesResponse.json();
        const newMovies = newReleasesData.results;

        // If there are no more movies, break the loop
        if (newMovies.length === 0) {
            break;
        }

        // Add new movies to the newReleases array
        newReleases = [...newReleases, ...newMovies];
        page++;
    }
    

        // Find a random movie rated over 8
        const eligibleMovies = popularMovies.concat(topRatedMovies).filter(movie => movie.vote_average > 7);

        if (eligibleMovies.length > 0) {
            const randomIndex = Math.floor(Math.random() * eligibleMovies.length);
            const filmOfTheDay = eligibleMovies[randomIndex];
    
            const filmOfTheDayContainer = document.getElementById("film-of-the-day");
            const { backdrop_path, title, overview, release_date } = filmOfTheDay;
            
            const backdropPath = backdrop_path ? `${IMGPATH}${backdrop_path}` : ''; // Construct the backdrop image URL
            
            const releaseYear = release_date ? new Date(release_date).getFullYear() : 'N/A';
            
            const filmOfTheDayHTML = `
                <div class="movie-banner-container">
                    <div class="overlay">
                        <h1 class="movie-title">${title}</h1>
                        <p class="movie-release-date"><b>${releaseYear}</b></p>
                    </div>
                    <img src="${backdropPath}" alt="${title}" class="backdrop-image" />
                </div>
            `;
            

            filmOfTheDayContainer.innerHTML = filmOfTheDayHTML;

            
        } else {
            // Handle the case when no eligible movies are found
            const filmOfTheDayContainer = document.getElementById("film-of-the-day");
            filmOfTheDayContainer.innerHTML = "No movies found for today.";
        }

    // Slice the array to get the top 25 new releases
    newReleases = newReleases.slice(0, 25);

    // Fetch top rated movies
    const topRatedMoviesUrl =
        "https://api.themoviedb.org/3/movie/top_rated?api_key=03cab8d210313d38cea2863da37f0978&page=1";
    const topRatedMoviesResponse = await fetch(topRatedMoviesUrl);
    const topRatedMoviesData = await topRatedMoviesResponse.json();
    topRatedMovies = topRatedMoviesData.results.slice(0, 25); // Get the top 25 top-rated movies

    // Fetch upcoming movies
    const upcomingMoviesUrl =
        "https://api.themoviedb.org/3/movie/upcoming?api_key=03cab8d210313d38cea2863da37f0978&page=1";
    const upcomingMoviesResponse = await fetch(upcomingMoviesUrl);
    const upcomingMoviesData = await upcomingMoviesResponse.json();
    const upcomingMovies = upcomingMoviesData.results.slice(0, 25); // Get the top 25 upcoming movies

    // Create a row for popular movies
    const popularMoviesRow = createMovieRow("Popular Movies", popularMovies);

    // Create a row for new releases
    const newReleasesRow = createMovieRow("New Releases", newReleases);

    // Create a row for top-rated movies
    const topRatedMoviesRow = createMovieRow("Top Rated", topRatedMovies);

    // Create a row for upcoming movies
    const upcomingMoviesRow = createMovieRow("Upcoming Movies", upcomingMovies);

    // Append rows to the main container
    main.appendChild(popularMoviesRow);
    main.appendChild(topRatedMoviesRow);
    main.appendChild(upcomingMoviesRow);
}


function createMovieRow(title, movies) {
    const row = document.createElement("div");
    row.classList.add("movie-row");

    const rowTitle = document.createElement("h2");
    rowTitle.innerText = title;
    row.appendChild(rowTitle);

    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");

    movies.forEach((movie) => {
        const { poster_path, title, overview, vote_average } = movie;

        // Skip movies without a poster image
        if (!poster_path) {
            return;
        }

        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");

        // Set background image and styles for the movie element
        movieEl.style.backgroundImage = `url(${IMGPATH + poster_path})`;
        movieEl.style.backgroundSize = "cover";
        movieEl.style.backgroundPosition = "center";
        movieEl.title = title; // Set the title as the tooltip

        const ratingEl = document.createElement("div");
        ratingEl.classList.add("movie-rating");

        // Set rating text and color based on the value
        ratingEl.innerText = vote_average.toFixed(1);
        if (vote_average > 8) {
            ratingEl.style.color = "gold"; // Set color to gold for ratings above 8
        } else if (vote_average > 5) {
            ratingEl.style.color = "white"; // Set color to white for ratings above 5
        } else {
            ratingEl.style.color = "red"; // Set color to red for ratings below or equal to 5
        }

        movieEl.appendChild(ratingEl);

        // Attach event listener to the movie element
        movieEl.addEventListener("click", () => openPopup(title));

        movieContainer.appendChild(movieEl);
    });

    row.appendChild(movieContainer);
    return row;
}


async function showMovies(movies) {
    // clear main
    main.innerHTML = "";

    for (const movie of movies) {
        const { poster_path, title, vote_average, overview, release_date } = movie;

        // Skip movies without a poster image
        if (!poster_path) {
            continue;
        }

        const movieId = movie.id;

        // Fetch runtime information
        const runtime = await fetchMovieDetails(movieId);

        // Round the vote_average to 1 decimal place
        const roundedRating = vote_average.toFixed(1);

        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");

        // Format the release date to show only the year
        const releaseYear = release_date ? new Date(release_date).getFullYear() : 'N/A';

        movieEl.innerHTML = `
        <img
            src="${IMGPATH + poster_path}"
            alt="${title}"
        />
        <div class="overview">
            <h3>${title}</h3>
            <p>${overview}</p>
            <p style="text-align: right;"><strong>${releaseYear}</strong></p>
        </div>
    `;

        // Attach event listener to the movie element
        movieEl.addEventListener("click", () => openPopup(title));

        main.appendChild(movieEl);
    }
}

function getClassByRate(vote) {
    if (vote >= 8) {
        return "green";
    } else if (vote >= 5) {
        return "orange";
    } else {
        return "red";
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchTerm = search.value;

    if (searchTerm) {
        const searchUrl = SEARCHAPI + searchTerm;
        const resp = await fetch(searchUrl);
        const respData = await resp.json();
        showMovies(respData.results);

        search.value = "";
    }
});

async function fetchMovieDetails(movieTitle) {
    const apiKey = "03cab8d210313d38cea2863da37f0978"; // Replace with your actual API key
    const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}`;

    async function getMovieDetails(movieId) {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=03cab8d210313d38cea2863da37f0978`);
        const data = await response.json();
        return data.runtime;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Check if there are any results
        if (data.results && data.results.length > 0) {
            // Get the movieId of the first movie in the results (you can customize this based on your API response structure)
            const movieId = data.results[0].id;
            // Get the runtime using the getMovieDetails function
            const runtime = await getMovieDetails(movieId);
            // Return the details of the first movie along with runtime
            return { ...data.results[0], runtime };
        } else {
            // Handle the case when no movie details are found
            return null;
        }
    } catch (error) {
        console.error("Error fetching movie details:", error);
        // Handle errors, e.g., show an error message to the user
        return null;
    }
}

// Named function for the Watch Trailer button click event
function handleWatchTrailerClick(searchQuery) {
    window.open(`https://www.youtube.com/results?search_query=${searchQuery}`);
}

// Inside your handleAddToFavouritesClick function
function handleAddToFavouritesClick() {
    const addToFavouritesButton = document.getElementById("addToFavouritesButton");

    // Toggle the "clicked" class on the addToFavouritesButton element
    addToFavouritesButton.classList.toggle("clicked");

    // Change the button image based on its state
    const buttonImage = addToFavouritesButton.querySelector("img");
    if (addToFavouritesButton.classList.contains("clicked")) {
        // If the button is in the clicked state, change the image to remove-favourites.png
        buttonImage.src = "./assets/icons/remove-favourites.png";

        // Add logic here for adding film to favorites
        // addFilmToFavourites();
    } else {
        // If the button is not in the clicked state, revert the image to add-favourites.png
        buttonImage.src = "./assets/icons/add-favourites.png";

        // Add logic here for removing film from favorites
        // removeFilmFromFavourites();
    }
}


// Function to open the popup window with movie details and trailer
async function openPopup(movieTitle) {
    const popup = document.getElementById("moviePopupWindow");
    const popupContent = popup.querySelector(".popup-content");
    const movieInfoDiv = popupContent.querySelector("#movie-info-popup"); // New div for movie information
    // Fetch movie details from your data source (e.g., API call) based on movieTitle
    // Replace the following line with your actual API call to fetch movie details
    const movieDetails = await fetchMovieDetails(movieTitle);
    const watchTrailerButton = document.getElementById("watchTrailerButton");
    const addToFavouritesButton = document.getElementById("addToFavouritesButton");
    const releaseYear = movieDetails.release_date ? new Date(movieDetails.release_date).getFullYear() : 'N/A';

    // Construct YouTube search query for the official trailer
    searchQuery = `${movieDetails.title} official trailer`;
    

    // Populate movie information in the movieInfoDiv with the backdrop image as background
    movieInfoDiv.style.backgroundImage = `url('${IMGPATH + movieDetails.backdrop_path}')`;
    // Check if the screen width is less than or equal to 767 pixels (considered as a mobile device)
    if (window.innerWidth <= 767) {
        movieInfoDiv.style.backgroundSize = 'cover';
        movieInfoDiv.style.height = '500px'; // Set the background height to 500px on mobile devices
        movieInfoDiv.style.backgroundPosition = 'center';
        movieInfoDiv.style.color = '#ffffff';
        movieInfoDiv.style.position = 'relative';
    }
    else {
        // For larger screens, set different styles or use default values
        movieInfoDiv.style.backgroundSize = 'cover';
        movieInfoDiv.style.height = '2000px';
        movieInfoDiv.style.backgroundPosition = 'center';
        movieInfoDiv.style.color = '#ffffff';
        movieInfoDiv.style.position = 'relative';
    }

    // Set display to flex and use flex-direction, justify-content, and align-items properties for centering
    movieInfoDiv.style.display = 'flex';
    movieInfoDiv.style.flexDirection = 'column';
    movieInfoDiv.style.justifyContent = 'center';
    movieInfoDiv.style.alignItems = 'center';

    movieInfoDiv.innerHTML = `
        <h1>${movieDetails.title}</h1>
        <p><b>${releaseYear} &bull; ${movieDetails.runtime}m</b></p>
        <p>${movieDetails.overview}</p>
    `;

    // Create a pseudo-element for the fading effect
    const fadingOverlay = document.createElement('div');
    fadingOverlay.classList.add('fading-overlay'); // Add a CSS class for styling

    // Append the fading overlay element to the movieInfoDiv
    movieInfoDiv.appendChild(fadingOverlay);

    // Create a pseudo-element for the vignette effect
    const vignette = document.createElement('div');
    vignette.classList.add('vignette'); // Add a CSS class for styling

    // Append the vignette element to the movieInfoDiv
    movieInfoDiv.appendChild(vignette);

    // Remove previous event listeners (if any)
    if (watchTrailerButton) {
        watchTrailerButton.removeEventListener("click", handleWatchTrailerClick);
    }
    if (addToFavouritesButton) {
        addToFavouritesButton.removeEventListener("click", handleAddToFavouritesClick);
    }

    // Assign the buttons to the global variables

    // Add event listeners using named functions
    watchTrailerButton.addEventListener("click", () => {
        handleWatchTrailerClick(searchQuery);
    });

    addToFavouritesButton.addEventListener("click", () => {
        handleAddToFavouritesClick();
    });

    // Display the popup
    popup.style.display = "flex";
}
    // Change the button image based on its state
    const buttonImage = addToFavouritesButton.querySelector("img");
    if (addToFavouritesButton.classList.contains("clicked")) {
        // If the button is in the clicked state, change the image to remove-favourites.png
        buttonImage.src = "./assets/icons/remove-favourites.png";

        // Add logic here for adding film to favorites
        // addFilmToFavourites();
    } else {
        // If the button is not in the clicked state, revert the image to add-favourites.png
        buttonImage.src = "./assets/icons/add-favourites.png";

        // Add logic here for removing film from favorites
        // removeFilmFromFavourites();
    }


// Add event listener for the "keydown" event on the document
document.addEventListener("keydown", function(event) {
    // Check if the pressed key is "Esc" (keyCode 27)
    if (event.keyCode === 27) {
        // Call the closePopup function to close the popup window
        closePopup();
    }
});

// Function to close the popup window
function closePopup() {
    // Check if the buttons are defined before removing event listeners
    if (watchTrailerButton && addToFavouritesButton) {
        // Remove event listeners
        watchTrailerButton.removeEventListener("click", handleWatchTrailerClick);
        addToFavouritesButton.removeEventListener("click", handleAddToFavouritesClick);
    }

    document.getElementById("moviePopupWindow").style.display = "none";
}


document.addEventListener("DOMContentLoaded", function() {
    const sidebar = document.querySelector('.sidebar-icon');
    const sidebarMenu = document.querySelector('.sidebar-menu');
    const menuIcon = document.querySelector('.menu-icon');

    menuIcon.addEventListener('click', function() {
        sidebar.classList.toggle('open');
        sidebarMenu.classList.toggle('open');

        if (sidebar.classList.contains('open')) {
            sidebarMenu.style.display = 'flex';
        } else {
            // Add a transitionend event listener to detect when the transition ends
            sidebarMenu.addEventListener('transitionend', function() {
                // Check if the sidebar is closed completely before setting display to 'none'
                if (!sidebar.classList.contains('open')) {
                    sidebarMenu.classList.toggle('closed');
                }
            });

            sidebarMenu.classList.toggle('closed');
        }
    });
});