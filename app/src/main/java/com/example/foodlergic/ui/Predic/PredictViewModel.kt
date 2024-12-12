package com.example.foodlergic.ui.Predic

import android.content.Context
import android.net.Uri
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.foodlergic.data.api.ApiClient
import com.example.foodlergic.data.api.ApiClient1
import com.example.foodlergic.data.models.Allergy
import com.example.foodlergic.data.models.PredictData
import com.example.foodlergic.ui.preference.Preference
import com.example.foodlergic.utils.Resource
import com.example.foodlergic.utils.imageUtils
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody

class PredictViewModel (preference: Preference) : ViewModel() {

    private val _PredictAlergy = MutableLiveData<Resource<PredictData>>()
    val PredictAlergy: LiveData<Resource<PredictData>> = _PredictAlergy

    private val userId: String = preference.getUserId().orEmpty()

    fun PredictAllergies(context: Context,imageUri: Uri) {
        viewModelScope.launch {
            _PredictAlergy.value = Resource.Loading() // Set loading state
            try {
                // Make the API call
                val userIdRequest = userId.toRequestBody("text/plain".toMediaType())
                val imageRequest = imageUtils.prepareImagePart(imageUri, context)
                val response = ApiClient1.getApiClient1().predict(userIdRequest,imageRequest)

                // Handle API response
                if (!response.isSuccessful) {
                    _PredictAlergy.value =
                        Resource.Error("Failed with code ${response.code()}: ${response.message()}")
                    return@launch // Exit loop if there's an error
                }

                val Prediction = response.body()!!.data

                _PredictAlergy.value = Resource.Success(Prediction)
            } catch (e: Exception) {
                // Handle exceptions
                _PredictAlergy.value = Resource.Error("An error occurred: ${e.message}")
            }
        }
    }
}