// wow, look at all that js!
// let's leave this file mostly for interacting with the document/dom/whatever
$(document).ready(async function () {
    // block of example API interaction
    //let token = "access token should go here"
    //let data = await getSearchResults("Kung Fu Panda", "movie", 1)
    //let data = await getTrending("all", "week")
    //let data = await getPopular(1, "movie")
    //let data = await getDetailedInfo(1022789, "movie")
    //console.log(data);


    // define some globals here that represents HTML elements
    let searchTypeElement = $("#search-type");
    let searchInputElement = $("#search-input")
    let trendingSearchElement = $("#trending-button");
    let searchSubmitButtonElement = $("#search-button");
    searchSubmitButtonElement.click(async function () {
        // check that the input is valid
        if(searchInputElement.val() !== "" || searchInputElement.val() !== null){
            let searchInputValue = searchInputElement.val();
            let searchType = searchTypeElement.val()
            try {
                let data = await getSearchResults(searchInputValue, searchType, 1)
                console.log(data)
            } catch(err) {
                console.log("Failed to perform a search")
                console.log(err)
            }
        }
    })
})



