from rest_framework import serializers
from .models import Goal, GoalCategory, GoalMilestone, GoalNote


class GoalCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalCategory
        fields = '__all__'


class GoalMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalMilestone
        fields = ['id', 'title', 'is_completed', 'due_date', 'created_at']


class GoalNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalNote
        fields = ['id', 'content', 'created_at']


class GoalSerializer(serializers.ModelSerializer):
    milestones = GoalMilestoneSerializer(many=True, read_only=True)
    notes = GoalNoteSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = Goal
        fields = ['id', 'title', 'description', 'category', 'category_name',
                  'status', 'priority', 'progress', 'target_date', 'image',
                  'is_public', 'created_at', 'updated_at', 'completed_at',
                  'milestones', 'notes', 'user_name']
        read_only_fields = ['user', 'created_at', 'updated_at', 'completed_at']

    def validate_progress(self, value):
        if not (0 <= value <= 100):
            raise serializers.ValidationError("Progress must be between 0 and 100.")
        return value


class GoalCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ['title', 'description', 'category', 'status', 'priority',
                  'progress', 'target_date', 'image', 'is_public']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
