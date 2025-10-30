import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, LoaderCircle, History, Camera, Edit } from "lucide-react";
import Questionnaire, { QuestionnaireAnswers } from "../../components/Questionnaire";
import PhotoCapture from "../../components/PhotoCapture";
import { analyzeSkin } from "../../services/geminiService";
import { useAuth } from "../../App";
import { UserData, Report } from "../../types";
import { supabase } from "../../lib/supabase";

const KnowYourSkinPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState<any | undefined>(undefined);
  const [localMode, setLocalMode] = useState<'mcq' | 'camera' | 'analyzing' | 'error' | 'menu' | 'history'>('menu');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<QuestionnaireAnswers | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentReport, setRecentReport] = useState<Report | null>(null);
  const [hasAnalysisHistory, setHasAnalysisHistory] = useState(false);
  const [allAnalyses, setAllAnalyses] = useState<any[]>([]);

  useEffect(() => {
    const initialize = async () => {
      if (user) {
        setUserProfile(user);
        
        // Check if user has all required demographic data
        const hasAllDemographicData = 
          user.gender && 
          (user.birthdate || user.date_of_birth) && 
          user.city && 
          user.state && 
          user.country;
        
        // Check for all analysis history
        const { data, error } = await supabase
          .from('analysis_history')
          .select('id, created_at, analysis_result')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (data && data.length > 0) {
          setHasAnalysisHistory(true);
          setAllAnalyses(data);
          setRecentReport(data[0].analysis_result);
          
          // Extract previous questionnaire answers from last analysis
          const lastUserData = data[0].analysis_result.userData;
          if (lastUserData) {
            const previousAnswers: QuestionnaireAnswers = {
              profession: lastUserData.profession || '',
              workingHours: lastUserData.workingTime || '',
              smoking: lastUserData.smoking || 'non-smoker',
              waterQuality: lastUserData.waterQuality || 'good',
              acUsage: lastUserData.acUsage || 'no'
            };
            setQuestionnaireAnswers(previousAnswers);
            console.log('📋 Loaded previous questionnaire answers from last analysis');
          }
        } else {
          setHasAnalysisHistory(false);
        }
        
        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching recent analysis:", error);
        }
        
        // Set initial mode based on history (check data directly, not state)
        if (data && data.length > 0) {
          // Has history - show menu with options
          setLocalMode('menu');
        } else {
          // No history - start MCQ directly
          setLocalMode('mcq');
        }
      }
      setLoadingProfile(false);
    };

    initialize();
  }, [user]);

  const useLocalMcq = useMemo(() => {
    const qs = new URLSearchParams(location.search);
    return qs.get('local') === '1' || !import.meta.env.VITE_KNOW_YOUR_SKIN_URL;
  }, [location.search]);

  const src = useMemo(() => {
    const base = import.meta.env.VITE_KNOW_YOUR_SKIN_URL || "";
    let params = new URLSearchParams();
    try {
      const raw = localStorage.getItem('karma-terra-user');
      if (raw) {
        const u = JSON.parse(raw);
        if (u.name) params.set('name', u.name);
        if (u.gender) params.set('gender', u.gender);
        if (u.birthdate) {
          const years = Math.floor((Date.now() - new Date(u.birthdate).getTime()) / (365.25*24*60*60*1000));
          if (!isNaN(years)) params.set('age', String(years));
        }
        if (u.country) params.set('country', u.country);
        if (u.state) params.set('state', u.state);
        if (u.city) params.set('city', u.city);
      }
    } catch {}
    // Start step based on local mode when using local fallback, else default to MCQ
    if (!params.has('start')) params.set('start', useLocalMcq ? (localMode === 'camera' ? 'camera' : 'mcq') : 'mcq');
    const qs = params.toString();
    return base ? (qs ? `${base}?${qs}` : base) : "";
  }, [useLocalMcq, localMode]);

  const handleAnalysis = async (images: string[]) => {
    if (!userProfile || !questionnaireAnswers) {
      setError("User data or questionnaire answers are missing.");
      setLocalMode('error');
      return;
    }

    setLocalMode('analyzing');

    try {
      // Update user profile with any demographic data collected from questionnaire
      const profileUpdates: any = {};
      let needsUpdate = false;

      if (questionnaireAnswers.gender && !userProfile.gender) {
        profileUpdates.gender = questionnaireAnswers.gender;
        needsUpdate = true;
      }
      if (questionnaireAnswers.birthdate && !userProfile.birthdate && !userProfile.date_of_birth) {
        profileUpdates.birthdate = questionnaireAnswers.birthdate;
        needsUpdate = true;
      }
      if (questionnaireAnswers.city && !userProfile.city) {
        profileUpdates.city = questionnaireAnswers.city;
        needsUpdate = true;
      }
      if (questionnaireAnswers.state && !userProfile.state) {
        profileUpdates.state = questionnaireAnswers.state;
        needsUpdate = true;
      }
      if (questionnaireAnswers.country && !userProfile.country) {
        profileUpdates.country = questionnaireAnswers.country;
        needsUpdate = true;
      }

      // Save demographic updates to database and localStorage
      if (needsUpdate && userProfile.id) {
        console.log('💾 SAVING DEMOGRAPHIC DATA TO SUPABASE');
        console.log('  User ID:', userProfile.id);
        console.log('  Updates:', profileUpdates);
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('id', userProfile.id);

        if (updateError) {
          console.error('❌ Failed to update profile:', updateError);
        } else {
          console.log('✅ Profile updated successfully in Supabase');
          
          // Update local user profile
          const updatedProfile = { ...userProfile, ...profileUpdates };
          setUserProfile(updatedProfile);
          
          // Update localStorage
          localStorage.setItem('karma-terra-user', JSON.stringify(updatedProfile));
          
          console.log('✅ Local storage updated');
          console.log('📊 Updated profile:', updatedProfile);
        }
      } else if (!needsUpdate) {
        console.log('ℹ️ No demographic data updates needed - all fields already present');
      }

      const birthdate = questionnaireAnswers.birthdate || userProfile.birthdate || userProfile.date_of_birth;
      if (!birthdate) {
        throw new Error("Birthdate is missing from user profile.");
      }
      
      const age = Math.floor((Date.now() - new Date(birthdate).getTime()) / (365.25 * 24 * 60 * 60 * 1000));

      const userDataForApi: UserData = {
        name: userProfile.name || 'Anonymous',
        age: age,
        gender: questionnaireAnswers.gender || userProfile.gender,
        city: questionnaireAnswers.city || userProfile.city,
        state: questionnaireAnswers.state || userProfile.state,
        country: questionnaireAnswers.country || userProfile.country,
        profession: questionnaireAnswers.profession,
        workingTime: questionnaireAnswers.workingHours,
        acUsage: questionnaireAnswers.acUsage,
        smoking: questionnaireAnswers.smoking,
        waterQuality: questionnaireAnswers.waterQuality,
      };

      const result = await analyzeSkin(userDataForApi, images);

      const report: Report = {
        id: new Date().toISOString(), // This will be replaced by the DB ID
        date: new Date().toLocaleDateString(),
        result,
        userData: userDataForApi,
        faceImages: images,
      };

      // Save the report to the analysis_history table
      const { data: savedRecord, error: saveError } = await supabase
        .from('analysis_history')
        .insert({
          user_id: userProfile.id,
          analysis_result: report,
        })
        .select()
        .single();
      
      if (saveError) {
        throw new Error(`Failed to save analysis report: ${saveError.message}`);
      }

      // Use the saved report data for navigation
      const finalReport = savedRecord.analysis_result;
      finalReport.id = savedRecord.id;
      
      navigate('/skin-analysis-results', { state: { report: finalReport } });

    } catch (err) {
      console.error("Analysis failed:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during analysis.";
      setError(errorMessage);
      setLocalMode('error');
    }
  };

  const renderContent = () => {
    if (loadingProfile) {
      return <p>Loading user profile...</p>;
    }

    switch (localMode) {
      case 'history':
        return (
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setLocalMode('menu')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Analysis History</h2>
                  <p className="text-sm text-gray-600">{allAnalyses.length} report{allAnalyses.length > 1 ? 's' : ''} found</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {allAnalyses.map((analysis, index) => {
                const report = analysis.analysis_result;
                const analysisDate = new Date(analysis.created_at);
                const isRecent = index === 0;
                
                // Get severity color
                const getSeverityColor = (severity: string) => {
                  switch (severity) {
                    case 'Mild': return 'bg-green-100 text-green-700 border-green-300';
                    case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
                    case 'Severe': return 'bg-red-100 text-red-700 border-red-300';
                    default: return 'bg-gray-100 text-gray-700 border-gray-300';
                  }
                };

                return (
                  <button
                    key={analysis.id}
                    onClick={() => navigate('/skin-analysis-results', { state: { report } })}
                    className={`bg-white/90 backdrop-blur-sm border-2 rounded-2xl p-5 hover:shadow-xl transition-all text-left ${
                      isRecent ? 'border-green-500 shadow-lg' : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-800">
                            {analysisDate.toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </h3>
                          {isRecent && (
                            <span className="text-xs bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full font-semibold shadow-sm">
                              Latest
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {analysisDate.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(report.result.overallSeverity)}`}>
                        {report.result.overallSeverity}
                      </div>
                    </div>

                    {/* Summary preview */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {report.result.summary}
                    </p>

                    {/* Quick stats */}
                    <div className="flex gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-700">{report.result.parameters.length}</span>
                        <span className="text-gray-500">parameters analyzed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-700">
                          {report.result.parameters.filter((p: any) => p.severity === 'Mild' || p.severity === 'N/A').length}
                        </span>
                        <span className="text-gray-500">doing well</span>
                      </div>
                    </div>

                    {/* View indicator */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className="text-xs text-green-600 font-semibold">
                        Tap to view full report →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 'menu':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">Choose an Option</h2>
              <p className="text-gray-600">Select what you'd like to do with your skin analysis</p>
            </div>

            <div className="grid gap-5">
              {/* View Recent History - Only show if user has analysis */}
              {hasAnalysisHistory && (
                <button
                  onClick={() => setLocalMode('history')}
                  className="bg-white/90 backdrop-blur-sm border-2 border-blue-400 rounded-2xl p-6 hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <History className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">View Analysis History</h3>
                      <p className="text-sm text-gray-600">
                        {allAnalyses.length} analysis report{allAnalyses.length > 1 ? 's' : ''} available
                      </p>
                      <p className="text-xs text-blue-600 mt-1">Browse and select any report to view</p>
                    </div>
                  </div>
                </button>
              )}

              {/* Edit MCQ - Only show if user has questionnaire answers */}
              {questionnaireAnswers && (
                <button
                  onClick={() => setLocalMode('mcq')}
                  className="bg-white/90 backdrop-blur-sm border-2 border-orange-400 rounded-2xl p-6 hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                      <Edit className="w-8 h-8 text-orange-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">Edit Questionnaire</h3>
                      <p className="text-sm text-gray-600">
                        Update your lifestyle and demographic information
                      </p>
                      <p className="text-xs text-orange-600 mt-1">Keep your profile up to date</p>
                    </div>
                  </div>
                </button>
              )}

              {/* Track Progress - Only show if user has history */}
              {hasAnalysisHistory && (
                <button
                  onClick={() => navigate('/progress-tracking')}
                  className="bg-white/90 backdrop-blur-sm border-2 border-purple-400 rounded-2xl p-6 hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <LoaderCircle className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">Track Progress</h3>
                      <p className="text-sm text-gray-600">
                        Compare your skin improvements over time
                      </p>
                      <p className="text-xs text-purple-600 mt-1">View detailed progress reports</p>
                    </div>
                  </div>
                </button>
              )}

              {/* Start New Analysis */}
              <button
                onClick={() => {
                  // Check if user has questionnaire answers from previous analysis
                  // If no previous answers, must go through MCQ first
                  if (questionnaireAnswers) {
                    // Has previous answers, can skip to camera
                    setLocalMode('camera');
                  } else {
                    // No previous answers, must complete questionnaire
                    setLocalMode('mcq');
                  }
                }}
                className="bg-gradient-to-r from-green-500 to-green-600 border-2 border-green-600 rounded-2xl p-6 hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-bold text-white mb-1">Start New Analysis</h3>
                    <p className="text-sm text-white/90">
                      {hasAnalysisHistory ? 'Take new photos and get updated results' : 'Begin your skin analysis journey'}
                    </p>
                    <p className="text-xs text-white/80 mt-1">
                      {questionnaireAnswers ? '✓ Skip to camera (answers saved)' : '📋 Complete questionnaire + photo capture'}
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* First Time User Message */}
            {!hasAnalysisHistory && (
              <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl shadow-lg">
                <p className="text-sm text-green-800 text-center leading-relaxed">
                  <strong className="text-lg">🌟 Welcome!</strong><br />
                  Start your first analysis to unlock progress tracking and history features.
                </p>
              </div>
            )}
          </div>
        );
      case 'mcq':
        return (
          <div className="space-y-4">
            {/* Show back to menu button if user has history */}
            {hasAnalysisHistory && (
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setLocalMode('menu')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {questionnaireAnswers ? 'Edit Questionnaire' : 'Complete Questionnaire'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {questionnaireAnswers ? 'Update your information' : 'Tell us about your lifestyle'}
                  </p>
                </div>
              </div>
            )}
            
            <Questionnaire
              userProfile={userProfile}
              existingAnswers={questionnaireAnswers}
              onBack={() => hasAnalysisHistory ? setLocalMode('menu') : navigate('/')}
              onComplete={(answers) => {
                console.log('Questionnaire complete:', answers);
                setQuestionnaireAnswers(answers);
                
                // If editing (has history), go back to menu
                // If new user, go to camera
                if (hasAnalysisHistory) {
                  setLocalMode('menu');
                } else {
                  setLocalMode('camera');
                }
              }}
            />
          </div>
        );
      case 'camera':
        return (
          <PhotoCapture onComplete={handleAnalysis} />
        );
      case 'analyzing':
        return (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <LoaderCircle className="w-16 h-16 text-teal-500 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-slate-800">Analyzing Your Skin...</h2>
            <p className="text-slate-600 mt-2">This may take a moment. Our AI is looking at your photos and information.</p>
          </div>
        );
      case 'error':
        return (
          <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-2xl font-bold text-red-700">Analysis Failed</h2>
            <p className="text-red-600 mt-2">{error}</p>
            <button onClick={() => setLocalMode('mcq')} className="mt-4 bg-red-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-red-600">
              Try Again
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800">Know Your Skin</h1>
            <p className="text-xs text-gray-500">{useLocalMcq ? 'AI-powered analysis' : 'Embedded analysis'}</p>
          </div>
        </div>
      </div>

      {useLocalMcq ? (
        <div className="max-w-4xl mx-auto px-4 py-6">
          {renderContent()}
        </div>
      ) : (
        <div className="w-full h-[calc(100vh-60px)]">
          <iframe
            title="Know Your Skin"
            src={src}
            className="w-full h-full border-0"
            allow="camera; microphone; clipboard-read; clipboard-write"
          />
        </div>
      )}
    </div>
  );
};

export default KnowYourSkinPage;