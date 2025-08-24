# Karma Terra Skin Guide

A comprehensive skincare and haircare companion app with AI-powered skin analysis.

## 🌟 Features

### Core Services
- **🧠 Know Your Skin**: Learn about different skin types and characteristics
- **💖 Know Your Hair**: Discover your hair type and care needs  
- **🧪 Ingredients**: Comprehensive ingredient knowledge database

### AI-Powered Skin Analysis
- **📸 Camera Integration**: Take photos directly in the app
- **🤖 AI Analysis**: Powered by Hugging Face's dermatology model
- **📊 Detailed Results**: Get skin type, concerns, and personalized recommendations
- **🔄 Upload Option**: Upload existing photos for analysis

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at: `http://localhost:8080`

### Backend Setup (AI Analysis)
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start backend server
npm start
```

The backend API will be available at: `http://localhost:3001`

## 🤖 AI Skin Analysis Setup

### Option 1: Real AI Analysis (Recommended)
1. Get a Hugging Face API token from [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Copy `backend/env.example` to `backend/.env`
3. Add your token: `HUGGING_FACE_TOKEN=your_token_here`
4. Restart the backend server

### Option 2: Mock Analysis (Default)
If no Hugging Face token is provided, the app will use realistic mock analysis results for demonstration purposes.

## 📱 How to Use

### Authentication
- Enter any 4-digit PIN to login
- Optionally provide your name for personalization

### Skin Analysis
1. Navigate to "Skin Analyzer" from the home page
2. Choose to use camera or upload a photo
3. Take/select a clear photo of your skin
4. Wait for AI analysis (usually 3-5 seconds)
5. Review detailed results and recommendations

### Features Available
- **Camera Capture**: Real-time camera with face detection guide
- **Photo Upload**: Upload existing photos from your device
- **AI Analysis**: Advanced skin texture, tone, and concern detection
- **Personalized Recommendations**: Tailored skincare routine suggestions
- **Results History**: View previous analyses

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **React Router** for navigation

### Backend
- **Express.js** server
- **Multer** for file uploads
- **Sharp** for image processing
- **Axios** for API calls
- **Hugging Face API** for AI analysis

### AI Model
- **Google Derm Foundation**: Advanced dermatology AI model
- **Image Preprocessing**: Automatic resizing and optimization
- **Fallback System**: Mock analysis when AI is unavailable

## 🔧 Development

### Project Structure
```
KarmaTerraApp/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   ├── pages/             # Application pages
│   │   └── services/      # Service-specific pages
│   └── App.tsx            # Main application component
├── backend/               # Backend API server
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── env.example        # Environment configuration
├── public/                # Static assets
└── package.json           # Frontend dependencies
```

### API Endpoints
- `GET /api/health` - Health check
- `POST /api/analyze-skin` - Skin analysis endpoint

### Environment Variables
```bash
# Backend (.env file)
HUGGING_FACE_TOKEN=your_token_here
PORT=3001
DEBUG=true
```

## 🎨 Design Features

- **Modern UI**: Beautiful gradients and animations
- **Responsive Design**: Works on mobile and desktop
- **Accessibility**: Screen reader friendly
- **Dark/Light Mode**: Automatic theme switching
- **Loading States**: Smooth user experience

## 🔒 Privacy & Security

- **Local Processing**: Images processed locally when possible
- **Secure Uploads**: HTTPS-only API communication
- **No Data Storage**: Images are not permanently stored
- **User Control**: Users can retake/upload photos anytime

## 🚀 Deployment

### Frontend
```bash
npm run build
```
Deploy the `dist` folder to any static hosting service.

### Backend
```bash
cd backend
npm start
```
Deploy to any Node.js hosting platform (Heroku, Vercel, etc.).

## 📞 Support

For issues or questions:
- Check the [GitHub repository](https://github.com/HASHTECHVENTURES/karma-terra-skin-guide-24)
- Review the API documentation
- Test the health endpoint: `http://localhost:3001/api/health`

## 🎯 Future Enhancements

- [ ] Hair analysis AI integration
- [ ] Product recommendation engine
- [ ] Progress tracking over time
- [ ] Social features and sharing
- [ ] Advanced skin condition detection
- [ ] Multi-language support

---

**Built with ❤️ by HashTech Ventures**
