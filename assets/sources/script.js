// Object used to store the local storage data while the site is active
var viewHistory = { search: [], id: [], poster: []}
// On loading the page will pull data from local storage and store it in the viewHistory object, then create the 'Your Movies' page for the user
function onload() {
    if (localStorage.getItem('history')) {
        viewHistory = JSON.parse(localStorage.getItem('history'));
        for (i = 0; i < viewHistory.search.length; i++) {
            $('#recentSearches').append(`
            <div class="m-4 zoom2">
                <p class="navbar-item is-justify-content-center is-size-4">
                    ${viewHistory.search[i]}
                </p>
                <a>
                    <img id="${viewHistory.id[i]}" class="recentSearchItem" src="https://image.tmdb.org/t/p/w300/${viewHistory.poster[i]}" alt="${viewHistory.search[i]}}">
                </a>
            </div>
            `)
        }
    } else {
        $('#clearHistory').html(`
            <p class="is-size-2 has-text-warning">Nothing to display, go look for some movies first!</p>
        `)
    }
    $('#yourMovies, #aboutPage, #navSearch').hide()
}
onload()

// Event Listeners

//Allows enter key to be pressed to start search
$(".searchBar").keypress(function (event) {
    if (event.keyCode === 13) {
        $(".searchButton").click();
    }
});
//Event Listener for the search button in navbar
$('.searchButton').on('click', function () {
    var title = $(this).parents('.control').prev().children('.searchBar').val()
    if (title === "") {
        return
    }
    movieSearch(title)
    $('#displayResults ,#streamingBox').html("")
    $('#aboutPage, #streamingBox, #favMovies, .hero').hide()
    $('#navSearch, #searchSection').show()

})

//Event listeners for the navbar buttons
$('#homePage').on('click', function () {
    $('#aboutPage, #searchSection, #resultsPage, #yourMovies, #navSearch').hide()
    $('#favMovies, .hero').show()
})
$('#about').on('click', function () {
    $('#aboutPage').show()
    $('#favMovies, #searchSection, #resultsPage, #yourMovies, .hero').hide()
})
$('#yourMoviesNav').on('click', function () {
    $('#aboutPage, #favMovies, .hero, #resultsPage').hide()
    $('#yourMovies, #navSearch').show()
})
// Event listener for the movies the user has saved to the 'Your Movies' page
$('.recentSearchItem').on('click', function (event) {
    $('#dataBox').html('')
    showResults($(this).attr('id'))
    event.stopPropagation()
})
// Event Listener for the movies located in the 'Popular Searches' section of the homepage
$('.favMovieBox').on('click', function () {
    $('#displayResults').html("")
    $('#aboutPage, #favMovies, .hero').hide()
    $('#navSearch').show()
    showResults($(this).attr('id'))
})
// Event Listener for the clear history button in the 'Your Movies' page
$('#clearHistory').on('click', function() {
    localStorage.clear()
    $('#recentSearches').html('')
    $('#homePage').click()
    $('#clearHistory').html(`
            <p class="is-size-2 has-text-warning">Nothing to display, go look for some movies first!</p>
        `)
})

//Searches for movie based on the value of the text entered into either searchbar
var movieSearch = (title) => {
    var watchmodeSearch = `https://api.watchmode.com/v1/autocomplete-search/?apiKey=MrGTsGgbhFfhDXVJCCQa4pFgqs8moIrmp7JsjoPl&search_value=${title}&search_type=3`;
    fetch(watchmodeSearch)
        .then(response => {
            return response.json()
        })
        .then(searchData => {
            $('#searchResults').html(``)
            $('#yourMovies, #resultsPage').hide()
            $('#searchSectionTitle').text(`
                Showing Results for "${title}"
            `)
            // for loop that loops through all the movies that the api search call returns, determines if they are popular enough to have both a poster image and TMDb id, then appends the filtered results to the page
            var searchResults = (searchData.results)
            console.log(searchResults)
            if(searchResults.length == 0) {
                $('#searchResults').append(`Sorry no movies found, check your spelling and try again`)
            }
            for (var i = 0; i < searchResults.length; i++) {
                var poster = searchResults[i].image_url
                if (poster == undefined) {
                    console.log('error no poster')
                    continue;
                }
                var movieId = searchResults[i].tmdb_id
                if (movieId == undefined || null) {
                    console.log('error no id')
                    continue;
                }
                $('#searchResults').append(`
                    <div id="${movieId}" class="box has-background-black-ter zoom2 has-text-light is-size-4 m-3">
                        <p class="mb-4">${searchResults[i].name}</p>
                        <a>
                            <img class="resultButton" src="${poster}">
                        </a>
                    </div>
                `)
            }
            // Event Listener for the search results, will call the showResults function
            $('.resultButton').on('click', function () {
                showResults($(this).parents('.box').attr('id'))
            })
        })
        .catch(error => {
            console.log(error)
        })
}
// Displays the details of the movie the user selected from the search results page
var showResults = (id) => {
    tmdbSearch = `https://api.themoviedb.org/3/movie/${id}?api_key=b3783de294fab53f3b5f107706f3d99e`;
    fetch(tmdbSearch)
        .then(response => {
            return response.json()
        })
        .then(data => {
            $('#resultsPage').show()
            $('#searchSection, #yourMovies').hide()
            $('#dataBox').html('')
            var genres = []
            for (i = 0; i < data.genres.length; i++) {
                genres += data.genres[i].name
                genres += '  '
            }
            $('#displayResults').html(`
            <div class="column ">
                <p class="is-size-3 mb-3 has-text-warning">${data.original_title}</p>
                <img src="https://image.tmdb.org/t/p/w300/${data.poster_path}" alt="Movie Poster">
                <p class="is-size-4 has-text-warning">Overview</p>
                <p class="mb-3">${data.overview}</p>
            </div>
            <div id="dataBox" class="column">
                
                <p class="is-size-4 has-text-warning">Release Date</p>
                <p class="mb-3">${data.release_date}</p>
                <p class="is-size-4 has-text-warning">Runtime</p>
                <p class="mb-3">${data.runtime} minutes</p>
                <p class="is-size-4 has-text-warning">Genre</p>
                <p class="mb-3">${genres}</p>
            </div>
            `)
            // Checks to see if the name of the resulting movie is stored in the viewHistory Object, stores the name, id, and poster path of the movie to the viewHistory object if it is not already, then appends the newly stored movie to the 'Your Movies' page
            if (viewHistory.search.includes(data.original_title) === false) {
                viewHistory.search.push(data.original_title);
                viewHistory.poster.push(data.poster_path);
                viewHistory.id.push(data.id)
                localStorage.setItem('history', JSON.stringify(viewHistory))
                $('#recentSearches').append(`
                    <div class="zoom2">
                        <p class="navbar-item is-justify-content-center is-size-4">
                            ${data.original_title}
                        </p>
                        <a>
                            <img id="${data.id}" class="recentSearchItem" src="https://image.tmdb.org/t/p/w300/${data.poster_path}" alt="${data.original_title}">
                        </a>
                    </div>
                `)
                // Changes the text of the clear history button if a new movie is added to the 'Your Movies' page
                $('#clearHistory').html(`
                    <p class="is-size-4 has-text-danger">Clear History</p>
                `)
                // Creates an event listener for any new movies appended to the 'Your Movies' section
                $('.recentSearchItem').on('click', function (event) {
                    showResults($(this).attr('id'))
                    event.stopPropagation()
                })
            }
            // Uses the imdb id that is available with the tmdb api to begin another api call to omdb, in a process known as chaining api's
            return fetch(`https://www.omdbapi.com/?i=${data.imdb_id}&page=1&apikey=611f00c7`)
        })
        .then(response => {
            return response.json();
        })
        // Uses OMDb data to display movie critic website ratings
        .then(data2 => {
            // Restuctures the title of the movie so that it can be used inside of the search links to the review websites below

            // If there is a semi-colon or hyphen, it won't be included in the title string, as the websites don't recognise it the the url
            var newName = data2.Title.replaceAll(':', '')
            console.log(newName)
            newName = newName.replaceAll('-', ' ')
            console.log(newName)
            // Splits the .title string into separate words, then rejoins them with either underscores(for rotten tomatoes), or hyphens(for metacritic) separating the words
            var nameArr = newName.split(' ')
            var nameStringRotten = nameArr.join('_').toLowerCase()
            var nameStringMeta = nameArr.join('-').toLowerCase()
            // Pulls even more data about the movie that wasn't available in the tmdb api
            $('#dataBox').append(`
                <p class="is-size-4 has-text-warning">Director</p>
                <p class="mb-3">${data2.Director}</p>
                <p class="is-size-4 has-text-warning">Actors</p>
                <p class="mb-3">${data2.Actors}</p>
                <p class="is-size-4 has-text-warning">Awards</p>
                <p class="mb-3">${data2.Awards}</p>
                <p class="is-size-4 has-text-warning">Box Office</p>
                <p class="mb-3">${data2.BoxOffice}</p>
                `)
            // Appends the ratings scores and links to the movie's pages on those specific sites to the page
            $('#displayRatings').html('')
            $('#displayRatings').append(`
            <div id="ratingsBox" class="is-size-4">
                <p class="is-size-3 mb-1 has-text-warning">Ratings:</p>
                <div>
                    <a target="_blank" href="https://www.rottentomatoes.com/m/${nameStringRotten}">
                        <img class="mt-3 zoom" width="150px" src="./assets/images/Rotten_Tomatoes_logo.svg.png" alt="Movie Poster">
                    </a>
                    <p>${data2.Ratings[1].Value}</p>
                </div>
                <div>
                    <a target="_blank" href="https://www.imdb.com/title/${data2.imdbID}/">
                        <img class="mt-3 zoom " width="150px" src="./assets/images/IMDB_Logo.png" alt="Movie Poster">
                    </a>
                    <p>${data2.Ratings[0].Value}</p>
                </div>
                <div>
                    <a target="_blank" href="https://www.metacritic.com/movie/${nameStringMeta}">
                            <img class="mt-3 zoom" width="150px" src="./assets/images/Metacritic_logo2.png" alt="Movie Poster">
                    </a>
                    <p>${data2.Ratings[2].Value}</p>
                </div>
            </div>
        `)
            // Chains the watchmode api with the imdb ID as the search parameter
            return fetch(`https://api.watchmode.com/v1/title/${data2.imdbID}/details/?apiKey=MrGTsGgbhFfhDXVJCCQa4pFgqs8moIrmp7JsjoPl&append_to_response=sources`)
        })
        .then(response => {
            return response.json();
        })
        // Displays the available streaming sites for the movie as links to those websites
        .then(data3 => {

            $('#streamingBox').show()
            $('#streamingBox').html('')
            $('#streamingBox').append(`
                <p class="is-size-3 mb-3 has-text-warning">Available Streaming Services:</p>
            `)
            // Checks to make sure there are no repetitions of streaming sources(i.e. three youtube data points, one for renting SD, one for renting 4K, and one for purchasing) and only chooses the first available source on that particular website
            var streamingArr = { title: [], url: [] }
            for (i = 0; i < data3.sources.length; i++) {
                if (streamingArr.title.includes(data3.sources[i].name) === false) {
                    streamingArr.title.push(data3.sources[i].name);
                    streamingArr.url.push(data3.sources[i].web_url);
                }
            }
            for (i = 0; i < streamingArr.title.length; i++) {
                $('#streamingBox').append(`
                <div class="m-2 is-size-4 zoom">
                <a target="_blank" href="${streamingArr.url[i]}">${streamingArr.title[i]}</a>
                </div>
            `)
            }
        })

}


//API keys (So we have easy access to them or if they get lost or deleted)
// var movieDatabaseApi = `http://www.omdbapi.com/?t==${title}&apikey=611f00c7`
// var watchmodeStreamingApi =  `https://api.watchmode.com/v1/title/345534/details/?apiKey=6N5wEhqG1MjX7EYLU4zvfMui5TyhL4Io8eUxuhM5&append_to_response=sources`
// backup watchmode key MrGTsGgbhFfhDXVJCCQa4pFgqs8moIrmp7JsjoPl
// var tmdbApi = 'https://api.themoviedb.org/3/search/movie?query=Jack+Reacher&api_key=7hibFdjKy4046BRqHjrUNu4fWLbXyO2rtZmN3XHv'