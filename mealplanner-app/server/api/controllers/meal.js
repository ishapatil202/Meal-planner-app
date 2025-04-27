/* eslint-disable camelcase */
import axios from 'axios';
import User from '../models/user.js';

const SPOONACULAR_API_URL = process.env.SPOON_API_URL;
const SPOONACULAR_API_KEY = process.env.SPOON_API_KEY;

// GET /meals/search
const searchMeals = async (req, res) => {
    try {
        const { user_id } = req.verified;
        const { meal, preferences = '' } = req.query;

        const user = await User.findById(user_id).select('preferences');

       
        const queryPreferences = preferences ? preferences.split(',') : [];
      
        const diet = [...user.preferences, ...queryPreferences].join(',');

        const response = await axios.get(`${SPOONACULAR_API_URL}/recipes/complexSearch`, {
            params: {
                apiKey: SPOONACULAR_API_KEY,
                query: meal,
                diet,
                addRecipeInformation: true
            }
        });

        res.json(response.data.results);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

export { searchMeals };
