from django.contrib import admin
from .models import Goal, GoalCategory, GoalMilestone, GoalNote


class GoalMilestoneInline(admin.TabularInline):
    model = GoalMilestone
    extra = 1
    fields = ['title', 'is_completed', 'due_date']


class GoalNoteInline(admin.TabularInline):
    model = GoalNote
    extra = 0
    fields = ['content', 'created_at']
    readonly_fields = ['created_at']


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'category', 'status', 'priority', 'progress', 'target_date', 'created_at']
    list_filter = ['status', 'priority', 'category', 'is_public', 'created_at']
    search_fields = ['title', 'user__email', 'description']
    ordering = ['-created_at']
    list_per_page = 20
    inlines = [GoalMilestoneInline, GoalNoteInline]
    readonly_fields = ['created_at', 'updated_at', 'completed_at']
    fieldsets = (
        ('Goal Info', {'fields': ('user', 'title', 'description', 'category', 'image')}),
        ('Status & Progress', {'fields': ('status', 'priority', 'progress', 'target_date', 'is_public')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at', 'completed_at'), 'classes': ('collapse',)}),
    )
    actions = ['mark_completed', 'mark_in_progress']

    def mark_completed(self, request, queryset):
        queryset.update(status='completed', progress=100)
    mark_completed.short_description = "Mark selected goals as Completed"

    def mark_in_progress(self, request, queryset):
        queryset.update(status='in_progress')
    mark_in_progress.short_description = "Mark selected goals as In Progress"


@admin.register(GoalCategory)
class GoalCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'color', 'created_at']
    search_fields = ['name']


@admin.register(GoalMilestone)
class GoalMilestoneAdmin(admin.ModelAdmin):
    list_display = ['title', 'goal', 'is_completed', 'due_date']
    list_filter = ['is_completed']
    search_fields = ['title', 'goal__title']
