package com.example.foodlergic.utils

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.example.foodlergic.ui.AuthViewModel
import com.example.foodlergic.ui.MyLergic.AllergyViewModel
import com.example.foodlergic.ui.Predic.PredictViewModel
import com.example.foodlergic.ui.preference.Preference

class ViewModelFactory(private val preference: Preference) : ViewModelProvider.Factory {

    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return when {
            modelClass.isAssignableFrom(AllergyViewModel::class.java) -> {
                AllergyViewModel(preference) as T
            }
            modelClass.isAssignableFrom(AuthViewModel::class.java) -> {
                AuthViewModel() as T
            }
            modelClass.isAssignableFrom(PredictViewModel::class.java) -> {
                PredictViewModel(preference) as T
            }
            else -> {
                throw IllegalArgumentException("Class ViewModel not Implement")
            }
        }
    }
}