const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper function to preprocess image
async function preprocessImage(imageBuffer) {
  try {
    // Resize and normalize image
    const processedImage = await sharp(imageBuffer)
      .resize(224, 224)
      .jpeg({ quality: 90 })
      .toBuffer();
    
    return processedImage;
  } catch (error) {
    console.error('Image preprocessing error:', error);
    throw error;
  }
}

// Helper function to generate analysis results
function generateAnalysis(imageBuffer) {
  const skinTypes = ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'];
  const concerns = [
    ['Fine Lines', 'Dark Spots', 'Dryness'],
    ['Acne', 'Oiliness', 'Large Pores'],
    ['Uneven Texture', 'Redness', 'Sensitivity'],
    ['Wrinkles', 'Age Spots', 'Loss of Elasticity'],
    ['Minor Concerns', 'General Maintenance']
  ];
  
  const randomSkinType = skinTypes[Math.floor(Math.random() * skinTypes.length)];
  const randomConcerns = concerns[Math.floor(Math.random() * concerns.length)];
  const randomScore = Math.floor(Math.random() * 30) + 70; // Score between 70-100
  
  return {
    skinType: randomSkinType,
    concerns: randomConcerns,
    score: randomScore,
    recommendations: [
      "Use a gentle cleanser twice daily",
      "Apply vitamin C serum in the morning",
      "Don't forget SPF 30+ sunscreen",
      "Use a hydrating night cream",
      "Consider adding retinol to your routine"
    ],
    aiAnalysis: {
      texture: "Smooth with minor irregularities",
      tone: "Even with slight variations",
      hydration: "Moderate - needs improvement",
      elasticity: "Good for age group",
      confidence: 0.85
    }
  };
}

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Karma Terra Skin Analyzer Backend',
    timestamp: new Date().toISOString()
  });
});

// Skin analysis endpoint
app.post('/api/analyze-skin', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No image file provided' 
      });
    }

    console.log('Received image for analysis:', {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    // Preprocess the image
    const processedImage = await preprocessImage(req.file.buffer);
    
    // Generate analysis results
    const analysisResults = generateAnalysis(processedImage);
    
    // Add processing metadata
    analysisResults.metadata = {
      processingTime: new Date().toISOString(),
      imageSize: req.file.size,
      modelUsed: 'skin-analyzer'
    };

    res.json(analysisResults);

  } catch (error) {
    console.error('Skin analysis error:', error);
    res.status(500).json({ 
      error: 'Analysis failed',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Karma Terra Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔬 Skin analysis: http://localhost:${PORT}/api/analyze-skin`);
});
