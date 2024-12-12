package com.example.foodlergic.data.models

data class ResponseBody(
    val message: String? = null,
    val error: String? = null,
    val allergies: List<String>? = null
)