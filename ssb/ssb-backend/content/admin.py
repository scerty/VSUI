from django.contrib import admin
from .models import Activity, News, Event, Author, Category


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    search_fields = ('name', 'email')
    readonly_fields = ('created_at',)
    fields = ('name', 'image', 'bio', 'email', 'created_at')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'color', 'created_at')
    search_fields = ('name',)
    readonly_fields = ('created_at',)
    fields = ('name', 'color', 'created_at')


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'year', 'activity_type', 'time', 'created_at')
    list_filter = ('activity_type', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')
    fields = ('title', 'description', 'date', 'year', 'activity_type', 'time', 'created_at', 'updated_at')


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'date', 'views', 'author', 'is_published', 'created_at')
    list_filter = ('category', 'is_published', 'date', 'created_at')
    search_fields = ('title', 'description', 'content')
    readonly_fields = ('created_at', 'updated_at', 'views')
    fieldsets = (
        ('المعلومات الأساسية', {
            'fields': ('title', 'description', 'category', 'author', 'image')
        }),
        ('المحتوى', {
            'fields': ('content',),
            'classes': ('wide',)
        }),
        ('النشر', {
            'fields': ('date', 'is_published')
        }),
        ('الإحصائيات', {
            'fields': ('views', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'time', 'location', 'status', 'attendees', 'capacity')
    list_filter = ('status', 'date', 'created_at')
    search_fields = ('title', 'description', 'location')
    readonly_fields = ('created_at', 'updated_at')
    fields = (
        'title', 'description', 'date', 'time', 'location',
        'capacity', 'attendees', 'status', 'created_at', 'updated_at'
    )
