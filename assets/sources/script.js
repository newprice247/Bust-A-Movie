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
    var movieDatabaseApi = `http://www.omdbapi.com/?s=${title}&page=1&apikey=611f00c7`;
    
    
    // var imdbID = ''

    fetch(movieDatabaseApi)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            var searchResults = (data.Search)
            console.log(searchResults)
            // for (i=0)
        //     var name = data.Title;
        //     var nameArr = name.split(' ')
        //     let nameString = nameArr.join('_')
        //         console.log(nameString)
        //     console.log(name)
        //     console.log(nameArr)
        //     console.log(data);
        //     console.log(data.Title);
        //     console.log(data.Plot);
            
        //     $('#searchForMovie').html(`
        //     <p class="is-size-3">It worked!</p>
        //     <div class="box">
        //         <p>Title: ${data.Title}</p>
        //         <p>Year:  ${data.Year}</p>
        //         <p>Rated: ${data.Rated}</p>
        //         <img src="${data.Poster}" alt="Movie Poster">
        //         <p>Genre: ${data.Genre}</p>
        //         <div id="ratingsBox">
        //             <p>Ratings:</p>
        //             <p>Rotten Tomatoes: ${data.Ratings[1].Value}.</p>
        //             <a target="_blank" href="https://www.rottentomatoes.com/m/${nameString}">
        //                 <img src="./assets/images/Rotten_Tomatoes_logo.svg.png" alt="Movie Poster">
        //             </a>
        //            <p>IMDb: ${data.Ratings[0].Value}</p>
                   
        //             <a target="_blank" href="https://www.imdb.com/title/${data.imdbID}/">
        //                 <img src="./assets/images/IMDB_Logo.png" alt="Movie Poster">
        //             </a>
        //         </div>
        //     </div>
        //     `)

        //     return data
        // })
        // .then(function (data) {
        //     var name = data.Title;
        //     var nameArr = name.split(' ')
        //     let nameString = nameArr.join('-').toLowerCase()
        //     console.log(nameString.toLowerCase())
        //     $('#ratingsBox').append(`
        //             <p>Metacritic: ${data.Ratings[2].Value}</p>
        //             <a target="_blank" href="https://www.metacritic.com/movie/${nameString}">
        //                     <img src="./assets/images/Metacritic_logo2.png" alt="Movie Poster">
        //             </a>`)
        })

        // let string = 'lets make a website'
        // var arr1 = string.split(' ')
        // console.log(arr1)
    
    
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