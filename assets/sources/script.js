//API keys
// var movieDatabaseApi = `http://www.omdbapi.com/?t==${title}&apikey=611f00c7`
// var watchmodeStreamingApi =  `https://api.watchmode.com/v1/title/345534/details/?apiKey=6N5wEhqG1MjX7EYLU4zvfMui5TyhL4Io8eUxuhM5&append_to_response=sources`
// var tmdbApi = 'https://api.themoviedb.org/3/search/movie?query=Jack+Reacher&api_key=b3783de294fab53f3b5f107706f3d99e'

$('#searchForMovie').hide()


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
})

//Event listener for the navbar buttons
$('#about').on('click', function() {
    $('#aboutPage').show()
    $('#searchForMovie').hide()
    $('#displayResults').hide()
})

$('#search').on('click', function() {
    $('#aboutPage').hide()
    $('#searchForMovie').show()
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
        <div class="box">
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

        $('#displayResults').append(`
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
        console.log(data3)
    })

}


// {/* <p>Rated: ${data.Rated}</p> */}


