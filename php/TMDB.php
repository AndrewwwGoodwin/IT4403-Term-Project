<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$token = $_ENV["TMDB_API_KEY"];
$requestType = $_GET["requestType"];
if ($requestType != "") {
    switch ($requestType) {
        case "getTrending":
            echo getTrending($_GET["type"], $_GET["timePeriod"], $token);
            break;
        case "getPopular":
            echo getPopular($_GET["type"], $_GET["page"], $token);
            break;
        case "getDetailedInfo":
            echo getDetailedInfo($_GET["id"], $_GET["type"], $token);
            break;
        case "getSearchResults":
            echo getSearchResults($_GET["searchQuery"], $_GET["searchType"], $_GET["page"], $token);
            break;
        default:
            echo "Invalid request type";
            break;
    }
} else {
    echo "";
}

function getTrending($type, $timePeriod, $accessTokenAuthKey) {
    $baseURL = "https://api.themoviedb.org/3/trending/";

    switch (strtolower($type)) {
        case "movie":
            $queryURL = $baseURL . "movie/";
            break;
        case "person":
            $queryURL = $baseURL . "person/";
            break;
        case "tv":
            $queryURL = $baseURL . "tv/";
            break;
        case "all":
            $queryURL = $baseURL . "all/";
            break;
        default:
            error_log("Invalid Query Type: " . $type);
            $queryURL = $baseURL . "all/";
            break;
    }

    switch (strtolower($timePeriod)) {
        case "day":
            $queryURL .= "day";
            break;
        case "week":
            $queryURL .= "week";
            break;
        default:
            error_log("Invalid time period: " . $timePeriod);
            $queryURL .= "week";
            break;
    }

    $queryParams = [
        "language" => "en-US",
    ];

    $headers = [
        "Authorization: Bearer " . $accessTokenAuthKey
    ];

    $context = stream_context_create([
        "http" => [
            "header" => $headers
        ]
    ]);

    $response = file_get_contents($queryURL . '?' . http_build_query($queryParams), false, $context);

    if ($response === FALSE) {
        error_log("Failed to pull trending feed");
        return json_encode([]);
    }

    return $response;
}

function getPopular($type, $page, $accessTokenAuthKey) {
    $baseURL = "https://api.themoviedb.org/3/";

    switch (strtolower($type)) {
        case "tv":
            $queryURL = $baseURL . "tv/popular";
            break;
        case "movie":
            $queryURL = $baseURL . "movie/popular";
            break;
        case "people":
            $queryURL = $baseURL . "person/popular";
            break;
        default:
            error_log("Invalid Query Type: " . $type);
            return json_encode([]);
    }

    $queryParams = [
        "language" => "en-US",
        "page" => $page,
        "region" => "US"
    ];

    $headers = [
        "Authorization: Bearer " . $accessTokenAuthKey
    ];

    $context = stream_context_create([
        "http" => [
            "header" => $headers
        ]
    ]);

    $response = file_get_contents($queryURL . '?' . http_build_query($queryParams), false, $context);

    if ($response === FALSE) {
        error_log("Failed to complete search request");
        return json_encode([]);
    }

    return $response;
}

function getDetailedInfo($id, $type, $accessTokenAuthKey) {
    $baseURL = "https://api.themoviedb.org/3/";

    switch (strtolower($type)) {
        case "movie":
            $queryURL = $baseURL . "movie/";
            break;
        case "tv":
            $queryURL = $baseURL . "tv/";
            break;
        case "people":
            $queryURL = $baseURL . "person/";
            break;
        default:
            error_log("Invalid Query Type: " . $type);
            return json_encode([]);
    }

    $queryURL .= $id;

    $queryParams = [
        "language" => "en-US",
    ];

    $headers = [
        "Authorization: Bearer " . $accessTokenAuthKey
    ];

    $context = stream_context_create([
        "http" => [
            "header" => $headers
        ]
    ]);

    $response = file_get_contents($queryURL . '?' . http_build_query($queryParams), false, $context);

    if ($response === FALSE) {
        error_log("Failed to complete search request");
        return json_encode([]);
    }

    return $response;
}

function getSearchResults($searchQuery, $searchType, $page, $accessTokenAuthKey) {
    $baseURL = "http://api.themoviedb.org/3/search/";

    // Set endpoint based on search type
    switch ($searchType) {
        case "movie":
            $queryURL = $baseURL . "movie";
            break;
        case "person":
            $queryURL = $baseURL . "person";
            break;
        case "tv":
            $queryURL = $baseURL . "tv";
            break;
        case "multi":
            $queryURL = $baseURL . "multi";
            break;
        default:
            error_log("Invalid Query Type: " . $searchType);
            $queryURL = $baseURL . "multi";
            break;
    }

    // Set query parameters
    $queryParams = [
        "query" => $searchQuery,
        "include_adult" => false,
        "language" => "en-US",
        "page" => $page
    ];

    // Create query string
    $queryString = http_build_query($queryParams);

    // Set up headers
    $headers = [
        "Authorization: Bearer " . $accessTokenAuthKey
    ];

    // Create the stream context
    $context = stream_context_create([
        "http" => [
            "header" => $headers
        ]
    ]);

    // Fetch the results
    $response = file_get_contents($queryURL . '?' . $queryString, false, $context);

    // Check for errors
    if ($response === FALSE) {
        error_log("Failed to complete search request");
        return json_encode([]);
    }

    // Return response
    return $response;
}
