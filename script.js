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
            const { poster_path, title, overview, release_date } = filmOfTheDay;
            const releaseYear = release_date ? new Date(release_date).getFullYear() : 'N/A';
    
            // Create HTML content for film of the day
            const filmOfTheDayHTML = `
                <div class="film-of-the-day">
                    <img src="${IMGPATH + poster_path}" alt="${title}" />
                    <div class="film-info">
                        <h1> Film Of The Day </h1>
                        <h3>${title}</h3>
                        <p>${overview}</p>
                        <p><strong>${releaseYear}</strong></p>
                    </div>
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
    const popularMoviesRow = createMovieRow("Top 25 Popular Movies", popularMovies);

    // Create a row for new releases
    const newReleasesRow = createMovieRow("New Releases", newReleases);

    // Create a row for top-rated movies
    const topRatedMoviesRow = createMovieRow("Top Rated Movies", topRatedMovies);

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
            <p style="text-align: right;"><strong>${releaseYear}</strong> &nbsp;&bull;&nbsp; <strong>${runtime}m</strong></p>
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



// Declare a variable to hold the YouTube iframe element
let youtubeIframe = null;

// Function to open the popup window with movie details and trailer
async function openPopup(movieTitle) {
    
    const popup = document.getElementById("moviePopupWindow");
    const popupContent = popup.querySelector(".popup-content");
    const trailerDiv = popupContent.querySelector("#trailer");
    const movieInfoDiv = popupContent.querySelector("#movie-info-popup"); // New div for movie information
    // Fetch movie details from your data source (e.g., API call) based on movieTitle
    // Replace the following line with your actual API call to fetch movie details
    const movieDetails = await fetchMovieDetails(movieTitle);

    const releaseYear = movieDetails.release_date ? new Date(movieDetails.release_date).getFullYear() : 'N/A';


    // Populate movie information in the movieInfoDiv
    movieInfoDiv.innerHTML = `
        <h1>${movieDetails.title}</h1>
        <p>${movieDetails.overview}</p>
        <p><b>${releaseYear} &bull; ${movieDetails.runtime}m</b></p>
        <!-- Add more movie details as needed -->
    `;

    // Fetch movie trailer using YouTube Data API
    const apiKey = "AIzaSyCnttqyzHWlRJONCxWYlZ7XfE8N-Tg6puM";
    const trailerUrl = `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(
        movieTitle + " official trailer"
    )}&key=${apiKey}&part=snippet&type=video`;

    // Check if there is already an existing YouTube iframe, and remove it if present
    if (youtubeIframe && youtubeIframe.parentNode) {
        youtubeIframe.parentNode.removeChild(youtubeIframe);
    }

    try {
        const response = await fetch(trailerUrl);
        const data = await response.json();

        // Check if there are any video results
        if (data.items && data.items.length > 0) {
            const videoId = data.items[0].id.videoId;
            // Create an iframe element for the YouTube video
            // Create an iframe element for the YouTube video
            const iframe = document.createElement("iframe");
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            iframe.allowFullscreen = true;

            // Set width to 100% for all devices
            iframe.width = "80%";

            // Check if it's a desktop (width greater than or equal to 768px)
            if (window.innerWidth >= 768) {
                iframe.height = "400px"; // Set height to 400px for desktop
                iframe.style.borderRadius = "20px";
            } else {
                // For mobile devices, set height to 100% and border radius to 10px
                iframe.height = "100%";
                iframe.style.borderRadius = "10px";
            }


            // Append the iframe to the movie info div
            movieInfoDiv.appendChild(iframe);

            // Assign the created iframe to the youtubeIframe variable
            youtubeIframe = iframe;
        } else {
            // If no trailer is found, display a message
            trailerDiv.innerText = "Trailer not available";
        }
    } catch (error) {
        console.error("Error fetching trailer:", error);
        // If an error occurs, display a message
        trailerDiv.innerText = "Error fetching trailer";
    }

    // Display the popup
    popup.style.display = "flex";
}

// Function to close the popup window
function closePopup() {
    // Check if there is an existing YouTube iframe, and remove it if present
    if (youtubeIframe) {
        youtubeIframe.parentNode.removeChild(youtubeIframe);
    }

    document.getElementById("moviePopupWindow").style.display = "none";
}


AIzaSyCnttqyzHWlRJONCxWYlZ7XfE8N-Tg6puM