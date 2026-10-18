from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import filters
from .models import Activity, News, Event, Author, Category
from .serializers import (
    ActivitySerializer, NewsListSerializer, NewsDetailSerializer,
    NewsCreateUpdateSerializer, EventSerializer, AuthorSerializer, CategorySerializer
)


class AuthorViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Authors.
    Provides CRUD operations for authors.
    """
    queryset = Author.objects.all().order_by('name')
    serializer_class = AuthorSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'email']


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Categories.
    Provides CRUD operations for news categories.
    """
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class ActivityViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Activities.
    Provides CRUD operations for activities.
    """
    queryset = Activity.objects.all().order_by('-created_at')
    serializer_class = ActivitySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'date']

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming activities"""
        activities = self.queryset[:5]  # Get latest 5
        serializer = self.get_serializer(activities, many=True)
        return Response(serializer.data)


class NewsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing News.
    Provides CRUD operations for news articles.
    """
    queryset = News.objects.filter(is_published=True).order_by('-date')
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'content']
    ordering_fields = ['date', 'views']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return NewsDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return NewsCreateUpdateSerializer
        return NewsListSerializer

    def get_queryset(self):
        queryset = News.objects.all().order_by('-date')
        # For admin, show all; for public, only published
        if self.request.query_params.get('all') == 'true':
            return queryset
        return queryset.filter(is_published=True)

    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Get latest news"""
        news = self.get_queryset()[:6]
        serializer = NewsListSerializer(news, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get news by category"""
        category_id = request.query_params.get('category_id', None)
        category_name = request.query_params.get('category', None)
        
        queryset = self.get_queryset()
        
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        elif category_name:
            queryset = queryset.filter(category__name=category_name)
        else:
            return Response({'error': 'Category parameter is required'}, status=400)
        
        serializer = NewsListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def trending(self, request):
        """Get trending news by views"""
        news = self.get_queryset().order_by('-views')[:5]
        serializer = NewsListSerializer(news, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        """Increment view count for a news item"""
        news = self.get_object()
        news.views += 1
        news.save()
        serializer = NewsDetailSerializer(news)
        return Response(serializer.data)


class EventViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Events.
    Provides CRUD operations for events/festivals.
    """
    queryset = Event.objects.all().order_by('-date')
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['date', 'status']

    @action(detail=False, methods=['get'])
    def upcoming_events(self, request):
        """Get upcoming events"""
        events = self.queryset.filter(status='upcoming')
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def ongoing_events(self, request):
        """Get ongoing events"""
        events = self.queryset.filter(status='ongoing')
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def register_attendee(self, request, pk=None):
        """Register an attendee for an event"""
        event = self.get_object()
        if event.attendees < event.capacity:
            event.attendees += 1
            event.save()
            return Response({
                'message': 'تم تسجيلك بنجاح',
                'current_attendees': event.attendees,
                'capacity': event.capacity
            })
        return Response({
            'error': 'العرض قد امتلأ'
        }, status=400)
