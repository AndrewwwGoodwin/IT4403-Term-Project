// wow, look at all that js!
// let's leave this file mostly for interacting with the document/dom/whatever

let currentPage = 1
let searchInputValue;
let searchType
let maxPages;
let sortOption;

$(document).ready(async function () {
    // block of example API interaction
    //let token = "access token should go here"
    //let data = await getSearchResults("Kung Fu Panda", "movie", 1)
    //let data = await getTrending("all", "week")
    //let data = await getPopular(1, "movie")
    //let data = await getDetailedInfo(1022789, "movie")
    //console.log(data);

    // define some globals here that represents HTML elements
    let sortDropdown = $("#sort-options")
    let sortDiv = $("#options");
    let paginationDiv = $("#pagination");
    let paginationNext = $("#next-page");
    let paginationPrev = $("#previous-page");
    let paginationDisplay = $("#page-number");
    let searchTypeElement = $("#search-type");
    let searchInputElement = $("#search-input")
    let trendingSearchElement = $("#trending-button");
    let searchSubmitButtonElement = $("#search-button");
    let popularSearchElement = $("#popular-button");
    let modalExitButtonElement = $("#close-modal");
    let resultsBox = $("#results");
    let lastSearchDataType;


    searchSubmitButtonElement.click(async function () {
        // check that the input is valid
        if (searchInputElement.val() !== "" || searchInputElement.val() !== undefined) {
            resultsBox.empty()
            searchInputValue = searchInputElement.val();
            searchType = searchTypeElement.val()
            sortOption = sortDropdown.find(":selected").val()
            try {
                let data = await getSearchResults(searchInputValue, searchType, 1)
                lastSearchDataType = "search"
                currentPage = 1
                maxPages = data.total_pages || 1
                console.log(data)
                // now that we have our info lets make some tiles
                DrawTiles(data, resultsBox, paginationDiv, sortDiv, "search")
            } catch (err) {
                console.log("Failed to perform a search")
                console.log(err)
            }
        }
    })

    paginationNext.click(async function () {
        if (currentPage + 1 > 0 && currentPage + 1 <= maxPages) {
            currentPage += 1
            paginationDisplay.text(currentPage)
            await reDrawTiles(currentPage, lastSearchDataType)
        }
    })

    paginationPrev.click(async function () {
        if (currentPage - 1 > 0 && currentPage - 1 <= maxPages) {
            currentPage -= 1
            paginationDisplay.text(currentPage)
            await reDrawTiles(currentPage, lastSearchDataType)
        }
    })

    //when we click the "trending" button this block will execute
    trendingSearchElement.click(async function () {
        resultsBox.empty()
        sortOption = "none"
        let searchType = searchTypeElement.val()
        try {
            let data = await getTrending(searchType, "week")
            DrawTiles(data, resultsBox, paginationDiv, sortDiv, "trending")
        } catch (err) {
            console.log("Failed to pull trending")
            console.log(err)
        }
    })

    popularSearchElement.click(async function () {
        resultsBox.empty()
        sortOption = "none"
        searchType = searchTypeElement.val()
        if (searchType === "multi") {
            console.log("popular cant be multi, defaulting to Movies instead")
            searchType = "movie"
        }
        try {
            let data = await getPopular(1, searchType)
            lastSearchDataType = "popular"
            maxPages = data.total_pages
            console.log(data)
            DrawTiles(data, resultsBox, paginationDiv, sortDiv, "popular")
        } catch (err) {
            console.log("Failed to pull Popular")
            console.log(err)
        }
    })

    modalExitButtonElement.click(async function () {
        console.log("x")
        $(".modal").css("visibility", "hidden")
    })

    async function reDrawTiles(newPage, dataType) {
        let data;
        sortOption = sortDropdown.find(":selected").val()
        switch (dataType) {
            case "search":
                console.log(searchInputValue, searchType, newPage)
                data = await getSearchResults(searchInputValue, searchType, newPage)
                break
            case "popular":
                data = await getPopular(newPage, searchType)
                break
        }
        resultsBox.empty()
        DrawTiles(data, resultsBox, paginationDiv, sortDiv, dataType)
    }
    //whenever a new sort is chosen, redraw the page to match
    sortDropdown.change(function (){
        sortOption = sortDropdown.find(":selected").val()
        reDrawTiles(currentPage, lastSearchDataType)
    })
})

function DrawTiles(data, resultsBox, paginationDiv, sortDiv, datatype) {
    switch (datatype) {
        // for a search we want pagination and sorting options to be visible
        case "search":
            if (sortDiv.css("visibility") === "hidden") {
                sortDiv.css("visibility", "visible")
            }
            if (paginationDiv.css("visibility") === "hidden") {
                paginationDiv.css("visibility", "visible")
            }
            break;

        // for trending we don't want any buttons to appear
        case "trending":
            sortDiv.css("visibility", "hidden")
            paginationDiv.css("visibility", "hidden")
            break
        // and for popular we can have pagination, but that's it.
        case "popular":
            sortDiv.css("visibility", "hidden")
            if (paginationDiv.css("visibility") === "hidden") {
                paginationDiv.css("visibility", "visible")
            }
            break
        default:
            break
    }
    let sortType = sortOption || "none"
    data = sortData(data, sortType)

    for (let entry of data.results) {
        let imgURL = "https://image.tmdb.org/t/p/original";
        switch (entry.media_type) {
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

        if (imgURL.includes("null") || imgURL.includes("undefined")) {
            imgURL = "./images/MissingCover.png"
        }
        let image = $("<img>").attr("src", imgURL)

        let tile = $("<div></div>")
            .attr("class", "resultsCard")
            .attr("id", entry.id)
            .appendTo(resultsBox)
            .click(async function () {
                //console.log(entry.id)
                try {
                    if (entry.media_type === "people") {
                        entry.media_type = "person"
                    }
                    let detailedInfo = await getDetailedInfo(entry.id, entry.media_type)
                    console.log(imgURL)
                    DrawDetailedInfoScreen(detailedInfo, entry.media_type, imgURL)
                } catch (err) {
                    console.log("failed to pull detailed info for " + entry.id)
                    console.log(err)
                }
            });
        image.appendTo(tile)

        switch (entry.media_type) {
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

function DrawDetailedInfoScreen(detailedInfo, mediaType, imageURL) {
    console.log(detailedInfo);
    console.log(mediaType)
    // Populate modal with detailed information
    const detailsDiv = $("#details");
    detailsDiv.empty();
    switch (mediaType) {
        case "tv":
            const titleTV = $("<h2>").text(detailedInfo.name || "")
            const imageTV = $("<img>").attr("src", imageURL).attr("id", "modalImg")
            const popularityScoreTV = $("<p>").html("<b>Popularity Score:</b> " + detailedInfo.popularity || "")
            const voteAvgTV = $("<p>").html("<b>Average Rating:</b> " + detailedInfo.vote_average || "")
            const voteCountTV = $("<p>").html("<b>Rating Count:</b> " + detailedInfo.vote_count || "")
            const firstAirDateTV = $("<p>").html("<b>First Air Date:</b> " + detailedInfo.first_air_date || "")
            const seasonCountTV = $("<p>").html("<b>Season Count:</b> " + detailedInfo.number_of_seasons || "")
            const episodeCountTV = $("<p>").html("<b>Episode Count:</b> " + detailedInfo.number_of_episodes || "")
            const overviewTextTV = $("<p>").html("<b>Overview:</b><br> " + detailedInfo.overview || "")
            const mediaTypeTV = $("<p>").html("<b>Media Type:</b> TV Show")
            detailsDiv.append(titleTV, imageTV, popularityScoreTV, voteAvgTV, voteCountTV, firstAirDateTV, seasonCountTV, episodeCountTV, overviewTextTV, mediaTypeTV)
            break;
        case "movie":
            //title
            const titleMovie = $("<h2>").text(detailedInfo.title || "")
            const taglineMovie = $("<h3>").text(detailedInfo.tagline || "")
            const imageMovie = $("<img>").attr("src", imageURL)
            const popularityScoreMovie = $("<p>").html("<b>Popularity Score:</b> " + detailedInfo.popularity || "")
            const voteAvgMovie = $("<p>").html("<b>Average Rating:</b> " + detailedInfo.vote_average || "")
            const voteCountMovie = $("<p>").html("<b>Rating Count:</b> " + detailedInfo.vote_count || "")
            const statusMovie = $("<p>").html("<b>Status:</b> " + detailedInfo.status || "")
            const releaseDateMovie = $().html("<b>Release Date:</b> " + detailedInfo.release_date || "")
            const runtimeMovie = $("<p>").html("<b>Runtime:</b> " + detailedInfo.runtime + " Minutes" || "")
            const overviewTextMovie = $("<p>").html("<b>Overview:</b> <br> " + detailedInfo.overview || "")
            const mediaTypeMovie = $("<p>").html("<b>Media Type:</b> Movie")
            detailsDiv.append(titleMovie, taglineMovie, imageMovie, popularityScoreMovie, voteAvgMovie, voteCountMovie, statusMovie, releaseDateMovie, runtimeMovie, overviewTextMovie, mediaTypeMovie)
            break
        case "person":
            let gender = {
                0: "Other",
                1: "Female",
                2: "Male"
            }
            const namePerson = $("<h2>").text(detailedInfo.name || "")
            const imagePerson = $("<img>").attr("src", imageURL)
            const popularityPerson = $("<p>").html("<b>Popularity Score:</b> " + detailedInfo.popularity)
            const knownForPerson = $("<p>").html("<b>Known For:</b> " + detailedInfo.known_for_department || "")
            const genderPerson = $("<p>").html("<b>Gender:</b> " + gender[detailedInfo.gender].toString() || "")
            const birthdayPerson = $("<p>").html("<b>Birthday:</b> " + detailedInfo.birthday || "")
            const biographyPerson = $("<p>").html("<b>Biography:</b> <br> " + detailedInfo.biography || "")
            detailsDiv.append(namePerson, imagePerson, popularityPerson, birthdayPerson, genderPerson, knownForPerson, biographyPerson)
            break
        default:
            console.log("Failed to display detailed info for " + mediaType);
            return []
    }

    // Show the modal
    $("#details-modal").css("visibility", "visible")
}

function sortData(data, sortType, datatype){
    let dataToSort = data.results
    switch(sortType){
        case "popularity.desc":
            dataToSort.sort((a, b) => b.popularity - a.popularity)
            break;
            /*
        case "release_date.desc":
            // for tv shows and movies, sort by release date
            // for people, sort by birthday
            switch (datatype){
                case "tv":
                    dataToSort.sort((a, b) => new Date(a.first_air_date) - new Date(b.first_air_date))
                    break;
                case "movie":
                    dataToSort.sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
                    break;
                case "person":
                    dataToSort.sort((a, b) => new Date(a.birthday) - new Date(b.birthday))
                    break;
                default:
                    break;
            }
            break
            */
        case "vote_average.desc":
            switch (datatype){
                case "tv":
                case "movie":
                    dataToSort.sort((a, b) => b.vote_average - a.vote_average)
                    break;
                case "person":
                    // change sorting when working on a person to just popularity again
                    dataToSort.sort((a, b) => b.popularity - a.popularity)
                    break;
                default:
                    break
            }

            break
        default:
            return data
    }
    data.results = dataToSort
    return data
}