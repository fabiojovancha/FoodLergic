package com.example.foodlergic.ui.Profile

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.ViewModelProvider
import com.example.foodlergic.R
import com.example.foodlergic.databinding.ActivityUserprofileBinding
import com.example.foodlergic.ui.Login.LoginActivity
import com.example.foodlergic.ui.MyLergic.AllergyViewModel
import com.example.foodlergic.ui.preference.Preference
import com.example.foodlergic.utils.Resource
import com.example.foodlergic.utils.ViewModelFactory

class UserProfileActivity : AppCompatActivity() {
    private lateinit var binding: ActivityUserprofileBinding
    private lateinit var preference: Preference
    private lateinit var viewModel: AllergyViewModel

    // ActivityResultLauncher for picking an image
    private val pickImageLauncher =
        registerForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
            if (uri != null) {
                try {
                    // Persist permission to access the URI
                    contentResolver.takePersistableUriPermission(uri, Intent.FLAG_GRANT_READ_URI_PERMISSION)

                    // Set the image using the URI
                    binding.profileImage.setImageURI(uri)

                    // Save URI to preferences
                    preference.saveProfileImageUri(uri.toString())
                } catch (e: SecurityException) {
                    // Handle permission-related errors gracefully
                    e.printStackTrace()
                    // Optionally, show a message to the user about the error
                    binding.profileImage.setImageResource(R.drawable.ic_baseline_account_circle_24)
                }
            } else {
                // No URI selected, set the default image
                binding.profileImage.setImageResource(R.drawable.ic_baseline_account_circle_24)
            }
        }

    // ActivityResultLauncher for requesting permissions
    private val requestPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { isGranted ->
            if (isGranted) {
                openGallery()
            } else {
                Toast.makeText(this, "Permission denied", Toast.LENGTH_SHORT).show()
            }
        }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityUserprofileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        preference = Preference(this)

        viewModel =
            ViewModelProvider(this, ViewModelFactory(preference))[AllergyViewModel::class.java]

        viewModel.getAllergies()
        observeGetAllergiesFromAPI()
        loadUserProfile()

        binding.logoutButton.setOnClickListener {
            // Clear user preferences (log out)
            preference.clearPreferences()
            Toast.makeText(this, "Logged out successfully", Toast.LENGTH_SHORT).show()

            // Redirect to LoginActivity
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
            finish()
        }
    }
    private fun observeGetAllergiesFromAPI() {
        viewModel.listAllergies.observe(this) { result ->
            when (result) {
                is Resource.Loading -> {
                    // Show loading state
                }

                is Resource.Success -> {
                    // Extract allergy names into a list
                    val allergyNames = result.data?.map { it.name } ?: emptyList()

                    // If the list is empty, show "None"
                    val allergiesText = if (allergyNames.isEmpty()) {
                        "Selected Allergies: None"
                    } else {
                        "Selected Allergies: ${allergyNames.joinToString(", ")}"
                    }

                    // Set the text to the TextView
                    binding.selectedAllergiesTextView.text = allergiesText
                }

                is Resource.Error -> {
                    // Show error message
                    Log.d("rezon-dbg", "error: ${result.message}")
                    Toast.makeText(this, result.message, Toast.LENGTH_LONG).show()
                }
            }
        }
    }
    private fun hasStoragePermission(): Boolean {
        return ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.READ_EXTERNAL_STORAGE
        ) == PackageManager.PERMISSION_GRANTED
    }

    private fun requestStoragePermission() {
        requestPermissionLauncher.launch(Manifest.permission.READ_EXTERNAL_STORAGE)
    }

    private fun openGallery() {
        pickImageLauncher.launch("image/*")
    }

    private fun loadUserProfile() {
        // Get the username and allergies from preferences
        val username = preference.getUsername() ?: "Unknown User"
        val profileImageUri = preference.getProfileImageUri()



        // Set the username text and allergies text
        binding.usernameText.text = username

        if (profileImageUri != null) {
            try {
                // Use content resolver if URI is from a content provider (like the gallery)
                val uri = Uri.parse(profileImageUri)

                // Ensure URI permissions are granted (needed for content URIs)
                contentResolver.takePersistableUriPermission(uri, Intent.FLAG_GRANT_READ_URI_PERMISSION)

                // Set the image using the URI
                binding.profileImage.setImageURI(uri)
            } catch (e: Exception) {
                // Handle any exceptions (e.g., URI not found, permission issues)
                e.printStackTrace()
                binding.profileImage.setImageResource(R.drawable.ic_baseline_account_circle_24)
            }
        } else {
            binding.profileImage.setImageResource(R.drawable.ic_baseline_account_circle_24)
        }

    }
}

