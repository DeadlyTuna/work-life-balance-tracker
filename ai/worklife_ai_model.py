import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

# Load dataset
df = pd.read_csv("Updated Quality of Life Data.csv")

# Create Mental Health Score
df['mental_health_score'] = (
    df['avg_sleep_hours_per_day'] * 0.35 +
    df['avg_rest_hours_per_day'] * 0.25 +
    df['avg_exercise_hours_per_day'] * 0.30 -
    df['avg_work_hours_per_day'] * 0.20
) * 10

df['mental_health_score'] = df['mental_health_score'].clip(0, 100)

# Encode categorical data
le_gender = LabelEncoder()
le_occupation = LabelEncoder()

df['gender'] = le_gender.fit_transform(df['gender'])
df['occupation_type'] = le_occupation.fit_transform(df['occupation_type'])

# Features and targets
X = df[['gender', 'occupation_type',
        'avg_work_hours_per_day',
        'avg_rest_hours_per_day',
        'avg_sleep_hours_per_day',
        'avg_exercise_hours_per_day']]

y_mental = df['mental_health_score']
y_life = df['age_at_death']

# Split data
X_train, X_test, y_m_train, y_m_test = train_test_split(
    X, y_mental, test_size=0.2, random_state=42
)

X_train2, X_test2, y_l_train, y_l_test = train_test_split(
    X, y_life, test_size=0.2, random_state=42
)

# Train models
mental_model = RandomForestRegressor(n_estimators=150, random_state=42)
life_model = RandomForestRegressor(n_estimators=150, random_state=42)

mental_model.fit(X_train, y_m_train)
life_model.fit(X_train2, y_l_train)

# Evaluate
print("Mental Health MAE:", mean_absolute_error(y_m_test, mental_model.predict(X_test)))
print("Lifespan MAE:", mean_absolute_error(y_l_test, life_model.predict(X_test2)))
