var viewHistory = { search: [], id: [], poster: []}

function onLoad() {
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
    $('#yourMovies').hide()
    $('#aboutPage').hide()
    $('#navSearch').hide()
}
onLoad()

// Event Listeners

//Allows enter key to be pressed to start search
$(".searchBar").keypress(function (event) {
    if (event.keyCode === 13) {
        $(".searchButton").click();
    }
});
//Event Listener for the search button
$('#navSearchButton').on('click', function () {
    var title = $('#navSearchBar').val()
    if (title === "") {
        return
    }
    movieSearch(title)
    $('#displayResults').html("")
    $('#aboutPage').hide()
    $('#searchSection').show()
    $('#streamingBox').html("")
    $('#streamingBox').hide()
    $('#favMovies').hide()
    $('.hero').hide()
    $('#navSearch').show()

})
$('#heroSearchButton').on('click', function () {
    var title = $('#heroSearchBar').val()
    if (title === "") {
        return
    }
    movieSearch(title)
    $('#displayResults').html("")
    $('#aboutPage').hide()
    $('#searchSection').show()
    $('#streamingBox').html("")
    $('#streamingBox').hide()
    $('#favMovies').hide()
    $('.hero').hide()
    $('#navSearch').show()

})
//Event listener for the navbar buttons
$('#homePage').on('click', function () {
    $('#aboutPage').hide()
    $('#favMovies').show()
    $('#searchSection').hide()
    $('#resultsPage').hide()
    $('#yourMovies').hide()
    $('.hero').show()
    $('#navSearch').hide()
})

$('#about').on('click', function () {
    $('#aboutPage').show()
    $('#favMovies').hide()
    $('#searchSection').hide()
    $('#resultsPage').hide()
    $('#yourMovies').hide()
    $('.hero').hide()
})

$('#yourMoviesNav').on('click', function () {
    $('#aboutPage').hide()
    $('#yourMovies').show()
    $('#favMovies').hide()
    $('.hero').hide()
    $('#navSearch').show()
    $('#resultsPage').hide()
    
})

$('.recentSearchItem').on('click', function (event) {
    var id = $(this).attr('id')
    showResults(id)
    event.stopPropagation()
})

$('.favMovieBox').on('click', function () {
    $('#displayResults').html("")
    $('#aboutPage').hide()
    $('#favMovies').hide()
    $('.hero').hide()
    $('#navSearch').show()
    var id = $(this).attr('id')
    showResults(id)
})

$('#clearHistory').on('click', function() {
    localStorage.clear()
    $('#recentSearches').html('')
    $('#homePage').click()
    $('#clearHistory').html(`
            <p class="is-size-2 has-text-warning">Nothing to display, go look for some movies first!</p>
        `)
})

//Search function
var movieSearch = (title) => {
    var watchmodeSearch = `https://api.watchmode.com/v1/autocomplete-search/?apiKey=h9bYrpSa7Rlr9oEUoXUqIQj14GFbRQy3LF7JvrEI&search_value=${title}&search_type=2`;
    fetch(watchmodeSearch)
        .then(response => {
            return response.json()
        })
        .then(searchData => {
            $('#searchResults').html(``)
            $('#yourMovies').hide()
            $('#resultsPage').hide()
            $('#searchSectionTitle').text(`
                Showing Results for "${title}"
            `)
            var searchResults = (searchData.results)
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
                    <div id="${movieId}" class="box  zoom2 has-background-dark has-text-light is-size-4 m-3">
                        <p>${searchResults[i].name}</p>
                        <a>
                            <img class="resultButton" src="${poster}">
                        </a>
                    </div>
                `)
            }

            $('.resultButton').on('click', function () {
                var id = $(this).parents('.box').attr('id')
                showResults(id)
            })
        })
        .catch(error => {
            console.log(error)
        })
}

var showResults = (id) => {
    tmdbSearch = `https://api.themoviedb.org/3/movie/${id}?api_key=b3783de294fab53f3b5f107706f3d99e`;
    fetch(tmdbSearch)
        .then(response => {
            return response.json()
        })
        .then(data => {
            $('#resultsPage').show()
            $('#searchSection').hide()
            $('#yourMovies').hide()
            var image = '"https://image.tmdb.org/t/p/w300/'
            var name = data.original_title;
            var poster = data.poster_path;
            var id = data.id
            var imdbId = data.imdb_id
            var genres = []
            for (i = 0; i < data.genres.length; i++) {
                genres += data.genres[i].name
                genres += '  '
            }
            $('#displayResults').html(`
            <div class="column ">
                <p class="is-size-3 mb-3 has-text-warning">${name}</p>
                <img src=${image}${poster}" alt="Movie Poster">
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
            if (viewHistory.search.includes(name) === false) {
                viewHistory.search.push(name);
                viewHistory.poster.push(poster);
                viewHistory.id.push(id)
                localStorage.setItem('history', JSON.stringify(viewHistory))
                $('#recentSearches').append(`
                    <div class="zoom2">
                        <p class="navbar-item is-justify-content-center is-size-4">
                            ${name}
                        </p>
                        <a>
                            <img id="${id}" class="recentSearchItem" src="https://image.tmdb.org/t/p/w300/${poster}" alt="${name}">
                        </a>
                    </div>
                `)
                $('#clearHistory').html(`
                    <p class="is-size-4 has-text-danger">Clear History</p>
                `)
                $('.recentSearchItem').on('click', function (event) {
                    var id = $(this).attr('id')
                    showResults(id)
                    event.stopPropagation()
                })
            }
            return fetch(`https://www.omdbapi.com/?i=${imdbId}&page=1&apikey=611f00c7`)
        })
        .then(response => {
            return response.json();
        })
        .then(data2 => {
            var name = data2.Title
            var newName = name.replace(':', '')
            var nameArr = newName.split(' ')
            var nameStringRotten = nameArr.join('_').toLowerCase()
            var nameStringMeta = nameArr.join('-').toLowerCase()

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

            return fetch(`https://api.watchmode.com/v1/title/${data2.imdbID}/details/?apiKey=h9bYrpSa7Rlr9oEUoXUqIQj14GFbRQy3LF7JvrEI&append_to_response=sources`)
        })
        .then(response => {
            return response.json();
        })
        .then(data3 => {

            $('#streamingBox').show()
            $('#streamingBox').html('')
            $('#streamingBox').append(`
                <p class="is-size-3 mb-3 has-text-warning">Available Streaming Services:</p>
            `)
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


//API keys
// var movieDatabaseApi = `http://www.omdbapi.com/?t==${title}&apikey=611f00c7`
// var watchmodeStreamingApi =  `https://api.watchmode.com/v1/title/345534/details/?apiKey=6N5wEhqG1MjX7EYLU4zvfMui5TyhL4Io8eUxuhM5&append_to_response=sources`
// backup watchmode key h9bYrpSa7Rlr9oEUoXUqIQj14GFbRQy3LF7JvrEI
// var tmdbApi = 'https://api.themoviedb.org/3/search/movie?query=Jack+Reacher&api_key=7hibFdjKy4046BRqHjrUNu4fWLbXyO2rtZmN3XHv'