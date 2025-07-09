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
import firebase_admin
from firebase_admin import credentials, storage
import uuid
import json
from urllib.parse import urlparse, unquote

app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))

# Load the JSON string from env and parse it
firebase_cred_json = os.environ.get("FIREBASE_CREDENTIALS")
cred_dict = json.loads(firebase_cred_json)

# Initialize with parsed credentials
cred = credentials.Certificate(cred_dict)
firebase_admin.initialize_app(
    cred, {"storageBucket": "lavender-spirit.firebasestorage.app"}
)

# cred = credentials.Certificate("lavender-spirit-firebase-adminsdk-fbsvc-86fcbc6a09.json")
# firebase_admin.initialize_app(cred, {
#     'storageBucket': 'lavender-spirit.firebasestorage.app'
# })

# Database configuration for Render
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
if app.config["SQLALCHEMY_DATABASE_URI"] and app.config[
    "SQLALCHEMY_DATABASE_URI"
].startswith("postgres://"):
    app.config["SQLALCHEMY_DATABASE_URI"] = app.config[
        "SQLALCHEMY_DATABASE_URI"
    ].replace("postgres://", "postgresql://", 1)

# DATABASE_PATH = os.getenv("DATABASE_PATH", os.path.join(basedir, "lavender_spirit.db"))
# app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DATABASE_PATH}"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "your-secret-key-here")

db = SQLAlchemy(app)

# Upload folder configuration
UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", os.path.join(basedir, "static", "uploads"))
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# Database Models
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    name_ar = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship with projects
    projects = db.relationship("Project", backref="category", lazy=True)

    def __repr__(self):
        return f"<Category {self.name}>"


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    title_ar = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    description_ar = db.Column(db.Text, nullable=False)
    image_filename = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(50), nullable=False)
    status_ar = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Foreign key to category
    category_id = db.Column(db.Integer, db.ForeignKey("category.id"), nullable=True)

    def __repr__(self):
        return f"<Project {self.title}>"


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), default="user")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username}>"


with app.app_context():
    db.create_all()

    # Add default user if none exist
    if User.query.count() == 0:
        default_user = User(username="Admin123", role="admin")
        default_user.set_password("1122")
        db.session.add(default_user)
        db.session.commit()

    # Add sample categories if none exist
    if Category.query.count() == 0:
        sample_categories = [
            Category(name="Residential", name_ar="سكني"),
            Category(name="Commercial", name_ar="تجاري"),
            Category(name="Infrastructure", name_ar="بنية تحتية"),
            Category(name="Industrial", name_ar="صناعي"),
            Category(name="Mixed-Use", name_ar="متعدد الاستخدامات"),
            Category(name="Healthcare", name_ar="رعاية صحية"),
        ]

        for category in sample_categories:
            db.session.add(category)

        db.session.commit()
        print("Sample categories added to database!")

    # Add sample projects if none exist
    if Project.query.count() == 0:
        # Get categories for assignment
        residential_cat = Category.query.filter_by(name="Residential").first()
        commercial_cat = Category.query.filter_by(name="Commercial").first()
        infrastructure_cat = Category.query.filter_by(name="Infrastructure").first()
        industrial_cat = Category.query.filter_by(name="Industrial").first()
        mixed_use_cat = Category.query.filter_by(name="Mixed-Use").first()
        healthcare_cat = Category.query.filter_by(name="Healthcare").first()

        sample_projects = [
            Project(
                title="Luxury Residential Complex",
                title_ar="مجمع سكني فاخر",
                description="A premium 200-unit residential development featuring modern amenities and sustainable design in North Riyadh.",
                description_ar="تطوير سكني متقدم يضم 200 وحدة مع وسائل راحة حديثة وتصميم مستدام في شمال الرياض.",
                image_filename="Example-1.jpeg",
                status="Completed",
                status_ar="مكتمل",
                category_id=residential_cat.id if residential_cat else None,
            ),
            Project(
                title="Commercial Office Tower",
                title_ar="برج مكاتب تجاري",
                description="30-story commercial complex with state-of-the-art facilities in Riyadh's business district.",
                description_ar="مجمع تجاري من 30 طابقًا مع مرافق حديثة في منطقة الأعمال بالرياض.",
                image_filename="Example-1.jpeg",
                status="In Progress",
                status_ar="قيد التنفيذ",
                category_id=residential_cat.id if residential_cat else None,
            ),
            Project(
                title="Infrastructure Development",
                title_ar="تطوير البنية التحتية",
                description="Major road and utility infrastructure project supporting Riyadh's urban expansion initiatives.",
                description_ar="مشروع رئيسي للطرق والمرافق يدعم مبادرات التوسع الحضري في الرياض.",
                image_filename="Example-3.jpeg",
                status="Completed",
                status_ar="مكتمل",
                category_id=infrastructure_cat.id if infrastructure_cat else None,
            ),
            Project(
                title="Industrial Facility",
                title_ar="منشأة صناعية",
                description="Modern manufacturing facility with specialized construction requirements and safety standards.",
                description_ar="منشأة تصنيع حديثة مع متطلبات بناء متخصصة ومعايير سلامة عالية.",
                image_filename="Example-1.jpeg",
                status="Completed",
                status_ar="مكتمل",
                category_id=industrial_cat.id if industrial_cat else None,
            ),
            Project(
                title="Mixed-Use Development",
                title_ar="تطوير متعدد الاستخدامات",
                description="Integrated residential and commercial complex with retail spaces and community facilities.",
                description_ar="مجمع سكني وتجاري متكامل مع مساحات تجارية ومرافق مجتمعية.",
                image_filename="Example-3.jpeg",
                status="Planning",
                status_ar="تخطيط",
                category_id=mixed_use_cat.id if mixed_use_cat else None,
            ),
            Project(
                title="Healthcare Center",
                title_ar="مركز رعاية صحية",
                description="Modern medical facility with advanced infrastructure and patient-centered design.",
                description_ar="منشأة طبية حديثة مع بنية تحتية متقدمة وتصميم يركز على المرضى.",
                image_filename="Example-1.jpeg",
                status="In Progress",
                status_ar="قيد التنفيذ",
                category_id=healthcare_cat.id if healthcare_cat else None,
            ),
        ]

        for project in sample_projects:
            db.session.add(project)

        db.session.commit()
        print("Sample projects added to database!")

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def load_admin_context(tab="project", message=None, errorMessage=None):
    return {
        "projects": Project.query.order_by(Project.created_at.desc()).all(),
        "users": User.query.order_by(User.created_at.desc()).all(),
        "categories": Category.query.order_by(Category.name).all(),
        "current_user": User.query.filter_by(username=session.get("username")).first(),
        "message": message,
        "tab": tab,
        "errorMessage": errorMessage,
    }


# Routes
@app.route("/")
def index():
    projects = Project.query.order_by(Project.created_at.desc()).all()
    categories = Category.query.order_by(Category.name).all()
    return render_template("index.html", projects=projects, categories=categories)


@app.route("/api/projects")
def get_projects():
    category_id = request.args.get("category_id")

    if category_id and category_id != "all":
        projects = Project.query.filter_by(category_id=category_id).all()
    else:
        projects = Project.query.all()

    projects_data = []
    for project in projects:
        project_data = {
            "id": project.id,
            "title": project.title,
            "title_ar": project.title_ar,
            "description": project.description,
            "description_ar": project.description_ar,
            "image_filename": project.image_filename,
            "status": project.status,
            "status_ar": project.status_ar,
            "created_at": project.created_at.isoformat(),
            "category_id": project.category_id,
        }

        if project.category:
            project_data["category"] = {
                "id": project.category.id,
                "name": project.category.name,
                "name_ar": project.category.name_ar,
            }
        else:
            project_data["category"] = None

        projects_data.append(project_data)

    return jsonify(projects_data)


@app.route("/api/categories")
def get_categories():
    categories = Category.query.order_by(Category.name).all()
    categories_data = []
    for category in categories:
        categories_data.append(
            {
                "id": category.id,
                "name": category.name,
                "name_ar": category.name_ar,
                "project_count": len(category.projects),
            }
        )
    return jsonify(categories_data)


@app.route("/contact", methods=["POST"])
def contact():
    if request.method == "POST":
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form

        # Note: This seems to be trying to create a User with contact info
        # You might want to create a separate Contact model instead
        try:
            # For now, just return success without saving
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
            if request.is_json:
                return jsonify(
                    {
                        "success": False,
                        "message": "An error occurred. Please try again.",
                    }
                )
            else:
                return redirect(url_for("index"))


@app.route("/admin", methods=["GET", "POST"])
def admin():
    if not session.get("admin_logged_in"):
        return redirect(url_for("login"))

    message = None
    current_user = User.query.filter_by(username=session.get("username")).first()
    tab = "project"

    if request.method == "POST":
        form_type = request.form.get("form_type")

        if form_type == "create":
            title = request.form.get("title")
            title_ar = request.form.get("title_ar")
            description = request.form.get("description")
            description_ar = request.form.get("description_ar")
            status = request.form.get("status")
            status_ar = request.form.get("status_ar")
            category_id = request.form.get("category_id")
            file = request.files.get("image_file")
            tab = "project"

            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                ext = filename.rsplit(".", 1)[-1].lower()
                unique_filename = f"{uuid.uuid4().hex}.{ext}"

                bucket = storage.bucket()
                blob = bucket.blob(f"project_images/{unique_filename}")
                blob.upload_from_file(file, content_type=file.content_type)
                blob.make_public()

                image_filename = unique_filename

            new_project = Project(
                title=title,
                title_ar=title_ar,
                description=description,
                description_ar=description_ar,
                image_filename=image_filename,
                status=status,
                status_ar=status_ar,
                category_id=category_id if category_id else None,
            )
            db.session.add(new_project)
            db.session.commit()
            message = "Project added successfully!"

        elif form_type == "edit":
            project_id = request.form.get("project_id")
            project = Project.query.get_or_404(project_id)
            project.title = request.form.get("title")
            project.title_ar = request.form.get("title_ar")
            project.description = request.form.get("description")
            project.description_ar = request.form.get("description_ar")
            project.status = request.form.get("status")
            project.status_ar = request.form.get("status_ar")
            category_id = request.form.get("category_id")
            project.category_id = category_id if category_id else None
            previousImage = request.form.get("previous_image_file")
            tab = "project"

            file = request.files.get("image_file")
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                ext = filename.rsplit(".", 1)[-1].lower()
                unique_filename = f"{uuid.uuid4().hex}.{ext}"

                bucket = storage.bucket()
                blob = bucket.blob(f"project_images/{unique_filename}")
                blob.upload_from_file(file, content_type=file.content_type)
                blob.make_public()

                project.image_filename = f"project_images/{unique_filename}"

            # DELETE THE PREVIOUS IMAGE
            if previousImage:
                try:
                    bucket = storage.bucket()
                    blob = bucket.blob(previousImage)
                    if blob.exists():
                        blob.delete()
                        print(f"Deleted Firebase image: {previousImage}")
                except Exception as e:
                    print(f"Error deleting from Firebase: {e}")

            db.session.commit()
            message = "Project updated successfully!"

        elif form_type == "add_category":
            name = request.form.get("name")
            name_ar = request.form.get("name_ar")

            tab = "category"

            new_category = Category(
                name=name, name_ar=name_ar, created_at=datetime.utcnow()
            )

            db.session.add(new_category)
            db.session.commit()
            message = "Category added successfully!"

        elif form_type == "edit_category":
            category_id = request.form.get("category_id")
            category = Category.query.get_or_404(category_id)
            category.name = request.form.get("name")
            category.name_ar = request.form.get("name_ar")

            tab = "category"

            db.session.commit()
            message = "Category updated successfully!"

    projects = Project.query.order_by(Project.created_at.desc()).all()
    users = User.query.order_by(User.created_at.desc()).all()
    categories = Category.query.order_by(Category.name).all()
    return render_template(
        "admin.html",
        message=message,
        projects=projects,
        users=users,
        categories=categories,
        current_user=current_user,
        tab=tab,
    )


@app.route("/add_user", methods=["POST"])
def add_user():
    if not session.get("admin_logged_in"):
        return redirect(url_for("login"))

    current_user = User.query.filter_by(username=session.get("username")).first()
    if current_user.role != "admin":
        return render_template("admin.html", **load_admin_context(tab="user", errorMessage="Only admins can delete users."))


    username = request.form.get("username").strip()
    password = request.form.get("password")
    confirm_password = request.form.get("confirm_password")
    role = request.form.get("role")

    if User.query.filter_by(username=username).first():
        return render_template("admin.html", **load_admin_context(tab="user", errorMessage="Username already exists"))


    if password != confirm_password:
        return render_template("admin.html", **load_admin_context(tab="user", errorMessage="Passwords do not match"))


    if not username or not password or not role:
        return render_template("admin.html", **load_admin_context(tab="user", errorMessage="All fields are rquired"))


    new_user = User(username=username, role=role)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return render_template("admin.html", **load_admin_context(tab="user", message="User added successfully!"))


@app.route("/edit_user", methods=["POST"])
def edit_user():
    if not session.get("admin_logged_in"):
        return redirect(url_for("login"))

    current_user = User.query.filter_by(username=session.get("username")).first()
    user_id = request.form.get("user_id")
    user = User.query.get_or_404(user_id)

    if current_user.role != "admin" and current_user.id != user.id:
        return render_template("admin.html", **load_admin_context(tab="user", errorMessage="You can only edit your own file!"))

    new_username = request.form.get("username").strip()
    password = request.form.get("password")
    confirm_password = request.form.get("confirm_password")
    role = request.form.get("role") if current_user.role == "admin" else user.role

    existing_user = User.query.filter_by(username=new_username).first()
    if existing_user and existing_user.id != user.id:
        return render_template("admin.html", **load_admin_context(tab="user", errorMessage="Username already exists"))

    if password and password != confirm_password:
        return render_template("admin.html", **load_admin_context(tab="user", errorMessage="Passwords do not match"))

    if not new_username:
        return render_template("admin.html", **load_admin_context(tab="user", errorMessage="username is required"))

    user.username = new_username
    if password:
        user.set_password(password)
    if current_user.role == "admin":
        user.role = role
    db.session.commit()

    return render_template("admin.html", **load_admin_context(tab="user", message="User updated Successfully!"))


@app.route("/delete/<string:entity_type>/<int:entity_id>", methods=["POST"])
def delete_entity(entity_type, entity_id):
    if not session.get("admin_logged_in"):
        flash("You must be logged in to delete.", "error")
        return redirect(url_for("login"))

    current_user = User.query.filter_by(username=session.get("username")).first()
    if not current_user:
        flash("User not found.", "error")
        return redirect(url_for("login"))

    try:
        if entity_type == "project":
            entity = Project.query.get_or_404(entity_id)
            tab = "project"

            if entity.image_filename:
                try:
                    bucket = storage.bucket()
                    blob = bucket.blob(entity.image_filename)
                    if blob.exists():
                        blob.delete()
                        print(f"Deleted Firebase image: {entity.image_filename}")
                except Exception as e:
                    print(f"Error deleting from Firebase: {e}")
            db.session.delete(entity)
            message = "Project Deleted SUccessfully!"

        elif entity_type == "user":
            if current_user.role != "admin":
                return render_template("admin.html", **load_admin_context(tab="user", errorMessage="Only admins can delete users"))
            entity = User.query.get_or_404(entity_id)
            # Prevent admin from deleting themselves
            if entity.id == current_user.id:
                return render_template("admin.html", **load_admin_context(tab="user", errorMessage="You cannot delete your own account"))
            db.session.delete(entity)
            message = "User deleted successfully!"
            tab = "user"

        elif entity_type == "category":
            if current_user.role != "admin":
                return render_template("admin.html", **load_admin_context(tab="category", errorMessage="Only admins can delete categories"))
            entity = Category.query.get_or_404(entity_id)
            # Check if category has associated projects
            if Project.query.filter_by(category_id=entity_id).count() > 0:
                return render_template("admin.html", **load_admin_context(tab="category", errorMessage="cannot delete categories with associated porjects"))
            db.session.delete(entity)
            message = "Category deleted successfully!"
            tab = "category"

        else:
            flash("Invalid entity type.", "error")
            return redirect(url_for("admin"))

        db.session.commit()
        projects = Project.query.order_by(Project.created_at.desc()).all()
        users = User.query.order_by(User.created_at.desc()).all()
        categories = Category.query.order_by(Category.name).all()
        return render_template(
            "admin.html",
            message=message,
            projects=projects,
            users=users,
            categories=categories,
            current_user=current_user,
            tab=tab,
        )

    except Exception as e:
        db.session.rollback()
        flash(f"Error deleting {entity_type}: {str(e)}", "error")
        return redirect(url_for("admin"))


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username").strip()
        password = request.form.get("password")

        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            session["admin_logged_in"] = True
            session["username"] = username
            return redirect(url_for("admin"))
        else:
            flash("Invalid username or password", "error")

    return render_template("login.html")


@app.route("/logout")
def logout():
    session.pop("admin_logged_in", None)
    session.pop("username", None)
    return redirect(url_for("login"))


if __name__ == "__main__":
    app.run(debug=False)
