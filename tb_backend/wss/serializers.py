from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

from .models import *

#Serializer to Get User Details using Django Token Authentication
class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = CustomUser
    fields = ["id", "first_name", "last_name", "username"]

class PatientInformationSerializer(serializers.ModelSerializer):
  user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), many=False)
  class Meta:
    model = PatientInformation
    fields=("patientId","firstName","lastName","age","gender","job", "region","zone","woreda","kebele","phonenumber","updated","created","user")
    depth=1

class PatientInformationAgeGenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientInformation
        fields=('pk','age', 'gender','created')
        depth=1

class ChestXraySerializer(serializers.ModelSerializer):

  creator = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), many=False)
  patient = serializers.PrimaryKeyRelatedField(queryset=PatientInformation.objects.all(), many=False)  

  image_url = serializers.ImageField(required=False)

  class Meta:
      model = ChestXray
      fields = ['id', 'creator', 'patient','image_url','created']

class PredictionResultSerializer(serializers.ModelSerializer):

  chestxray = serializers.PrimaryKeyRelatedField(queryset=ChestXray.objects.all(), many=False)  
  loc_prediction = serializers.ImageField(required=False)

  class Meta:
      model = PredictionResult
      fields = ['id', 'class_prediction', 'loc_prediction','chestxray', 'created']

class PhysicianDecisionSerializer(serializers.ModelSerializer):

  result = serializers.PrimaryKeyRelatedField(queryset=PredictionResult.objects.all(), many=False)  

  class Meta:
      model = PhysicianDecision
      fields = ['id', 'feedback','result','approval','disease', 'created']

#Serializer to Register User
class RegisterSerializer(serializers.ModelSerializer):
  email = serializers.EmailField( required=True, validators=[UniqueValidator(queryset=CustomUser.objects.all())])
  password = serializers.CharField( write_only=True, required=True, validators=[validate_password]) 
  password2 = serializers.CharField(write_only=True, required=True)
  
  class Meta:
    model = CustomUser
    fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
    extra_kwargs = { 'first_name': {'required': True}, 'last_name': {'required': True}}

  def validate(self, attrs):
    if attrs['password'] != attrs['password2']:
      raise serializers.ValidationError({"password": "Password fields didn't match."})
    return attrs
  
  def create(self, validated_data):
    user = CustomUser.objects.create(
      username=validated_data['username'],
      email=validated_data['email'],
      first_name=validated_data['first_name'],
      last_name=validated_data['last_name']
    )
    user.set_password(validated_data['password'])
    user.save()
    return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        # Add custom claims
        token['username'] = user.username
        return token
    
from django.contrib.auth import get_user_model
user = get_user_model()
class CustomUserSerializers(serializers.ModelSerializer):
    institution = serializers.PrimaryKeyRelatedField(queryset=HealthyInstitution.objects.all(), many=False)  

    class Meta:
        model = user
        fields = ('id','username', 'email', 'institution')
        depth = 1