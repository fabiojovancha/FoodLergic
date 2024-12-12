package com.example.foodlergic

import android.Manifest
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.util.Log
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.FileProvider
import androidx.lifecycle.ViewModelProvider
import com.example.foodlergic.databinding.ActivityMainBinding
import com.example.foodlergic.ml.Mobilenetv2V21
import com.example.foodlergic.ml.ModelFoodClassification
import com.example.foodlergic.ui.MyLergic.AllergyViewModel
import com.example.foodlergic.ui.MyLergic.MyLergicActivity
import com.example.foodlergic.ui.Predic.PredictViewModel
import com.example.foodlergic.ui.Profile.UserProfileActivity
import com.example.foodlergic.ui.preference.Preference
import com.example.foodlergic.utils.Resource
import com.example.foodlergic.utils.ViewModelFactory
import org.tensorflow.lite.DataType
import org.tensorflow.lite.support.image.ImageProcessor
import org.tensorflow.lite.support.image.TensorImage
import org.tensorflow.lite.support.image.ops.ResizeOp
import org.tensorflow.lite.support.tensorbuffer.TensorBuffer
import java.io.File
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.*

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var photoUri: Uri
    private lateinit var bitmap: Bitmap
    private lateinit var viewModel: AllergyViewModel
    private lateinit var predictviewModel: PredictViewModel
    private lateinit var preference: Preference

    private val requestPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { permissions ->
            if (permissions[Manifest.permission.CAMERA] == true &&
                permissions[Manifest.permission.READ_EXTERNAL_STORAGE] == true &&
                permissions[Manifest.permission.WRITE_EXTERNAL_STORAGE] == true
            ) {
                // Permissions granted
            } else {
                Toast.makeText(this, "Permission denied", Toast.LENGTH_SHORT).show()
            }
        }

    private val cameraResultLauncher =
        registerForActivityResult(ActivityResultContracts.TakePicture()) { success ->
            if (success) {
                binding.previewImage.setImageURI(photoUri)
                bitmap = MediaStore.Images.Media.getBitmap(this.contentResolver, photoUri)
            }
        }

    private val galleryResultLauncher =
        registerForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
            uri?.let {
                binding.previewImage.setImageURI(it)
                bitmap = MediaStore.Images.Media.getBitmap(this.contentResolver, it)
                photoUri = uri
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        preference = Preference(this)

        viewModel =
            ViewModelProvider(this, ViewModelFactory(preference))[AllergyViewModel::class.java]
        // Toolbar setup (optional, jika Anda menggunakan Toolbar)
        //val toolbar: Toolbar = findViewById(R.id.toolbar)
        //setSupportActionBar(toolbar)

        predictviewModel =
            ViewModelProvider(this, ViewModelFactory(preference))[PredictViewModel::class.java]

        requestPermissionLauncher.launch(
            arrayOf(
                Manifest.permission.CAMERA,
                Manifest.permission.READ_EXTERNAL_STORAGE,
                Manifest.permission.WRITE_EXTERNAL_STORAGE
            )
        )
        viewModel.getAllergies()
        observeGetAllergiesFromAPI()
        observePredictFromAPI()

        binding.bottomNavigation.setOnNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.ScanMyFood -> {
                    // Aksi untuk Scan My Food
                    val scanIntent = Intent(this, MainActivity::class.java)
                    startActivity(scanIntent)
                    true
                }

                R.id.MyLergic -> {
                    // Aksi untuk My Lergic
                    val myLergicIntent = Intent(this, MyLergicActivity::class.java)
                    startActivity(myLergicIntent)
                    true
                }

                R.id.UserProfile -> {
                    // Aksi untuk User Profile
                    val profileIntent = Intent(this, UserProfileActivity::class.java)
                    startActivity(profileIntent)
                    true
                }

                else -> false
            }
        }

        binding.cameraButton.setOnClickListener {
            openCamera()
        }

        binding.galleryButton.setOnClickListener {
            openGallery()
        }

        binding.predictButton.setOnClickListener {
            if (!::bitmap.isInitialized) {
                Toast.makeText(this, "Please select an image", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            if (!::photoUri.isInitialized) {
                Toast.makeText(this, "Please select an image", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            predictviewModel.PredictAllergies(context = this@MainActivity, imageUri = photoUri)

        }
    }

    private fun openCamera() {
        try {
            val photoFile = createImageFile()
            photoUri = FileProvider.getUriForFile(
                this,
                "com.example.foodlergic.fileprovider",
                photoFile
            )
            cameraResultLauncher.launch(photoUri)
        } catch (ex: IOException) {
            ex.printStackTrace()
            Toast.makeText(this, "Failed to open camera", Toast.LENGTH_SHORT).show()
        }
    }

    private fun openGallery() {
        galleryResultLauncher.launch("image/*")
    }

    @Throws(IOException::class)
    private fun createImageFile(): File {
        val timeStamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(Date())
        val storageDir = getExternalFilesDir(null)
        return File.createTempFile(
            "JPEG_${timeStamp}_",
            ".jpg",
            storageDir
        )
    }

    private fun observeGetAllergiesFromAPI() {
        viewModel.listAllergies.observe(this) { result ->
            when (result) {
                is Resource.Loading -> {
                    // Show loading state
                }

                is Resource.Success -> {

                }

                is Resource.Error -> {
                    // Show error message
                    Log.d("rezon-dbg", "error: ${result.message}")
                    Toast.makeText(this, result.message, Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    private fun observePredictFromAPI() {
        predictviewModel.PredictAlergy.observe(this) { result ->
            when (result) {
                is Resource.Loading -> {
                    // Show loading state
                }

                is Resource.Success -> {
                    binding.resultText.text = result.data?.result
                    binding.warningText.text = result.data?.suggestion
                }

                is Resource.Error -> {
                    // Show error message
                    Log.d("rezon-dbg", "error: ${result.message}")
                    Toast.makeText(this, result.message, Toast.LENGTH_LONG).show()
                    classifyImage()
                }
            }
        }
    }

    private fun classifyImage() {
        // Load labels
        val labels = assets.open("label.txt").bufferedReader().readLines()

        // Preprocess the image
        val imageProcessor = ImageProcessor.Builder()
            .add(ResizeOp(224, 224, ResizeOp.ResizeMethod.BILINEAR))
            .build()

        var tensorImage = TensorImage(org.tensorflow.lite.DataType.FLOAT32)
        tensorImage.load(bitmap)
        tensorImage = imageProcessor.process(tensorImage)

        // Normalize image data
        val byteBuffer = tensorImage.buffer
        val floatArray = FloatArray(byteBuffer.capacity() / 4)
        byteBuffer.asFloatBuffer().get(floatArray)
        for (i in floatArray.indices) {
            floatArray[i] = floatArray[i] / 255.0f
        }

        // Prepare input tensor
        val normalizedBuffer = TensorBuffer.createFixedSize(intArrayOf(1, 224, 224, 3), DataType.FLOAT32)
        normalizedBuffer.loadArray(floatArray)

        // Load model and run inference
        val model = Mobilenetv2V21.newInstance(this)
        val outputs = model.process(normalizedBuffer)
        val outputFeature0 = outputs.outputFeature0AsTensorBuffer.floatArray

        // Get the index of the highest probability
        val maxIdx = outputFeature0.indexOfFirst { it == outputFeature0.maxOrNull() }

        val label = labels[maxIdx]
        Log.d("rezon-dbg", "label: $label")
        Log.d("rezon-dbg", "allergies: ${viewModel.listAllergies.value?.data?.map{it.name}}")
        if (viewModel.listAllergies.value?.data?.map{it.name}?.contains(label) == true) {
            // If the label is found in the allergies list, show the warning message
            binding.resultText.text = "Warning!!! \n Minuman/Makanan ini mengandung $label"
        } else {
            // Otherwise, display the label normally
            binding.resultText.text = label
        }
        model.close()
    }
}
