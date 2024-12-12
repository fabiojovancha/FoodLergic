# FoodLergic: AI-Based Food Allergy Identification

## Our Team
Bangkit Capstone Team ID : C242 - PS527 Here is our team Capstone Product Based repository for Bangkit Batch 2 2024 Capstone project. Our team consist of 1 Mobile Development, 3 Machine Learning, and 2 Cloud Computing.

| Name                                 | Bangkit-ID      | Learning Path       | 
|--------------------------------------|-----------------|---------------------|
| Michael Kuswanto                     | M243B4KY2486    | Machine Learning    | 
| Adam Asyari                          | M253B4KY0067    | Machine Learning    | 
| I Gusti Bagus Sutha Arianata Putra   | M014B4KY1825    | Machine Learning    |
| Rezon Handry Gunawan                 | A243B4KY3797    | Mobile Development  |
| Elrama Ferdian Pratama               | C318B4KY1250    | Cloud Computing     |
| Fabio Michael Jovancha               | C243B4KY1308    | Cloud Computing     |
---

## About This Project
FoodLergic is an AI-powered mobile application designed to help individuals with food allergies make safer food choices. By leveraging machine learning and computer vision, the app identifies food items and cross-references their ingredients with the user's allergy profile to detect potential allergens.

## Table of Contents
1. [Background](#background)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Dataset](#dataset)
5. [Model Architecture](#model-architecture)
6. [Prerequisites](#prerequisites)
7. [Setup and Replication Guide](#setup-and-replication-guide)
   - [Google Colab Instructions](#google-colab-instructions)
   - [Mobile Integration (TFLite)](#mobile-integration-tflite)
   - [Cloud Computing Integration (TF.js)](#cloud-computing-integration-tfjs)
8. [Branch Structure](#branch-structure)
9. [Usage](#usage)
10. [Future Improvements](#future-improvements)
11. [Acknowledgments](#acknowledgments)

---

## Background

Food allergies are a growing global concern, affecting millions of individuals. Mislabeling and hidden allergens pose significant risks to health. Current tools often lack efficiency and accuracy, particularly in local cuisines like Indonesian food. FoodLergic addresses this gap by offering a quick, accurate, and user-friendly solution.

---

## Features

- **Food Classification**: Recognizes Indonesian food categories, such as *rendang*, *sate*, and *onde-onde*.
- **Allergen Detection**: Alerts users about potential allergens based on their profile.
- **Mobile Integration**: Offers real-time detection with on-device predictions.
- **Cloud API**: Enables scalability and seamless updates for model improvements.
- **User-Friendly Interface**: Simple design for quick access to allergy alerts.

---

## Technology Stack

- **Frontend**: Kotlin (Mobile Application)
- **Backend**: Hapi (REST API)
- **Machine Learning**: TensorFlow, Keras (Model Training and Deployment)
- **Cloud Infrastructure**: Google Cloud Platform (API Hosting)

---

## Dataset

- **Overview**: 
  - Contains 600 curated images across 12 food categories.
  - Includes diverse angles, lighting conditions, and food variations.
- **Labels**:
  - *telur*, *kerang*, *ayam*, *gandum*, *ikan*, *kacang_kedelai*, *sapi*, *wijen*, *susu*, *kacang_tanah*, *udang*, *coklat*.

---

## Model Architecture

- **Base Model**: MobileNetV2 fine-tuned for food classification.
- **Optimization**:
  - Converted to TensorFlow Lite for efficient mobile inference.
  - REST API supports larger batch processing and continuous learning.

---

## Prerequisites

You will need:
- Google Colab for training and testing.
- Basic Python libraries pre-installed in Colab:
  - `tensorflow`, `numpy`, `matplotlib`
- Optional: Android Studio (for mobile integration) or a cloud platform like AWS/GCP (for TF.js).

---

## Setup and Replication Guide

### Google Colab Instructions

1. **Clone the Repository**:
   - Save the GitHub repository to your Google Drive:
     ```bash
     git clone https://github.com/fabiojovancha/FoodLergic.git
     ```
   - Upload the `FoodLergic` folder to your Google Drive.

2. **Load the Dataset**:
   - Use the provided dataset or upload your own dataset.
   - Organize your dataset in this structure:
     ```
     /data
       /class_1
       /class_2
       /class_3
       /class_4
       ...
     ```

3. **Open the Colab Notebook**:
   - Navigate to the `FoodLergic` folder in your drive.
   - Open `foodLergic_classification.ipynb` in Google Colab.

4. **Train the Model**:
   - Run all cells in the notebook to train the CNN-based MobileNetV2 model.
   - The trained model (.h5, .tflite, and .zip archive formats) will be saved in the /model folder.
   - The archive file (.zip) includes .bin and .json files for TensorFlow.js cloud integration.
     
5. **Optional**:
   - Fine-tuning: You can modify the model parameters in the relevant cells to improve performance.
   - Dataset Experimentation: Upload new datasets to see how the model adapts to new data.

---

### Mobile Integration (TFLite)

1. **Convert the Model to TFLite**:
   - Use the provided conversion script in Colab:
     ```python
     converter = tf.lite.TFLiteConverter.from_saved_model('path_to_saved_model')
     tflite_model = converter.convert()
     with open('model.tflite', 'wb') as f:
         f.write(tflite_model)
     ```

2. **Integrate into Mobile App**:
   - Replace the default `model.tflite` file in the mobile project.
   - Use Android Studio to rebuild and install the app.

---

### Cloud Computing Integration (TF.js)

1. **Convert the Model to TF.js**:
   - In Colab, use the TensorFlow.js converter:
     ```bash
     !tensorflowjs_converter --input_format=tf_saved_model \
       path_to_saved_model \
       path_to_tfjs_model
     ```

2. **Deploy to Cloud**:
   - Host the converted model on a cloud platform like GCP or AWS.
   - Update your application to fetch predictions from the cloud-hosted model.

---

## Branch Structure

- **Machine-Learning Branch**:
  - **dataset/**: This folder contains the dataset used to train the model, with categorized Indonesian food categories.
  - **model/**: This folder stores the trained models, with the following files:
    - `MobileNetV2_V.2.h5`: Model in Keras format for further training or evaluation.
    - `MobileNetV2_V.2.tflite`: Model converted to TensorFlow Lite format for mobile app integration.
    - `MobileNetV2_V.2.zip`: Archive file containing the model in .bin and .json formats for cloud integration (TensorFlow.js).
  - **foodlergic_classification.ipynb**: Main notebook for classification model training, including preprocessing, training, and evaluation.
  - **fork_of_food_classification.ipynb**: Prototype version of the initial training notebook before cleanup and optimization.

- **Cloud-Computing Branch**:
  - Focuses on Hapi-based API integration and model hosting on Google Cloud Platform.

- **Mobile-Development Branch**:
  - Contains Android application source code for TFLite integration.

---

## Usage
- Open the FoodLergic mobile app.
- Capture or upload a photo of a dish.
- Review detected ingredients and allergen alerts.

---

## Future Improvements

- Expand the dataset to include more diverse food categories.
- Enhance allergen detection accuracy with additional user feedback.
- Improve mobile UI for better usability.

---

## Acknowledgments

This project was made possible with support from:
- **Bangkit Program**: Providing resources, guidance, and inspiration.
- **Google Cloud Platform (GCP)**: Hosting and scalability for REST API integration.
- **TensorFlow**: Powering our machine learning model for accurate predictions.
- **Keras**: Simplifying the process of building and training neural networks.

Special thanks to our mentors, peers, and contributors who helped make this project a reality.
