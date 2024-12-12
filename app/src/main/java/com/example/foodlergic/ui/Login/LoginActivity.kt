package com.example.foodlergic.ui.Login

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.example.foodlergic.MainActivity
import com.example.foodlergic.R
import com.example.foodlergic.databinding.ActivityLoginBinding
import com.example.foodlergic.ui.AuthViewModel
import com.example.foodlergic.ui.SignUp.RegisterActivity
import com.example.foodlergic.ui.preference.Preference
import com.example.foodlergic.utils.Resource
import com.example.foodlergic.utils.ViewModelFactory

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    private lateinit var preference: Preference
    private lateinit var viewModel: AuthViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        preference = Preference(this)
        viewModel =
            ViewModelProvider(this, ViewModelFactory(preference))[AuthViewModel::class.java]
        observeLogin()
        binding.loginButton.setOnClickListener {
            val email = binding.emailEditText.text.toString().trim()
            val password = binding.passwordEditText.text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, getString(R.string.fill_all_fields), Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            viewModel.login(email, password)
        }

        binding.tvRegisterNow.setOnClickListener {
            val intent = Intent(this, RegisterActivity::class.java)
            startActivity(intent)
        }
    }

    private fun observeLogin() {
        viewModel.loginStatus.observe(this) { result ->
            when (result) {
                is Resource.Loading -> {
                    binding.loginButton.isEnabled = false
                    binding.loginButton.text = getString(R.string.loading)
                }

                is Resource.Success -> {
                    binding.loginButton.isEnabled = true
                    binding.loginButton.text = getString(R.string.login)

                    result.data?.let { preference.saveUserSession(it.id, it.username, it.email) }
                    Toast.makeText(
                        this@LoginActivity,
                        getString(R.string.login_success),
                        Toast.LENGTH_SHORT
                    ).show()
                    Log.d("rezon-dbg", "userId: ${result.data}")
                    startActivity(Intent(this@LoginActivity, MainActivity::class.java))
                    finish()

                }

                is Resource.Error -> {
                    binding.loginButton.isEnabled = true
                    binding.loginButton.text = getString(R.string.login)

                    Log.e("LoginActivity", "Error: ${result.message}")
                    Toast.makeText(
                        this@LoginActivity,
                        getString(R.string.login_failed),
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

        }
    }
}
