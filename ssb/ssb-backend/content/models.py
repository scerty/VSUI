from django.db import models
from django.utils import timezone


class Author(models.Model):
    """Model for Article Authors"""
    name = models.CharField(max_length=100)
    image = models.URLField(
        help_text="URL to author image",
        blank=True,
        null=True
    )
    bio = models.TextField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'الكاتب'
        verbose_name_plural = 'الكتّاب'

    def __str__(self):
        return self.name


class Category(models.Model):
    """Model for News Categories"""
    name = models.CharField(max_length=50, unique=True)
    color = models.CharField(
        max_length=20,
        choices=[
            ('yellow', 'أصفر'),
            ('green', 'أخضر'),
            ('blue', 'أزرق'),
            ('purple', 'بنفسجي'),
            ('red', 'أحمر'),
        ],
        default='blue'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'التصنيف'
        verbose_name_plural = 'التصنيفات'

    def __str__(self):
        return self.name


class Activity(models.Model):
    """Model for Activities/Events Timeline"""
    date = models.CharField(
        max_length=50,
        help_text="Date in Arabic format (e.g., نوفمبر 15)"
    )
    year = models.CharField(max_length=4)
    title = models.CharField(max_length=255)
    description = models.TextField()
    activity_type = models.CharField(
        max_length=20,
        choices=[
            ('حضوري', 'حضوري'),
            ('عن بعد', 'عن بعد'),
            ('هجين', 'هجين'),
        ],
        default='حضوري'
    )
    time = models.CharField(
        max_length=50,
        help_text="Time in format (e.g., 6:00 مساءً)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'النشاط'
        verbose_name_plural = 'الأنشطة'

    def __str__(self):
        return self.title


class News(models.Model):
    """Model for News/Announcements/Articles"""
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name='news',
        verbose_name='التصنيف'
    )
    author = models.ForeignKey(
        Author,
        on_delete=models.SET_NULL,
        null=True,
        related_name='articles',
        verbose_name='الكاتب'
    )
    date = models.DateField(default=timezone.now, verbose_name='تاريخ النشر')
    views = models.IntegerField(default=0, verbose_name='المشاهدات')
    title = models.CharField(max_length=255, verbose_name='العنوان')
    description = models.TextField(verbose_name='الوصف المختصر')
    content = models.TextField(
        verbose_name='المحتوى الكامل',
        help_text='استخدم ## للعناوين الرئيسية و ### للعناوين الفرعية',
        blank=True,
        null=True
    )
    image = models.URLField(
        help_text="رابط صورة المقالة",
        verbose_name='صورة المقالة'
    )
    is_published = models.BooleanField(default=True, verbose_name='منشور')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        verbose_name = 'الخبر'
        verbose_name_plural = 'الأخبار'

    def __str__(self):
        return self.title


class Event(models.Model):
    """Model for Events/Festivals"""
    STATUS_CHOICES = [
        ('upcoming', 'قادم'),
        ('ongoing', 'جاري الآن'),
        ('completed', 'مكتمل'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField()
    time = models.TimeField()
    location = models.CharField(max_length=255)
    capacity = models.IntegerField(
        default=100,
        help_text="Maximum attendees"
    )
    attendees = models.IntegerField(
        default=0,
        help_text="Current attendees count"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='upcoming'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        verbose_name = 'الفعالية'
        verbose_name_plural = 'الفعاليات'

    def __str__(self):
        return self.title
