from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
db = SQLAlchemy(app)

# Task Model (table)
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)

# Home route
@app.route('/')
def home():
    return "Backend is running!"

@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    result = []

    for task in tasks:
        result.append({
            "id": task.id,
            "title": task.title,
            "completed": task.completed
        })

    return jsonify(result)    

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.get_json()

    new_task = Task(title=data['title'])
    db.session.add(new_task)
    db.session.commit()

    return jsonify({"message": "Task added successfully"})


@app.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    task = Task.query.get(id)

    if not task:
        return jsonify({"error": "Task not found"}), 404

    task.completed = True
    db.session.commit()

    return jsonify({"message": "Task updated"})

@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get(id)

    if not task:
        return jsonify({"error": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted"})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()   # creates database
    app.run(debug=True, port=5001)