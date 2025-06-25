from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "lavender_spirit.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'

db = SQLAlchemy(app)

UPLOAD_FOLDER = os.path.join(basedir, 'static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# Database Models
class Project(db.Model):
    class Project(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        title = db.Column(db.String(200), nullable=False)
        description = db.Column(db.Text, nullable=False)
        image_filename = db.Column(db.String(255), nullable=True)  # stores uploaded file name
        project_type = db.Column(db.String(100), nullable=False)
        status = db.Column(db.String(50), nullable=False)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Project {self.title}>'

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=True)
    service = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<User {self.name}>'

# Create tables
with app.app_context():
    db.create_all()
    
    # Add sample projects if none exist
    if Project.query.count() == 0:
        sample_projects = [
            Project(
                title="Luxury Residential Complex",
                description="A premium 200-unit residential development featuring modern amenities and sustainable design in North Riyadh.",
                image_filename="https://images.pexels.com/photos/1838640/pexels-photo-1838640.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
                project_type="Residential",
                status="Completed"
            ),
            Project(
                title="Commercial Office Tower",
                description="30-story commercial complex with state-of-the-art facilities in Riyadh's business district.",
                image_filename="https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
                project_type="Commercial",
                status="In Progress"
            ),
            Project(
                title="Infrastructure Development",
                description="Major road and utility infrastructure project supporting Riyadh's urban expansion initiatives.",
                image_filename="https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
                project_type="Infrastructure",
                status="Completed"
            ),
            Project(
                title="Industrial Facility",
                description="Modern manufacturing facility with specialized construction requirements and safety standards.",
                image_filename="https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
                project_type="Industrial",
                status="Completed"
            ),
            Project(
                title="Mixed-Use Development",
                description="Integrated residential and commercial complex with retail spaces and community facilities.",
                image_filename="https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
                project_type="Mixed-Use",
                status="Planning"
            ),
            Project(
                title="Healthcare Center",
                description="Modern medical facility with advanced infrastructure and patient-centered design.",
                image_filename="https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
                project_type="Healthcare",
                status="In Progress"
            )
        ]
        
        for project in sample_projects:
            db.session.add(project)
        
        db.session.commit()
        print("Sample projects added to database!")


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Routes
@app.route('/')
def index():
    # Fetch all projects from database
    projects = Project.query.order_by(Project.created_at.desc()).all()
    return render_template('index.html', projects=projects)

@app.route('/api/projects')
def get_projects():
    projects = Project.query.all()
    projects_data = []
    for project in projects:
        projects_data.append({
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'image_filename': project.image_filename,
            'project_type': project.project_type,
            'status': project.status,
            'created_at': project.created_at.isoformat()
        })
    return jsonify(projects_data)

@app.route('/contact', methods=['POST'])
def contact():
    if request.method == 'POST':
        # Handle both form data and JSON
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form
        
        # Create new user entry
        new_user = User(
            name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone', ''),
            service=data.get('service'),
            message=data.get('message')
        )
        
        try:
            db.session.add(new_user)
            db.session.commit()
            
            if request.is_json:
                return jsonify({'success': True, 'message': 'Thank you for your message! We will get back to you soon.'})
            else:
                return redirect(url_for('index'))
        except Exception as e:
            db.session.rollback()
            if request.is_json:
                return jsonify({'success': False, 'message': 'An error occurred. Please try again.'})
            else:
                return redirect(url_for('index'))

@app.route('/admin/users')
def admin_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify([{
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'service': user.service,
        'message': user.message,
        'created_at': user.created_at.isoformat()
    } for user in users])


@app.route('/admin', methods=['GET', 'POST'])
def admin():
    message = None

    if request.method == 'POST':
        form_type = request.form.get('form_type')

        # Handle create project
        if form_type == 'create':
            title = request.form.get('title')
            description = request.form.get('description')
            project_type = request.form.get('project_type')
            status = request.form.get('status')
            file = request.files.get('image_file')

            image_filename = None
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                image_filename = filename

            new_project = Project(
                title=title,
                description=description,
                image_filename=image_filename,
                project_type=project_type,
                status=status
            )
            db.session.add(new_project)
            db.session.commit()
            message = "Project added successfully!"

        # Handle edit project
        elif form_type == 'edit':
            project_id = request.form.get('project_id')
            project = Project.query.get_or_404(project_id)
            project.title = request.form.get('title')
            project.description = request.form.get('description')
            project.project_type = request.form.get('project_type')
            project.status = request.form.get('status')

            file = request.files.get('image_file')
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                project.image_filename = filename

            db.session.commit()
            message = "Project updated successfully!"

    projects = Project.query.order_by(Project.created_at.desc()).all()
    return render_template('admin.html', message=message, projects=projects)


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)