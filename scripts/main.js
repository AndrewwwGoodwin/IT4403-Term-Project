// wow, look at all that js!
// let's leave this file mostly for interacting with the document/dom/whatever
$(document).ready(async function () {

    // block of example API interaction
    
    const apiKey = '305711c757350a1a0284f9b39ccb0e97';
    //let token = "access token should go here"
    const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMDU3MTFjNzU3MzUwYTFhMDI4NGY5YjM5Y2NiMGU5NyIsIm5iZiI6MTcyMTU5NDc5MS44MTUyODQsInN1YiI6IjY2NzE5NTJjZjNmODZjMGYwZDNmMGY0NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VZLQ3VhR8taOgFRezZNWPkcDeaH2xvYqQasaN-SWqSg';  // Replace with your TMDb Access Token

        $('#search-button').on('click', async function () {
            const query = $('#search-input').val();
            const type = $('#search-type').val();
            if (query) {
                const data = await getSearchResults(query, type);
                displayResults(data.results);
            }
        });
    //let data = await getSearchResults("Kung Fu Panda", "movie", 1, token)
    //let data = await getTrending("all", "week", token)
    //let data = await getPopular(1, "movie", token)
    //let data = await getDetailedInfo(1022789, "movie", token)
    //console.log(data)


