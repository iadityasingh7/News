import { toast } from "react-toastify";
import axios from "axios";


const apiKey = process.env.REACT_APP_NEWSDATA_API_KEY

const fetchNews = async (category, page = null, size = 9) => {
  const options = {
    method: "GET",
    url: `https://newsdata.io/api/1/${category}`,
    params: {
      apikey: apiKey,
      language: "en",
      size: size,
      removeduplicate: 1,
      ...(page && { page: page }),
    },
  };

  try {
    const response = await axios.request(options);

    console.log("response", response.data);

    // Check if response is successful and has results
    if (
      response?.data?.status === "success" &&
      response.data?.results &&
      response.data.results.length > 0
    ) {
      // Transform the API response to match the expected format
      const transformedResults = response.data.results.map((article) => {
        const imageUrl =
          article.image_url && article.image_url.trim()
            ? article.image_url
            : "";

        return {
          title: article.title || "No Title",
          snippet: article.description || "",
          images: {
            thumbnail: imageUrl,
          },
          newsUrl: article.link || "#",
          publisher: article.source_name || "Unknown",

          article_id: article.article_id,
          pubDate: article.pubDate,
          category: article.category,
        };
      });

      return {
        data: transformedResults,
        nextPage: response.data.nextPage || null,
      };
    } else {
      if (!page) {
        toast.error("Error while fetching news - No results found");
      }
      return { data: [], nextPage: null };
    }
  } catch (error) {
    console.error("API Key Status:", process.env.REACT_APP_NEWSDATA_API_KEY ? "Loaded from .env" : "Using fallback");
    console.error(error);
    if (!page) {
      toast.error("Error while fetching news");
    }
    throw error;
  }
};

export default fetchNews;
