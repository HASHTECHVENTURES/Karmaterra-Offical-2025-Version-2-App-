import { supabase } from '../lib/supabase';

export interface AnalysisHistoryRecord {
  id: string;
  created_at: string;
  user_id: string;
  analysis_result: any; // Storing the full report as JSON
}

export interface ProgressReport {
  hasEnoughData: boolean;
  comparison?: {
    score_change: number;
    overall_trend: 'improving' | 'declining' | 'stable';
    improvements: string[];
    concerns: string[];
    recommendations: string[];
  };
}

// Fetch user's analysis history from the 'analysis_history' table
export const getUserAnalysisHistory = async (userId: string, limit: number = 20): Promise<AnalysisHistoryRecord[]> => {
  const { data, error } = await supabase
    .from('analysis_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching analysis history:', error);
    throw error;
  }

  return data || [];
};

// Accurate progress report generator based on actual parameter ratings
export const generateProgressReport = async (userId: string): Promise<ProgressReport> => {
  const history = await getUserAnalysisHistory(userId, 2);

  if (history.length < 2) {
    return { hasEnoughData: false };
  }

  const latest = history[0].analysis_result;
  const previous = history[1].analysis_result;

  // Calculate accurate score based on actual parameter ratings (1-10 scale)
  // Lower rating = better, so we invert it for score calculation
  const calculateScore = (report: any) => {
    if (!report?.result?.parameters) return 0;
    
    const totalParameters = report.result.parameters.length;
    const totalRating = report.result.parameters.reduce((sum: number, param: any) => sum + (param.rating || 0), 0);
    
    // Convert to 0-100 scale (inverted - lower rating is better)
    // Rating 1 = 100 score, Rating 10 = 0 score
    const averageRating = totalRating / totalParameters;
    const score = Math.round(((10 - averageRating) / 9) * 100);
    
    return score;
  };

  const latestScore = calculateScore(latest);
  const previousScore = calculateScore(previous);
  const scoreChange = latestScore - previousScore;

  let overallTrend: 'improving' | 'declining' | 'stable' = 'stable';
  if (scoreChange > 3) overallTrend = 'improving';
  if (scoreChange < -3) overallTrend = 'declining';

  // Find parameters that have improved (rating decreased)
  const improvements = latest.result.parameters
    .filter((param: any) => {
      const prevParam = previous.result.parameters.find((p: any) => p.category === param.category);
      return prevParam && param.rating < prevParam.rating;
    })
    .map((param: any) => {
      const prevParam = previous.result.parameters.find((p: any) => p.category === param.category);
      const improvement = prevParam.rating - param.rating;
      return `${param.category} improved by ${improvement} point${improvement > 1 ? 's' : ''}`;
    });

  // Find parameters that have worsened (rating increased)
  const concerns = latest.result.parameters
    .filter((param: any) => {
      const prevParam = previous.result.parameters.find((p: any) => p.category === param.category);
      return prevParam && param.rating > prevParam.rating;
    })
    .map((param: any) => {
      const prevParam = previous.result.parameters.find((p: any) => p.category === param.category);
      const decline = param.rating - prevParam.rating;
      return `${param.category} increased by ${decline} point${decline > 1 ? 's' : ''} - needs attention`;
    });

  // Generate actual recommendations based on analysis data
  const recommendations: string[] = [];
  
  // Add recommendations based on concerns
  if (concerns.length > 0) {
    recommendations.push(`Focus on addressing ${concerns.length} area${concerns.length > 1 ? 's' : ''} that need attention`);
  }
  
  // Add recommendations based on improvements
  if (improvements.length > 0) {
    recommendations.push(`Continue your current routine for ${improvements.length} improving parameter${improvements.length > 1 ? 's' : ''}`);
  }
  
  // Add recommendation based on overall severity
  if (latest.result.overallSeverity === 'Severe') {
    recommendations.push('Consider consulting a dermatologist for severe concerns');
  }
  
  // Add recommendation based on routine compliance
  if (latest.result.routine) {
    recommendations.push('Follow the morning and evening routine consistently for best results');
  }

  // If no specific recommendations, add general one
  if (recommendations.length === 0) {
    recommendations.push('Maintain your current skincare routine and monitor changes');
  }

  return {
    hasEnoughData: true,
    comparison: {
      score_change: scoreChange,
      overall_trend: overallTrend,
      improvements,
      concerns,
      recommendations
    },
  };
};
