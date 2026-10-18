from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ActivityViewSet, NewsViewSet, EventViewSet, AuthorViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'news', NewsViewSet, basename='news')
router.register(r'events', EventViewSet, basename='event')
router.register(r'authors', AuthorViewSet, basename='author')
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
]
