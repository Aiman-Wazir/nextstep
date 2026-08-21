import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import json
import numpy as np

class CareerRecommendationModel:
    def __init__(self, num_features: int, num_careers: int):
        self.num_features = num_features
        self.num_careers = num_careers
        self.model = None
        
    def build(self) -> keras.Model:
        """Build the neural network architecture"""
        model = keras.Sequential([
            layers.Input(shape=(self.num_features,)),
            
            # First hidden layer
            layers.Dense(256, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.3),
            
            # Second hidden layer
            layers.Dense(128, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.2),
            
            # Third hidden layer
            layers.Dense(64, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.2),
            
            # Output layer
            layers.Dense(self.num_careers, activation='softmax')
        ])
        
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss='categorical_crossentropy',
            metrics=[
                'accuracy',
                keras.metrics.TopKCategoricalAccuracy(k=3, name='top_3_accuracy'),
                keras.metrics.TopKCategoricalAccuracy(k=5, name='top_5_accuracy')
            ]
        )
        
        self.model = model
        return model
    
    def train(self, X_train, y_train, X_val, y_val, epochs=100, batch_size=32):
        """Train the model with early stopping"""
        if self.model is None:
            raise ValueError("Model must be built first")
        
        callbacks = [
            keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=15,
                restore_best_weights=True
            ),
            keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=5,
                min_lr=1e-6
            )
        ]
        
        history = self.model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=epochs,
            batch_size=batch_size,
            callbacks=callbacks,
            verbose=1
        )
        
        return history
    
    def predict(self, features: np.ndarray):
        """Make predictions on new data"""
        if self.model is None:
            raise ValueError("Model must be loaded or trained first")
        
        predictions = self.model.predict(features)
        return predictions
    
    def save(self, path: str):
        """Save the model"""
        if self.model is None:
            raise ValueError("No model to save")
        self.model.save(path)
    
    def load(self, path: str):
        """Load a saved model"""
        self.model = keras.models.load_model(path)
        return self.model