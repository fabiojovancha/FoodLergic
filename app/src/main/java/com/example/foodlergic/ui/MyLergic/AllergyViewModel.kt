package com.example.foodlergic.ui.MyLergic

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.foodlergic.data.api.ApiClient
import com.example.foodlergic.data.models.Allergy
import com.example.foodlergic.data.models.AllergyRequest
import com.example.foodlergic.data.models.DeleteAlergyRequest
import com.example.foodlergic.ui.preference.Preference
import com.example.foodlergic.utils.Resource
import kotlinx.coroutines.launch

class AllergyViewModel(preference: Preference) : ViewModel() {

    private val _listAllergies = MutableLiveData<Resource<List<Allergy>>>()
    val listAllergies: LiveData<Resource<List<Allergy>>> = _listAllergies

    private val _submitResult = MutableLiveData<Resource<String>>()
    val submitResult: LiveData<Resource<String>> = _submitResult

    private val userId: String = preference.getUserId().orEmpty()

    fun getAllergies() {
        viewModelScope.launch {
            _listAllergies.value = Resource.Loading() // Set loading state
            try {
                // Make the API call
                val response = ApiClient.getApiService().showAllergies(userId)

                // Handle API response
                if (!response.isSuccessful) {
                    _listAllergies.value =
                        Resource.Error("Failed with code ${response.code()}: ${response.message()}")
                    return@launch // Exit loop if there's an error
                }

                val allergies = response.body()?.allergies.orEmpty().map { allergyItem ->
                    Allergy(id= allergyItem.id,name = allergyItem.name, isChecked = true)
                }
                _listAllergies.value = Resource.Success(allergies)
            } catch (e: Exception) {
                // Handle exceptions
                _listAllergies.value = Resource.Error("An error occurred: ${e.message}")
            }
        }
    }

    fun submitAllergies(allergies: List<Allergy>) {
        viewModelScope.launch {
            _submitResult.value = Resource.Loading() // Set loading state
            try {
                val serverAllergies = _listAllergies.value?.data.orEmpty()
                val allergiesToDelete = serverAllergies.filter { serverAllergy ->
                    // Find allergies from server that are not selected locally
                    !allergies.any { it.name == serverAllergy.name }
                }
                if (allergiesToDelete.isNotEmpty()) {
                    val deleteAllergyRequest =
                        DeleteAlergyRequest(
                            userId = userId,
                            allergyIds = allergiesToDelete.map { it.id })
                    val deleteResponse =
                        ApiClient.getApiService().deleteAllergy(deleteAllergyRequest)

                    if (!deleteResponse.isSuccessful) {
                        _submitResult.value =
                            Resource.Error("Failed to delete allergy: ${deleteResponse.code()}: ${deleteResponse.message()}")
                        return@launch
                    }
                }

                val addAllergiesNotInServer = allergies.filter { allergy ->
                    serverAllergies.none { it.name == allergy.name }
                }

                if (addAllergiesNotInServer.isNotEmpty()) {
                    val addAllergiesRequest = AllergyRequest(
                        userId = userId,
                        allergies = addAllergiesNotInServer.map { it.name })

                    // Make the API call
                    val addResponse =
                        ApiClient.getApiService().addAllergy(userId, addAllergiesRequest)

                    // Handle API response
                    if (!addResponse.isSuccessful) {
                        _submitResult.value =
                            Resource.Error("Failed with code ${addResponse.code()}: ${addResponse.message()}")
                        return@launch // Exit loop if there's an error
                    }
                }

                // If all allergies submitted successfully
                _submitResult.value =
                    Resource.Success("All allergies submitted and unselected ones deleted successfully!")
            } catch (e: Exception) {
                // Handle exceptions
                _submitResult.value = Resource.Error("An error occurred: ${e.message}")
            }
        }
    }
}