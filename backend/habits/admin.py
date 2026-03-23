from django.contrib import admin
from .models import Habit, HabitLog


class HabitLogInline(admin.TabularInline):
    model = HabitLog
    extra = 0
    fields = ['date', 'completed', 'note']
    readonly_fields = ['created_at']


@admin.register(Habit)
class HabitAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'frequency', 'current_streak', 'total_completions', 'is_active', 'created_at']
    list_filter = ['frequency', 'is_active', 'created_at']
    search_fields = ['name', 'user__email']
    inlines = [HabitLogInline]
    readonly_fields = ['current_streak', 'longest_streak', 'total_completions', 'created_at']
    list_per_page = 25
    actions = ['activate_habits', 'deactivate_habits']

    def activate_habits(self, request, queryset):
        queryset.update(is_active=True)
    activate_habits.short_description = "Activate selected habits"

    def deactivate_habits(self, request, queryset):
        queryset.update(is_active=False)
    deactivate_habits.short_description = "Deactivate selected habits"


@admin.register(HabitLog)
class HabitLogAdmin(admin.ModelAdmin):
    list_display = ['habit', 'date', 'completed', 'note']
    list_filter = ['completed', 'date']
    search_fields = ['habit__name', 'habit__user__email']
