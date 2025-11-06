-- Migration script to remove unique constraint from PIN column
-- Run this in your Supabase SQL Editor
-- This allows multiple users to have the same PIN (only phone numbers need to be unique)

-- Step 1: Drop the unique constraint on PIN if it exists
DO $$ 
BEGIN
    -- Check if the constraint exists and drop it
    IF EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'profiles_pin_key'
    ) THEN
        ALTER TABLE profiles DROP CONSTRAINT profiles_pin_key;
        RAISE NOTICE 'Unique constraint profiles_pin_key removed from PIN column';
    ELSE
        RAISE NOTICE 'Constraint profiles_pin_key does not exist (already removed or never existed)';
    END IF;
END $$;

-- Step 2: Verify the constraint is removed (optional check)
-- SELECT conname, contype 
-- FROM pg_constraint 
-- WHERE conrelid = 'profiles'::regclass 
-- AND conname LIKE '%pin%';


