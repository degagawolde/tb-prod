from pathlib import Path
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from django.core.files import File
from django.core import serializers as core_serializers
from django.core.paginator import Paginator
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.generics import RetrieveAPIView, CreateAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView

import tensorflow.keras.backend as K

from .serializers import *

from PIL import Image
import cv2
import json
import sys,os
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

sys.path.append('../scripts')
from . scripts.get_prediction import GetPrediction
from . scripts.preprocess_image import ProcessImage
from .scripts.convert_dicom2png import convert_dicom2png


pimg = ProcessImage("./mediafiles/reference/h0001.png")
IM_WIDTH, IM_HEIGHT = 512, 512
target_size=(IM_WIDTH, IM_HEIGHT)
media_url = "mediafiles"
mask_url = os.path.join(media_url,'masks')
dataset_dict = {
    'class_id': {
        0: 'Healthy',
        1: 'Sick', 
        2: 'Tuberculosis'
    }
}
dataset_dict['class_alias'] = dict((g, i) for i, g in dataset_dict['class_id'].items())

gp = GetPrediction()
model = gp.load_model(os.path.join(media_url,'models/classify_model.h5'))


def image_binarizer(gray_image, ts):
    (_, thresh) = cv2.threshold(gray_image, ts, 1.0, cv2.THRESH_BINARY)
    return thresh


class UserAPIView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomUserSerializers

    def get_object(self):
        return self.request.user

#Class based view to register user
class RegisterUserAPIView(CreateAPIView):
  permission_classes = (AllowAny,)
  serializer_class = RegisterSerializer 

# VIEW FOR CREATE PATIENT INFORMATION
class CreatePatientInformation(CreateAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,) 
    serializer_class =  PatientInformationSerializer

    def post(self, request, *args, **kwargs):
        
        token = request.META["HTTP_AUTHORIZATION"].split(" ")[-1]
        decoded_token = AccessToken(token)
        user_pk = decoded_token['user_id']

        user = get_object_or_404(CustomUser, pk=user_pk)
        inst_id = user.institution.id
        
        request.data['patientId'] = str(inst_id)+'_'+request.data['patientId']
        patient_serializer = PatientInformationSerializer(data=request.data)

        if patient_serializer.is_valid():
            patient_serializer.save()
            print(patient_serializer.data) 
            return Response(patient_serializer.data, status=status.HTTP_201_CREATED)
        else:
           return Response(patient_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    
class CreatePhysicianDesicion(CreateAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,) 
    serializer_class =  PhysicianDecisionSerializer

    def post(self, request, *args, **kwargs):
        physician_serializer = PhysicianDecisionSerializer(data=request.data)
        print(request.data)
        if physician_serializer.is_valid():
            physician_serializer.save()
            print(physician_serializer.data) 
            return Response(physician_serializer.data, status=status.HTTP_201_CREATED)
        else:
           return Response(physician_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    
class UploadChestXray(APIView):
    queryset = ChestXray.objects.all()
    serializer_class = ChestXraySerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request, *args, **kwargs):

        print(request.data)
        file_serializer = ChestXraySerializer(data=request.data)

        if file_serializer.is_valid():
            file_serializer.save()
            
            dicom_path = file_serializer.data['image_url'][1:].replace("wss/", "")
            # png_path, image = convert_dicom2png(dicom_path)
            
            image = cv2.imread(dicom_path)

            image = pimg.crop_image(image)
            # image = pimg.hist_eqzr(image)
            # image = pimg.hist_matching(image)

            image = cv2.resize(image, target_size, interpolation = cv2.INTER_AREA)
            
            img = image
            if len(img.shape)==3:
                img_gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
            else:
                img_gray = img
                img = np.expand_dims(img,-1)
                img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB) 
            img_gray = np.expand_dims(img_gray,-1)

            img = np.expand_dims(img,0)
            img = (img-img.min())/(img.max()-img.min())

            # get_output = K.function(model.input, model.output)
            # outputs = get_output([img])
            outputs = model.predict(img)
            cls = dataset_dict['class_id'][np.argmax(outputs[0])]
            print("Belongs to {}".format(cls))
            cam = outputs[1]
            cam = (cam-cam.min())/(cam.max()-cam.min())
            cam = np.squeeze(cam, axis=0)
            cam = image_binarizer(cam, 0.5)
            # cam = np.expand_dims(cam, axis=-1)
            contours, _= cv2.findContours(cam.astype('uint8'), cv2.RETR_TREE,
                               cv2.CHAIN_APPROX_SIMPLE)
            # Calculate and store areas along with their corresponding contours
            areas_and_contours = [(cv2.contourArea(contour), contour) for contour in contours]
            sorted_contours = sorted(areas_and_contours, key=lambda x: x[0], reverse=True)

            first2_countours = [c[1] for c in sorted_contours[:1]]

            if len(image.shape)<3:
                image = np.expand_dims(image,-1)
                image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
            if len(contours)!=0:
                cv2.drawContours(image, first2_countours, -1, (0, 255, 0), 3)

            loc_path = os.path.join(mask_url, file_serializer.data['image_url'].split('/')[-1])
            path = Path(loc_path)
            
            cv2.imwrite(loc_path, image)
            f = open(loc_path, mode='rb')
            image_file = File(f, name=path.name)

            prediction_serializer = PredictionResultSerializer(
                data={'class_prediction':cls, 
                      'loc_prediction':image_file,
                      'chestxray':file_serializer.data['id']
                      })
            if prediction_serializer.is_valid():
                prediction_serializer.save()
                return Response(prediction_serializer.data, status=status.HTTP_201_CREATED)
            else:
               return Response(prediction_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def getPatientsTotalStatistics(request):
    pcounts = PredictionResult.objects.values('chestxray_id').count()
    tb_count = PredictionResult.objects.filter(class_prediction='Tuberculosis').count() 
    sick_count = PredictionResult.objects.filter(class_prediction='Sick').count()
    health_count = PredictionResult.objects.filter(class_prediction='Healthy').count()  

    return Response({"total":pcounts,'health':health_count,
                    "tb":tb_count,"sick":sick_count}, status=status.HTTP_200_OK)
@api_view(['GET'])
def getPatientsComplication(request):
    tb_count = PredictionResult.objects.filter(class_prediction='Tuberculosis').count() 
    sick_count = PredictionResult.objects.filter(class_prediction = 'Sick').count()
    health_count = PredictionResult.objects.filter(class_prediction = 'Healthy').count()  
    return Response({'tb_count':tb_count, "sick_count":sick_count, "health_count":health_count},  status = status.HTTP_200_OK)

@api_view(['GET'])
def getChestXrayResult(request,pk):
    xray=ChestXray.objects.filter(patient_id = pk)
    xray_serializer = ChestXraySerializer(xray.only('patient'), many=True)

    chestxray_result = []
    for xs in xray_serializer.data:
        predictions = PredictionResult.objects.filter(chestxray_id = xs['id'])
        if predictions:
            pred_serializer = PredictionResultSerializer(predictions.all(), many=True).data
            for ps in pred_serializer:
                chestxray_result.append({
                    'pk':xs['id'],
                    'created':ps['created'],
                    'image_url':xs['image_url'],
                    'msk_url':ps['loc_prediction'],
                    'class_prediction':ps['class_prediction']
                    })
    return Response(chestxray_result)

@api_view(['GET'])
def getPatientInformation(request,pk):
    notes=PatientInformation.objects.filter(patientId=pk)
    serializer=PatientInformationSerializer(notes,many=True)
    return Response(serializer.data[0])

@api_view(['GET'])
def getPatientInformationPages(request):
    patient_list = PatientInformation.objects.all()
    paginator = Paginator(patient_list, request.GET.get('size'))
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    data = core_serializers.serialize("json",page_obj)
    data = json.loads(data)
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
def getPatientsAgeGender(request):
    fields = ('pk','age','gender','created')
    year = request.GET.get('year')
    di_type = request.GET.get('type')
    if di_type=="tuberculosis":
        di_type = "Tuberculosis"
    elif di_type=="non-tb-sick":
        di_type = "Sick"

    elif di_type=="healthy":
        di_type = "Healthy"

    list_of_months = ["January", "February", "March", "April", "May", "June", 
                        "July", "August","September","October", "November", "December"]
    month_count = {      
        list_of_months[0]:0, list_of_months[1]:0, list_of_months[2]:0, list_of_months[3]:0, 
        list_of_months[4]:0, list_of_months[5]:0, list_of_months[6]:0, list_of_months[7]:0,
        list_of_months[8]:0,list_of_months[9]:0, list_of_months[10]:0, list_of_months[11]:0
        }
    if len(year) == 4:
        pred_info = PredictionResult.objects.filter(class_prediction = di_type, created__year__in = [int(year)])
        pred_info = PredictionResultSerializer( pred_info.only('chestxray'), many=True).data
        if len(pred_info)==0:
            return Response(
                {"gender_df":
                    {"Male":0,"Female":0},
                    "female_month":month_count,
                    "male_month":month_count
                },
                status=status.HTTP_200_OK) 
        patient_list = []
        for pi in pred_info:
            chx_info = ChestXray.objects.filter(pk=pi['chestxray'])
            chx_info = ChestXraySerializer(chx_info.only('patient'), many=True).data
            
            for chx in chx_info:
                patient_info = PatientInformation.objects.filter(pk=chx['patient'])
                patient_info = PatientInformationSerializer(patient_info.all(),many=True).data

                for pi in patient_info:
                    patient_list.append({
                        'pk': pi['patientId'],
                        'age': pi['age'],
                        'gender': pi['gender'],
                        'created': pi['created']
                        }
                        ) 
        
        data = PatientInformationAgeGenderSerializer(patient_list, many=True).data
        df = pd.DataFrame(data)
        df['month'] = pd.to_datetime(df.created).dt.month
        df = df.dropna(subset=['gender'],how='any')

        final_all = pd.pivot_table(df, values='pk', index=['month'],
                    columns=['gender'], aggfunc='count').reset_index()
        final_all = final_all.fillna(0)
        final_all_female = month_count.copy()
        final_all_male = month_count.copy()  
        for i in range(final_all.shape[0]):
            if 'Female' in final_all.columns:
                final_all_female[list_of_months[final_all['month'].iloc[i]-1]] = final_all['Female'].iloc[i]
            if 'Male' in final_all.columns:
                final_all_male[list_of_months[final_all['month'].iloc[i]-1]] = final_all['Male'].iloc[i]

        gender_df = df.groupby('gender').agg({'pk':'count'}).reset_index().rename(columns={"pk":"count"})
        gender_dict = gender_df.to_dict()

        final_gender = {}
        if 0 in gender_dict['gender']:
            if  gender_dict['gender'][0] == "Female":
                final_gender['Female'] = gender_dict['count'][0] 
            elif  gender_dict['gender'][0] == "Male":
                final_gender['Male'] = gender_dict['count'][0]  
            if 1 in gender_dict['gender']:
                if  gender_dict['gender'][1] == "Female":
                    final_gender['Female'] = gender_dict['count'][1] 
                elif  gender_dict['gender'][1] == "Male":
                    final_gender['Male'] = gender_dict['count'][1] 
            else:
                if 'Female' in final_gender:
                    final_gender['Male'] = 0
                else:
                    final_gender['Female'] = 0  
        else:
           final_gender["Female"] = 0
           final_gender["Male"] = 0
 
        return Response(
            { 
                "gender_df": final_gender,
                "female_month": final_all_female,
                "male_month": final_all_male
            },
            status=status.HTTP_200_OK)

    elif year == "all":
        patient_list = PatientInformation.objects.all().only('pk','age','gender')
        data = PatientInformationAgeGenderSerializer(patient_list, many=True).data
        return Response(data, status=status.HTTP_200_OK)
    else:
        return Response('invalid data format', status=status.HTTP_404_NOT_FOUND)

def signin(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            print('invalid')
            messages.error(request, "Invalid credentials provided")
            return redirect('login')
        
    return render(request, 'wss/login.html')

def dashboard(request):
    return render(request, 'wss/dashboard.html')

def signout(request):
    logout(request)
    messages.success(request, "Logged out successfully!")
    return redirect('login')