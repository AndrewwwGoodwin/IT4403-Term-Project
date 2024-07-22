// this file should be functions for interacting and pulling info from TMDB
// it's our little "almost a wrapper"

// using getSearchResults, you are able to query TMDB for movies, tv shows, people, or all of them at once
// valid searchTypes are ("movie", "person", "tv", "multi")
async function getSearchResults(searchQuery, searchType, page = 1, accessTokenAuthKey) {
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
    let headerParameters = {
        Authorization: `Bearer ${accessTokenAuthKey}`
    }

    //finally lets make the call
    try {
        return $.ajax(queryURL, {
            type: "GET",
            accepts: "application/json",
            headers: headerParameters,
            data: queryParams
        });
    } catch (error) {
        console.log("Failed to complete search request")
        console.log(error)
        return []
    }
}

// gets trending movies from TMDB over a time period. valid types are ("movie", "person", "tv", "all)
//valid time periods are ("day", "week)
async function getTrending(type, timePeriod, accessTokenAuthKey) {
    let queryURL;
    switch (type.toLowerCase()) {
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

// gets popular movies from TMDB. valid types are as follows: ("tv", "movie", "people")
async function getPopular(page = 1, type, accessTokenAuthKey){
    let queryURL;
    switch (type.toLowerCase()) {
        case "tv":
            queryURL = "https://api.themoviedb.org/3/tv/popular"
            break
        case "movie":
            queryURL = "https://api.themoviedb.org/3/movie/popular"
            break
        case "people":
            queryURL = "https://api.themoviedb.org/3/person/popular"
    }

    let queryParams = {
        language: "en-US",
        page: page,
        region: "US"
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
        console.log("Failed to complete search request")
        console.log(error)
        return []
    }
}

//gets detailed information from TMDB. Valid type are: ("tv", "movie", "people")
async function getDetailedInfo(id,type,accessTokenAuthKey){
    let queryURL;
    switch(type.toLowerCase()){
        case "movie":
            queryURL = "https://api.themoviedb.org/3/movie/"
            break
        case "tv":
            queryURL = "https://api.themoviedb.org/3/tv/"
            break
        case "people":
            queryURL = "https://api.themoviedb.org/3/people/"
            break
        default:
            console.log("Invalid Query Type: ", type)
            return []
    }
    queryURL += id.toString()

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
        });
    } catch (error) {
        console.log("Failed to complete search request")
        console.log(error)
        return []
    }
}