const router = require("express").Router();
const Movie = require("../models/movie");
const movies = require("../config/movies.json");

// Existing GET method for fetching movies
router.get("/movies", async (req, res) => {
	try {
		const page = parseInt(req.query.page) - 1 || 0;
		const limit = parseInt(req.query.limit) || 7;
		const search = req.query.search || "";
		let sort = req.query.sort || "rating";
		let genre = req.query.genre || "All";

		const genreOptions = [
			"Action",
			"Romance",
			"Fantasy",
			"Drama",
			"Crime",
			"Adventure",
			"Thriller",
			"Sci-fi",
			"Music",
			"Family",
		];

		genre === "All"
			? (genre = [...genreOptions])
			: (genre = req.query.genre.split(","));
		req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

		let sortBy = {};
		if (sort[1]) {
			sortBy[sort[0]] = sort[1];
		} else {
			sortBy[sort[0]] = "asc";
		}

		const movies = await Movie.find({ name: { $regex: search, $options: "i" } })
			.where("genre")
			.in([...genre])
			.sort(sortBy)
			.skip(page * limit)
			.limit(limit);

		const total = await Movie.countDocuments({
			genre: { $in: [...genre] },
			name: { $regex: search, $options: "i" },
		});

		const response = {
			error: false,
			total,
			page: page + 1,
			limit,
			genres: genreOptions,
			movies,
		};

		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});

// PUT method for updating a movie
router.put("/movies/:id", async (req, res) => {
	try {
		const movieId = req.params.id;
		const updatedData = req.body;

		const updatedMovie = await Movie.findByIdAndUpdate(movieId, updatedData, {
			new: true, // Return the updated document
			runValidators: true, // Validate the data against the model
		});

		if (!updatedMovie) {
			return res.status(404).json({ error: true, message: "Movie not found" });
		}

		res.status(200).json({ error: false, movie: updatedMovie });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});

// POST method for creating a new movie
router.post("/movies", async (req, res) => {
	try {
		const newMovie = new Movie(req.body);
		const savedMovie = await newMovie.save();
		
		res.status(201).json({ error: false, movie: savedMovie });
	} catch (err) {
		console.log(err);
		res.status(400).json({ error: true, message: "Failed to create movie", details: err.message });
	}
});

// DELETE method for deleting a movie
router.delete("/movies/:id", async (req, res) => {
	try {
		const movieId = req.params.id;

		const deletedMovie = await Movie.findByIdAndDelete(movieId);

		if (!deletedMovie) {
			return res.status(404).json({ error: true, message: "Movie not found" });
		}

		res.status(200).json({ error: false, message: "Movie deleted successfully", movie: deletedMovie });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});

// const insertMovies = async () => {
//     try {
//         const docs = await Movie.insertMany(movies);
//         return Promise.resolve(docs);
//     } catch (err) {
//         return Promise.reject(err)
//     }
// };

// insertMovies()
//     .then((docs) => console.log(docs))
//     .catch((err) => console.log(err))

module.exports = router;
