import axios from "axios";

export const api = axios.create({
  baseURL: `https://api.calorieninjas.com/v1`,
  timeout: 60000,
  headers: {
    "content-type": "application/json",
    "x-api-key": "GgogmF6XlBhG1YaTQYr6EA==lee0q66mG4Q22awd",
  },
});

export const getNutrition = async (query) => {
  return api.get(`/nutrition?query=${query}`);
};
