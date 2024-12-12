# FoodLergic: AI-Based Food Allergy Identification

FoodLergic is an AI-powered mobile application designed to help individuals with food allergies make safer food choices. By leveraging machine learning and computer vision, the app identifies food items and cross-references their ingredients with the user's allergy profile to detect potential allergens.

---

## Table of Contents
1. [Background](#background)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Dataset](#dataset)
5. [Model Architecture](#model-architecture)
6. [Setup and Installation](#setup-and-installation)
7. [Usage](#usage)
8. [Future Development](#future-development)
9. [Acknowledgments](#acknowledgments)

---

## Background

Food allergies are a growing global concern, affecting millions of individuals. Mislabeling and hidden allergens pose significant risks to health. Current tools often lack efficiency and accuracy, particularly in local cuisines like Indonesian food. FoodLergic addresses this gap by offering a quick, accurate, and user-friendly solution.

---

## Features

- **Food Classification**: Recognizes 12 common Indonesian food categories, such as *rendang*, *sate*, and *gado-gado*.
- **Allergen Detection**: Alerts users about potential allergens based on their profile.
- **Mobile Integration**: Offers real-time detection with on-device predictions.
- **Cloud API**: Enables scalability and seamless updates for model improvements.
- **User-Friendly Interface**: Simple design for quick access to allergy alerts.

---

## Technology Stack

- **Frontend**: Kotlin (Mobile Application)
- **Backend**: Flask (REST API)
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
