import axios from "axios";

/**
 * Pre-configured axios instance for IRCTC RapidAPI (irctc1 by IRCTCAPI).
 * Credentials are read exclusively from environment variables — never hardcoded.
 * Import this instance in every route handler; never create inline axios instances.
 */
const rapidApiClient = axios.create({
  baseURL: "https://irctc1.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": process.env.RAPIDAPI_KEY ?? "",
    "x-rapidapi-host": process.env.RAPIDAPI_HOST ?? "irctc1.p.rapidapi.com",
  },
});

export default rapidApiClient;
