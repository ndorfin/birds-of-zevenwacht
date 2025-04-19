# Generated by Django 5.1.6 on 2025-04-19 11:50

import bofz.models
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bofz', '0007_alter_redlistlevel_severity'),
    ]

    operations = [
        migrations.AddField(
            model_name='bird',
            name='redlist_level',
            field=models.ForeignKey(default=bofz.models.RedListLevel.get_default_pk, on_delete=django.db.models.deletion.CASCADE, to='bofz.redlistlevel'),
        ),
    ]
