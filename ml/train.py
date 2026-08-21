import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow import keras
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
import json
import os

def train_model():
    # Load synthetic data
    df = pd.read_csv('ml/dataset/raw/synthetic_profiles.csv')
    
    # Prepare features
    feature_cols = [col for col in df.columns if col not in ['user_id', 'target_career']]
    X = df[feature_cols]
    y = df['target_career']
    
    # Encode labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    y_one_hot = tf.keras.utils.to_categorical(y_encoded)
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Split data
    X_train, X_val, y_train, y_val = train_test_split(
        X_scaled, y_one_hot, test_size=0.2, random_state=42
    )
    
    # Build model
    model = keras.Sequential([
        keras.layers.Dense(128, activation='relu', input_shape=(X.shape[1],)),
        keras.layers.Dropout(0.3),
        keras.layers.Dense(64, activation='relu'),
        keras.layers.Dropout(0.2),
        keras.layers.Dense(32, activation='relu'),
        keras.layers.Dense(len(label_encoder.classes_), activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Train
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=50,
        batch_size=32,
        callbacks=[
            keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True)
        ]
    )
    
    # Save model
    os.makedirs('ml/saved_model', exist_ok=True)
    model.save('ml/saved_model/career_recommender.h5')
    
    # Save encoders
    import joblib
    joblib.dump(scaler, 'ml/saved_model/scaler.pkl')
    joblib.dump(label_encoder, 'ml/saved_model/label_encoder.pkl')
    
    print("Model training complete!")
    print(f"Validation accuracy: {history.history['val_accuracy'][-1]:.4f}")

if __name__ == "__main__":
    train_model()