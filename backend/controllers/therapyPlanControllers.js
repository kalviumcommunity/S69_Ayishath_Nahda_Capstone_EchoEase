
const { generateTherapyPlanWithGemini, fetchYouTubeLinks } = require("../utils/aiUtils");
const generateTherapyPlanHandler = async (req, res) => {
    const { age, diagnosis } = req.body;
  
    // Enhanced input validation
    if (!age || !diagnosis) {
      return res.status(400).json({ 
        message: "Missing required fields",
        details: age ? "Diagnosis is required" : "Age is required",
        field: age ? "diagnosis" : "age"
      });
    }
  
    if (typeof age !== "number" || age <= 0 || age > 18) {
      return res.status(400).json({ 
        message: "Invalid age value",
        details: "Age must be a positive number between 1 and 18",
        received: age
      });
    }
  
    if (typeof diagnosis !== "string" || diagnosis.trim().length < 3) {
      return res.status(400).json({ 
        message: "Invalid diagnosis",
        details: "Diagnosis must be a string with at least 3 characters",
        received: diagnosis
      });
    }
  
    try {
      // Generate therapy plan with timeout (increased to 30 seconds)
      const generationPromise = generateTherapyPlanWithGemini(age, diagnosis);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Generation timeout exceeded")), 30000) // Changed from 10000 to 30000
      );
  
      const { goals, activities } = await Promise.race([generationPromise, timeoutPromise]);
  
      if (!goals || !activities || goals.length === 0 || activities.length === 0) {
        return res.status(503).json({
          message: "Failed to generate therapy plan content",
          details: "The AI service returned empty goals or activities",
          debug: {
            age,
            diagnosis,
            apiKeyExists: !!process.env.GEMINI_API_KEY,
            suggestion: "Check the AI service status or try again later"
          }
        });
      }
  
      // Fetch YouTube links with error handling
      let youtubeLinks = [];
      try {
        youtubeLinks = await fetchYouTubeLinks(activities);
      } catch (youtubeError) {
        console.error("YouTube links fetch failed, continuing without:", youtubeError);
        youtubeLinks = activities.map(() => "Video not available");
      }
  
      // Successful response
      res.status(200).json({
        success: true,
        data: {
          goals,
          activities,
          youtubeLinks
        },
        meta: {
          generatedAt: new Date().toISOString(),
          ageGroup: age < 5 ? "preschool" : age < 12 ? "school-age" : "adolescent"
        }
      });
  
    } catch (error) {
      console.error("Error in therapy plan generation:", {
        error: error.message,
        stack: error.stack,
        requestBody: req.body
      });
  
      const statusCode = error.message.includes("timeout") ? 504 : 500;
      
      res.status(statusCode).json({
        message: "Therapy plan generation failed",
        details: process.env.NODE_ENV === 'development' ? error.message : "Service unavailable",
        errorType: error.name,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    }
  };
  
  module.exports = { generateTherapyPlanHandler };