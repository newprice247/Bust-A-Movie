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
    // var imdbID
    var movieDatabaseApi = `http://www.omdbapi.com/?t==${title}&apikey=611f00c7`;
    
    
    // var imdbID = ''

    fetch(movieDatabaseApi)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            imdbID = data.imdbID;
            console.log(data);
            console.log(data.Title);
            console.log(data.Plot);
            $('#searchForMovie').html(`
            <p class="is-size-3">It worked!</p>
            <div class="box">
                <p>Title: ${data.Title}</p>
                <p>Year:  ${data.Year}</p>
                <img src="${data.Poster}" alt="Movie Poster">
                <p>Ratings:</p>
                <p>IMDb: ${data.Ratings[0].Value}</p>
                <p>Rotten Tomatoes: ${data.Ratings[1].Value}.</p>
                <p>Metacritic: ${data.Ratings[2].Value}</p>
                
            </div>
            `)
        }) 
        // console.log(imdbID)
    
    
    // var watchmodeStreamingApi =  `https://api.watchmode.com/v1/title/${imdbID}/details/?apiKey=6N5wEhqG1MjX7EYLU4zvfMui5TyhL4Io8eUxuhM5&append_to_response=sources`

    // fetch(watchmodeStreamingApi)
    //     .then(function (response) {
    //         return response.json()
    //     })
    //     .then(function (data) {
    //         console.log(data)
    //     })

}       

// {Title: 'Up', Year: '2009', Rated: 'PG', Released: '29 May 2009', Runtime: '96 min', …}
// Actors
// : 
// "Edward Asner, Jordan Nagai, John Ratzenberger"
// Awards
// : 
// "Won 2 Oscars. 80 wins & 87 nominations total"
// BoxOffice
// : 
// "$293,004,164"
// Country
// : 
// "United States, Japan"
// DVD
// : 
// "01 Jan 2014"
// Director
// : 
// "Pete Docter, Bob Peterson"
// Genre
// : 
// "Animation, Adventure, Comedy"
// Language
// : 
// "English"
// Metascore
// : 
// "88"
// Plot
// : 
// "78-year-old Carl Fredricksen travels to Paradise Falls in his house equipped with balloons, inadvertently taking a young stowaway."
// Poster
// : 
// "https://m.media-amazon.com/images/M/MV5BYjBkM2RjMzItM2M3Ni00N2NjLWE3NzMtMGY4MzE4MDAzMTRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg"
// Production
// : 
// "N/A"
// Rated
// : 
// "PG"
// Ratings
// : 
// (3) [{…}, {…}, {…}]
// Released
// : 
// "29 May 2009"
// Response
// : 
// "True"
// Runtime
// : 
// "96 min"
// Title
// : 
// "Up"
// Type
// : 
// "movie"
// Website
// : 
// "N/A"
// Writer
// : 
// "Pete Docter, Bob Peterson, Tom McCarthy"
// Year
// : 
// "2009"
// imdbID
// : 
// "tt1049413"
// imdbRating
// : 
// "8.3"
// imdbVotes
// : 
// "1,080,506"