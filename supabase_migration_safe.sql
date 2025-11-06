-- Safe Migration Script for Karma Terra App - Update profiles table
-- This script safely adds new columns only if they don't exist
-- Run this in your Supabase SQL Editor

-- =====================================================
-- PART 1: ADD NEW SKIN-SPECIFIC QUESTIONNAIRE FIELDS
-- =====================================================

DO $$ 
BEGIN
    -- Primary Skin Concern (JSONB array for multiple selections)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'primary_skin_concern') THEN
        ALTER TABLE profiles ADD COLUMN primary_skin_concern JSONB DEFAULT '[]'::jsonb;
    END IF;

    -- Skin Type
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'skin_type') THEN
        ALTER TABLE profiles ADD COLUMN skin_type VARCHAR(50);
    END IF;

    -- Skin Tone
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'skin_tone') THEN
        ALTER TABLE profiles ADD COLUMN skin_tone VARCHAR(50);
    END IF;

    -- Glow
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'glow') THEN
        ALTER TABLE profiles ADD COLUMN glow VARCHAR(50);
    END IF;

    -- Midday Skin Feel
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'midday_skin_feel') THEN
        ALTER TABLE profiles ADD COLUMN midday_skin_feel VARCHAR(100);
    END IF;

    -- Sunscreen Usage
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'sunscreen_usage') THEN
        ALTER TABLE profiles ADD COLUMN sunscreen_usage VARCHAR(100);
    END IF;

    -- Physical Activity
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'physical_activity') THEN
        ALTER TABLE profiles ADD COLUMN physical_activity VARCHAR(50);
    END IF;

    -- Sleeping Habits
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'sleeping_habits') THEN
        ALTER TABLE profiles ADD COLUMN sleeping_habits VARCHAR(50);
    END IF;

    -- Skin Treatment
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'skin_treatment') THEN
        ALTER TABLE profiles ADD COLUMN skin_treatment VARCHAR(50);
    END IF;
END $$;

-- =====================================================
-- PART 2: ENSURE LIFESTYLE FIELDS EXIST
-- =====================================================

DO $$ 
BEGIN
    -- Profession
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'profession') THEN
        ALTER TABLE profiles ADD COLUMN profession VARCHAR(255);
    END IF;

    -- Working Time (note: using working_time to match database convention)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'working_time') THEN
        ALTER TABLE profiles ADD COLUMN working_time VARCHAR(100);
    END IF;

    -- AC Usage
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'ac_usage') THEN
        ALTER TABLE profiles ADD COLUMN ac_usage VARCHAR(100);
    END IF;

    -- Smoking
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'smoking') THEN
        ALTER TABLE profiles ADD COLUMN smoking VARCHAR(50);
    END IF;

    -- Water Quality
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'water_quality') THEN
        ALTER TABLE profiles ADD COLUMN water_quality VARCHAR(50);
    END IF;
END $$;

-- =====================================================
-- PART 3: CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_skin_type ON profiles(skin_type);
CREATE INDEX IF NOT EXISTS idx_profiles_skin_tone ON profiles(skin_tone);
CREATE INDEX IF NOT EXISTS idx_profiles_primary_concern ON profiles USING GIN(primary_skin_concern);
CREATE INDEX IF NOT EXISTS idx_profiles_phone_number ON profiles(phone_number);

-- =====================================================
-- PART 4: ENSURE analysis_history TABLE EXISTS
-- =====================================================

CREATE TABLE IF NOT EXISTS analysis_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    analysis_result JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analysis_history_user_id ON analysis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_created_at ON analysis_history(created_at DESC);

-- =====================================================
-- PART 5: ENSURE questionnaire_history TABLE EXISTS
-- =====================================================

CREATE TABLE IF NOT EXISTS questionnaire_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    questionnaire_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questionnaire_history_user_id ON questionnaire_history(user_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_history_created_at ON questionnaire_history(created_at DESC);

-- =====================================================
-- VERIFICATION QUERY (Optional - run to check structure)
-- =====================================================
-- Uncomment below to verify the table structure:
--
-- SELECT 
--     column_name, 
--     data_type, 
--     is_nullable,
--     column_default
-- FROM information_schema.columns 
-- WHERE table_name = 'profiles'
-- ORDER BY ordinal_position;


