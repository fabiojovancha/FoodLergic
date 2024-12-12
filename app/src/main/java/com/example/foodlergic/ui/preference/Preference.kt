package com.example.foodlergic.ui.preference

import android.content.Context
import android.content.SharedPreferences

class Preference(context: Context) {

    private val sharedPreferences: SharedPreferences =
        context.getSharedPreferences(PREFERENCE_NAME, Context.MODE_PRIVATE)

    // Define keys for SharedPreferences
    companion object {
        private const val PREFERENCE_NAME = "UserPreferences"
        private const val KEY_USERNAME = "username"
        private const val KEY_ALLERGIES = "allergies"
        private const val KEY_USER_ID = "userId"
        private const val KEY_EMAIL = "email"
        private const val KEY_LOGGED_IN = "loggedIn"
        private const val KEY_PROFILE_IMAGE_URI = "profileImageUri"
    }

    // Save user session
    fun saveUserSession(userId: String,username: String,email: String) {
        sharedPreferences.edit().putString(KEY_USER_ID, userId).apply()
        sharedPreferences.edit().putString(KEY_USERNAME, username).apply()
        sharedPreferences.edit().putString(KEY_EMAIL, email).apply()
        sharedPreferences.edit().putBoolean(KEY_LOGGED_IN, true).apply()
    }

    // Save username
    fun saveUsername(username: String) {
        sharedPreferences.edit().putString(KEY_USERNAME, username).apply()
    }

    // Retrieve username
    fun getUsername(): String? {
        return sharedPreferences.getString(KEY_USERNAME, null)
    }

    // Save email
    fun saveEmail(email: String) {
        sharedPreferences.edit().putString(KEY_EMAIL, email).apply()
    }

    // Retrieve email
    fun getEmail(): String? {
        return sharedPreferences.getString(KEY_EMAIL, null)
    }


    // Save allergies (as a comma-separated string)
    fun saveAllergies(allergies: List<String>) {
        val allergiesString = allergies.joinToString(",")
        sharedPreferences.edit().putString(KEY_ALLERGIES, allergiesString).apply()
    }

    // Retrieve allergies
    fun getAllergies(): List<String> {
        val allergiesString = sharedPreferences.getString(KEY_ALLERGIES, "")
        return allergiesString?.split(",") ?: emptyList()
    }

    // Save user ID
    fun saveUserId(userId: String) {
        sharedPreferences.edit().putString(KEY_USER_ID, userId).apply()
    }

    // Retrieve user ID
    fun getUserId(): String? {
        return sharedPreferences.getString(KEY_USER_ID, null)
    }

    // Retrieve Logged In User State
    fun getIsLoggedIn(): Boolean {
        return sharedPreferences.getBoolean(KEY_LOGGED_IN, false)
    }

    fun saveProfileImageUri(uri: String) {
        sharedPreferences.edit().putString(KEY_PROFILE_IMAGE_URI, uri).apply()
    }

    fun getProfileImageUri(): String? {
        return sharedPreferences.getString(KEY_PROFILE_IMAGE_URI, null)
    }


    // Clear all saved preferences
    fun clearPreferences() {
        sharedPreferences.edit().clear().apply()
    }
}
