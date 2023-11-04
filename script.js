//This site uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.

const ACTION_GENRE_ID = 28;
const ACTION_GENRE_NAME = 'Action';

const ADVENTURE_GENRE_ID = 12;
const ADVENTURE_GENRE_NAME = 'Adventure';

const ANIMATION_GENRE_ID = 16;
const ANIMATION_GENRE_NAME = 'Animation';

const COMEDY_GENRE_ID = 35;
const COMEDY_GENRE_NAME = 'Comedy';

const CRIME_GENRE_ID = 80;
const CRIME_GENRE_NAME = 'Crime';

const DOCUMENTARY_GENRE_ID = 99;
const DOCUMENTARY_GENRE_NAME = 'Documentary';

const DRAMA_GENRE_ID = 18;
const DRAMA_GENRE_NAME = 'Drama';

const FAMILY_GENRE_ID = 10751;
const FAMILY_GENRE_NAME = 'Family';

const FANTASY_GENRE_ID = 14;
const FANTASY_GENRE_NAME = 'Fantasy';

const HISTORY_GENRE_ID = 36;
const HISTORY_GENRE_NAME = 'History';

const HORROR_GENRE_ID = 27;
const HORROR_GENRE_NAME = 'Horror';

const MUSIC_GENRE_ID = 10402;
const MUSIC_GENRE_NAME = 'Music';

const MYSTERY_GENRE_ID = 9648;
const MYSTERY_GENRE_NAME = 'Mystery';

const ROMANCE_GENRE_ID = 10749;
const ROMANCE_GENRE_NAME = 'Romance';

const SCIENCE_FICTION_GENRE_ID = 878;
const SCIENCE_FICTION_GENRE_NAME = 'Science Fiction';

const TV_MOVIE_GENRE_ID = 10770;
const TV_MOVIE_GENRE_NAME = 'TV Movie';

const THRILLER_GENRE_ID = 53;
const THRILLER_GENRE_NAME = 'Thriller';

const WAR_GENRE_ID = 10752;
const WAR_GENRE_NAME = 'War';

const WESTERN_GENRE_ID = 37;
const WESTERN_GENRE_NAME = 'Western';

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

async function updateFilmOfTheDay(movieId) {
    console.log("Updating film of the day...");

    try {
        // Fetch the details of the specific movie using its TMDB ID
        const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=03cab8d210313d38cea2863da37f0978`;
        const movieDetailsResponse = await fetch(movieDetailsUrl);
        const movieDetailsData = await movieDetailsResponse.json();

        // Check if the response contains valid movie details
        if (movieDetailsData.id) {
            const filmOfTheDayContainer = document.getElementById("film-of-the-day");
            const { backdrop_path, title, overview, release_date } = movieDetailsData;
            const backdropPath = backdrop_path ? `${IMGPATH}${backdrop_path}` : ''; // Construct the backdrop image URL
            const releaseYear = release_date ? new Date(release_date).getFullYear() : 'N/A';

            const filmOfTheDayHTML = `
                <div class="movie-banner-container">
                    <div class="overlay">
                        <h1 class="movie-title">${title}</h1>
                        <p class="movie-release-date"><b>${releaseYear}</b></p>
                        <div class="button-container">
                            <button class="watchTrailerButton">
                                <img src="./assets/icons/youtube.png" alt="YouTube Icon">
                            </button>
                            <button class="addToFavouritesButton">
                                <img src="./assets/icons/add-favourites.png" alt="Add to Favorites Icon">
                            </button>
                            <button class="addToPlaylistButton">
                                <img src="./assets/icons/add-white.png" alt="Add to Playlist Icon">
                            </button>
                        </div>
                    </div>
                    <img src="${backdropPath}" alt="${title}" class="backdrop-image" />
                </div>
            `;

            filmOfTheDayContainer.innerHTML = filmOfTheDayHTML;
        } else {
            // Handle the case when no movie details are found for the specified ID
            const filmOfTheDayContainer = document.getElementById("film-of-the-day");
            filmOfTheDayContainer.innerHTML = "No movie found for today.";
        }
    } catch (error) {
        console.error("Error fetching movie details:", error);
        // Handle errors, e.g., show an error message to the user
        const filmOfTheDayContainer = document.getElementById("film-of-the-day");
        filmOfTheDayContainer.innerHTML = "Error fetching movie details.";
    }
}


async function getMovies() {
    console.log("Fetching movies...");

    // Fetch popular movies
    const popularMoviesUrl =
        "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=03cab8d210313d38cea2863da37f0978&page=1";
    const popularMoviesResponse = await fetch(popularMoviesUrl);
    const popularMoviesData = await popularMoviesResponse.json();
    let popularMovies = popularMoviesData.results;
    popularMovies = await fetchAllPages(popularMoviesUrl, popularMovies);

    // Fetch top-rated movies
    const topRatedMoviesUrl =
        "https://api.themoviedb.org/3/movie/top_rated?api_key=03cab8d210313d38cea2863da37f0978&page=1";
    const topRatedMoviesResponse = await fetch(topRatedMoviesUrl);
    const topRatedMoviesData = await topRatedMoviesResponse.json();
    let topRatedMovies = topRatedMoviesData.results;
    topRatedMovies = await fetchAllPages(topRatedMoviesUrl, topRatedMovies);

    // Fetch upcoming movies
    const upcomingMoviesUrl =
        "https://api.themoviedb.org/3/movie/upcoming?api_key=03cab8d210313d38cea2863da37f0978&page=1";
    const upcomingMoviesResponse = await fetch(upcomingMoviesUrl);
    const upcomingMoviesData = await upcomingMoviesResponse.json();
    let upcomingMovies = upcomingMoviesData.results;
    upcomingMovies = await fetchAllPages(upcomingMoviesUrl, upcomingMovies);

    // Create a row for popular movies
    const popularMoviesRow = createMovieRow("Popular", popularMovies);

    // Create a row for top-rated movies
    const topRatedMoviesRow = createMovieRow("Top Rated", topRatedMovies);

    // Create a row for upcoming movies
    const upcomingMoviesRow = createMovieRow("Upcoming", upcomingMovies);

    // Usage: Call updateFilmOfTheDay function with the specific TMDB movie ID
    const FILM_OF_THE_DAY_ID = "354912"; // Replace this with the desired TMDB movie ID
    updateFilmOfTheDay(FILM_OF_THE_DAY_ID);

    // Append rows to the main container
    main.appendChild(popularMoviesRow);
    main.appendChild(topRatedMoviesRow);
    main.appendChild(upcomingMoviesRow);
    // Fetch and display movies for different genres
    getMoviesByGenre(ACTION_GENRE_ID, ACTION_GENRE_NAME);
    getMoviesByGenre(ADVENTURE_GENRE_ID, ADVENTURE_GENRE_NAME);
    getMoviesByGenre(ANIMATION_GENRE_ID, ANIMATION_GENRE_NAME);
    getMoviesByGenre(COMEDY_GENRE_ID, COMEDY_GENRE_NAME);
    getMoviesByGenre(SCIENCE_FICTION_GENRE_ID, SCIENCE_FICTION_GENRE_NAME);
    getMoviesByGenre(ROMANCE_GENRE_ID, ROMANCE_GENRE_NAME);
    getMoviesByGenre(FAMILY_GENRE_ID, FAMILY_GENRE_NAME);
    getMoviesByGenre(FANTASY_GENRE_ID, FANTASY_GENRE_NAME);
    getMoviesByGenre(HORROR_GENRE_ID, HORROR_GENRE_NAME);
    getMoviesByGenre(THRILLER_GENRE_ID, THRILLER_GENRE_NAME);
    getMoviesByGenre(MYSTERY_GENRE_ID, MYSTERY_GENRE_NAME);
    getMoviesByGenre(DRAMA_GENRE_ID, DRAMA_GENRE_NAME);
    getMoviesByGenre(MUSIC_GENRE_ID, MUSIC_GENRE_NAME);
    getMoviesByGenre(WAR_GENRE_ID, WAR_GENRE_NAME);
    getMoviesByGenre(WESTERN_GENRE_ID, WESTERN_GENRE_NAME);
    getMoviesByGenre(HISTORY_GENRE_ID, HISTORY_GENRE_NAME);
    }

    // Define a set to keep track of added movie IDs
    const addedMovieIds = new Set();

    async function getMoviesByGenre(genreId, genreName) {
        console.log(`Fetching highest rated movies in genre ${genreName}...`);

        let allGenreMovies = [];
        let currentPage = 1;

        while (allGenreMovies.length < 50) {
            const genreMoviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=03cab8d210313d38cea2863da37f0978&with_genres=${genreId}&page=${currentPage}`;
            const genreMoviesResponse = await fetch(genreMoviesUrl);
            const genreMoviesData = await genreMoviesResponse.json();
            const genreMovies = genreMoviesData.results;

            // Filter out movies that are already added to the main container
            const newGenreMovies = genreMovies.filter(movie => !addedMovieIds.has(movie.id));

            // Append the current page's new movies to the allGenreMovies array
            allGenreMovies = allGenreMovies.concat(newGenreMovies);

            // Add the new movie IDs to the set
            newGenreMovies.forEach(movie => addedMovieIds.add(movie.id));

            // If there are more pages, increment the current page, else break the loop
            if (genreMoviesData.page < genreMoviesData.total_pages) {
                currentPage++;
            } else {
                break;
            }
        }

        // Get the top 50 highest rated movies for each genre
        const topRatedMovies = allGenreMovies.slice(0, 50);

        // Create a row for genre movies with the genre name as the title
        const genreMoviesRow = createMovieRow(`${genreName}`, topRatedMovies);

        // Append the row to the main container
        main.appendChild(genreMoviesRow);
    }


    // Function to fetch all pages of movie data
    async function fetchAllPages(url, movies) {
        let currentPage = 1;

        while (movies.length < 50) {
            const nextPageUrl = `${url}&page=${currentPage + 1}`;
            const nextPageResponse = await fetch(nextPageUrl);
            const nextPageData = await nextPageResponse.json();
            const nextPageMovies = nextPageData.results;

            if (nextPageMovies.length === 0) {
                break; // No more pages, exit the loop
            }

            movies = movies.concat(nextPageMovies);
            currentPage++;
        }

        return movies.slice(0, 50);
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

        // Create a star element
        const starEl = document.createElement("span");
        starEl.innerText = " ★"; // Unicode character for a star
        starEl.style.color = "gold"; // Set star color to gold
        // Apply flexbox to center the text and the star vertically and adjust spacing along the main axis
        ratingEl.style.display = "flex";
        ratingEl.style.alignItems = "center";
        ratingEl.style.justifyContent = "center"; // Center the content horizontally

        // Move the star up a few pixels by adding margin-bottom
        starEl.style.marginBottom = "2px"; // Adjust the value as needed
        starEl.style.paddingLeft = "4px"; // Adjust the value as needed
        

        // Append rating and star elements to the movie element
        ratingEl.appendChild(starEl);
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
    clearMovies();

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

// Get the back button element
const backButton = document.getElementById("backButton");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchTerm = search.value;

    if (searchTerm) {
        const searchUrl = SEARCHAPI + searchTerm;
        const resp = await fetch(searchUrl);
        const respData = await resp.json();
        showMovies(respData.results);

        search.value = "";

        // Switch to the Home tab when the form is submitted
        switchTab('homeTab', 'homeSection');

        // Show the back button
        backButton.style.display = "block";
    }
});

// Function to clear the main element content
function clearMovies() {
    main.innerHTML = "";
}

// Add click event listener for the back button
backButton.addEventListener("click", () => {
    // Clear the searched movies
    clearMovies();

    // Call getMovies function to reset the page
    getMovies();

    // Switch to the Home tab
    switchTab('homeTab', 'homeSection');

    // Hide the back button again
    backButton.style.display = "none";
});

const homeButton = document.getElementById("homeButton");
homeTab.addEventListener("click", () => {
    // Clear the existing movies
    clearMovies();

    // Get and display the default movies
    getMovies();

    // Hide the back button
    backButton.style.display = "none";

    // Switch to the Home tab
    switchTab('homeTab', 'homeSection');
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

// Inside your handleAddToFavouritesClick function
function handleAddToPlaylistClick() {
    return;
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
    const addToPlaylistButton = document.getElementById("addToPlaylistButton");
    const addToFavouritesButton = document.getElementById("addToFavouritesButton");
    const releaseYear = movieDetails.release_date ? new Date(movieDetails.release_date).getFullYear() : 'N/A';

    // Construct YouTube search query for the official trailer
    searchQuery = `${movieDetails.title} official trailer`;
    

    // Populate movie information in the movieInfoDiv with the backdrop image as background
    movieInfoDiv.style.backgroundImage = `url('${IMGPATH + movieDetails.backdrop_path}')`;
    // Check if the screen width is less than or equal to 767 pixels (considered as a mobile device)
    if (window.innerWidth <= 767) {
        movieInfoDiv.style.backgroundSize = 'cover';
        movieInfoDiv.style.height = '650px'; // Set the background height to 500px on mobile devices
        movieInfoDiv.style.backgroundPosition = 'center';
        movieInfoDiv.style.color = '#ffffff';
        movieInfoDiv.style.position = 'relative';
    }
    else {
        // For larger screens, set different styles or use default values
        movieInfoDiv.style.backgroundSize = 'cover';
        movieInfoDiv.style.height = '425px';
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


    // Assign the buttons to the global variables

    // Add event listeners using named functions
    watchTrailerButton.addEventListener("click", () => {
        handleWatchTrailerClick(searchQuery);
    });

    addToFavouritesButton.addEventListener("click", () => {
        handleAddToFavouritesClick();
    });

    // Add event listeners using named functions
    addToPlaylistButton.addEventListener("click", () => {
        handleAddToPlaylistClick();
    });

    // Display the popup
    popup.style.display = "flex";
}
    // Change the button image based on its state
    const buttonImage = addToFavouritesButton.querySelector("img");

    if (addToFavouritesButton.classList.contains("clicked")) {
        // If the button is in the clicked state, change the image to remove-favourites.png
        buttonImage.src = "./assets/icons/remove-favourites.png";

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
    if (watchTrailerButton && addToFavouritesButton && addToPlaylistButton) {
        // Remove event listeners
        watchTrailerButton.removeEventListener("click", handleWatchTrailerClick);
        addToFavouritesButton.removeEventListener("click", handleAddToFavouritesClick);
        addToPlaylistButton.removeEventListener("click", handleAddToPlaylistClick);

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

// Get all movie containers
const movieContainers = document.querySelectorAll('.movie-container');

// Variables to track mouse events
let isMouseDown = false;
let startX;
let scrollLeft;

// Add mouse events to each movie container
movieContainers.forEach(movieContainer => {
    movieContainer.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        startX = e.pageX - movieContainer.offsetLeft;
        scrollLeft = movieContainer.scrollLeft;
    });

    movieContainer.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return;
        e.preventDefault();
        const x = e.pageX - movieContainer.offsetLeft;
        const walk = (x - startX) * 2; // Adjust the scroll speed if needed
        movieContainer.scrollLeft = scrollLeft - walk;
    });

    movieContainer.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    movieContainer.addEventListener('mouseleave', () => {
        isMouseDown = false;
    });
});


function switchTab(tabId, sectionId) {
    // Get tab elements
    const tabs = ["homeTab", "feedTab", "groupTab", "profileTab", "postTab"];
    const sections = ["homeSection", "feedSection", "groupSection", "profileSection", "profileSection"];

    // Hide all sections and deactivate all tabs
    for (let i = 0; i < tabs.length; i++) {
        const tab = document.getElementById(tabs[i]);
        const section = document.getElementById(sections[i]);

        tab.classList.remove("active");
        section.style.display = "none";
    }

    // Show the selected section and activate the selected tab
    const selectedTab = document.getElementById(tabId);
    const selectedSection = document.getElementById(sectionId);

    selectedTab.classList.add("active");
    selectedSection.style.display = "block";
}
