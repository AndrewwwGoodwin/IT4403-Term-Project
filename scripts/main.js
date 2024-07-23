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
    let sortDiv = $("#options");
    let paginationDiv = $("#pagination");
    let searchTypeElement = $("#search-type");
    let searchInputElement = $("#search-input")
    let trendingSearchElement = $("#trending-button");
    let searchSubmitButtonElement = $("#search-button");
    let popularSearchElement = $("#popular-button");
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
                DrawTiles(data, resultsBox, paginationDiv, sortDiv)
            } catch(err) {
                console.log("Failed to perform a search")
                console.log(err)
            }
        }
    })

    //when we click the "trending" button this block will execute
    trendingSearchElement.click(async function () {
        resultsBox.empty()
        let searchType = searchTypeElement.val()
        try {
            let data = await getTrending(searchType,"week")
            DrawTiles(data, resultsBox, paginationDiv, sortDiv)
        } catch(err) {
            console.log("Failed to pull trending")
            console.log(err)
        }
    })

    popularSearchElement.click(async function () {
        resultsBox.empty()
        let searchType = searchTypeElement.val()
        if (searchType === "multi") {
            console.log("popular cant be multi, defaulting to Movies instead")
            searchType = "movie"
        } else if (searchType === "person"){
            searchType = "people"
        }
        try {
            let data = await getPopular(1,searchType)
            console.log(data)
            DrawTiles(data, resultsBox, paginationDiv, sortDiv)
        } catch(err) {
            console.log("Failed to pull Popular")
            console.log(err)
        }
    })
})

function DrawTiles(data, resultsBox, paginationDiv, sortDiv){

    // check if our pagination and sort is visible
    if(sortDiv.css("visibility") === "hidden"){
        sortDiv.css("visibility", "visible")
    }
    if (paginationDiv.css("visibility") === "hidden"){
        paginationDiv.css("visibility", "visible")
    }

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

        // really, really need a better filler image for this.
        // checks if the image URL is valid, and if it isn't, inserts a filler image
        if(imgURL.includes("null")||imgURL.includes("undefined")){
            $("<img>").attr("src", "./images/MissingCover.png").appendTo(tile)

        } else {
            $("<img>").attr("src", imgURL).appendTo(tile)
        }

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