// wow, look at all that js!

$(document).ready(async function () {
    //let data = await getSearchResults("Kung Fu Panda", "movie")
    //let token = "AccessTokenAuth key should go here"
    //let data = await getTrending("all", "week", token)
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

// for whatever reason this endpoint requires authorization via token
// which introduces its own set of issues, since we shouldn't share our keys in plaintext javascript.
// there's probably some way to fix this with php, but I don't really know how that works.
// valid options are as following
// (movie, people, tv, all)
// (day, week)
async function getTrending(type, timePeriod, accessTokenAuthKey) {
    let queryURL;
    switch (type) {
        case "movie":
            queryURL = "https://api.themoviedb.org/3/trending/movie/"
            break
        case "person":
            queryURL = "https://api.themoviedb.org/3/trending/person/"
            break
        case "tv":
            queryURL = "https://api.themoviedb.org/3/trending/tv"
            break
        case "all":
            queryURL = "https://api.themoviedb.org/3/trending/all/"
            break
        default:
            console.log("Invalid Query Type: ", type)
            console.log("Falling back to all as alternative");
            queryURL = "https://api.themoviedb.org/3/trending/all/"
            break
    }
    // next we need to append our timePeriod to the queryURL
    // valid options are day or week.
    switch (timePeriod.toLowerCase()) {
        case "day":
            queryURL += "day"
            break
        case "week":
            queryURL += "week"
            break
        default:
            console.log("Invalid time period: ", timePeriod)
            console.log("Setting time period to week as fallback")
            queryURL += "week"
            break
    }

    // finally have our query url all written up, time to make the request
    let queryParams = {
        language: "en-US",
    }
    let headerParameters = {
        Authorization: `Bearer ${accessTokenAuthKey}`
    }

    try {
        return $.ajax(queryURL, {
            type: "GET",
            accepts: "application/json",
            headers: headerParameters,
            data: queryParams
        })
    } catch (error) {
        console.log("Failed to pull trending feed")
        console.log(error)
        return []
    }
}