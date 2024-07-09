from flask import Flask, request, jsonify
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from statsmodels.tsa.arima.model import ARIMA
import numpy as np
from flask_cors import CORS
import joblib
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app)

# Sample data
data = {
    "month": ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    "income": [2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100],
    "expenses": [1500, 1600, 1550, 1700, 1750, 1650, 1800, 1900, 1850, 2000, 2100, 1950]
}

# Map month names to numbers
month_mapping = {month: idx + 1 for idx, month in enumerate(data["month"])}

df = pd.DataFrame(data)
df['month_num'] = df['month'].map(month_mapping)

# Dynamic Feature Extraction: adding previous month's expenses as a feature
df['prev_expenses'] = df['expenses'].shift(1).fillna(0)

# Save data for visualization later
df.to_csv('expenses_data.csv', index=False)

X = df[['month_num', 'income', 'prev_expenses']]
y = df['expenses']

# Train Random Forest model
model_rf = RandomForestRegressor(n_estimators=100, random_state=42)
model_rf.fit(X, y)
joblib.dump(model_rf, 'model_rf.pkl')

# Train ARIMA model for time series forecasting
model_arima = ARIMA(df['expenses'], order=(5, 1, 0))
model_arima_fit = model_arima.fit()
joblib.dump(model_arima_fit, 'model_arima.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        month = data['month']
        income = data['income']
        prev_expenses = data.get('prev_expenses', 0)
    except KeyError as e:
        return jsonify({"error": f"Missing key: {e.args[0]}"}), 400

    month_num = month_mapping[month]
    
    # Load the trained models
    model_rf = joblib.load('model_rf.pkl')
    model_arima_fit = joblib.load('model_arima.pkl')

    # Random Forest Prediction
    rf_prediction = model_rf.predict(np.array([[month_num, income, prev_expenses]]))

    # ARIMA Prediction
    arima_forecast = model_arima_fit.forecast(steps=1)
    arima_forecast_value = arima_forecast.iloc[0]  # Access the forecast value correctly

    return jsonify({
        "predicted_expenses_rf": rf_prediction[0],
        "predicted_expenses_arima": arima_forecast_value
    })

@app.route('/visualize', methods=['GET'])
def visualize():
    df = pd.read_csv('expenses_data.csv')
    plt.figure(figsize=(10, 5))
    plt.plot(df['month'], df['expenses'], label='Actual Expenses')
    plt.title('Monthly Expenses')
    plt.xlabel('Month')
    plt.ylabel('Expenses')
    plt.legend()
    plt.savefig('expenses_plot.png')
    return jsonify({"message": "Visualization created", "image": "expenses_plot.png"})

@app.route('/anomalies', methods=['GET'])
def anomalies():
    df = pd.read_csv('expenses_data.csv')
    
    # Anomaly detection logic (e.g., using Z-score)
    df['z_score'] = (df['expenses'] - df['expenses'].mean()) / df['expenses'].std()
    anomalies = df[df['z_score'].abs() > 2]['month'].tolist()
    
    return jsonify({
        "anomalies": anomalies
    })

@app.route('/advice', methods=['GET'])
def advice():
    # Sample financial advice based on current expenses
    financial_advice = "Consider reviewing your expenses and reducing unnecessary spending."
    
    return jsonify({
        "advice": financial_advice
    })

if __name__ == '__main__':
    app.run(debug=True)
