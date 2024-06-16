import pyrebase
from datetime import datetime

firebaseConfig = {
  'apiKey': "AIzaSyD4GHgPMYY2znWx8S9x4P9bZOmTflMeGSk",
  'authDomain': "smartiot-7389c.firebaseapp.com",
  'databaseURL': "https://smartiot-7389c-default-rtdb.asia-southeast1.firebasedatabase.app",
  'projectId': "smartiot-7389c",
  'storageBucket': "smartiot-7389c.appspot.com",
  'messagingSenderId': "709692540344",
  'appId': "1:709692540344:web:abd5d03437c5d18d7b3b4d",
  'measurementId': "G-0FW7V8CX08"
}

firebase = pyrebase.initialize_app(firebaseConfig)
storage = firebase.storage()
db = firebase.database()

def format_current_time():
    now = datetime.now()
    formatted_time = now.strftime("%Y-%m-%d_%H:%M:%S")
    return formatted_time