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
    console.log('Search button clicked')
    console.log(title)
    var imdbID
    var movieDatabaseApi = `http://www.omdbapi.com/?t==${title}&apikey=611f00c7`
    var watchmodeStreamingApi =  `https://api.watchmode.com/v1/title/${imdbID}/details/?apiKey=6N5wEhqG1MjX7EYLU4zvfMui5TyhL4Io8eUxuhM5&append_to_response=sources`
    fetch(movieDatabaseApi)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            imdbID = data.imdbID
            console.log(imdbID)
            // return imdbID
        }) 
        // console.log(imdbID)
    
    // fetch(watchmodeStreamingApi)
    //     .then(function (response) {
    //         return response.json()
    //     })
    //     .then(function (data) {
    //         console.log(data)
    //     })

}       

