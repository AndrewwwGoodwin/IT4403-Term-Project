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
    let resultsBox = $("#results");

    searchSubmitButtonElement.click(async function () {
        // check that the input is valid
        if(searchInputElement.val() !== "" || searchInputElement.val() !== null){
            resultsBox.empty()
            let searchInputValue = searchInputElement.val();
            let searchType = searchTypeElement.val()
            try {
                let data = await getSearchResults(searchInputValue, searchType, 1)
                console.log(data)
                // now that we have our info lets make some tiles
                DrawTiles(data, resultsBox)
            } catch(err) {
                console.log("Failed to perform a search")
                console.log(err)
            }
        }
    })
})



function DrawTiles(data, resultsBox){
    for(let entry of data.results){
        let tile = $("<div></div>")
            .attr("class", "resultsCard")
            .attr("id", entry.id)
            .appendTo(resultsBox);
        let imgURL = "https://image.tmdb.org/t/p/original";
        switch(entry.media_type) {
            case "tv":
                imgURL += entry.poster_path;
                break
            case "movie":
                imgURL += entry.poster_path
                break
            default:
                imgURL += entry.profile_path
                break
        }

        // need to add a check to see if poster_path exists, and if it doesn't replace with some "missing image" type thing
        $("<img>").attr("src", imgURL).appendTo(tile)

        switch (entry.media_type){
            case "tv":
                $("<p>").appendTo(tile).html(entry.name)
                break
            case "movie":
                $("<p>").appendTo(tile).html(entry.title)
                break
            default:
                $("<p>").appendTo(tile).html(entry.name)
                break
        }
    }
}