//API keys
// var movieDatabaseApi = `http://www.omdbapi.com/?t==${title}&apikey=611f00c7`
// var watchmodeStreamingApi =  `https://api.watchmode.com/v1/title/345534/details/?apiKey=6N5wEhqG1MjX7EYLU4zvfMui5TyhL4Io8eUxuhM5&append_to_response=sources`
// var tmdbApi = 'https://api.themoviedb.org/3/search/movie?query=Jack+Reacher&api_key=7hibFdjKy4046BRqHjrUNu4fWLbXyO2rtZmN3XHv'

$('#searchForMovie').hide()

var viewHistory = { search: [], id:[], poster: [] };

function onLoad() {
  if(localStorage.getItem('history')) {
    viewHistory = JSON.parse(localStorage.getItem('history'));
    for(i = 0; i < viewHistory.search.length; i++) {
        $('#recentSearches').append(`

            <div>
                <p class="navbar-item has-text-primary is-justify-content-center is-size-4">
                    ${viewHistory.search[i]}
                </p>
                <a>
                    <img  id="${viewHistory.id[i]}" class="recentSearchItem" src="https://image.tmdb.org/t/p/w300/${viewHistory.poster[i]}" alt="${viewHistory.search[i]}}">
                </a>
            </div>
            `)
        } 
  } else {
    $('#recentSearches').append(`
    <div id="noRecentSearches">
        <p class="is-size-2 has-text-warning">Nothing to display, go look for some movies first!</p>
    </div>
    `)
  }
  $('#yourMovies').hide()
}
onLoad()

// function addHistory(dataToSave) {
//   historyObj.city.push(dataToSave);
//   localStorage.setItem('history',JSON.stringify(historyObj));
// }
//Allows enter key to be pressed to start search
$("#searchBar").keypress(function (event) {
    if (event.keyCode === 13) {
        $("#searchButton").click();
    }
});

//Event Listener for the search button
$('#searchButton').on('click', function() {
    //pulls the text entered into the searchbar and saves it as the variable 'title'
    var title = $('#searchBar').val()
    //If statement for the search field being empty when the button is clicked
    if ($('#searchBar').val() === "") {
        return
    }
    //calls the movieSearch function and searches for the title of the movie
    movieSearch(title)
    $('#displayResults').html("")
    $('#aboutPage').hide()
    $('#searchResults').show()
    $('#streamingBox').html("")
    $('#streamingBox').hide()
    $('#favMovies').hide()

})

//Event listener for the navbar buttons
$('.homePage').on('click', function() {
    $('#aboutPage').show()
    $('#favMovies').show()
    $('#searchResults').hide()
    $('#searchForMovie').hide()
    $('#resultsPage').hide()
    $('#yourMovies').hide()
})

$('#yourMoviesNav').on('click', function() {
    $('#aboutPage').hide()
    $('#yourMovies').show()
    $('#favMovies').hide()
})

$('.recentSearchItem').on('click', function(event) {
    var id = $(this).attr('id')
    console.log(id)
    showResults(id)
    event.stopPropagation()
})

$('.favMovieBox').on('click', function() {
    $('#displayResults').html("")
    $('#aboutPage').hide()
    $('#favMovies').hide()
    var id = $(this).attr('id')
    showResults(id)
})

//Search function
var movieSearch = (title) => {

    var watchmodeSearch = `https://api.watchmode.com/v1/autocomplete-search/?apiKey=7hibFdjKy4046BRqHjrUNu4fWLbXyO2rtZmN3XHv&search_value=${title}&search_type=2`;
    
    fetch(watchmodeSearch)
        .then(response => {
            return response.json()
        })
        .then(searchData => {
            $('#searchResults').html(``)
            $('#yourMovies').hide()
            $('#resultsPage').hide()
            var searchResults = (searchData.results)
            for (var i=0; i<searchResults.length; i++){
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
                    <div id="${movieId}" class="box p-3 m-3">
                        <p>${searchResults[i].name}</p>
                        <a>
                            <img class="resultButton" src="${poster}">
                        </a>
                    </div>
                `)
            }
            
            $('.resultButton').on('click', function() {
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
        var image = '"https://image.tmdb.org/t/p/w300/'
        var name = data.original_title;
        var poster = data.poster_path;
        var id = data.id
        if (viewHistory.search.includes(name) === false) {
            viewHistory.search.push(name);
            viewHistory.poster.push(poster);
            viewHistory.id.push(id)
            localStorage.setItem('history',JSON.stringify(viewHistory))
            $('#noRecentSearches').hide()
            $('#recentSearches').append(`
            <div>
                <p class="navbar-item has-text-primary is-justify-content-center is-size-4">
                    ${name}
                </p>
                <a>
                    <img id="${id}" class="recentSearchItem" src="https://image.tmdb.org/t/p/w300/${poster}" alt="${name}">
                </a>
            </div>
            `)
            $('.recentSearchItem').on('click', function(event) {
                var id = $(this).attr('id')
                console.log(id)
                showResults(id)
                event.stopPropagation()
            })
        }


        $('#resultsPage').show()
        var imdbId = data.imdb_id
        var genres = []
        for (i = 0; i < data.genres.length; i++) {
            genres += data.genres[i].name
            genres += '  '
        }
        $('#searchResults').hide()
        $('#yourMovies').hide()
        $('#displayResults').html(`
        <div id="resultsBox">
            <p class="is-size-3 mb-3">${name}</p>
            <img src=${image}${data.poster_path}" alt="Movie Poster">
            <p>Release Date:  ${data.release_date}</p>
            <p>Runtime: ${data.runtime} minutes</p>
            <p>Genre: ${genres}</p>
        </div>
        `)
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

        $('#displayRatings').html('')
        $('#displayRatings').append(`
        <div id="ratingsBox" class="is-size-4">
            <p class="is-size-3 mb-3">Ratings:</p>
            <div>
                <a target="_blank" href="https://www.rottentomatoes.com/m/${nameStringRotten}">
                    <img class="mt-6"src="./assets/images/Rotten_Tomatoes_logo.svg.png" alt="Movie Poster">
                </a>
                <p>${data2.Ratings[1].Value}</p>
            </div>
            <div>
                <a target="_blank" href="https://www.imdb.com/title/${data2.imdbID}/">
                    <img class="mt-6" src="./assets/images/IMDB_Logo.png" alt="Movie Poster">
                </a>
                <p>${data2.Ratings[0].Value}</p>
            </div>
            <div>
                <a target="_blank" href="https://www.metacritic.com/movie/${nameStringMeta}">
                        <img class="mt-6" src="./assets/images/Metacritic_logo2.png" alt="Movie Poster">
                </a>
                <p>${data2.Ratings[2].Value}</p>
            </div>
        </div>
        `)

        return fetch(`https://api.watchmode.com/v1/title/${data2.imdbID}/details/?apiKey=7hibFdjKy4046BRqHjrUNu4fWLbXyO2rtZmN3XHv&append_to_response=sources`)
    })
    .then(response => {
        return response.json();
    })
    .then(data3 => {
        
        $('#streamingBox').show()
        $('#streamingBox').html('')
        $('#streamingBox').append(`
            <p class="is-size-3 mb-3">Available Streaming Services:</p>
        `)
        var streamingArr = {title:[], url:[]}
        for(i = 0;i < data3.sources.length; i++) {
            if (streamingArr.title.includes(data3.sources[i].name) === false) {
                streamingArr.title.push(data3.sources[i].name);
                streamingArr.url.push(data3.sources[i].web_url);
            }
        }
        for (i = 0; i < streamingArr.title.length; i++) {
            $('#streamingBox').append(`
                <div class="m-5 is-size-4">
                <a target="_blank" href="${streamingArr.url[i]}">${streamingArr.title[i]}</a>
                </div>
            `)
        }
    })

}


// {/* <p>Rated: ${data.Rated}</p> */}

// let arr = ["apple", "mango", "apple",
//           "orange", "mango", "mango"];
  
// function removeDuplicates(arr) {
//     return arr.filter((item, index) => arr.indexOf(item) === index);
// }
// console.log(removeDuplicates(arr));
