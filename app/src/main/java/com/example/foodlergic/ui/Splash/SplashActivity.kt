package com.example.foodlergic.ui.Splash

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.example.foodlergic.MainActivity
import com.example.foodlergic.R
import com.example.foodlergic.ui.Login.LoginActivity
import com.example.foodlergic.ui.preference.Preference
import kotlinx.coroutines.delay

class SplashActivity : AppCompatActivity() {
    private lateinit var preference: Preference

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.start_app_activity)
        preference = Preference(this)
        val isLoggedIn = preference.getIsLoggedIn()


        Handler(Looper.getMainLooper()).postDelayed({
            if (isLoggedIn) {
                Log.d("SplashActivity", "Navigating to MainActivity")
                goToMainActivity()
            } else {
                Log.d("SplashActivity", "Navigating to LoginActivity")
                goToLoginActivity()
            }
        }, 2000L)
    }

    private  fun goToLoginActivity() {
        Intent(this,LoginActivity::class.java).also {
            startActivity(it)
            finish()
        }
    }
    private fun goToMainActivity() {
        Intent(this, MainActivity::class.java).also {
            startActivity(it)
            finish()
        }
    }
}