package com.example.foodlergic.ui.MyLergic

import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.foodlergic.data.models.Allergy
import com.example.foodlergic.databinding.ActivityMylergicBinding
import com.example.foodlergic.ui.preference.Preference
import com.example.foodlergic.utils.Resource
import com.example.foodlergic.utils.ViewModelFactory

class MyLergicActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMylergicBinding
    private lateinit var allergyAdapter: AllergyAdapter
    private lateinit var preference: Preference
    private lateinit var viewModel: AllergyViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMylergicBinding.inflate(layoutInflater)
        setContentView(binding.root)
        preference = Preference(this)

        viewModel =
            ViewModelProvider(this, ViewModelFactory(preference))[AllergyViewModel::class.java]

        observeSubmitAllergiesToAPI()
        observeGetAllergiesFromAPI()
        // Set up RecyclerView
        allergyAdapter = AllergyAdapter()
        binding.rvSwitch.apply {
            layoutManager = LinearLayoutManager(this@MyLergicActivity)
            adapter = allergyAdapter
        }


        // Handle submit button
        binding.btnSubmitAllergies.setOnClickListener {
            val selectedAllergies = allergyAdapter.currentList.filter { it.isChecked }
            Log.d("rezon-dbg", "selectedAllergies: " + selectedAllergies)
            viewModel.submitAllergies(selectedAllergies)
        }

        viewModel.getAllergies()
    }

    private fun observeGetAllergiesFromAPI() {
        viewModel.listAllergies.observe(this) { result ->
            when (result) {
                is Resource.Loading -> {
                    // Show loading state
                }

                is Resource.Success -> {
                    // Perbandingan alergi lokal dan data dari API, perbarui status `isChecked`
                    val localAllergies = getAllergyList()
                    val updatedAllergies =
                        compareAndUpdateAllergies(localAllergies, result.data.orEmpty())

                    // Submit daftar alergi yang diperbarui ke adapter
                    allergyAdapter.submitList(updatedAllergies)
                }

                is Resource.Error -> {
                    // Show error message
                    Log.d("rezon-dbg", "error: ${result.message}")
                    Toast.makeText(this, result.message, Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    private fun compareAndUpdateAllergies(
        localAllergies: List<Allergy>,
        apiAllergies: List<Allergy>
    ): List<Allergy> {
        // Buat set nama alergi dari response API untuk pencocokan cepat
        val apiAllergyNames = apiAllergies.map { it.name }.toSet()
        val apiAllergyMap = apiAllergies.associateBy { it.name }

        // Bandingkan alergi lokal dengan daftar API dan perbarui properti `isChecked`
        return localAllergies.map { localAllergy ->
            val matchingApiAllergy = apiAllergyMap[localAllergy.name]
            if (matchingApiAllergy != null) {
                localAllergy.copy(id = matchingApiAllergy.id, isChecked = true)
            } else {
                localAllergy // Kembalikan alergi lokal seperti semula
            }
        }
    }

    private fun observeSubmitAllergiesToAPI() {
        viewModel.submitResult.observe(this) { result ->
            when (result) {
                is Resource.Loading -> {
                    // Show loading state
                }

                is Resource.Success -> {
                    Toast.makeText(
                        this@MyLergicActivity,
                        "Allergies submitted successfully!",
                        Toast.LENGTH_SHORT
                    ).show()
                }

                is Resource.Error -> {
                    Log.d("rezon-dbg", "error: ${result.message}")
                    // Show error message
                    Toast.makeText(this, result.message, Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    private fun getAllergyList(): List<Allergy> {
        return listOf(
            Allergy(name = "ayam"),
            Allergy(name ="coklat"),
            Allergy(name ="gandum"),
            Allergy(name ="ikan"),
            Allergy(name ="kacang_kedelai"),
            Allergy(name ="kacang_tanah"),
            Allergy(name ="kerang"),
            Allergy(name ="sapi"),
            Allergy(name ="susu"),
            Allergy(name ="telur"),
            Allergy(name ="udang"),
            Allergy(name ="wijen")
        )
    }
}
