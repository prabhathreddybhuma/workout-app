### auth_routes.py
from flask import Blueprint, request, jsonify
from models import User
from database.db_setup import SessionLocal

auth_routes = Blueprint('auth', __name__)
db = SessionLocal()

## 1. User Registration
@auth_routes.route('/register', methods=['POST'])
def register():
    data = request.json
    user = User(
        name=data['name'],
        email=data['email'],
        password=data['password'],
        age=data['age'],
        height=data['height'],
        weight=data['weight'],
        fitness_goal=data['fitness_goal']
    )
    db.add(user)
    db.commit()
    return jsonify({"message": "User registered successfully!"}), 201

## 2. User Login
@auth_routes.route('/login', methods=['POST'])
def login():
    data = request.json
    user = db.query(User).filter(User.email == data['email'], User.password == data['password']).first()
    if user:
        return jsonify({"message": "Login successful!", "user_id": user.id})
    else:
        return jsonify({"message": "Invalid email or password."}), 401