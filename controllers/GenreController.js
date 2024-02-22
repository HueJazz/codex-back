import GenreModel from "../models/GenreModel.js"

export const getGenres = async (req, res) => {
    try {

        const genres = await GenreModel.find().sort({ count: -1 }).select('name')

        if (!genres) {
            return res.status(400).json({
                message: "Genre not found"
            });
        }

        res.json(genres.slice(0, 50));

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to get a genre"
        })
    }
}

export const getRelatedGenres = async (req, res) => {
    try {

        const genre = req.params.genreName

        const genres = await GenreModel.findOne({ name: genre })

        if (!genres) {
            return res.status(400).json({
                message: "Genre not found"
            });
        }

        res.json(Object.keys(genres.relatedGenres).slice(0, 12));

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Unable to get a genre"
        })
    }
}
