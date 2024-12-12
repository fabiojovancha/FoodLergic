package com.example.foodlergic.data.models

data class Allergy(
    val id: String = "",
    val name: String,
    var isChecked: Boolean = false
) {
    fun formatName(): String {
        return name.replace("", " ") // Ganti  dengan spasi
            .split(" ")          // Pecah menjadi daftar kata
            .joinToString(" ") { word ->
                word.replaceFirstChar { it.uppercase() } // Kapitalisasi huruf pertama setiap kata
            }
    }
}