const pool = require("../config/database");
const { v4: uuidv4 } = require('uuid');

class OnboardingSubmission {
  static async create(submissionData) {
    const {
      name, gender, age, datingGoal, currentMatches, anchorQuestion, bodyType, stylePreference,
      ethnicity, interests, currentBio, email, confirmEmail, phone, weeklyTips,
      originalPhotos, screenshotPhotos, expectedDelivery, vibe, wantMore, oneLiner
    } = submissionData;

    // Generate a new UUID for the user
    const userId = uuidv4();

    const query = `
      INSERT INTO onboarding_submissions (
        user_id, name, gender, age, dating_goal, current_matches, anchor_question, body_type, style_preference,
        ethnicity, interests, current_bio, email, confirm_email, phone, weekly_tips,
        original_photos, screenshot_photos, expected_delivery, vibe, want_more, one_liner
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      RETURNING *
    `;

    const values = [
      userId, name, gender, age, datingGoal, currentMatches, anchorQuestion, bodyType, stylePreference,
      ethnicity, JSON.stringify(interests), currentBio, email, confirmEmail, phone,
      weeklyTips, JSON.stringify(originalPhotos || []), JSON.stringify(screenshotPhotos || []), expectedDelivery,
      vibe, wantMore, oneLiner
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const query = "SELECT * FROM onboarding_submissions WHERE id = $1";
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    const query = "SELECT * FROM onboarding_submissions ORDER BY created_at DESC";
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    const query = "SELECT * FROM onboarding_submissions WHERE email = $1 ORDER BY created_at DESC";
    try {
      const result = await pool.query(query, [email]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OnboardingSubmission;
