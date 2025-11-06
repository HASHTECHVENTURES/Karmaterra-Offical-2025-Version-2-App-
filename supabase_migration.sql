-- Migration script for Karma Terra App - Update profiles table with new questionnaire fields
-- Run this in your Supabase SQL Editor

-- Step 1: Add new skin-specific questionnaire fields
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS primary_skin_concern JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS skin_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS skin_tone VARCHAR(50),
ADD COLUMN IF NOT EXISTS glow VARCHAR(50),
ADD COLUMN IF NOT EXISTS midday_skin_feel VARCHAR(100),
ADD COLUMN IF NOT EXISTS sunscreen_usage VARCHAR(100),
ADD COLUMN IF NOT EXISTS physical_activity VARCHAR(50),
ADD COLUMN IF NOT EXISTS sleeping_habits VARCHAR(50),
ADD COLUMN IF NOT EXISTS skin_treatment VARCHAR(50);

-- Step 2: Ensure lifestyle fields exist (may already exist, but adding IF NOT EXISTS for safety)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS profession VARCHAR(255),
ADD COLUMN IF NOT EXISTS working_time VARCHAR(100),
ADD COLUMN IF NOT EXISTS ac_usage VARCHAR(100),
ADD COLUMN IF NOT EXISTS smoking VARCHAR(50),
ADD COLUMN IF NOT EXISTS water_quality VARCHAR(50);

-- Step 3: Add comments for documentation
COMMENT ON COLUMN profiles.primary_skin_concern IS 'Array of primary skin concerns selected by user (e.g., ["Ageing", "Dark Spots"])';
COMMENT ON COLUMN profiles.skin_type IS 'User skin type: Dry, Oily, Normal, Sensitive to light and products, Combination';
COMMENT ON COLUMN profiles.skin_tone IS 'User skin tone: Fair, Light, Medium, Tan, Dark, Deep';
COMMENT ON COLUMN profiles.glow IS 'Skin glow level: Dull, Low Glow, Moderate Glow, High Glow, Radiant';
COMMENT ON COLUMN profiles.midday_skin_feel IS 'How skin feels at midday: Fresh and well hydrated, Smooth and bright, etc.';
COMMENT ON COLUMN profiles.sunscreen_usage IS 'Sunscreen usage frequency';
COMMENT ON COLUMN profiles.physical_activity IS 'Physical activity level: Regular, Sometimes, Rarely';
COMMENT ON COLUMN profiles.sleeping_habits IS 'Sleep quality: Sound Sleep, Moderate Sleep, Disturbed Sleep';
COMMENT ON COLUMN profiles.skin_treatment IS 'Previous skin treatments: Chemical Peels, Laser Treatments, Bleaching, None';

-- Step 4: Create indexes for better query performance (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_profiles_skin_type ON profiles(skin_type);
CREATE INDEX IF NOT EXISTS idx_profiles_skin_tone ON profiles(skin_tone);
CREATE INDEX IF NOT EXISTS idx_profiles_primary_concern ON profiles USING GIN(primary_skin_concern);

-- Step 5: Ensure the analysis_history table exists with proper structure (if not already present)
CREATE TABLE IF NOT EXISTS analysis_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    analysis_result JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on analysis_history for faster queries
CREATE INDEX IF NOT EXISTS idx_analysis_history_user_id ON analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_created_at ON analysis_history(created_at DESC);

-- Step 6: Ensure questionnaire_history table exists (for storing questionnaire snapshots)
CREATE TABLE IF NOT EXISTS questionnaire_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    questionnaire_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on questionnaire_history
CREATE INDEX IF NOT EXISTS idx_questionnaire_history_user_id ON questionnaire_history(user_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_history_created_at ON questionnaire_history(created_at DESC);

-- Step 7: Verify the profiles table has required base columns (ensure these exist)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS pin VARCHAR(4) NOT NULL,
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20) UNIQUE,
ADD COLUMN IF NOT EXISTS gender VARCHAR(50),
ADD COLUMN IF NOT EXISTS birthdate VARCHAR(50),
ADD COLUMN IF NOT EXISTS country VARCHAR(100),
ADD COLUMN IF NOT EXISTS state VARCHAR(100),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS country_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 8: Add unique constraint on phone_number if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'profiles_phone_number_key'
    ) THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_phone_number_key UNIQUE (phone_number);
    END IF;
END $$;

-- Step 9: Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 10: Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verification query (run this to check the structure)
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'profiles'
-- ORDER BY ordinal_position;


