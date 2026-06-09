from django.urls import path
from rest_framework_simplejwt.views import(TokenObtainPairView, TokenRefreshView) 
from wss.views import *
 
urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/user-detail/',UserAPIView.as_view(), name='user'),
    path('api/user-register/',RegisterUserAPIView.as_view()),
    path('api/patient-register/',CreatePatientInformation.as_view()),
    path('api/feedback/', CreatePhysicianDesicion.as_view()),
    path('api/patients/agegender/', getPatientsAgeGender),
    path('api/patients/complication/', getPatientsComplication),
    path('api/patients/statistics/', getPatientsTotalStatistics),
    path("api/patients/page/", getPatientInformationPages),
    path('api/patient/<str:pk>', getPatientInformation),
    path('api/cxr-upload/',UploadChestXray.as_view()),
    path('api/cxr-result/<str:pk>',getChestXrayResult),
    path('api/login/', signin, name='login'),
    path('dashboard/', dashboard, name='dashboard') 
]