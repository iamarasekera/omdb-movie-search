# OMDB Movie Search React App (public/hms-cover.png)

This is a React application that allows users to search for movies, series, and episodes from the OMDb API, view detailed information, and add them to a watchlist. The app includes features like year range filtering and type filtering for more specific search results.

## Features

- **Movie Search**: Search for movies, series, episodes, or any other type by title.
- **Year Range Filter**: Filter search results by year range (from 1970 to 2024).
- **Type Filter**: Filter search results by type (Movies, Series, Episodes, or Any).
- **Movie Details**: Display detailed information about each movie, including title, year, poster, plot, and the option to add it to the watchlist.
- **Watchlist**: Users can add movies to their personal watchlist.

## Limitations

- **Not Responsive**: The app is currently not designed to be responsive for mobile or tablet devices, as a mock-up is not provided. However, this can be implemented as an enhancement in the future.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Installation

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone <repository-url>
cd omdb-movie-search
```

### 2. Install Dependencies

Install the necessary dependencies using npm:

```bash
npm install
```

This will install all required libraries for the project.

### 3. Set Up Environment Variables

Create a `.env` file in the root directory of your project. You'll need to set your OMDb API key in the `.env` file:

```env
REACT_APP_OMDB_API_KEY=your-api-key-here
```

Replace `your-api-key-here` with your actual OMDb API key, which you can obtain by signing up at [OMDb API](http://www.omdbapi.com/).

## Available Scripts

In the project directory, you can run the following commands:

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode. You can see the results of your tests in real-time. For more details about running tests with Create React App, check the [official documentation](https://create-react-app.dev/docs/running-tests/).

### `npm run build`

Builds the app for production to the `build` folder. It correctly bundles the React app in production mode and optimizes it for the best performance.

The build is minified, and the filenames include the hashes. Your app is ready to be deployed.

For more information about deployment, check the [Create React App documentation](https://create-react-app.dev/docs/deployment/).

### `npm run eject`

**Note:** this is a one-way operation. Once you eject, you can't go back!

If you're not satisfied with the build tool or configuration, you can eject at any time. This will copy all configuration files and dependencies into your project, giving you full control over them. However, the curated feature set should be sufficient for most use cases, so you may not need to eject.

## Dependencies

This project requires the following dependencies:

- **React**: A JavaScript library for building user interfaces.
- **Material-UI**: A popular React UI framework for building responsive, modern web applications.
- **React Router**: For navigating between different pages (if implemented).
- **Axios**: For making HTTP requests to the OMDb API.

To install these dependencies, run:

```bash
npm install
```

## Development Dependencies

For unit testing, the following packages were installed:

- **@testing-library/react**: A library for testing React components.
- **@testing-library/jest-dom**: Custom matchers for Jest, to make it easier to test DOM nodes.
- **@testing-library/user-event**: For simulating user events in tests.
- **@types/jest**: TypeScript definitions for Jest.

To install these development dependencies, run:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest
```

## Running Unit Tests

To run unit tests, use the following command:

```bash
npm test
```

This will start the test runner in watch mode. Tests will run automatically whenever you make changes to the files.

## Learn More

You can learn more about the technologies used in this project here:

- [React Documentation](https://reactjs.org/)
- [Material-UI Documentation](https://material-ui.com/)
- [OMDb API Documentation](http://www.omdbapi.com/)

For more details about Create React App and its setup, check out the [official documentation](https://create-react-app.dev/).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
