# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.urls import reverse


def index(request):
    # Check if user is authenticated
    if "user_id" not in request.session:
        return redirect("/login/")  # Redirect to login if not authenticated

    # Ensure role exists in session
    user_role = request.session.get("role", None)
    if not user_role:
        request.session.flush()  # Clear session if corrupted
        return redirect("/login/")

    context = {'segment': 'index', 'user_role': user_role}

    html_template = loader.get_template('home/index.html')
    return HttpResponse(html_template.render(context, request))


def pages(request):
    # Check if user is authenticated
    if "user_id" not in request.session:
        return redirect("/login/")

    # Ensure role exists in session
    user_role = request.session.get("role", None)
    if not user_role:
        request.session.flush()
        return redirect("/login/")

    context = {"user_role": user_role}

    try:
        load_template = request.path.split('/')[-1]

        if load_template == 'admin':
            return HttpResponseRedirect(reverse('admin:index'))

        context['segment'] = load_template

        html_template = loader.get_template(f'home/{load_template}')
        return HttpResponse(html_template.render(context, request))

    except:
        html_template = loader.get_template('home/page-404.html')
        return HttpResponse(html_template.render(context, request))
