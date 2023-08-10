//API keys
// var movieDatabaseApi = `http://www.omdbapi.com/?t==${title}&apikey=611f00c7`
// var watchmodeStreamingApi =  `https://api.watchmode.com/v1/title/345534/details/?apiKey=6N5wEhqG1MjX7EYLU4zvfMui5TyhL4Io8eUxuhM5&append_to_response=sources`





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
    var movieDatabaseApi = `http://www.omdbapi.com/?t==${title}&page=1&apikey=611f00c7`;
    
    fetch(movieDatabaseApi)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            // var searchResults = (data.Search)
            console.log(data)
            // for (var i=0; i<5; i++){
            //     console.log(searchResults[i].Title)
            // }
            var name = data.Title;
            var nameArr = name.split(' ')
            let nameString = nameArr.join('_')
            console.log(nameString)
            console.log(name)
            console.log(nameArr)
            console.log(data);
            console.log(data.Title);
            console.log(data.Plot);
            
            $('#searchForMovie').html(`
            <p class="is-size-3">It worked!</p>
            <div class="box">
                <p>Title: ${data.Title}</p>
                <p>Year:  ${data.Year}</p>
                <p>Rated: ${data.Rated}</p>
                <img src="${data.Poster}" alt="Movie Poster">
                <p>Genre: ${data.Genre}</p>
                <div id="ratingsBox">
                    <p>Ratings:</p>
                    <p>Rotten Tomatoes: ${data.Ratings[1].Value}.</p>
                    <a target="_blank" href="https://www.rottentomatoes.com/m/${nameString}">
                        <img src="./assets/images/Rotten_Tomatoes_logo.svg.png" alt="Movie Poster">
                    </a>
                   <p>IMDb: ${data.Ratings[0].Value}</p>
                   
                    <a target="_blank" href="https://www.imdb.com/title/${data.imdbID}/">
                        <img src="./assets/images/IMDB_Logo.png" alt="Movie Poster">
                    </a>
                </div>
            </div>
            `)
            return data;
        })
        .then(function (data) {
            var name = data.Title;
            var nameArr = name.split(' ')
            let nameString = nameArr.join('-').toLowerCase()
            console.log(nameString.toLowerCase())
            $('#ratingsBox').append(`
                    <p>Metacritic: ${data.Ratings[2].Value}</p>
                    <a target="_blank" href="https://www.metacritic.com/movie/${nameString}">
                            <img src="./assets/images/Metacritic_logo2.png" alt="Movie Poster">
                    </a>`)
            return fetch(`https://api.watchmode.com/v1/title/${data.imdbID}/details/?apiKey=6N5wEhqG1MjX7EYLU4zvfMui5TyhL4Io8eUxuhM5&append_to_response=sources`)
        })
        .then(response => {
            return response.json();
        })
        .then(function (data2) {
            console.log(data2)
        })
        .catch(error => {
            console.error(error);
          });
}       

console.log('different')

console.log('git pull')

var hellerr 