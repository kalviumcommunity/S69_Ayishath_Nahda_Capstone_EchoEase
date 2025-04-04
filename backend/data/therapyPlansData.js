const axios = require('axios');

const therapyPlansData = {
  articulation: {
    "3-5": {
      goals: [
        "Improve correct production of target sounds (e.g., /k/ instead of /t/)",
        "Increase awareness of tongue and lip placement",
        "Reduce phonological errors (e.g., stopping, fronting)",
        "Strengthen oral-motor coordination"
      ],
      activities: [
        {
          name: "Sound imitation with mirrors",
          ytKeywords: "speech sound imitation for preschoolers"
        },
        {
          name: "Tongue placement games",
          ytKeywords: "tongue exercises for speech therapy"
        }
      ]
    },
    "6-12": {
      goals: [
        "Produce difficult sounds in all word positions",
        "Use correct sounds in sentences/conversations",
        "Increase self-monitoring of speech"
      ],
      activities: [
        {
          name: "Sentence repetition drills",
          ytKeywords: "speech therapy sentence practice"
        }
      ]
    },
    "13+": {
      goals: [
        "Eliminate residual speech sound errors",
        "Improve clarity in spontaneous speech",
        "Develop self-correction strategies"
      ],
      activities: [
        {
          name: "Conversational practice",
          ytKeywords: "speech therapy for teens conversation"
        }
      ]
    }
  },
  language: {
    "3-5": {
      goals: [
        "Expand vocabulary (naming objects/categories)",
        "Improve sentence structure",
        "Strengthen understanding of basic concepts",
        "Increase ability to answer 'wh' questions"
      ],
      activities: [
        {
          name: "Picture card naming",
          ytKeywords: "vocabulary building for toddlers"
        }
      ]
    },
    "6-12": {
      goals: [
        "Improve multi-step directions",
        "Expand complex sentence use",
        "Strengthen storytelling skills",
        "Increase understanding of figurative language"
      ],
      activities: [
        {
          name: "Story sequencing",
          ytKeywords: "story sequencing activities"
        }
      ]
    },
    "13+": {
      goals: [
        "Develop advanced academic vocabulary",
        "Strengthen written communication",
        "Improve pragmatic language skills"
      ],
      activities: [
        {
          name: "Debate practice",
          ytKeywords: "debate skills for teens"
        }
      ]
    }
  },
  stuttering: {
    "3-5": {
      goals: [
        "Reduce tension while speaking",
        "Increase use of slow, relaxed speech",
        "Develop turn-taking skills"
      ],
      activities: [
        {
          name: "Breathing exercises",
          ytKeywords: "kids breathing exercises for speech"
        }
      ]
    },
    "6-12": {
      goals: [
        "Use fluency-enhancing strategies",
        "Reduce fear around speaking",
        "Improve communication confidence"
      ],
      activities: [
        {
          name: "Easy onset practice",
          ytKeywords: "easy onset speech therapy"
        }
      ]
    },
    "13+": {
      goals: [
        "Master fluency techniques",
        "Reduce avoidance behaviors",
        "Improve emotional coping"
      ],
      activities: [
        {
          name: "Real-life practice",
          ytKeywords: "stuttering therapy for adults"
        }
      ]
    }
  },
  apraxia: {
    "3-5": {
      goals: [
        "Produce simple syllables consistently",
        "Improve word production accuracy",
        "Use alternative communication"
      ],
      activities: [
        {
          name: "VC/CV syllable drills",
          ytKeywords: "apraxia syllable practice"
        }
      ]
    },
    "6-12": {
      goals: [
        "Improve complex word coordination",
        "Increase speech accuracy at sentence level",
        "Strengthen oral-motor planning"
      ],
      activities: [
        {
          name: "Multisensory cueing",
          ytKeywords: "apraxia multisensory therapy"
        }
      ]
    },
    "13+": {
      goals: [
        "Improve conversation clarity",
        "Develop compensatory strategies",
        "Strengthen speech rhythm"
      ],
      activities: [
        {
          name: "Melodic intonation",
          ytKeywords: "melodic intonation therapy"
        }
      ]
    }
  },
  aphasia: {
    mild: {
      goals: [
        "Strengthen word-finding skills",
        "Improve sentence formation",
        "Develop comprehension strategies"
      ],
      activities: [
        {
          name: "Semantic feature analysis",
          ytKeywords: "semantic feature aphasia therapy"
        }
      ]
    },
    moderate: {
      goals: [
        "Communicate basic needs",
        "Use alternative communication",
        "Improve direction following"
      ],
      activities: [
        {
          name: "Gesture communication",
          ytKeywords: "gesture communication aphasia"
        }
      ]
    }
  },
  pragmatic: {
    "3-5": {
      goals: [
        "Improve eye contact",
        "Strengthen turn-taking",
        "Expand play with peers"
      ],
      activities: [
        {
          name: "Joint attention games",
          ytKeywords: "joint attention activities"
        }
      ]
    },
    "6-12": {
      goals: [
        "Stay on topic in conversations",
        "Understand nonverbal cues",
        "Develop social problem-solving"
      ],
      activities: [
        {
          name: "Emotion charades",
          ytKeywords: "teaching facial expressions kids"
        }
      ]
    },
    "13+": {
      goals: [
        "Engage in deeper conversations",
        "Improve self-advocacy",
        "Learn professional communication"
      ],
      activities: [
        {
          name: "Workplace role-plays",
          ytKeywords: "social skills workplace scenarios"
        }
      ]
    }
  }
};

async function fetchYouTubeVideos(activity, language) {
  try {
    console.log("Fetching YouTube videos for activity:", activity.name, "Language:", language);
    console.log("Using API Key:", process.env.YOUTUBE_API_KEY ? "Set" : "Not Set");
    console.log("Search query:", `${activity.ytKeywords || activity.name} ${language} therapy`);

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${activity.ytKeywords || activity.name} ${language} therapy`,
        key: process.env.YOUTUBE_API_KEY,
        maxResults: 2,
        type: 'video',
        videoDuration: 'short',
        safeSearch: 'strict',
        relevanceLanguage: language
      }
    });

    if (!response.data.items || response.data.items.length === 0) {
      console.log(`No videos found for ${activity.name}`);
      return [];
    }

    const videos = response.data.items.map(video => ({
      title: video.snippet.title,
      url: `https://youtube.com/watch?v=${video.id.videoId}`,
      thumbnail: video.snippet.thumbnails.medium.url
    }));
    console.log(`Fetched videos for ${activity.name}:`, videos);
    return videos;
  } catch (error) {
    console.error('YouTube API error:', error.response ? error.response.data : error.message);
    // Fallback for testing
    console.log("Using fallback videos due to API failure");
    return [
      {
        title: "Speech Therapy Exercise",
        url: "https://youtube.com/watch?v=abc123",
        thumbnail: "http://img.youtube.com/vi/abc123/mqdefault.jpg"
      }
    ];
  }
}

async function getTherapyPlan(diagnosis, age, language = 'en') {
  const ageGroup = age <= 5 ? "3-5" : age <= 12 ? "6-12" : "13+";
  const plan = therapyPlansData[diagnosis]?.[ageGroup];

  if (!plan) {
    console.log(`No plan found for diagnosis: ${diagnosis}, age: ${age}`);
    return null;
  }

  const activities = await Promise.all(
    plan.activities.map(async activity => ({
      name: activity.name,
      videos: await fetchYouTubeVideos(activity, language)
    }))
  );

  console.log(`Generated plan for ${diagnosis}, ${ageGroup}:`, { goals: plan.goals, activities });
  return { 
    goals: plan.goals,
    activities
  };
}

module.exports = { getTherapyPlan, therapyPlansData };