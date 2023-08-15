//API keys
// var movieDatabaseApi = `http://www.omdbapi.com/?t==${title}&apikey=611f00c7`
// var watchmodeStreamingApi =  `https://api.watchmode.com/v1/title/345534/details/?apiKey=6N5wEhqG1MjX7EYLU4zvfMui5TyhL4Io8eUxuhM5&append_to_response=sources`
// var tmdbApi = 'https://api.themoviedb.org/3/search/movie?query=Jack+Reacher&api_key=b3783de294fab53f3b5f107706f3d99e'

$('#searchForMovie').hide()

var searchHistory = { search: [], id: [] };

function onLoad() {
  if(localStorage.getItem('history')) {
    searchHistory = JSON.parse(localStorage.getItem('history'));
    console.log(searchHistory.search)
    for(i = 0; i < searchHistory.search.length; i++) {
        $('#historyDropdown').append(`
            <a class="recentSearchItem navbar-item">
                ${searchHistory.search[i]}
            </a>
            `)
}

$('.recentSearchItem').on('click', function(event) {
    var id = $(this).text()
    movieSearch(id)
    event.stopPropagation()
})

    
  }
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
        console.log('Enter key pressed')
    }
});

//Event Listener for the search button
$('#searchButton').on('click', function() {
    //pulls the text entered into the searchbar and saves it as the variable 'title'
    var title = $('#searchBar').val()
    //If statement for the search field being empty when the button is clicked
    if ($('#searchBar').val() === "") {
        console.log('Please enter a movie title')
        return
    }
    //calls the movieSearch function and searches for the title of the movie
    movieSearch(title)
    console.log('search button clicked')
    $('#displayResults').html("")
    $('#aboutPage').hide()
    $('#searchResults').show()
    $('#streamingBox').html("")
    $('#streamingBox').hide()
})

//Event listener for the navbar buttons
$('.homePage').on('click', function() {
    $('#aboutPage').show()
    $('#searchResults').hide()
    $('#streamingBox').hide()
    $('#searchForMovie').hide()
    $('#displayResults').hide()
})

// 

// var showRecentSearches = () => {
//     for (i = 0; i < 10; i++) {
//         console.log(searchHistory.search[i])
//     }
//     }

$('.favMovieBox').on('click', function() {
    $('#displayResults').html("")
    $('#aboutPage').hide()
    var id = $(this).attr('id')
    showResults(id)
})

//Search function
var movieSearch = (title) => {
    console.log('Search button clicked');
    console.log(title);

    var watchmodeSearch = `https://api.watchmode.com/v1/autocomplete-search/?apiKey=6N5wEhqG1MjX7EYLU4zvfMui5TyhL4Io8eUxuhM5&search_value=${title}&search_type=2`;
    
    fetch(watchmodeSearch)
        .then(response => {
            return response.json()
        })
        .then(searchData => {

            if (searchHistory.search.includes(title) === false) {
                searchHistory.search.push(title);
                localStorage.setItem('history',JSON.stringify(searchHistory))

                $('#historyDropdown').append(`
                <a class="navbar-item">
                  ${searchHistory.search}
                </a>
                `)
            }
        ;

            console.log(searchData)
            var searchResults = (searchData.results)
            console.log(searchResults)
            $('#searchResults').html(``)
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
                console.log(searchResults[i].tmdb_id)
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
                console.log(id)
                console.log('Search Result Button clicked')
                showResults(id)
            })
        })
        .catch(error => {
            console.log(error)
            $('.resultButton').on('click', function() {
                var id = $(this).parents('.column').attr('id')
                console.log(id)
                console.log('Search Result Button clicked')
                showResults(id)
            })
        })
}  

var showResults = (id) => {
    tmdbSearch = `https://api.themoviedb.org/3/movie/${id}?api_key=b3783de294fab53f3b5f107706f3d99e`;
    fetch(tmdbSearch)
    .then(response => {
        return response.json()
    })
    .then(data => {
        $('#displayResults').show()
        var imdbId = data.imdb_id
        console.log(imdbId)
        console.log(data)
        var genres = []
        for (i = 0; i < data.genres.length; i++) {
            genres += data.genres[i].name
            genres += '  '
            console.log(genres)
        }
        $('#searchResults').hide()
        var image = '"https://image.tmdb.org/t/p/w300/'
        var name = data.original_title;
        
        $('#displayResults').html(`
        <p class="is-size-3">It worked!</p>
        <div id="resultsBox" class="box">
            <p>Title: ${name}</p>
            <p>Year:  ${data.release_date}</p>
            <p>Runtime: ${data.runtime}</p>
            <img src=${image}${data.poster_path}" alt="Movie Poster">
            <p>Genre: ${genres}</p>
        </div>
        `)
        return fetch(`https://www.omdbapi.com/?i=${imdbId}&page=1&apikey=611f00c7`)
    })
    .then(response => {
        return response.json();
    })
    .then(data2 => {
        console.log(data2)
        var name = data2.Title
        var newName = name.replace(':', '')
        var nameArr = newName.split(' ')
        let nameStringRotten = nameArr.join('_').toLowerCase()
        let nameStringMeta = nameArr.join('-').toLowerCase()

        console.log(nameStringRotten)
        console.log(nameStringMeta)
        console.log(name)
        console.log(nameArr)
        console.log(data2);
        console.log(data2.Title);
        console.log(data2.Plot);

        $('#resultsBox').append(`
        <div id="ratingsBox">
            <p>Ratings:</p>
            <p>Rotten Tomatoes: ${data2.Ratings[1].Value}.</p>
            <a target="_blank" href="https://www.rottentomatoes.com/m/${nameStringRotten}">
                <img src="./assets/images/Rotten_Tomatoes_logo.svg.png" alt="Movie Poster">
            </a>
            <p>IMDb: ${data2.Ratings[0].Value}</p>
            <a target="_blank" href="https://www.imdb.com/title/${data2.imdbID}/">
                <img src="./assets/images/IMDB_Logo.png" alt="Movie Poster">
            </a>
            <p>Metacritic: ${data2.Ratings[2].Value}</p>
                <a target="_blank" href="https://www.metacritic.com/movie/${nameStringMeta}">
                        <img src="./assets/images/Metacritic_logo2.png" alt="Movie Poster">
                </a>
        </div>
        `)

        return fetch(`https://api.watchmode.com/v1/title/${data2.imdbID}/details/?apiKey=6N5wEhqG1MjX7EYLU4zvfMui5TyhL4Io8eUxuhM5&append_to_response=sources`)
    })
    .then(response => {
        return response.json();
    })
    .then(data3 => {
        $
        $('#streamingBox').show()
        
        var streamingArr = {title:[], url:[]}
        for(i = 0;i < data3.sources.length; i++) {
            if (streamingArr.title.includes(data3.sources[i].name) === false) {
                streamingArr.title.push(data3.sources[i].name);
                console.log('title added', i)
                streamingArr.url.push(data3.sources[i].web_url);
                console.log('total loops', i, streamingArr)
            }
        }
        for (i = 0; i < streamingArr.title.length; i++) {
            console.log('streaming Array item', streamingArr.title[i])
            console.log(streamingArr.url[i])
            $('#streamingBox').append(`
                <div class="m-6 is-size-4">
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
