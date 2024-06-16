# This file is part of https://github.com/jainamoswal/Flask-Example.
# Usage covered in <IDC lICENSE>
# Jainam Oswal. <jainam.me> 


# Import Libraries 
from urllib.parse import urlparse
from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS, cross_origin 
from pyngrok import ngrok
from dotenv import load_dotenv
from firebase import db
from model import predict
import os

load_dotenv()

# Define app.
app = Flask(__name__)

# Config CORS.
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["SECRET_KEY"] = "yolov8"

# Define root route.
@app.route("/", methods=['GET'])
@cross_origin() # Allow Cross-Origin Resource Sharing
def home():
    return jsonify({
        "data": "We support Han Nom image detection and recognition."
    })

@app.route("/api/detect", methods=['POST'])
@cross_origin()
def object_detection():
    # # Message format
    # {
    #     "link": [
    #         "https://ultralytics.com/images/zidane.jpg",
    #         "https://ultralytics.com/images/bus.jpg"
    #     ]
    # }

    data = request.get_json()

    sources = data['link']

    output = []

    for source in sources:
      json_objects, file_url = predict(source)
      output.append({
        'objects_detection': json_objects,
        'url_image': file_url,
        'image_name': urlparse(source).path.split("/")[-1]
      })

    return jsonify(output)

@app.route('/favicon.ico')
def favicon():
    path = os.path.join(app.root_path, 'static')
    return send_from_directory(path, 'favicon.ico')

ngrok.set_auth_token("2aMoxF9vkPAjbYueIdsDUS1AfEV_4eeTz7BQZu6u1oaGbR5Ad")
url = ngrok.connect(os.environ.get('PORT', 5000)).public_url
db.update({"server_url": url})
print('Global NGROK URL:', url)
