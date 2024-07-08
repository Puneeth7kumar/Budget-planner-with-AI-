from flask import Flask, request, jsonify
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Sample data
data = {
    "month": ['January', 'February', 'March', 'April', 'May'],
    "income": [2000, 2100, 2200, 2300, 2400],
    "expenses": [1500, 1600, 1550, 1700, 1750]
}

# Map month names to numbers
month_mapping = {
    'January': 1,
    'February': 2,
    'March': 3,
    'April': 4,
    'May': 5,
    'June': 6,
    'July': 7,
    'August': 8,
    'September': 9,
    'October': 10,
    'November': 11,
    'December': 12
}

df = pd.DataFrame(data)

# Train model
df['month_num'] = df['month'].map(month_mapping)
X = df[["month_num"]]
y = df["expenses"]
model = LinearRegression()
model.fit(X, y)

@app.route('/predict', methods=['POST'])
def predict():
    month = request.json['month']
    month_num = month_mapping[month]
    prediction = model.predict(np.array([[month_num]]))
    return jsonify({"predicted_expenses": prediction[0]})

if __name__ == '__main__':
    app.run(debug=True)
