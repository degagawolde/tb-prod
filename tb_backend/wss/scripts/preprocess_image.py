import cv2
import numpy as np
from skimage import exposure

class ProcessImage:
    def __init__(self,reference_image_path="") -> None:
        self.reference_image_path = reference_image_path
    

    def load_image(self,file_path):
        return cv2.imread(file_path)

    def crop_image(self,image):

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        # threshold 
        thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)[1]
        hh, ww = thresh.shape
        # make bottom 2 rows black where they are white the full width of the image
        thresh[hh-3:hh, 0:ww] = 0
        # get bounds of white pixels
        white = np.where(thresh==255)
        xmin, ymin, xmax, ymax = np.min(white[1]), np.min(white[0]), np.max(white[1]), np.max(white[0])
        print(xmin,xmax,ymin,ymax)
        # crop the image at the bounds adding back the two blackened rows at the bottom
        crop = image[ymin:ymax+3, xmin:xmax]
        return crop
    
    def hist_eqzr(self,original_image):
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(16,16))
        if len(original_image.shape)==3:
            b,g,r = cv2.split(original_image)        
            clahe_b = clahe.apply(b)
            clahe_g = clahe.apply(g)
            clahe_r = clahe.apply(r)
            image = cv2.merge([clahe_b, clahe_g, clahe_r])
            return image
        else:
            image = clahe.apply(original_image)
            return image
        
    def hist_matching(self,image):
        reference = cv2.imread(self.reference_image_path)
        multi = True if image.shape[-1]>1 else False
        return exposure.match_histograms(image,reference,channel_axis=2)