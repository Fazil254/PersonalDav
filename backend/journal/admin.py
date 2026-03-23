from django.contrib import admin
from .models import JournalEntry, JournalTag


@admin.register(JournalEntry)
class JournalEntryAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'mood', 'word_count', 'is_private', 'created_at']
    list_filter = ['mood', 'is_private', 'created_at']
    search_fields = ['title', 'content', 'user__email']
    readonly_fields = ['word_count', 'created_at', 'updated_at']
    filter_horizontal = ['tags']
    list_per_page = 25


@admin.register(JournalTag)
class JournalTagAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'color']
    search_fields = ['name', 'user__email']
