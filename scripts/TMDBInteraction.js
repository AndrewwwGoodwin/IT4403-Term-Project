// this file should be functions for interacting and pulling info from our php wrapper
// it's written like this to protect our API key from the public, while maintaining functionality
let queryURL = "https://it4403termproject.azurewebsites.net/php/TMDB.php"
// using getSearchResults, you are able to query TMDB for movies, tv shows, people, or all of them at once
// valid searchTypes are ("movie", "person", "tv", "multi")
async function getSearchResults(searchQuery, searchType, page = 1) {
    //set our endpoint based on what type of search we want to perform
    //since this is a school project, lets just set include_adult to always be false
    let queryParams = {
        "requestType": "getSearchResults",
        "searchQuery": searchQuery,
        "page": page,
        "searchType": searchType,
    }

    //finally lets make the call
    try {
        let data = await $.ajax(queryURL, {
            type: "GET",
            accepts: "application/json",
            data: queryParams
        });

        // if type !== multi we need to go in and manually add data.results.entry.media_type
        if(searchType !== "multi"){
            let responseData = JSON.parse(data)
            for (let entry of responseData.results) {
                entry.media_type = searchType
            }
            return responseData;
        }
        return JSON.parse(data)
    } catch (error) {
        console.log("Failed to complete search request")
        console.log(error)
        return []
    }
}

// gets trending movies from TMDB over a time period. valid types are ("movie", "person", "tv", "all)
//valid time periods are ("day", "week)
async function getTrending(type, timePeriod) {
    // finally have our query url all written up, time to make the request
    let queryParams = {
        requestType: "getTrending",
        timePeriod: timePeriod,
        type: type
    }
    try {
        let data = await $.ajax(queryURL, {
            type: "GET",
            accepts: "application/json",
            data: queryParams
        })
        return JSON.parse(data)
    } catch (error) {
        console.log("Failed to pull trending feed")
        console.log(error)
        return []
    }
}

// gets popular movies from TMDB. valid types are as follows: ("tv", "movie", "people")
async function getPopular(page = 1, type){
    let queryParams = {
        page: page,
        type: type,
        requestType: "getPopular"
    }
    try {
        let data = await $.ajax(queryURL, {
            type: "GET",
            accepts: "application/json",
            data: queryParams
        })
        return JSON.parse(data)
    } catch (error) {
        console.log("Failed to complete search request")
        console.log(error)
        return []
    }
}

//gets detailed information from TMDB. Valid type are: ("tv", "movie", "people")
async function getDetailedInfo(id,type){
    let queryParams = {
        requestType: "getDetailedInfo",
        id: id,
        type: type
    }

    try {
        let data = await $.ajax(queryURL, {
            type: "GET",
            accepts: "application/json",
            data: queryParams
        });
        return JSON.parse(data)
    } catch (error) {
        console.log("Failed to complete search request")
        console.log(error)
        return []
    }
}