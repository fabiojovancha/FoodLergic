package com.example.foodlergic.ui.SignUp

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.example.foodlergic.R
import com.example.foodlergic.databinding.ActivityRegisterBinding
import com.example.foodlergic.ui.AuthViewModel
import com.example.foodlergic.ui.Login.LoginActivity
import com.example.foodlergic.ui.preference.Preference
import com.example.foodlergic.utils.Resource
import com.example.foodlergic.utils.ViewModelFactory

class RegisterActivity : AppCompatActivity() {
    private lateinit var binding: ActivityRegisterBinding
    private lateinit var viewModel: AuthViewModel
    private lateinit var preference: Preference
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)
        preference = Preference(this)
        viewModel =
            ViewModelProvider(this, ViewModelFactory(preference))[AuthViewModel::class.java]

        observeRegister()
        binding.signupButton.setOnClickListener {
            val name = binding.nameEditText.text.toString().trim()
            val email = binding.emailEditText.text.toString().trim()
            val password = binding.passwordEditText.text.toString().trim()
            Log.d("rezon-dbg", "name: $name")
            Log.d("rezon-dbg", "email: $email")
            Log.d("rezon-dbg", "password: $password")

            if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, getString(R.string.fill_all_fields), Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
//
//            register(name, email, password)
            viewModel.register(name, email, password)
        }
    }

    private fun observeRegister() {
        viewModel.registrationStatus.observe(this) { result ->
            when (result) {
                is Resource.Loading -> {
                    binding.signupButton.isEnabled = false
                    binding.signupButton.text = getString(R.string.loading)
                }

                is Resource.Success -> {
                    binding.signupButton.isEnabled = true
                    binding.signupButton.text = getString(R.string.signup)

                    Toast.makeText(
                        this@RegisterActivity,
                        getString(R.string.registration_success),
                        Toast.LENGTH_SHORT
                    ).show()
                    Log.d("rezon-dbg", "userId: ${result.data}")
                    startActivity(Intent(this@RegisterActivity, LoginActivity::class.java))
                    finish()

                }

                is Resource.Error -> {
                    binding.signupButton.isEnabled = true
                    binding.signupButton.text = getString(R.string.signup)

                    Log.e("RegisterActivity", "Error: ${result.message}")
                    Toast.makeText(
                        this@RegisterActivity,
                        result.message,
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

        }
    }
}

