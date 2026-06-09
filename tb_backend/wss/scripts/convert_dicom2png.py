import cv2
import numpy as np
import pydicom as PDCM
import matplotlib.pyplot as plt

import pydicom
from PIL import Image

def convert_dicom2png(dicom_file_path):
    DCM_Img = PDCM.read_file(dicom_file_path)
    rows = DCM_Img.get(0x00280010).value  # Get number of rows from tag (0028, 0010)
    cols = DCM_Img.get(0x00280011).value  # Get number of cols from tag (0028, 0011)

    Window_Center = int(
        DCM_Img.get(0x00281050).value
    )  # Get window center from tag (0028, 1050)
    Window_Width = int(
        DCM_Img.get(0x00281051).value
    )  # Get window width from tag (0028, 1051)

    Window_Max = int(Window_Center + Window_Width / 2)
    Window_Min = int(Window_Center - Window_Width / 2)

    if DCM_Img.get(0x00281052) is None:
        Rescale_Intercept = 0
    else:
        Rescale_Intercept = int(DCM_Img.get(0x00281052).value)

    if DCM_Img.get(0x00281053) is None:
        Rescale_Slope = 1
    else:
        Rescale_Slope = int(DCM_Img.get(0x00281053).value)

    New_Img = np.zeros((rows, cols), np.uint8)
    Pixels = DCM_Img.pixel_array

    for i in range(0, rows):
        for j in range(0, cols):
            Pix_Val = Pixels[i][j]
            Rescale_Pix_Val = Pix_Val * Rescale_Slope + Rescale_Intercept

            if Rescale_Pix_Val > Window_Max:  # if intensity is greater than max window
                New_Img[i][j] = 255
            elif Rescale_Pix_Val < Window_Min:  # if intensity is less than min window
                New_Img[i][j] = 0
            else:
                New_Img[i][j] = int(
                    ((Rescale_Pix_Val - Window_Min) / (Window_Max - Window_Min)) * 255
                )  # Normalize the intensities

    png_file_path = dicom_file_path.replace(".dcm", ".png")
    # png_file_path = os.path.join(folder, png_file_path.split("/")[-1])

    if DCM_Img.get(0x00280004).value == "MONOCHROME1":
        New_Img = cv2.bitwise_not(New_Img)
    New_Img = cv2.cvtColor(New_Img, cv2.COLOR_GRAY2RGB)
    cv2.imwrite(png_file_path, New_Img)
    return png_file_path, New_Img