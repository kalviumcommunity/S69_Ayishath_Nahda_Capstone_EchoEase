require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { google } = require("googleapis");

// Initialize Gemini AI with better error handling
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
if (!process.env.GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in environment variables");
}

// Enhanced function to generate therapy plan
const retry = require("async-retry");

async function generateTherapyPlanWithGemini(age, diagnosis) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40
      }
    });

    const prompt = `As a pediatric speech therapist, generate 3 SMART therapy goals and 3 age-appropriate activities for an ${age}-year-old with ${diagnosis}. Return the result as JSON in this format: {"goals": ["goal1", "goal2", "goal3"], "activities": ["activity1", "activity2", "activity3"]}.`;

    console.log("Sending prompt to Gemini:", prompt);

    const startTime = Date.now();
    
    // Add retry logic for the Gemini API call
    const result = await retry(
      async () => {
        const generationPromise = model.generateContent(prompt);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Gemini API timeout exceeded")), 25000)
        );
        return await Promise.race([generationPromise, timeoutPromise]);
      },
      {
        retries: 2, // Retry up to 2 times
        factor: 2, // Exponential backoff
        minTimeout: 1000, // Wait 1 second before the first retry
        maxTimeout: 5000 // Maximum wait of 5 seconds between retries
      }
    );

    const response = await result.response;
    const text = response.text();
    const endTime = Date.now();

    console.log("Raw Gemini response:", text);
    console.log("Time taken for Gemini API call:", (endTime - startTime) / 1000, "seconds");

    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);

    const parsed = JSON.parse(jsonString);
    
    if (!Array.isArray(parsed.goals)) parsed.goals = [];
    if (!Array.isArray(parsed.activities)) parsed.activities = [];

    return {
      goals: parsed.goals.slice(0, 3),
      activities: parsed.activities.slice(0, 3)
    };

  } catch (error) {
    console.error("Error in generateTherapyPlanWithGemini:", {
      error: error.message,
      stack: error.stack
    });
    return { goals: [], activities: [] };
  }
}
// Enhanced YouTube search function
async function fetchYouTubeLinks(activities) {
    if (!activities || activities.length === 0) return [];
    
    const youtube = google.youtube({
      version: "v3",
      auth: process.env.YOUTUBE_API_KEY,
      timeout: 10000 // Increased to 10 seconds for better reliability
    });
  
    try {
      const videoLinks = await Promise.all(
        activities.map(async (activity) => {
          if (!activity) return "";
  
          // Extract the activity title (e.g., 'Silly Sentences' with /s/) and simplify the query
          const titleMatch = activity.match(/\*\*['"]([^'"]+)['"]/);
          const activityTitle = titleMatch ? titleMatch[1] : activity.split(":")[0].replace(/\*\*/g, "").trim();
          const query = `${activityTitle} speech therapy for children`;
  
          console.log(`Searching YouTube for query: "${query}"`);
  
          try {
            const response = await youtube.search.list({
              part: "snippet",
              q: query,
              maxResults: 1,
              type: "video",
              videoDuration: "short"
            });
  
            console.log(`YouTube API response for "${query}":`, JSON.stringify(response.data, null, 2));
  
            if (response.data.items && response.data.items.length > 0) {
              const videoId = response.data.items[0]?.id?.videoId;
              return videoId ? `https://www.youtube.com/watch?v=${videoId}` : "";
            } else {
              console.log(`No videos found for query: "${query}"`);
              return "";
            }
          } catch (err) {
            console.error(`Error searching for "${query}":`, err.message);
            if (err.response) {
              console.error("YouTube API error details:", err.response.data);
            }
            return "";
          }
        })
      );
  
      return videoLinks;
    } catch (error) {
      console.error("Error in fetchYouTubeLinks:", error.message);
      if (error.response) {
        console.error("YouTube API error details:", error.response.data);
      }
      return activities.map(() => "");
    }
  }

module.exports = {
  generateTherapyPlanWithGemini,
  fetchYouTubeLinks
};