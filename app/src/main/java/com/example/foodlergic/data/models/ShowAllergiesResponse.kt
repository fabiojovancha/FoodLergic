package com.example.foodlergic.data.models

data class ShowAllergiesResponse(
    val message: String,
    val userId: String,
    val allergies: List<AllergyItem>
)

