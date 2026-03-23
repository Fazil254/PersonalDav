from rest_framework import generics, status, permissions, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from .models import Goal, GoalCategory, GoalMilestone, GoalNote
from .serializers import (GoalSerializer, GoalCreateSerializer,
                           GoalCategorySerializer, GoalMilestoneSerializer, GoalNoteSerializer)


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or request.user.role == 'admin'


# Goal Category Views (Admin)
class GoalCategoryListCreateView(generics.ListCreateAPIView):
    queryset = GoalCategory.objects.all()
    serializer_class = GoalCategorySerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]


class GoalCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GoalCategory.objects.all()
    serializer_class = GoalCategorySerializer
    permission_classes = [permissions.IsAdminUser]


# Goal Views
class GoalListCreateView(generics.ListCreateAPIView):
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'category']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'target_date', 'progress', 'priority']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Goal.objects.all().select_related('user', 'category')
        return Goal.objects.filter(user=user).select_related('category')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return GoalCreateSerializer
        return GoalSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class GoalDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user).select_related('category')

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return GoalCreateSerializer
        return GoalSerializer

    def perform_update(self, serializer):
        # Auto-set completed_at if status changed to completed
        if serializer.validated_data.get('status') == 'completed':
            serializer.save(completed_at=timezone.now(), progress=100)
        else:
            serializer.save()


# Milestone Views
class MilestoneListCreateView(generics.ListCreateAPIView):
    serializer_class = GoalMilestoneSerializer

    def get_queryset(self):
        return GoalMilestone.objects.filter(goal_id=self.kwargs['goal_id'],
                                             goal__user=self.request.user)

    def perform_create(self, serializer):
        goal = Goal.objects.get(id=self.kwargs['goal_id'], user=self.request.user)
        serializer.save(goal=goal)


class MilestoneDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GoalMilestoneSerializer

    def get_queryset(self):
        return GoalMilestone.objects.filter(goal__user=self.request.user)


# Note Views
class GoalNoteListCreateView(generics.ListCreateAPIView):
    serializer_class = GoalNoteSerializer

    def get_queryset(self):
        return GoalNote.objects.filter(goal_id=self.kwargs['goal_id'],
                                        goal__user=self.request.user)

    def perform_create(self, serializer):
        goal = Goal.objects.get(id=self.kwargs['goal_id'], user=self.request.user)
        serializer.save(goal=goal)


# PDF Export
class GoalPDFExportView(APIView):
    def get(self, request):
        goals = Goal.objects.filter(user=request.user)
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="my_goals.pdf"'

        p = canvas.Canvas(response, pagesize=letter)
        width, height = letter
        p.setTitle(f"Goals Report — {request.user.full_name}")

        p.setFont("Helvetica-Bold", 20)
        p.drawString(50, height - 60, f"Goals Report — {request.user.full_name}")
        p.setFont("Helvetica", 12)
        p.drawString(50, height - 85, f"Generated: {timezone.now().strftime('%d %B %Y')}")

        y = height - 130
        for i, goal in enumerate(goals, 1):
            if y < 100:
                p.showPage()
                y = height - 60
            p.setFont("Helvetica-Bold", 13)
            p.drawString(50, y, f"{i}. {goal.title}")
            y -= 18
            p.setFont("Helvetica", 11)
            p.drawString(70, y, f"Status: {goal.get_status_display()} | Priority: {goal.get_priority_display()} | Progress: {goal.progress}%")
            y -= 15
            if goal.description:
                p.drawString(70, y, f"Description: {goal.description[:100]}")
                y -= 15
            y -= 10

        p.save()
        return response


# Admin
class AdminGoalListView(generics.ListAPIView):
    queryset = Goal.objects.all().select_related('user', 'category')
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAdminUser]
    search_fields = ['title', 'user__email']
    filterset_fields = ['status', 'priority']
