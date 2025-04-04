require("dotenv").config();

async function recommendVideos(activities, nativeLanguage, diagnosis) {
  console.log("recommendVideos is not currently in use. Using fetchYouTubeVideos instead.");
  return activities.map(activity => ({
    activityName: activity.name,
    videos: []
  }));
}

module.exports = { recommendVideos };