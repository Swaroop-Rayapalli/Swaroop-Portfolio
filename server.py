import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from dotenv import load_dotenv

# Load variables from .env if it exists
load_dotenv()

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
        "github": "https://github.com/Swaroop-Rayapalli",
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
        "github": "https://github.com/Swaroop-Rayapalli",
        "demo": "https://pawcare-chi.vercel.app",
        "category": "Web App",
        "image": "images/paw1.png",
        "images": ["images/paw1.png", "images/paw2.png", "images/paw.png"]
    },
    {
        "id": 3,
        "title": "Electronics Store",
        "description": "Responsive electronics store with Apple-inspired design and optimized performance for high Lighthouse scores.",
        "long_description": "An elegant, highly responsive electronics storefront heavily inspired by Apple's minimalist design philosophy. This frontend project focuses on achieving near-perfect Lighthouse performance scores through meticulous optimization, semantic HTML5 structure, and modern CSS3 techniques without relying on heavy frontend frameworks.",
        "tech": ["HTML5", "CSS3", "JavaScript", "SEO"],
        "github": "https://github.com/Swaroop-Rayapalli",
        "demo": "https://electron-store.vercel.app",
        "category": "Web App",
        "image": "images/ele1.png",
        "images": ["images/ele1.png", "images/ele3.png", "images/ele2.png"]
    },
    {
        "id": 4,
        "title": "Women Fashions",
        "description": "Modern e-commerce platform with product catalog, cart, and admin dashboard. Built with Next.js and Prisma.",
        "long_description": "A cutting-edge e-commerce platform developed for Jyothi Boutique, offering a dynamic product catalog, seamless shopping cart experience, and a secure admin dashboard for inventory management. Utilizing Next.js for high-performance server-side rendering and Prisma for optimized database interactions, it provides a lightning-fast shopping experience.",
        "tech": ["Next.js", "Prisma", "PostgreSQL", "Tailwind CSS"],
        "github": "https://github.com/Swaroop-Rayapalli",
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
        "github": "https://github.com/Swaroop-Rayapalli",
        "demo": "https://amma-pickels.vercel.app",
        "category": "Web App",
        "image": "images/pickels1.png",
        "images": ["images/pickels1.png", "images/pickels2.png", "images/pickels3.png"]
    },
    {
        "id": 6,
        "title": "Jyothi Boutique",
        "description": "Elegant boutique website showcasing maggam works, designer blouses, and custom stitching services.",
        "long_description": "A stylish website designed for Jyothi Boutique in Visakhapatnam to highlight premium maggam work, designer blouse stitching, saree fall and pico services. The platform presents service sections, gallery, contact options, and WhatsApp integration for direct customer communication. Built with a modern UI to reflect the elegance of fashion and boutique services.",
        "tech": ["React", "Tailwind CSS", "JavaScript", "Responsive Design"],
        "github": "https://github.com/Swaroop-Rayapalli",
        "demo": "https://jyothi-boutique.vercel.app",
        "category": "Web App",
        "image": "images/jyothi_boutique.png",
        "images": ["images/jyothi_boutique.png", "images/jyothi_boutique1.png", "images/jyothi_boutique2.png"]
    },

    # ── Major Projects ───────────────────────────────────────────────────────
    {
        "id": 7,
        "title": "Smart Business Intelligence Suite",
        "description": "End-to-end executive decision support suite integrating customer churn risk analysis, real estate valuation models, sales forecasting with Prophet, movie recommendation engine, and Power BI reporting.",
        "long_description": "Smart Business Intelligence Suite is a comprehensive enterprise analytics platform combining multiple predictive models. It features customer churn probability scoring, real estate fair market valuation, CSV sales forecasting via Meta's Prophet model, a collaborative movie recommendation engine, and live Power BI executive dashboards for actionable business insights.",
        "tech": ["Python", "Prophet", "Power BI", "Machine Learning", "Data Analytics"],
        "github": "https://github.com/Swaroop-Rayapalli",
        "demo": "https://smart-bi-phi.vercel.app",
        "category": "Major Project",
        "image": "images/smart_bi.png"
    },
    {
        "id": 8,
        "title": "AI Healthcare Intelligence System",
        "description": "Advanced predictive analytics platform featuring cardiovascular disease risk assessment, medical insurance fraud detection, and time-series medicine demand forecasting.",
        "long_description": "AI Healthcare Intelligence System provides clinical and operational predictive solutions for healthcare providers. It includes a cardiovascular risk diagnosis calculator, an automated medical insurance claim fraud detector to mitigate financial loss, and a time-series inventory forecasting module for optimizing pharmaceutical supply chains.",
        "tech": ["Python", "Machine Learning", "Time-Series", "Healthcare AI", "Flask"],
        "github": "https://github.com/Swaroop-Rayapalli",
        "demo": "https://aihealthcare-livid.vercel.app",
        "category": "Major Project",
        "image": "images/ai_healthcare.png"
    },

    # ── Mini Projects (Machine Learning & Data Science) ───────────────────────
    {
        "id": 9,
        "title": "Student Performance Predictor",
        "description": "Interactive machine learning web application to forecast student Academic Performance Index based on study hours, past scores, and extracurricular activities.",
        "long_description": "Student Performance Predictor leverages regression modeling to evaluate academic input metrics—such as daily study hours, attendance percentages, and previous exam scores—to accurately forecast a student's GPA and academic outcome in real time.",
        "tech": ["Python", "Scikit-Learn", "Machine Learning", "Data Analytics"],
        "github": "https://github.com/Swaroop-Rayapalli",
        "demo": "https://studentpredict-five.vercel.app",
        "category": "Machine Learning",
        "image": "images/student_predict.png"
    },
    {
        "id": 10,
        "title": "SentiMind - Sentiment Analytics Dashboard",
        "description": "NLP-driven sentiment analysis dashboard providing real-time text classification, emotion scoring, and interactive tone analytics.",
        "long_description": "SentiMind is an interactive Natural Language Processing dashboard that analyzes textual inputs, customer feedback, or social media commentary. It yields real-time sentiment polarities (Positive, Neutral, Negative), confidence percentages, and emotion radars.",
        "tech": ["Python", "NLP", "Sentiment Analysis", "Data Visualization"],
        "github": "https://github.com/Swaroop-Rayapalli",
        "demo": "https://sentimentanalysis-ashy-one.vercel.app",
        "category": "Machine Learning",
        "image": "images/sentiment_analytics.png"
    },
    {
        "id": 11,
        "title": "Sales Future Predictor",
        "description": "Predictive sales forecasting engine using time-series analysis to project future sales revenue and trend insights.",
        "long_description": "Sales Future Predictor enables businesses to forecast revenue trends by applying time-series prediction models. It allows users to upload historic transactional data, auto-detect date and sales columns, and visualize projected seasonal revenue growth.",
        "tech": ["Python", "Prophet", "Time-Series", "Data Analytics"],
        "github": "https://github.com/Swaroop-Rayapalli",
        "demo": "https://salesfuturepredict.vercel.app",
        "category": "Data Analytics",
        "image": "images/sales_predict.png"
    },
    {
        "id": 12,
        "title": "AI-Powered Resume Screener & Parser",
        "description": "Automated resume parser and job role matcher utilizing Natural Language Processing to extract candidate skills and calculate ATS match scores.",
        "long_description": "An intelligent applicant tracking and candidate evaluation tool built with NLP. It extracts key contact details, work experience, and technical competencies from resume documents, matching them against job descriptions to generate automated ATS compatibility scores.",
        "tech": ["Python", "NLP", "Text Mining", "Scikit-Learn"],
        "github": "https://github.com/Swaroop-Rayapalli",
        "demo": "https://resumescreening-eight.vercel.app",
        "category": "Machine Learning",
        "image": "images/resume_screener.png"
    },
    {
        "id": 13,
        "title": "House Price Prediction Engine",
        "description": "Real estate market valuation web app that predicts residential property prices using regression models and structural parameters.",
        "long_description": "House Price Prediction Engine provides real-time property market valuations by evaluating key structural factors such as square footage, bedroom/bathroom counts, neighborhood parameters, and construction age using supervised regression algorithms.",
        "tech": ["Python", "Scikit-Learn", "Regression Analysis", "Data Analytics"],
        "github": "https://github.com/Swaroop-Rayapalli",
        "demo": "https://housepricepred-six.vercel.app",
        "category": "Machine Learning",
        "image": "images/house_price.png"
    },
    {
        "id": 14,
        "title": "Movie Recommendation Engine",
        "description": "Personalized movie recommender system implementing collaborative and content-based filtering algorithms to suggest top-rated films.",
        "long_description": "Movie Recommendation Engine processes user viewing preferences and rating histories to generate highly tailored film recommendations. Utilizing matrix factorization and cosine similarity, it curates personalized movie lists across genres.",
        "tech": ["Python", "Recommender Systems", "Collaborative Filtering", "Data Science"],
        "github": "https://github.com/Swaroop-Rayapalli",
        "demo": "https://movierecommend-kappa.vercel.app",
        "category": "Machine Learning",
        "image": "images/movie_recommend.png"
    },
    {
        "id": 15,
        "title": "CardioPulse AI - Heart Disease Risk Dashboard",
        "description": "Clinical risk assessment application that evaluates cardiovascular disease risk factors using supervised machine learning algorithms.",
        "long_description": "CardioPulse AI is a medical decision support dashboard designed to assist clinicians and individuals in evaluating cardiac risk. By analyzing biometric indicators—including blood pressure, cholesterol levels, resting heart rate, and age—it calculates cardiovascular risk probabilities.",
        "tech": ["Python", "Scikit-Learn", "Healthcare AI", "Predictive Modeling"],
        "github": "https://github.com/Swaroop-Rayapalli",
        "demo": "https://heart-disease-predict-ochre.vercel.app",
        "category": "Machine Learning",
        "image": "images/heart_disease.png"
    },
    {
        "id": 16,
        "title": "TruthScanner - AI Fake News Detector",
        "description": "AI-powered text verification tool that analyzes article credibility, language patterns, and news authenticity using classification models.",
        "long_description": "TruthScanner combat mis-information by deploying text classification models trained on extensive journalistic datasets. Users can input news headlines or article text to receive an authenticity confidence score and linguistic bias audit.",
        "tech": ["Python", "NLP", "Text Classification", "Machine Learning"],
        "github": "https://github.com/Swaroop-Rayapalli",
        "demo": "https://fakenewsdetect-snowy.vercel.app",
        "category": "Machine Learning",
        "image": "images/fake_news.png"
    },
    {
        "id": 17,
        "title": "SentinelShield - Fraud Transaction Detection",
        "description": "Real-time financial anomaly detection dashboard designed to flag suspicious banking transactions and prevent fraudulent activities.",
        "long_description": "SentinelShield is a financial cybersecurity monitoring application that applies anomaly detection algorithms to transaction streams. It highlights high-risk transactions, flags geo-location anomalies, and alerts security analysts to potential credit card fraud.",
        "tech": ["Python", "Anomaly Detection", "Cybersecurity", "Machine Learning"],
        "github": "https://github.com/Swaroop-Rayapalli",
        "demo": "https://fraud-detection-woad.vercel.app",
        "category": "Cybersecurity",
        "image": "images/fraud_detection.png"
    },
    {
        "id": 18,
        "title": "Customer Churn Predictor",
        "description": "Consumer retention analytics app predicting subscription churn likelihood based on customer usage and billing behavior.",
        "long_description": "Customer Churn Predictor helps subscription businesses reduce customer drop-off by evaluating account metrics, monthly charges, tenure, and service tickets to flag high-risk accounts and outline proactive retention steps.",
        "tech": ["Python", "Scikit-Learn", "Predictive Analytics", "Data Analytics"],
        "github": "https://github.com/Swaroop-Rayapalli",
        "demo": "https://churnprediction-kappa.vercel.app",
        "category": "Data Analytics",
        "image": "images/churn_predict.png"
    }
]

MESSAGES_FILE = os.path.join(BASE_DIR, "messages.json")


def load_messages():
    if os.path.exists(MESSAGES_FILE):
        with open(MESSAGES_FILE, "r") as f:
            return json.load(f)
    return []


def save_message(msg):
    try:
        messages = load_messages()
        messages.append(msg)
        with open(MESSAGES_FILE, "w") as f:
            json.dump(messages, f, indent=2)
        return True
    except Exception as e:
        print(f"[Storage Error] Could not save to {MESSAGES_FILE}: {e}")
        return False


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
