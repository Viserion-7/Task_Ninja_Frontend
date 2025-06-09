import api from "./api";

const userService = {
  // Get user profile data
  getProfile: async () => {
    const response = await api.get("/profile/");
    return response.data;
  },

  // Update user profile data
  updateProfile: async (profileData) => {
    const response = await api.put("/profile/", profileData);
    return response.data;
  },

  // List of supported languages
  languages: [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "hi", label: "Hindi" },
  ],

  // List of genders
  genders: [
    { value: "M", label: "Male" },
    { value: "F", label: "Female" },
    { value: "O", label: "Other" },
    { value: "N", label: "Prefer not to say" },
  ],

  // List of common countries
  countries: [
    "United States",
    "United Kingdom",
    "Australia",
    "India",
    "Germany",
    "France",
    "Japan",
    "Russia",
  ].sort(),

  // List of common timezones
  timezones: [
    "UTC",
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Australia/Sydney",
  ],
};

export default userService;
