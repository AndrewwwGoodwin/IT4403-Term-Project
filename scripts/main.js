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
        if (searchInputElement.val() !== "" || searchInputElement.val() !== null) {
            resultsBox.empty()
            let searchInputValue = searchInputElement.val();
            let searchType = searchTypeElement.val()
            try {
                let data = await getSearchResults(searchInputValue, searchType, 1)
                console.log(data)
                // now that we have our info lets make some tiles
                DrawTiles(data, resultsBox, paginationDiv, sortDiv)
            } catch (err) {
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
            let data = await getTrending(searchType, "week")
            DrawTiles(data, resultsBox, paginationDiv, sortDiv)
        } catch (err) {
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
        } else if (searchType === "person") {
            searchType = "people"
        }
        try {
            let data = await getPopular(1, searchType)
            console.log(data)
            DrawTiles(data, resultsBox, paginationDiv, sortDiv)
        } catch (err) {
            console.log("Failed to pull Popular")
            console.log(err)
        }
    })
})

function DrawTiles(data, resultsBox, paginationDiv, sortDiv) {

    // check if our pagination and sort is visible
    if (sortDiv.css("visibility") === "hidden") {
        sortDiv.css("visibility", "visible")
    }
    if (paginationDiv.css("visibility") === "hidden") {
        paginationDiv.css("visibility", "visible")
    }


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
            const imageTV = $("<img>").attr("src", imageURL)
            const popularityScoreTV = $("<p>").text("Popularity Score: " + detailedInfo.popularity || "")
            const voteAvgTV = $("<p>").text("Average Rating: " + detailedInfo.vote_average || "")
            const voteCountTV = $("<p>").text("Rating Count: " + detailedInfo.vote_count || "")
            const firstAirDateTV = $("<p>").text("First Air Date: " + detailedInfo.first_air_date || "")
            const seasonCountTV = $("<p>").text("Season Count: " + detailedInfo.number_of_seasons || "")
            const episodeCountTV = $("<p>").text("Episode Count: " + detailedInfo.number_of_episodes || "")
            const overviewTextTV = $("<p>").text("Overview: " + detailedInfo.overview || "")
            const mediaTypeTV = $("<p>").text("Media Type: TV Show")
            detailsDiv.append(titleTV, imageTV, popularityScoreTV, voteAvgTV, voteCountTV, firstAirDateTV, seasonCountTV, episodeCountTV, overviewTextTV, mediaTypeTV)
            break;
        case "movie":
            //title
            const titleMovie = $("<h2>").text(detailedInfo.title || "")
            const taglineMovie = $("<p>").text(detailedInfo.tagline || "")
            const imageMovie = $("<img>").attr("src", imageURL)
            const popularityScoreMovie = $("<p>").text("Popularity Score: " + detailedInfo.popularity || "")
            const voteAvgMovie = $("<p>").text("Average Rating: " + detailedInfo.vote_average || "")
            const voteCountMovie = $("<p>").text("Rating Count: " + detailedInfo.vote_count || "")
            const statusMovie = $("<p>").text("Status: " + detailedInfo.status || "")
            const releaseDateMovie = $().text("Release Date: " + detailedInfo.release_date || "")
            const runtimeMovie = $("<p>").text("Runtime: " + detailedInfo.runtime + " Minutes" || "")
            const overviewTextMovie = $("<p>").text("Overview: " + detailedInfo.overview || "")
            const mediaTypeMovie = $("<p>").text("Media Type: Movie")
            detailsDiv.append(titleMovie, taglineMovie, imageMovie, popularityScoreMovie, voteAvgMovie, voteCountMovie, statusMovie, releaseDateMovie, runtimeMovie, overviewTextMovie, mediaTypeMovie )
            break
        case "person":
            let gender = {
                0: "Other",
                1: "Female",
                2: "Male"
            }
            const namePerson = $("<p>").text(detailedInfo.name || "")
            const imagePerson = $("<img>").attr("src", imageURL)
            const popularityPerson = $("<p>").text("Popularity Score: " + detailedInfo.popularity)
            const knownForPerson = $("<p>").text("Known For: " + detailedInfo.known_for_department || "")
            const genderPerson = $("<p>").text("Gender: " + gender[detailedInfo.gender].toString() || "")
            const birthdayPerson = $("<p>").text("Birthday: " + detailedInfo.birthday || "")
            const biographyPerson = $("<p>").text("Biography: " + detailedInfo.biography || "")
            detailsDiv.append(namePerson, imagePerson, popularityPerson, birthdayPerson, genderPerson, knownForPerson, biographyPerson)
            break
        default:
            console.log("Failed to display detailed info for " + mediaType);
            return []
    }

    // Show the modal
    $("#details-modal").show();
}