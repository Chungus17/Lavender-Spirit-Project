from flask import (
    Flask,
    render_template,
    request,
    jsonify,
    redirect,
    url_for,
    session,
    flash,
)
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = (
    f'sqlite:///{os.path.join(basedir, "lavender_spirit.db")}'
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "your-secret-key-here"

db = SQLAlchemy(app)

UPLOAD_FOLDER = os.path.join(basedir, "static", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# Database Models
class Project(db.Model):
    class Project(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        title = db.Column(db.String(200), nullable=False)
        description = db.Column(db.Text, nullable=False)
        image_filename = db.Column(
            db.String(255), nullable=True
        )  # stores uploaded file name
        project_type = db.Column(db.String(100), nullable=False)
        status = db.Column(db.String(50), nullable=False)
        created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Project {self.title}>"


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.name}>"


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
                status="Completed",
            ),
            Project(
                title="Commercial Office Tower",
                description="30-story commercial complex with state-of-the-art facilities in Riyadh's business district.",
                image_filename="https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
                project_type="Commercial",
                status="In Progress",
            ),
            Project(
                title="Infrastructure Development",
                description="Major road and utility infrastructure project supporting Riyadh's urban expansion initiatives.",
                image_filename="https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
                project_type="Infrastructure",
                status="Completed",
            ),
            Project(
                title="Industrial Facility",
                description="Modern manufacturing facility with specialized construction requirements and safety standards.",
                image_filename="https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
                project_type="Industrial",
                status="Completed",
            ),
            Project(
                title="Mixed-Use Development",
                description="Integrated residential and commercial complex with retail spaces and community facilities.",
                image_filename="https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
                project_type="Mixed-Use",
                status="Planning",
            ),
            Project(
                title="Healthcare Center",
                description="Modern medical facility with advanced infrastructure and patient-centered design.",
                image_filename="https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
                project_type="Healthcare",
                status="In Progress",
            ),
        ]

        for project in sample_projects:
            db.session.add(project)

        db.session.commit()
        print("Sample projects added to database!")


ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# Routes
@app.route("/")
def index():
    # Fetch all projects from database
    projects = Project.query.order_by(Project.created_at.desc()).all()
    return render_template("index.html", projects=projects)


@app.route("/api/projects")
def get_projects():
    projects = Project.query.all()
    projects_data = []
    for project in projects:
        projects_data.append(
            {
                "id": project.id,
                "title": project.title,
                "description": project.description,
                "image_filename": project.image_filename,
                "project_type": project.project_type,
                "status": project.status,
                "created_at": project.created_at.isoformat(),
            }
        )
    return jsonify(projects_data)


@app.route("/contact", methods=["POST"])
def contact():
    if request.method == "POST":
        # Handle both form data and JSON
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form

        # Create new user entry
        new_user = User(
            name=data.get("name"),
            email=data.get("email"),
            phone=data.get("phone", ""),
            service=data.get("service"),
            message=data.get("message"),
        )

        try:
            db.session.add(new_user)
            db.session.commit()

            if request.is_json:
                return jsonify(
                    {
                        "success": True,
                        "message": "Thank you for your message! We will get back to you soon.",
                    }
                )
            else:
                return redirect(url_for("index"))
        except Exception as e:
            db.session.rollback()
            if request.is_json:
                return jsonify(
                    {
                        "success": False,
                        "message": "An error occurred. Please try again.",
                    }
                )
            else:
                return redirect(url_for("index"))


@app.route("/admin/users")
def admin_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify(
        [
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "service": user.service,
                "message": user.message,
                "created_at": user.created_at.isoformat(),
            }
            for user in users
        ]
    )


@app.route("/admin", methods=["GET", "POST"])
def admin():
    if not session.get("admin_logged_in"):
        flash("Login required to access admin panel.", "warning")
        return redirect(url_for("login"))

    message = None

    if request.method == "POST":
        form_type = request.form.get("form_type")

        # Handle create project
        if form_type == "create":
            title = request.form.get("title")
            description = request.form.get("description")
            project_type = request.form.get("project_type")
            status = request.form.get("status")
            file = request.files.get("image_file")

            image_filename = None
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
                image_filename = filename

            new_project = Project(
                title=title,
                description=description,
                image_filename=image_filename,
                project_type=project_type,
                status=status,
            )
            db.session.add(new_project)
            db.session.commit()
            message = "Project added successfully!"

        # Handle edit project
        elif form_type == "edit":
            project_id = request.form.get("project_id")
            project = Project.query.get_or_404(project_id)
            project.title = request.form.get("title")
            project.description = request.form.get("description")
            project.project_type = request.form.get("project_type")
            project.status = request.form.get("status")

            file = request.files.get("image_file")
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
                project.image_filename = filename

            db.session.commit()
            message = "Project updated successfully!"

    projects = Project.query.order_by(Project.created_at.desc()).all()
    return render_template("admin.html", message=message, projects=projects)


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = request.form.get("username").strip()
        password = request.form.get("password")
        confirm_password = request.form.get("confirm_password")

        # Validation
        if User.query.filter_by(username=username).first():
            flash("Username already exists.", "danger")
            return redirect(url_for("signup"))

        if password != confirm_password:
            flash("Passwords do not match.", "danger")
            return redirect(url_for("signup"))

        if not username or not password:
            flash("All fields are required.", "warning")
            return redirect(url_for("signup"))

        # Create and save new user
        new_user = User(username=username)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        flash("Signup successful! Please login.", "success")
        return redirect(url_for("login"))

    return render_template("signup.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username").strip()
        password = request.form.get("password")

        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            session["admin_logged_in"] = True
            session["username"] = username
            flash("Login successful!", "success")
            return redirect(url_for("admin"))
        else:
            flash("Invalid username or password", "danger")

    return render_template("login.html")


@app.route("/logout")
def logout():
    session.pop("admin_logged_in", None)
    flash("Logged out successfully.", "info")
    return redirect(url_for("login"))


if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=5000)
