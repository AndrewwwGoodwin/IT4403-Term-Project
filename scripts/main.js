// wow, look at all that js!

$(document).ready(async function () {
    //let data = await getSearchResults("Kung Fu Panda", "movie")
    //console.log(data.results)
})

// using getSearchResults, you are able to query TMDB for movies, tv shows, people, or all of them at once
async function getSearchResults(searchQuery, searchType, page = 1) {
    let queryURL;
    //set our endpoint based on what type of search we want to perform
    switch (searchType){
        case "movie":
            queryURL = "https://api.themoviedb.org/3/search/movie"
            break
        case "person":
            queryURL = "https://api.themoviedb.org/3/search/person"
            break
        case "tv":
            queryURL = "https://api.themoviedb.org/3/search/tv"
            break
        case "multi":
            queryURL = "https://api.themoviedb.org/3/search/multi"
            break
        default:
            console.log("Invalid Query Type: ", searchType)
            console.log("Falling back to Multi SearchType as alternative");
            queryURL = "https://api.themoviedb.org/3/search/multi"
    }

    //since this is a school project, lets just set include_adult to always be false
    let queryParams = {
        "query": searchQuery,
        "include_adult": false,
        "language": "en-US",
        "page": page
    }

    //finally lets make the call
    try {
        return $.ajax(queryURL, {
            type: "GET",
            accepts: "application/json",
            data: queryParams
        });
    } catch (error) {
        console.log("Failed to complete search request")
        console.log(error)
        return []
    }
}