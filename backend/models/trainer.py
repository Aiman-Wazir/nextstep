import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
import json
import joblib
from model_builder import CareerRecommendationModel

class ModelTrainer:
    def __init__(self, data_path: str):
        self.data = pd.read_csv(data_path)
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.feature_columns = None
        
    def preprocess(self):
        """Preprocess data for training"""
        # Separate features and labels
        X = self.data.drop(['user_id', 'target_career'], axis=1)
        y = self.data['target_career']
        
        # Encode categorical features
        categorical_cols = ['education']
        for col in categorical_cols:
            X[col] = LabelEncoder().fit_transform(X[col])
        
        # Encode labels
        y_encoded = self.label_encoder.fit_transform(y)
        y_one_hot = tf.keras.utils.to_categorical(y_encoded)
        
        # Store feature columns for inference
        self.feature_columns = X.columns.tolist()
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        return X_scaled, y_one_hot
    
    def train_model(self):
        """Main training pipeline"""
        print("Loading and preprocessing data...")
        X, y = self.preprocess()
        
        print(f"Feature shape: {X.shape}")
        print(f"Number of careers: {y.shape[1]}")
        
        # Split data
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Build model
        model = CareerRecommendationModel(
            num_features=X.shape[1],
            num_careers=y.shape[1]
        )
        model.build()
        
        print("Training model...")
        history = model.train(X_train, y_train, X_val, y_val, epochs=100)
        
        # Save model and artifacts
        os.makedirs('ml/saved_model', exist_ok=True)
        model.save('ml/saved_model/career_recommender.h5')
        
        # Save scaler and label encoder
        joblib.dump(self.scaler, 'ml/saved_model/scaler.pkl')
        joblib.dump(self.label_encoder, 'ml/saved_model/label_encoder.pkl')
        
        # Save feature columns
        with open('ml/saved_model/feature_columns.json', 'w') as f:
            json.dump(self.feature_columns, f)
        
        # Save training history
        with open('ml/saved_model/training_history.json', 'w') as f:
            json.dump(history.history, f)
        
        print("Model training complete!")
        print(f"Final accuracy: {history.history['accuracy'][-1]:.4f}")
        print(f"Final validation accuracy: {history.history['val_accuracy'][-1]:.4f}")
        
        return model, history

def main():
    trainer = ModelTrainer('ml/dataset/processed/training_data.csv')
    model, history = trainer.train_model()

if __name__ == "__main__":
    main()