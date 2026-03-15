import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__, static_folder=BASE_DIR, static_url_path='')

# ── Data ──────────────────────────────────────────────────────────────────────

PROJECTS = [
    {
        "id": 1,
        "title": "Information Gathering Tool",
        "description": "Python-based tool for gathering website metadata and open-source intelligence. Automated reconnaissance processes to identify potential vulnerabilities.",
        "long_description": "A comprehensive Python-based reconnaissance tool designed to automate the process of gathering website metadata, performing DNS lookups, and conducting open-source intelligence (OSINT). This tool streamlines the initial phases of penetration testing by identifying potential vulnerabilities and mapping out the target's digital footprint.",
        "tech": ["Python", "Requests", "BeautifulSoup", "Socket"],
        "github": "https://github.com/swaroop0608",
        "demo": "#",
        "category": "Cybersecurity",
        "image": "images/project_info.png"
    },
    {
        "id": 2,
        "title": "PawCare Platform",
        "description": "Full-stack pet-care management platform with user authentication, appointment scheduling, and pet health tracking.",
        "long_description": "PawCare Platform is a robust full-stack solution tailored for pet owners and veterinary clinics. It features secure user authentication, intuitive appointment scheduling, and comprehensive pet health tracking. Built with Flask and PostgreSQL, the platform ensures data integrity and a seamless user experience for managing pet care efficiently.",
        "tech": ["Python", "Flask", "PostgreSQL", "HTML/CSS", "JavaScript"],
        "github": "https://github.com/swaroop0608",
        "demo": "https://pawcare-chi.vercel.app",
        "category": "Full Stack",
        "image": "images/paw1.png",
        "images": ["images/paw1.png", "images/paw2.png", "images/paw.png"]
    },
    {
        "id": 3,
        "title": "Electronics Store",
        "description": "Responsive electronics store with Apple-inspired design and optimized performance for high Lighthouse scores.",
        "long_description": "An elegant, highly responsive electronics storefront heavily inspired by Apple's minimalist design philosophy. This frontend project focuses on achieving near-perfect Lighthouse performance scores through meticulous optimization, semantic HTML5 structure, and modern CSS3 techniques without relying on heavy frontend frameworks.",
        "tech": ["HTML5", "CSS3", "JavaScript", "SEO"],
        "github": "https://github.com/swaroop0608",
        "demo": "#",
        "category": "Frontend",
        "image": "images/ele1.png",
        "images": ["images/ele1.png", "images/ele3.png", "images/ele2.png"]
    },
    {
        "id": 4,
        "title": "Women Fashions",
        "description": "Modern e-commerce platform with product catalog, cart, and admin dashboard. Built with Next.js and Prisma.",
        "long_description": "A cutting-edge e-commerce platform developed for Jyothi Boutique, offering a dynamic product catalog, seamless shopping cart experience, and a secure admin dashboard for inventory management. Utilizing Next.js for high-performance server-side rendering and Prisma for optimized database interactions, it provides a lightning-fast shopping experience.",
        "tech": ["Next.js", "Prisma", "PostgreSQL", "Tailwind CSS"],
        "github": "https://github.com/swaroop0608",
        "demo": "https://women-fashions.vercel.app",
        "category": "Web App",
        "image": "images/women_fashions.png",
        "images": ["images/women_fashions.png", "images/women_fashions1.png", "images/women_fashions2.png"]
    },
    {
        "id": 5,
        "title": "Amma Pickels",
        "description": "E-commerce platform for authentic homemade pickles with a clean product catalog and seamless ordering experience.",
        "long_description": "Amma Pickels is a dedicated e-commerce platform showcasing authentic, homemade pickle varieties. The platform features a clean product catalog, easy ordering flow, and a warm, traditional design that reflects the brand's home-kitchen roots.",
        "tech": ["HTML/CSS", "JavaScript"],
        "github": "https://github.com/swaroop0608",
        "demo": "#",
        "category": "Frontend",
        "image": "images/pickels1.png",
        "images": ["images/pickels1.png", "images/pickels2.png", "images/pickels3.png"]
    },

    {
    "id": 6,
    "title": "Jyothi Boutique",
    "description": "Elegant boutique website showcasing maggam works, designer blouses, and custom stitching services.",
    "long_description": "A stylish website designed for Jyothi Boutique in Visakhapatnam to highlight premium maggam work, designer blouse stitching, saree fall and pico services. The platform presents service sections, gallery, contact options, and WhatsApp integration for direct customer communication. Built with a modern UI to reflect the elegance of fashion and boutique services.",
    "tech": ["React", "Tailwind CSS", "JavaScript", "Responsive Design"],
    "github": "https://github.com/swaroop0608",
    "demo": "https://jyothi-boutique.vercel.app",
    "category": "Web App",
    "image": "images/jyothi_boutique.png",
    "images": ["images/jyothi_boutique.png", "images/jyothi_boutique1.png", "images/jyothi_boutique2.png"]
  }
]

MESSAGES_FILE = os.path.join(BASE_DIR, "messages.json")


def load_messages():
    if os.path.exists(MESSAGES_FILE):
        with open(MESSAGES_FILE, "r") as f:
            return json.load(f)
    return []


def save_message(msg):
    messages = load_messages()
    messages.append(msg)
    with open(MESSAGES_FILE, "w") as f:
        json.dump(messages, f, indent=2)


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'images'),
                               'favicon.png', mimetype='image/vnd.microsoft.icon')


@app.route("/resume")
def resume():
    return send_from_directory(BASE_DIR, "resume.html")


@app.route("/api/projects")
def api_projects():
    category = request.args.get("category")
    if category and category != "All":
        filtered = [p for p in PROJECTS if p["category"] == category]
    else:
        filtered = PROJECTS
    return jsonify({"projects": filtered, "total": len(filtered)})


# ── Email Settings ────────────────────────────────────────────────────────────
EMAIL_SENDER = os.environ.get("EMAIL_SENDER", "rswaroop0608@gmail.com")
EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD")
EMAIL_RECEIVER = "rswaroop0608@gmail.com"

def send_email_notification(name, user_email, message):
    if not EMAIL_PASSWORD:
        print("[Email] Skipping email send. 'EMAIL_PASSWORD' environment variable is not set. Please set it to a Gmail App Password.")
        return False
        
    try:
        msg = MIMEMultipart()
        msg['From'] = f"Portfolio Contact <{EMAIL_SENDER}>"
        msg['To'] = EMAIL_RECEIVER
        msg['Subject'] = f"New Portfolio Message from {name}"
        
        body = f"You received a new message from your portfolio website!\n\nName: {name}\nEmail: {user_email}\n\nMessage:\n{message}"
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        text = msg.as_string()
        server.sendmail(EMAIL_SENDER, EMAIL_RECEIVER, text)
        server.quit()
        print(f"[Email] Successfully sent notification for {name}")
        return True
    except Exception as e:
        print(f"[Email Error] Failed to send email: {e}")
        return False


@app.route("/contact", methods=["POST"])
def contact():
    data = request.get_json(silent=True) or request.form.to_dict()

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()

    if not name or not email or not message:
        return jsonify({"success": False, "error": "All fields are required."}), 400

    record = {
        "name": name,
        "email": email,
        "message": message,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
    save_message(record)
    
    # Send email notification implicitly
    send_email_notification(name, email, message)
    
    print(f"[Contact] New message from {name} <{email}>")
    return jsonify({"success": True, "message": f"Thanks {name}! I'll get back to you soon."})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
