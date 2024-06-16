import requests
import cv2
from ultralytics import YOLO
from firebase import storage, format_current_time


model_detect = YOLO('./weights/detect.pt')
model_classify = YOLO('./weights/classify.pt')

## Predict
def predict(source):
  headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'}
  # Clone image for crop
  if source.startswith('https://'):
    # Send a GET request to the URL to fetch the image data
    resp = requests.get(source, headers=headers)
    # image_data = resp.raw.read()
    # nparr = np.frombuffer(image_data, np.uint8)
    # # copy_source = np.asarray(bytearray(resp.content), dtype="uint8")
    # img_source = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    # copy_source = img_source

    # Save the image data to a file
    with open("downloaded_image.png", "wb") as f:
        f.write(resp.content)

    img_source = cv2.imread("./downloaded_image.png")
    copy_source = img_source
  else:
     img_source = cv2.imread(source)
     copy_source = img_source

  # Run inference on the source
  results_detect = model_detect("./downloaded_image.png", stream=False)

  # Initialize an empty list to store JSON objects
  json_objects = []

  # Initialize an empty list to store cropped images
  # cropped_images = []

  # Process results list
  for result in results_detect:
      boxes = result.boxes  # Boxes object for bounding box outputs

      # Iterate over the detected objects
      for box in boxes:
        # Create a dictionary for the current object
        obj = {
            'class': int(box.cls),  # Class ID
            'name': model_detect.names[int(box.cls)],  # Class name
            'confidence': float(box.conf),  # Confidence score
        }
        if(obj['confidence'] > 0.1):
          json_objects.append(obj)

          # Draw bounding boxes on the image
          x1, y1, x2, y2 = map(int, box.xyxy.cpu().tolist()[0])

          # Crop the image using the bounding box coordinates
          cropped_img = copy_source[y1:y2, x1:x2]

          ## Classification
          results_classify = model_classify(cropped_img)

          # cv2.rectangle(image, start_point, end_point, colorBGR, thickness)
          cv2.rectangle(img_source, (x1, y1), (x2, y2), (0, 255, 0), 1)

          # Append the cropped image to the list
          # cropped_images.append(cropped_img)

          # Get the class with the highest probability
          names_dict = results_classify[0].names
          probs = results_classify[0].probs

          highest_conf = probs.top1conf.cpu().tolist()
          highest_prob_class = names_dict[probs.top1]

          obj['class'] = highest_prob_class
          obj['confidence'] = highest_conf
          obj['coordinate'] = [
              {'x': x1, 'y': y1},
              {'x': x1, 'y': y2},
              {'x': x2, 'y': y2},
              {'x': x2, 'y': y1},
              {'x': x1, 'y': y1},
          ]

          # print(f"The predicted class with the highest probability is: {highest_prob_class} with conf is {highest_conf}")

  cv2.imwrite('result.jpg', img_source)
  file_path = "result.jpg"
  cloud_path = f"images/{format_current_time()}_{file_path}"
  storage.child(cloud_path).put(file_path)

  file_url = storage.child(cloud_path).get_url(None)
  print(f"Public url of file: {file_url}")
  return json_objects, file_url