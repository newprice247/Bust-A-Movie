//API keys
// var movieDatabaseApi = `http://www.omdbapi.com/?t==${title}&apikey=611f00c7`
// var watchmodeStreamingApi =  `https://api.watchmode.com/v1/title/345534/details/?apiKey=6N5wEhqG1MjX7EYLU4zvfMui5TyhL4Io8eUxuhM5&append_to_response=sources`
// var tmdbApi = 'https://api.themoviedb.org/3/search/movie?query=Jack+Reacher&api_key=b3783de294fab53f3b5f107706f3d99e'


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
    //calls the movieSearch function and searches for the title of the movie
    movieSearch(title)
    //If statement for the search field being empty when the button is clicked
    if ($('#searchBar').val() === "") {
        console.log('Please enter a movie title')
    }
})

//Event listener for the navbar buttons
$('#about').on('click', function() {
    aboutPage()
})

$('#search').on('click', function() {
    searchPage()
})



var aboutPage = () => {
    $('#searchForMovie').html(`
        <div class="is-size-4">
            <p>Welcome to Bust-A-Movie, your ultimate movie companion in the digital age! 🎬🍿 Dive into a world of cinematic excitement as we blend the magic of "bust a move" with the thrill of blockbuster hits. With our cutting-edge APIs, we bring you instant access to a treasure trove of movie information - from plot summaries that will leave you in awe, to cast and crew details that will make you feel like an insider.

            But that's not all! Bust-A-Movie takes your movie night to the next level by seamlessly integrating streaming data. Say goodbye to endless scrolling and hello to instant gratification - with a single click, discover exactly where to stream the movies you're searching for. Whether it's the latest Hollywood sensation or a hidden gem from across the globe, we've got your streaming desires covered.
            
            So why wait? Embark on a cinematic journey like never before with Bust-A-Movie. Unleash your inner cinephile, gather your popcorn, and let's "bust a movie" night together! 🌟🎉</p>
        </div>
    
    `)
}

var searchPage = () => {
    console.log('searchPage func called')
    $('#searchForMovie').html(`
    <p class="is-size-3">Use the search bar below to find a movie!</p>
      <div class="box m-6 has-background-dark columns is-justify-content-center">
        <div class="field has-addons is-justify-content-center box column is-6 has-background-primary is-align-items-center">
          <p class="control">
            <input id="searchBar" class="input" type="text" placeholder="Title of Movie or Show">
          </p>
          <p class="control">
            <button id="searchButton" class="button">
              Search
            </button>
          </p>
        </div>
      </div>
      <div id="searchResults" class="has-background-light columns">
      </div>
    `)
}


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
            for (var i=0; i<10; i++){
                var movieId = searchResults[i].tmdb_id
                console.log(searchResults[i].tmdb_id)
                var poster = searchResults[i].image_url
                $('#searchResults').append(`
                    <div id="${movieId}" class="column has-background-dark">
                        <p>${searchResults[i].name}</p>
                        <a>
                            <img class="resultButton" src="${poster}">
                        </a>
                    </div>
                `)
            }
            
            $('.resultButton').on('click', function() {
                var id = $(this).parents('.column').attr('id')
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

        var imdbId = data.imdb_id
        console.log(imdbId)
        console.log(data)
        var genres = []
        for (i = 0; i < data.genres.length; i++) {
            genres += data.genres[i].name
            genres += '  '
            console.log(genres)
        }

        var image = '"https://image.tmdb.org/t/p/w300/'
        var name = data.original_title;
        
        $('#searchForMovie').html(`
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
        var nameArr = name.split(' ')
        let nameStringRotten = nameArr.join('_')
        let nameStringMeta = nameArr.join('-').toLowerCase()

        console.log(nameStringRotten)
        console.log(nameStringMeta)
        console.log(name)
        console.log(nameArr)
        console.log(data2);
        console.log(data2.Title);
        console.log(data2.Plot);

        $('#searchForMovie').append(`
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


