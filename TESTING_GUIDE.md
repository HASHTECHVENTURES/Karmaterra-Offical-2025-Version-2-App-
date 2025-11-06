# Testing Guide - MCQ Data Isolation Fix

## 🎯 Purpose
Test that new users see a blank questionnaire with NO pre-selected answers, and existing users only see their own data.

---

## ✅ Test Scenario 1: New User (No Previous Data)

### Steps:
1. **Sign up as a NEW user**
   - Use a phone number that has NEVER been used before
   - Create account with PIN (can be same as other users)
   - Fill in all required signup fields

2. **Navigate to "Know Your Skin"**
   - Go to services → Know Your Skin
   - Start the questionnaire

3. **Expected Result:**
   - ✅ NO options should be pre-selected
   - ✅ Question 1: "What is your skin type?" - ALL options unselected (Dry, Oily, Normal, etc.)
   - ✅ Question 2: "What is your skin tone?" - ALL options unselected (Fair, Light, Medium, etc.)
   - ✅ Every question should start blank
   - ✅ User must manually select each answer

4. **Verify in Console:**
   - Open browser console (F12)
   - Look for log: `📋 No previous questionnaire data found - starting fresh for user: [user-id]`
   - Should NOT see: `📋 Loaded existing questionnaire answers`

---

## ✅ Test Scenario 2: Existing User (With Previous Data)

### Steps:
1. **Sign in as EXISTING user**
   - Use phone number from a user who completed questionnaire before
   - Sign in with their PIN

2. **Navigate to "Know Your Skin"**
   - Go to services → Know Your Skin
   - Start the questionnaire

3. **Expected Result:**
   - ✅ Previous answers should be pre-selected
   - ✅ If they previously selected "Oily" skin type, it should be selected
   - ✅ If they previously selected "Light" skin tone, it should be selected
   - ✅ Only THEIR answers are shown

4. **Verify in Console:**
   - Look for log: `📋 Loaded existing questionnaire answers for user: [user-id]`
   - Should see the loaded answers object

---

## ✅ Test Scenario 3: User Switching (Data Isolation)

### Steps:
1. **Complete questionnaire as User A**
   - Sign in as User A
   - Complete full skin questionnaire
   - Save answers

2. **Sign out and Sign in as User B (different phone number)**
   - Sign out completely
   - Sign in as a NEW user (User B) with different phone number
   - Go to Know Your Skin

3. **Expected Result:**
   - ✅ User B should see BLANK questionnaire
   - ✅ Should NOT see User A's answers
   - ✅ No pre-selected options

4. **Verify in Console:**
   - Should see: `📋 No previous questionnaire data found - starting fresh for user: [user-b-id]`
   - Should NOT see User A's data

---

## ✅ Test Scenario 4: Hair Analysis (Same Fix)

### Steps:
1. **New user tests hair analysis**
   - Sign in as NEW user
   - Go to Hair Analysis
   - Start questionnaire

2. **Expected Result:**
   - ✅ NO pre-selected answers
   - ✅ All questions start blank

3. **Complete and test again**
   - Complete hair questionnaire
   - Go back to hair analysis
   - Should now show previous answers

---

## 🔍 Debug Checks

### In Browser Console:
1. **Check State Reset:**
   ```
   Look for: "📋 Reset state when user changes"
   ```

2. **Check Data Loading:**
   ```
   ✅ New User: "📋 No previous questionnaire data found - starting fresh"
   ✅ Existing User: "📋 Loaded existing questionnaire answers"
   ```

3. **Check User ID Filter:**
   ```
   All queries should show: .eq('user_id', user.id)
   ```

### In Network Tab:
1. **Check Supabase Queries:**
   - Open Network tab (F12 → Network)
   - Filter by "supabase.co"
   - Check that queries include `user_id=eq.[current-user-id]`
   - No queries should fetch other users' data

---

## ❌ What Should NOT Happen

1. **New users should NEVER see:**
   - Pre-selected "Normal" for skin type
   - Pre-selected "Medium" for skin tone
   - Any pre-filled answers

2. **Users should NEVER see:**
   - Another user's answers
   - Mixed data from multiple users
   - Default values appearing as if they were their answers

---

## 📱 Mobile Testing (APK)

### Steps:
1. **Install APK version 3.8** (or latest)
2. **Create new account** in the app
3. **Test questionnaire** - should be blank
4. **Complete questionnaire**
5. **Go back** - should see previous answers (only yours)

---

## 🐛 Troubleshooting

### Issue: Still seeing pre-selected answers for new users

**Check:**
1. Clear browser cache/localStorage
2. Check console for errors
3. Verify user.id is correct in logs
4. Check if database has old data causing issues

**Solution:**
- The fix should work, but if old cached data exists, clear it
- Make sure you're testing with a completely NEW phone number

---

## ✅ Success Criteria

- ✅ New users: Blank questionnaire (100% blank)
- ✅ Existing users: Only their own previous answers
- ✅ User switching: Data properly isolated
- ✅ No cross-contamination between users
- ✅ Console logs confirm proper data isolation

---

## 📝 Test Checklist

- [ ] Test 1: New user - blank questionnaire ✓
- [ ] Test 2: Existing user - previous answers loaded ✓
- [ ] Test 3: User switching - data isolation ✓
- [ ] Test 4: Hair analysis - same behavior ✓
- [ ] Console logs confirm correct behavior ✓
- [ ] Network requests show correct user filtering ✓

---

## 🎉 Expected Outcome

**Before Fix:**
- New users saw pre-selected "Normal" and "Medium" ❌

**After Fix:**
- New users see completely blank questionnaire ✅
- Each user only sees their own data ✅
- Perfect data isolation ✅

---

**Happy Testing! 🚀**


