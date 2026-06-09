from django.contrib import admin
from .models import *

admin.site.register(CustomUser)
admin.site.register(HealthyInstitution)
admin.site.register(PatientInformation)
admin.site.register(PredictionResult)
admin.site.register(PhysicianDecision)
admin.site.register(ChestXray)