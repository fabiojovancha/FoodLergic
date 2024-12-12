package com.example.foodlergic.utils

import android.content.Context
import android.graphics.Bitmap
import android.net.Uri
import android.provider.MediaStore
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody
import java.io.File
import java.io.FileOutputStream

object imageUtils {
    fun prepareImagePart(imageUri: Uri, context: Context): MultipartBody.Part {
        val contentResolver = context.contentResolver
        val bitmap = MediaStore.Images.Media.getBitmap(contentResolver, imageUri)

        // Kompresi gambar
        val compressedBitmap = compressBitmap(bitmap)

        // Simpan bitmap yang telah dikompresi ke file sementara
        val file = File(context.cacheDir, "compressed_image.jpg")
        val outputStream = FileOutputStream(file)
        compressedBitmap.compress(Bitmap.CompressFormat.JPEG, 80, outputStream)
        outputStream.flush()
        outputStream.close()

        val requestFile = RequestBody.create("image/jpeg".toMediaTypeOrNull(), file)
        return MultipartBody.Part.createFormData("image", file.name, requestFile)
    }

    private fun compressBitmap(bitmap: Bitmap): Bitmap {
        return Bitmap.createScaledBitmap(bitmap, 800, 800, true)
    }

}