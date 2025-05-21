from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.hashers import make_password, check_password
from django.core import serializers
import json
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
import serial # pip install pyserial

from .models import User, Condominio, Produto

# Adjust the serial port and the baud rate
#serialCom = serial.Serial("COM3", 9600, timeout=1)

# Create your views here.
def index(request):
    message = ""

    if request.method == "POST":
        name = email = request.POST["name"]
        email = request.POST["email"]
        password = request.POST["password"]

        # u = User.objects.create_user(name, email, password)
        h = make_password(password)

        u = User(username=name, email=email, password=h)
        #message = f"{u} - id: {u.id}, name: {u.username}, email: {u.email}, password: {u.password}"


    return render(request, "cmSolSystem/index.html", {
        "message": message,
        "users": User.objects.all().order_by("username"),
        "condos": Condominio.objects.all().order_by("name"),
        "produtos": Produto.objects.all().order_by("name"),
    })


def checkUser(request, field, content):
    print(f"request: {request}")
    # Create a variable to store the result, false or true, is the content is valid for corresponding field
    allow = False

    # Verify if passed field exists and if content is already saved
    if field == "username":
        try:
            u = User.objects.get(username=content)
            allow = False
            print(f"The {field} {content} has already taken")
        except ObjectDoesNotExist:
            allow = True
            print(f"There is no {field} {content} in database")

    elif field == "cpf":
        try:
            u = User.objects.get(cpf=content)
            allow = False
            print(f"The {field} {content} has already taken")
        except ObjectDoesNotExist:
            allow = True
            print(f"There is no {field} {content} in database")

    elif field == "celular":
        try:
            u = User.objects.get(celular=content)
            allow = False
            print(f"The {field} {content} has already taken")
        except ObjectDoesNotExist:
            allow = True
            print(f"There is no {field} {content} in database")
    elif field == "email":
        try:
            u = User.objects.get(email=content)
            allow = False
            print(f"The {field} {content} has already taken")
        except ObjectDoesNotExist:
            allow = True
            print(f"There is no {field} {content} in database")

    else:
        allow = False
        print(f"There is not any field {field} for Users in database")

    return JsonResponse(allow, safe=False)


def addUser(request):

    # User is added only if method is POST
    if request.method == "POST":

        # Get new user data
        data = json.loads(request.body)
        userData = data.get("userData", "")
        print("=" * 150)
        print(f"userData: {userData}")
        print("=" * 150)
        
        # Create user         
        # As long as we're using create_user and not creating a user with command u=User.objects.all(etc);;;
        # We don't need use the function make_password to convert the password into a hash...
        # The create_user function handles properly this situation
        User.objects.create_user(
            username = userData['username'],
            first_name = userData['name'],
            last_name = userData['lastname'],
            cpf = userData['cpf'],
            celular = userData['cel'],
            email = userData['email'],
            password = userData['password'],            
        )

        # Adding the new user as a responsible for the passed condo id
        c = Condominio.objects.get(id=userData['condo'])
        u = User.objects.get(username=userData['username'])
        c.repres.add(u.id)  

        return JsonResponse({"message": "New user added successfully."}, status=201)

    elif request.method == "GET":
        return JsonResponse({"error": "POST request required."}, status=400)


# Function to check token (cToken), if it is right or not
def cToken(request, id, token):
    # Create a variable to store the result, false or true, is the token is valid
    c = False
    # id is an it or not?
    idIsInt = False
    # Verify if passed id is a possible int
    try:
        int(id)
        idIsInt = True
    except:
        idIsInt = False

    if idIsInt:
        # Get the condo corresponding to passed id
        condo = Condominio.objects.get(id=id)
        # Get the token corresponding to condo above
        condoToken = condo.token
        # Check if the passed token is valid for passed id
        c = check_password(token, condoToken)
    
    if not c:
        print(f"Token {token} for condo with id {id} is not valid")
    else:
        print(f"Token {token} for condo with id {id} is valid")

    return JsonResponse(c, safe=False)


def rfid(request):
    serialCom.flushInput()
    packet = ""
    data = ""
    packet = serialCom.readline()

    if packet != "":
        data = packet.decode("utf")
        # Remove new line charactere
        data = data.rstrip("\n")
        # Remove carriage return charactere?
        data = data.rstrip("\r")
        #print(f"data: {data}")
        
    if data != "":
        print(f"data: {data}")

    # In order to return a string, the parameter safe=False must be passed
    return JsonResponse(data, safe=False)