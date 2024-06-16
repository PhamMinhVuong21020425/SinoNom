# This file is part of https://github.com/jainamoswal/Flask-Example.
# Usage covered in <IDC lICENSE>
# Jainam Oswal. <jainam.me> 

# Import Libraries 
from app import app
import os

# Install required libraries
# os.system("python -m pip install --upgrade pip")
# os.system("pip install numpy requests opencv-python opencv-contrib-python")

# If file is called directly called, then run the app on the PORT provided defined in ENV.
if __name__ == "__main__":
    app.run(debug=False, host='0.0.0.0', port=os.environ.get('PORT', 5000))
    # app.run(debug=True)