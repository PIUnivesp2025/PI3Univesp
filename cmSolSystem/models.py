from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password

class User(AbstractUser):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=60)
    cpf = models.CharField(max_length=20, null=True)
    celular = models.IntegerField(default=0, null=True)
    is_admin = models.BooleanField(default=False)

class Condominio(models.Model):
    name = models.CharField(max_length=256)
    address = models.CharField(max_length=256)
    tel = models.IntegerField(blank=True)
    repres = models.ManyToManyField(User, blank=True, related_name="condominios")
    date_client = models.DateTimeField(auto_now_add=True)
    token = models.CharField(max_length=128, default=make_password("Vai Corinthians!!!"))

    def __str__(self):
        return f"Condomínio {self.name}, telefone: {self.tel}, representantes: {self.repres.all().values_list('username', flat=True)}"

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "address": self.address,
            "tel": self.tel,
            "repres": [user.username for user in self.repres.all()],
            "date_client": self.date_client,
            "token": self.token,
        }


class Produto(models.Model):
    name = models.CharField(max_length=256)
    description = models.CharField(max_length=1024, blank=True)
    image_url = models.CharField(max_length=1024, default="no image")
    quantity = models.IntegerField(blank=True)

    def __str__(self):
        return f"{self.name}, quantidade: {self.quantity}"

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "image_url": self.image_url,
            "quantity": self.quantity,
        }
        

