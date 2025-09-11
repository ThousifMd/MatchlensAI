const validateOnboardingSubmission = (req, res, next) => {
  const { name, age, datingGoal, currentMatches, bodyType, stylePreference, email, interests } = req.body;

  if (!name || !age || !datingGoal || !currentMatches || !bodyType || !stylePreference || !email) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["name", "age", "datingGoal", "currentMatches", "bodyType", "stylePreference", "email"]
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!interests || !Array.isArray(interests) || interests.length !== 3) {
    return res.status(400).json({ error: "Exactly 3 interests must be selected" });
  }

  const ageNum = parseInt(age);
  if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
    return res.status(400).json({ error: "Age must be between 18 and 100" });
  }

  const validDatingGoals = ["casual", "relationship", "marriage", "hookup"];
  if (!validDatingGoals.includes(datingGoal)) {
    return res.status(400).json({ error: "Invalid dating goal" });
  }

  const validMatches = ["0-2", "3-5", "5-10", "10+"];
  if (!validMatches.includes(currentMatches)) {
    return res.status(400).json({ error: "Invalid current matches selection" });
  }

  const validBodyTypes = ["slim", "athletic", "average", "plus"];
  if (!validBodyTypes.includes(bodyType)) {
    return res.status(400).json({ error: "Invalid body type" });
  }

  const validStyles = ["professional", "casual", "adventurous", "party"];
  if (!validStyles.includes(stylePreference)) {
    return res.status(400).json({ error: "Invalid style preference" });
  }

  next();
};

module.exports = { validateOnboardingSubmission };
