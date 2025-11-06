-- Hair Analysis Supabase Migration SQL
-- Run this in your Supabase SQL Editor to set up hair analysis tables and columns

-- 1. Add hair-related columns to profiles table if they don't exist
DO $$ 
BEGIN
  -- Hair Type
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'hair_type') THEN
    ALTER TABLE profiles ADD COLUMN hair_type TEXT;
  END IF;
  
  -- Hair Texture
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'hair_texture') THEN
    ALTER TABLE profiles ADD COLUMN hair_texture TEXT;
  END IF;
  
  -- Hair Thickness
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'hair_thickness') THEN
    ALTER TABLE profiles ADD COLUMN hair_thickness TEXT;
  END IF;
  
  -- Scalp Condition
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'scalp_condition') THEN
    ALTER TABLE profiles ADD COLUMN scalp_condition TEXT;
  END IF;
  
  -- Washing Frequency
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'washing_frequency') THEN
    ALTER TABLE profiles ADD COLUMN washing_frequency TEXT;
  END IF;
  
  -- Hair Care Products
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'hair_care_products') THEN
    ALTER TABLE profiles ADD COLUMN hair_care_products TEXT;
  END IF;
  
  -- Chemical Treatments
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'chemical_treatments') THEN
    ALTER TABLE profiles ADD COLUMN chemical_treatments TEXT;
  END IF;
  
  -- Heat Styling Frequency
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'heat_styling_frequency') THEN
    ALTER TABLE profiles ADD COLUMN heat_styling_frequency TEXT;
  END IF;
  
  -- Stress Level
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'stress_level') THEN
    ALTER TABLE profiles ADD COLUMN stress_level TEXT;
  END IF;
  
  -- Water Quality (should already exist, but check anyway)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'water_quality') THEN
    ALTER TABLE profiles ADD COLUMN water_quality TEXT;
  END IF;
END $$;

-- 2. Ensure analysis_history table exists and supports hair analysis
-- (Assuming analysis_history already exists from skin analysis)
-- Add hair analysis type support if needed

DO $$ 
BEGIN
  -- Add analysis_type column if it doesn't exist to distinguish skin vs hair
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analysis_history' AND column_name = 'analysis_type') THEN
    ALTER TABLE analysis_history ADD COLUMN analysis_type TEXT DEFAULT 'skin';
  END IF;
END $$;

-- 3. Add questionnaire_type to questionnaire_history if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questionnaire_history' AND column_name = 'questionnaire_type') THEN
    ALTER TABLE questionnaire_history ADD COLUMN questionnaire_type TEXT DEFAULT 'skin';
  END IF;
END $$;

-- 4. Create index for faster queries on analysis_type
CREATE INDEX IF NOT EXISTS idx_analysis_history_type ON analysis_history(analysis_type);
CREATE INDEX IF NOT EXISTS idx_analysis_history_user_type ON analysis_history(user_id, analysis_type);

-- 5. Create index for questionnaire_type
CREATE INDEX IF NOT EXISTS idx_questionnaire_history_type ON questionnaire_history(questionnaire_type);

-- Verification queries (optional - run these to check):
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles' AND column_name LIKE '%hair%';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'analysis_history';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'questionnaire_history';


