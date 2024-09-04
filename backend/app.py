from flask import Flask, request, jsonify
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from statsmodels.tsa.arima.model import ARIMA
import numpy as np
from flask_cors import CORS
import joblib
import matplotlib.pyplot as plt
from twilio.twiml.messaging_response import MessagingResponse
import speech_recognition as sr
import os
from flask import Flask, request, Response
from dotenv import load_dotenv
from transformers import pipeline, set_seed
import stripe
from flask import Flask, request, jsonify

app = Flask(__name__)
stripe.api_key = 'sk_test_51MvzmXSJjiGXnO3KqJetFeFs9F9pMWFg4VkCL4UA7ctJjtCFLtTXjZ75zaRsJoFJKYlRAYwIIzDhlKX07sqRns0S00hXSX8xAi'




load_dotenv()

app = Flask(__name__)
CORS(app)


month_mapping = {month: idx + 1 for idx, month in enumerate([
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'])}
df = pd.read_csv('expenses_data.csv')

X = df[['month_num', 'income', 'prev_expenses']]
y = df['expenses']

model_rf = RandomForestRegressor(n_estimators=100, random_state=42)
model_rf.fit(X, y)
joblib.dump(model_rf, 'model_rf.pkl')

model_arima = ARIMA(df['expenses'], order=(5, 1, 0))
model_arima_fit = model_arima.fit()
joblib.dump(model_arima_fit, 'model_arima.pkl')

# Set up GPT-2
generator = pipeline('text-generation', model='gpt2')
set_seed(42)

import re

def extract_amount(message):
    match = re.search(r'(\d+(?:\.\d+)?)', message)
    return float(match.group(1)) if match else None

def classify_message(message):
    if 'debited' in message.lower():
        return 'expense'
    elif 'credited' in message.lower():
        return 'income'
    return None

@app.route('/voice_command', methods=['POST'])
def voice_command():
    file = request.files['audio']
    recognizer = sr.Recognizer()
    audio = sr.AudioFile(file)
    with audio as source:
        audio_data = recognizer.record(source)
        text = recognizer.recognize_google(audio_data)
    response = {"command": text}
    return jsonify(response)



@app.route('/financial_advice', methods=['POST'])
def financial_advice():
    data = request.json
    user_query = data['query']
    advice = get_financial_advice(user_query)
    return jsonify({"advice": advice})

latest_income = None
latest_expense = None

def get_financial_advice(query):
    try:
        response = generator(query, max_length=50, num_return_sequences=1)
        return response[0]['generated_text'].strip()
    except Exception as e:
        return str(e)

@app.route('/sms', methods=['POST'])
def sms_reply():
    global latest_income, latest_expense
    message_body = request.form['Body']
    transaction_type = classify_message(message_body)
    amount = extract_amount(message_body)
    
    if transaction_type == 'income':
        latest_income = amount
        update_income(amount)
    elif transaction_type == 'expense':
        latest_expense = amount
        update_expenses(amount)

    return "Message processed", 200


@app.route('/latest-data', methods=['GET'])
def get_latest_data():
    return jsonify({"latestIncome": latest_income, "latestExpense": latest_expense})

def extract_amount(message):
    import re
    match = re.search(r'₹(\d+)', message)
    if match:
        return int(match.group(1))
    return 0

def update_income(amount):
    global df
    df.loc[df.index[-1], 'income'] += amount
    df.to_csv('expenses_data.csv', index=False)

def update_expenses(amount):
    global df
    df.loc[df.index[-1], 'expenses'] += amount
    df.to_csv('expenses_data.csv', index=False)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    month = data['month']
    income = data['income']
    prev_expenses = data.get('prev_expenses', 0)

    month_num = month_mapping[month]
    model_rf = joblib.load('model_rf.pkl')
    model_arima_fit = joblib.load('model_arima.pkl')

    rf_prediction = model_rf.predict(np.array([[month_num, income, prev_expenses]]))
    arima_forecast = model_arima_fit.forecast(steps=1)
    arima_forecast_value = arima_forecast.iloc[0]

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
    df['z_score'] = (df['expenses'] - df['expenses'].mean()) / df['expenses'].std()
    anomalies = df[df['z_score'].abs() > 2]['month'].tolist()
    return jsonify({
        "anomalies": anomalies
    })

@app.route('/advice', methods=['GET'])
def advice():
    user_query = "general financial advice"
    financial_advice = get_financial_advice(user_query)
    return jsonify({
        "advice": financial_advice
    })

@app.route('/incomes', methods=['GET'])
def get_incomes():
    income_data = df[['month', 'income']].to_dict(orient='records')
    return jsonify(income_data)

@app.route('/expenses', methods=['GET'])
def get_expenses():
    expense_data = df[['month', 'expenses']].to_dict(orient='records')
    return jsonify(expense_data)

if __name__ == '__main__':
    app.run(debug=True)
