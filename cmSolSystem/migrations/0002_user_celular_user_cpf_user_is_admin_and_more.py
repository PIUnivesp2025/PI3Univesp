# Generated by Django 5.0.4 on 2024-09-16 01:03

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cmSolSystem', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='celular',
            field=models.IntegerField(default=0, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='cpf',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='is_admin',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='user',
            name='first_name',
            field=models.CharField(max_length=30),
        ),
        migrations.AlterField(
            model_name='user',
            name='last_name',
            field=models.CharField(max_length=60),
        ),
        migrations.CreateModel(
            name='Condominio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('address', models.CharField(max_length=256)),
                ('tel', models.IntegerField(blank=True)),
                ('date_client', models.DateTimeField(auto_now_add=True)),
                ('token', models.CharField(default='pbkdf2_sha256$720000$kX47akdQYrrm9aVKALEYM9$xhXEEXbNgfGlYpwTeV8q7uk2HG0nKCgoKqBXdwIZd0w=', max_length=128)),
                ('repres', models.ManyToManyField(blank=True, related_name='condominios', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
