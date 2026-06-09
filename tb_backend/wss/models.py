from datetime import datetime
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

# lets us explicitly set upload path and filename
def img_upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)

def msk_upload_to(instance, filename):
    return 'masks/{filename}'.format(filename=filename)

class HealthyInstitution(models.Model):
    name = models.TextField(max_length=20, null=False, default="")
    created = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name
    
class CustomUser(AbstractUser):
    institution = models.ForeignKey(HealthyInstitution, on_delete=models.CASCADE,null=True, related_name='institution')
    def __str__(self):
        return self.username
    
# Create your models here.
class PatientInformation(models.Model):
    patientId = models.CharField( max_length=30,default='',unique=True,primary_key=True)
    firstName = models.CharField(max_length=50,null=True,default='')
    lastName = models.CharField(max_length=50,null=True,default='')
    gender = models.CharField(max_length=10,null=True,default='')
    age = models.FloatField( null=True,default='')
    job = models.CharField(max_length=50,null=True,default='')
    region = models.CharField(max_length=50,null=True,default='')
    zone = models.CharField(max_length=50,null=True,default='')
    woreda = models.CharField(max_length=50,null=True,default='')
    kebele = models.CharField(max_length=50,null=True,default='')
    phonenumber = models.CharField(max_length=15,null=True, default='')
    updated = models.DateTimeField(auto_now=True)
    created= models.DateTimeField(auto_now_add=True)   
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="user", on_delete=models.CASCADE)

    def __str__(self):
        return self.patientId
    
class ChestXray(models.Model):
    image_url = models.ImageField(upload_to=img_upload_to, null=True, default="")
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="creator", on_delete=models.CASCADE)
    patient = models.ForeignKey(PatientInformation, on_delete=models.CASCADE, related_name="patient")
    created = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.image_url.name
    
class PredictionResult(models.Model):
    class_prediction = models.TextField(max_length=20, null=False, default="Healthy")
    loc_prediction = models.ImageField(upload_to=msk_upload_to, null=True, default="")
    chestxray = models.ForeignKey(ChestXray, on_delete=models.CASCADE, related_name="chestxray")
    created = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.class_prediction
    
class PhysicianDecision(models.Model):
    result = models.ForeignKey(PredictionResult, on_delete=models.CASCADE, related_name='result', unique=False)
    approval = models.BooleanField(default=True,null=True)
    feedback = models.TextField(blank=True)
    disease = models.TextField(max_length=20, null=True, default="")
    created = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return str(self.created)    