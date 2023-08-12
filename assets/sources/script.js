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

//Search function
var movieSearch = (title) => {
    console.log('Search button clicked');
    console.log(title);
    var watchmodeSearch = `https://api.watchmode.com/v1/autocomplete-search/?apiKey=6N5wEhqG1MjX7EYLU4zvfMui5TyhL4Io8eUxuhM5&search_value=${title}&search_type=2`;
    
    fetch(watchmodeSearch)
        .then(function (response) {
            return response.json()
        })
        .then(function (searchData) {
            console.log(searchData)
            var searchResults = (searchData.results)
            console.log(searchResults)
            $('#searchResults').html(``)
            for (var i=0; i<5; i++){
                var movieId = searchResults[i].tmdb_id
                if(movieId === undefined) {
                    console.log('no more movies')
                    break
                }
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
// var movieSearch = (title) => {
//     console.log('Search button clicked');
//     console.log(title);
//     var movieDatabaseSearch = `https://www.omdbapi.com/?s=${title}&page=1&apikey=611f00c7`;
    
//     fetch(movieDatabaseSearch)
//         .then(function (response) {
//             return response.json()
//         })
//         .then(function (searchData) {
//             console.log(searchData)
//             var searchResults = (searchData.Search)
//             $('#searchResults').html(``)
//             for (var i=0; i<5; i++){
//                 var movieId = searchResults[i].imdbID
//                 var poster = searchResults[i].Poster
//                 $('#searchResults').append(`
//                     <div id="${movieId}" class="column has-background-dark">
//                         <p>${searchResults[i].Title}</p>
//                         <a>
//                             <img class="resultButton" src="${poster}">
//                         </a>
//                     </div>
//                 `)
//             }
            
//             $('.resultButton').on('click', function() {
//                 var id = $(this).parents('.column').attr('id')
//                 console.log(id)
//                 showResults(id)
//                 console.log('Search Result Button clicked')
//             })
//         })
// }  

var showResults = (id) => {
    tmdbSearch = `https://api.themoviedb.org/3/movie/${id}?api_key=b3783de294fab53f3b5f107706f3d99e`;
    fetch(tmdbSearch)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        var imdbId = data.imdb_id
        console.log(imdbId)
        console.log(data)
        var genres = []
        for (i = 0; i < data.genres.length; i++) {
            genres += data.genres[i].name
            genres += '  '
            console.log(genres)
        }

        // var genres = genreArr.split(' ')
        var image = '"https://image.tmdb.org/t/p/w300/'
        var name = data.original_title;
        // var nameArr = name.split(' ')
        // let nameString = nameArr.join('_')
        // console.log(nameString)
        // console.log(name)
        // console.log(nameArr)
        // console.log(data);
        // console.log(data.Title);
        // console.log(data.Plot);
        
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
    .then(function (data2) {
        console.log(data2)
        var name = data2.Title
        var nameArr = name.split(' ')
        let nameString = nameArr.join('_')
        console.log(nameString)
        console.log(name)
        console.log(nameArr)
        console.log(data2);
        console.log(data2.Title);
        console.log(data2.Plot);

        $('#searchForMovie').append(`
        <div id="ratingsBox">
            <p>Ratings:</p>
            <p>Rotten Tomatoes: ${data2.Ratings[1].Value}.</p>
            <a target="_blank" href="https://www.rottentomatoes.com/m/${nameString}">
                <img src="./assets/images/Rotten_Tomatoes_logo.svg.png" alt="Movie Poster">
            </a>
            <p>IMDb: ${data2.Ratings[0].Value}</p>
            <a target="_blank" href="https://www.imdb.com/title/${data2.imdbID}/">
                <img src="./assets/images/IMDB_Logo.png" alt="Movie Poster">
            </a>
        </div>
        `)

        return data2
    })
    .then(function (data2) {
        var name = data2.Title;
        var nameArr = name.split(' ')
        let nameString = nameArr.join('-').toLowerCase()
        console.log(nameString.toLowerCase())
        $('#ratingsBox').append(`
                <p>Metacritic: ${data2.Ratings[2].Value}</p>
                <a target="_blank" href="https://www.metacritic.com/movie/${nameString}">
                        <img src="./assets/images/Metacritic_logo2.png" alt="Movie Poster">
                </a>`)
        return fetch(`https://api.watchmode.com/v1/title/${data2.imdbID}/details/?apiKey=6N5wEhqG1MjX7EYLU4zvfMui5TyhL4Io8eUxuhM5&append_to_response=sources`)
    })
    .then(response => {
        return response.json();
    })
    .then(function (data3) {
        console.log(data3)
    })

}


// {/* <p>Rated: ${data.Rated}</p> */}


