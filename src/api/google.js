import axios from 'axios';

const API_KEY = 'AIzaSyAkd5rhI0R_SrUW31rYer2h3pVimGfGQ_E'; // Your API Key
const SEARCH_ENGINE_ID = 'a38174dc19767412e'; // Your Custom Search Engine ID

export const fetchGoogleResults = async (query) => {
  try {
    const response = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
      params: {
        key: API_KEY,
        cx: SEARCH_ENGINE_ID,
        q: query,
      },
    });

    // Extract the search results
    return response.data.items;
  } catch (error) {
    console.error('Error fetching Google search results:', error);
    throw error;
  }
};
