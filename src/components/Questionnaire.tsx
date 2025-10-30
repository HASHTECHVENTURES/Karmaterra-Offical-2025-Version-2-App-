import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, User, Clock, Cigarette, Droplets, Wind, MapPin, Calendar } from "lucide-react";

interface QuestionnaireProps {
  onComplete: (answers: QuestionnaireAnswers) => void;
  onBack: () => void;
  userProfile?: any; // Add user profile to check missing data
  existingAnswers?: QuestionnaireAnswers | null; // Pre-fill with existing answers when editing
}

export interface QuestionnaireAnswers {
  profession: string;
  workingHours: string;
  smoking: 'smoker' | 'non-smoker';
  waterQuality: 'excellent' | 'good' | 'average' | 'poor';
  acUsage: 'yes' | 'no';
  // Additional demographic fields for missing data
  gender?: 'male' | 'female' | 'other';
  birthdate?: string;
  city?: string;
  state?: string;
  country?: string;
}

// Base questions (always asked) - moved outside component to prevent recreation
const baseQuestions = [
    {
      id: 'profession',
      title: 'What is your profession?',
      icon: User,
      options: [
        'Office Worker',
        'Healthcare Professional',
        'Teacher/Educator',
        'Student',
        'Retail/Service',
        'Construction/Manual Labor',
        'Artist/Creative',
        'Remote Worker',
        'Other'
      ]
    },
    {
      id: 'workingHours',
      title: 'What are your working hours?',
      icon: Clock,
      options: [
        '9 AM - 5 PM (Day shift)',
        '6 AM - 2 PM (Early morning)',
        '2 PM - 10 PM (Evening)',
        '10 PM - 6 AM (Night shift)',
        'Flexible/Remote',
        'Part-time',
        'Not working'
      ]
    },
    {
      id: 'smoking',
      title: 'Are you a smoker or non-smoker?',
      icon: Cigarette,
      options: [
        'Non-smoker',
        'Occasional smoker',
        'Regular smoker',
        'Former smoker'
      ]
    },
    {
      id: 'waterQuality',
      title: 'How is the water quality in your city?',
      icon: Droplets,
      options: [
        'Excellent (Very clean)',
        'Good (Generally clean)',
        'Average (Some impurities)',
        'Poor (Many impurities)',
        'Not sure'
      ]
    },
    {
      id: 'acUsage',
      title: 'How many hours per day do you use air conditioning?',
      icon: Wind,
      options: [
        'More than 8 hours daily',
        '4-8 hours daily',
        '1-3 hours daily',
        'Less than 1 hour daily',
        'Not using AC'
      ]
    }
  ];

// Additional demographic questions (only if data is missing) - moved outside component
const demographicQuestions = [
    {
      id: 'gender',
      title: 'What is your gender?',
      icon: User,
      options: ['Male', 'Female', 'Other', 'Prefer not to say']
    },
    {
      id: 'birthdate',
      title: 'What is your date of birth?',
      icon: Calendar,
      type: 'date'
    },
    {
      id: 'city',
      title: 'Which city do you live in?',
      icon: MapPin,
      type: 'text'
    },
    {
      id: 'state',
      title: 'Which state/province do you live in?',
      icon: MapPin,
      type: 'text'
    },
    {
      id: 'country',
      title: 'Which country do you live in?',
      icon: MapPin,
      type: 'text'
    }
  ];

const Questionnaire = ({ onComplete, onBack, userProfile, existingAnswers }: QuestionnaireProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>(existingAnswers || {});

  // Memoize missing data check to prevent recalculation on every render
  const missingData = useMemo(() => ({
    gender: !userProfile?.gender || userProfile?.gender === '' || userProfile?.gender === null,
    birthdate: (!userProfile?.birthdate && !userProfile?.date_of_birth) || userProfile?.birthdate === '' || userProfile?.date_of_birth === '',
    city: !userProfile?.city || userProfile?.city === '' || userProfile?.city === null,
    state: !userProfile?.state || userProfile?.state === '' || userProfile?.state === null,
    country: !userProfile?.country || userProfile?.country === '' || userProfile?.country === null
  }), [userProfile]);

  const hasMissingData = useMemo(() => Object.values(missingData).some(Boolean), [missingData]);

  // Log only once when component mounts or userProfile changes
  useEffect(() => {
    console.log('🔍 QUESTIONNAIRE - Checking User Profile Data:');
    console.log('👤 User Profile:', userProfile);
    console.log('❌ Missing Data:', missingData);
    console.log('📊 Has Missing Data:', hasMissingData);
    
    if (hasMissingData) {
      const missingFields = Object.entries(missingData)
        .filter(([_, isMissing]) => isMissing)
        .map(([field]) => field);
      console.log('⚠️ MISSING FIELDS DETECTED:', missingFields.join(', '));
      console.log('✅ These fields will be asked in the questionnaire');
    } else {
      console.log('✅ All demographic data present - Only lifestyle questions will be asked');
    }
  }, [userProfile, missingData, hasMissingData]);

  // Memoize questions array to prevent rebuilding on every render
  const allQuestions = useMemo(() => {
    const questions = [...baseQuestions];
    
    if (hasMissingData) {
      // Add demographic questions for missing data in order
      if (missingData.gender) questions.push(demographicQuestions[0]);
      if (missingData.birthdate) questions.push(demographicQuestions[1]);
      if (missingData.city) questions.push(demographicQuestions[2]);
      if (missingData.state) questions.push(demographicQuestions[3]);
      if (missingData.country) questions.push(demographicQuestions[4]);
    }
    
    return questions;
  }, [hasMissingData, missingData]);

  // Log questions only once when they change
  useEffect(() => {
    if (hasMissingData) {
      console.log('📝 ADDING DEMOGRAPHIC QUESTIONS for missing data');
      if (missingData.gender) console.log('  ➕ Question added: Gender');
      if (missingData.birthdate) console.log('  ➕ Question added: Birthdate');
      if (missingData.city) console.log('  ➕ Question added: City');
      if (missingData.state) console.log('  ➕ Question added: State');
      if (missingData.country) console.log('  ➕ Question added: Country');
      console.log(`📊 Total questions to ask: ${allQuestions.length} (${baseQuestions.length} lifestyle + ${allQuestions.length - baseQuestions.length} demographic)`);
    } else {
      console.log(`📊 Total questions to ask: ${allQuestions.length} (lifestyle questions only - all demographic data present)`);
    }
  }, [allQuestions.length, hasMissingData, missingData]);

  const currentQuestion = allQuestions[currentStep];

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const handleNext = () => {
    if (currentStep < allQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete questionnaire
      const completeAnswers: QuestionnaireAnswers = {
        profession: answers.profession || '',
        workingHours: answers.workingHours || '',
        smoking: (answers.smoking as 'smoker' | 'non-smoker') || 'non-smoker',
        waterQuality: (answers.waterQuality as 'excellent' | 'good' | 'average' | 'poor') || 'good',
        acUsage: (answers.acUsage as 'yes' | 'no') || 'no',
        // Include demographic data if provided
        ...(answers.gender && { gender: answers.gender as 'male' | 'female' | 'other' }),
        ...(answers.birthdate && { birthdate: answers.birthdate }),
        ...(answers.city && { city: answers.city }),
        ...(answers.state && { state: answers.state }),
        ...(answers.country && { country: answers.country })
      };
      
      console.log('📋 Questionnaire completed with answers:', completeAnswers);
      onComplete(completeAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progress = ((currentStep + 1) / allQuestions.length) * 100;

  return (
    <div className="bg-gradient-to-br from-karma-cream via-background to-karma-light-gold p-6 rounded-2xl">
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm text-gray-600">{currentStep + 1} of {allQuestions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-karma-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Missing Data Alert */}
        {hasMissingData && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Additional Information Needed</h3>
            </div>
            <p className="text-sm text-blue-700">
              We need some additional demographic information to provide you with the most accurate skin analysis. 
              This information helps our AI understand your skin better based on your location, age, and other factors.
            </p>
            <div className="mt-2 text-xs text-blue-600">
              <strong>Missing:</strong> {Object.entries(missingData).filter(([_, missing]) => missing).map(([field, _]) => field).join(', ')}
            </div>
          </div>
        )}

        {/* Question Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-karma-light-green rounded-full flex items-center justify-center mx-auto mb-4">
              <currentQuestion.icon className="w-8 h-8 text-karma-green" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{currentQuestion.title}</h2>
            <p className="text-gray-600">
              Question {currentStep + 1} of {allQuestions.length}
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.type === 'date' ? (
              <input
                type="date"
                value={answers[currentQuestion.id as keyof QuestionnaireAnswers] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-lg focus:border-karma-green focus:ring-karma-green px-4"
                max={new Date().toISOString().split('T')[0]}
              />
            ) : currentQuestion.type === 'text' ? (
              <input
                type="text"
                value={answers[currentQuestion.id as keyof QuestionnaireAnswers] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder={`Enter your ${currentQuestion.id}`}
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-lg focus:border-karma-green focus:ring-karma-green px-4"
              />
            ) : (
              currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`w-full h-12 rounded-lg border-2 transition-all duration-200 text-left px-4 ${
                    answers[currentQuestion.id as keyof QuestionnaireAnswers] === option
                      ? 'border-karma-green bg-karma-light-green text-karma-green'
                      : 'border-gray-200 hover:border-karma-green hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md disabled:shadow-none"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id as keyof QuestionnaireAnswers]}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-karma-green to-green-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            {currentStep === allQuestions.length - 1 ? (
              <>
                Complete
                <CheckCircle className="w-5 h-5" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="text-center text-sm text-gray-500 mt-2">
          {answers[currentQuestion.id as keyof QuestionnaireAnswers] 
            ? '✓ Answer selected - Click Next to continue' 
            : 'Please select an answer to continue'}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;