from rest_framework import serializers
from .models import Activity, News, Event, Author, Category


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name', 'image', 'bio', 'email', 'created_at']
        read_only_fields = ['created_at']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'color', 'created_at']
        read_only_fields = ['created_at']


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = [
            'id', 'date', 'year', 'title', 'description',
            'activity_type', 'time', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class NewsListSerializer(serializers.ModelSerializer):
    """Serializer for listing news (without full content)"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)
    author_name = serializers.CharField(source='author.name', read_only=True)
    author_image = serializers.URLField(source='author.image', read_only=True)

    class Meta:
        model = News
        fields = [
            'id', 'category', 'category_name', 'category_color',
            'date', 'views', 'title', 'description', 'image',
            'author', 'author_name', 'author_image',
            'is_published', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'views']


class NewsDetailSerializer(serializers.ModelSerializer):
    """Serializer for news detail (with full content)"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)
    author_name = serializers.CharField(source='author.name', read_only=True)
    author_image = serializers.URLField(source='author.image', read_only=True)
    author_bio = serializers.CharField(source='author.bio', read_only=True)

    class Meta:
        model = News
        fields = [
            'id', 'category', 'category_name', 'category_color',
            'date', 'views', 'title', 'description', 'content', 'image',
            'author', 'author_name', 'author_image', 'author_bio',
            'is_published', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class NewsCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating news"""
    class Meta:
        model = News
        fields = [
            'id', 'category', 'author', 'date', 'title',
            'description', 'content', 'image', 'is_published'
        ]


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'date', 'time',
            'location', 'capacity', 'attendees', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
