package com.example.foodlergic.ui

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.foodlergic.data.api.ApiClient
import com.example.foodlergic.data.models.LoginRequest
import com.example.foodlergic.data.models.RegisterRequest
import com.example.foodlergic.data.models.User
import com.example.foodlergic.utils.Resource
import kotlinx.coroutines.launch

class AuthViewModel : ViewModel() {
    private val _registrationStatus = MutableLiveData<Resource<String>>()
    val registrationStatus: LiveData<Resource<String>> = _registrationStatus

    fun register(name: String, email: String, password: String) {
        _registrationStatus.value = Resource.Loading() // Show loading state

        viewModelScope.launch {
            try {
                val registerRequest =
                    RegisterRequest(username = name, email = email, password = password)

                val response = ApiClient.getApiService().register(registerRequest)

                // Handle successful registration
                if (response.isSuccessful) {
                    _registrationStatus.value = Resource.Success(response.body()?.userId.orEmpty())
                } else {
                    // Handle error response from API
                    _registrationStatus.value =
                        Resource.Error("Failed with code ${response.code()}: ${response.message()}")
                }
            } catch (e: Exception) {
                // Handle exception
                _registrationStatus.value = Resource.Error("An error occurred: ${e.message}")
            }
        }
    }

    private val _loginStatus = MutableLiveData<Resource<User?>>()
    val loginStatus: LiveData<Resource<User?>> = _loginStatus

    fun login(email: String, password: String) {
        _loginStatus.value = Resource.Loading() // Show loading state

        viewModelScope.launch {
            try {
                val loginRequest = LoginRequest(email = email, password = password)

                val response = ApiClient.getApiService().login(loginRequest)

                // Handle successful registration
                if (response.isSuccessful) {
                    _loginStatus.value = Resource.Success(response.body()?.user)
                } else {
                    // Handle error response from API
                    _loginStatus.value =
                        Resource.Error("Failed with code ${response.code()}: ${response.message()}")
                }
            } catch (e: Exception) {
                // Handle exception
                _loginStatus.value = Resource.Error("An error occurred: ${e.message}")
            }
        }
    }
}