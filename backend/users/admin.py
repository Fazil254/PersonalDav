from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Profile


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'
    fields = ['bio', 'avatar', 'timezone', 'motivation_quote',
              'weekly_goal_target', 'streak_days', 'total_xp']
    readonly_fields = ['streak_days', 'total_xp']


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    inlines = [ProfileInline]
    list_display = ['email', 'full_name', 'role', 'is_active', 'is_staff', 'date_joined']
    list_filter = ['role', 'is_active', 'is_staff', 'date_joined']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['-date_joined']
    list_per_page = 25
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Dates', {'fields': ('last_login', 'date_joined'), 'classes': ('collapse',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2', 'role'),
        }),
    )
    readonly_fields = ['date_joined']
    actions = ['activate_users', 'deactivate_users']

    def activate_users(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, f"{queryset.count()} users activated.")
    activate_users.short_description = "Activate selected users"

    def deactivate_users(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f"{queryset.count()} users deactivated.")
    deactivate_users.short_description = "Deactivate selected users"


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'timezone', 'streak_days', 'total_xp', 'weekly_goal_target']
    search_fields = ['user__email', 'user__first_name']
    list_filter = ['timezone']
    readonly_fields = ['streak_days', 'total_xp', 'created_at', 'updated_at']
