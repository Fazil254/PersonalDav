from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

admin.site.site_header = "Personal Development Admin"
admin.site.site_title = "PersonalDev Admin Portal"
admin.site.index_title = "Welcome to PersonalDev Admin"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/goals/', include('goals.urls')),
    path('api/habits/', include('habits.urls')),
    path('api/journal/', include('journal.urls')),
    path('api/dashboard/', include('dashboard.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
