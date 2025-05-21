from django.urls import path
from . import views


urlpatterns = [
    path("", views.index, name="index"),

    # API Routes
    path("checkUser/<str:field>/<str:content>", views.checkUser, name="checkUser"),
    path("cToken/<str:id>/<str:token>", views.cToken, name="cToken"),
    path("addUser", views.addUser, name="addUser"),
    path("rfid", views.rfid, name="rfid")
]