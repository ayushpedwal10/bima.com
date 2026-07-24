"""
Generate synthetic customer data for training/demo purposes.
Run: python data/generate_synthetic.py
"""
import json
import random
import csv

random.seed(42)

SEGMENTS = ["student", "young_professional", "couple", "family", "senior"]
GENDERS = ["Male", "Female", "Other"]
CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad"]
OCCUPATIONS = {
    "student": ["Student"],
    "young_professional": ["Software Engineer", "Teacher", "Nurse", "Sales Executive", "Accountant"],
    "couple": ["Software Engineer", "Doctor", "Business Owner", "Manager", "Architect"],
    "family": ["Business Owner", "Government Employee", "Doctor", "Engineer", "Manager"],
    "senior": ["Retired", "Pensioner", "Consultant"]
}

def generate_customer(i):
    segment = random.choice(SEGMENTS)
    
    if segment == "student":
        age = random.randint(18, 25)
        income = random.randint(0, 150000)
        members = 1
        has_children = False
    elif segment == "young_professional":
        age = random.randint(23, 35)
        income = random.randint(300000, 900000)
        members = 1
        has_children = False
    elif segment == "couple":
        age = random.randint(25, 42)
        income = random.randint(500000, 1800000)
        members = 2
        has_children = random.choice([True, False])
    elif segment == "family":
        age = random.randint(30, 52)
        income = random.randint(600000, 3000000)
        members = random.randint(3, 5)
        has_children = True
    else:  # senior
        age = random.randint(55, 75)
        income = random.randint(100000, 1500000)
        members = random.randint(1, 2)
        has_children = False

    smoker = random.choices([True, False], weights=[20, 80])[0]
    bmi = round(random.uniform(17.5, 38.0), 1)
    pre_existing = random.choices([True, False], weights=[30 if age > 45 else 10, 70 if age > 45 else 90])[0]
    chronic = random.choices([True, False], weights=[25 if age > 50 else 8, 75 if age > 50 else 92])[0]
    occupation = random.choice(OCCUPATIONS[segment])
    city = random.choice(CITIES)
    gender = random.choice(GENDERS)

    return {
        "customer_id": f"C{i:04d}",
        "age": age,
        "gender": gender,
        "segment": segment,
        "occupation": occupation,
        "city": city,
        "annual_income": income,
        "family_members": members,
        "has_children": has_children,
        "smoker": smoker,
        "bmi": bmi,
        "pre_existing_disease": pre_existing,
        "chronic_condition": chronic
    }

customers = [generate_customer(i) for i in range(1, 501)]

with open("data/customers.json", "w") as f:
    json.dump(customers, f, indent=2)

# Also save as CSV for easy viewing
keys = customers[0].keys()
with open("data/customers.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=keys)
    writer.writeheader()
    writer.writerows(customers)

print(f"Generated {len(customers)} synthetic customers -> data/customers.json & data/customers.csv")
