/**
 * The structure of a Movie object used in the application.
*/
export interface Movie {
    Title: string;  //The title of the movie.
    Year: string;   //The year the movie was relesed. 
    imdbID: string; //The IMDb ID of the movie
    Type: string;   //The type of the movie
    Poster: string; //The URL of the movie poster image.
    Plot?: string; //The plot description of the movie.(Optional)
}

/**
 * The structure of a Rating object from the API response
 */
export interface Rating {
    Source: string;  // The source of the rating ("IMDB", "Rotten Tomatoes, Metacritic")
    Value: string;   // The rating value (can include % or other formats)
}

/**
 * The structure of a MovieDetail object used in the application.
 * MovieDetail extends the basic movie structure 'Movie' by adding additional fields.
*/
export interface MovieDetail extends Movie {
    Plot: string;   //The plot description of the movie.
    Director: string;   //The name of the movie director.
    Actors: string; //The list of the actors in the movie.
    Genre: string;  //The genres of the movie.
    Runtime: string;    //The runtime of the movie.
    Rated: string;  //The content rating of the movie.
    imdbRating: string; //The IMDb rating of the movie.
    Ratings?: Rating[];  // Array of ratings from different sources
    Response: string;   //The response status from the API
}

/**
 * The structure of the API response for a movie search operation.
*/
export interface SearchResponse {
    Search: Movie[];    //The array of movies matching the search criteria.
    totalResults: string;   //The total no of results
    Response: string;   //The response status from the API
    Error?: string; //The error message if the response is unsuccessful. (Optianl)
}