from .models import School, Grade, Student, Fee, Payment
from rest_framework import serializers



class BaseSerializer(serializers.ModelSerializer):
    """
    BaseSerializer is a base class for serializers that provides common fields for model serialization.

    Attributes:
        id (CharField): A read-only field representing identifier of the model.
        created_at (DateTimeField): A read-only field representing the creation

    """
    id = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)
    updated_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)


class SchoolSerializer(BaseSerializer):
    class Meta:
        model = School
        fields = '__all__'

class GradeSerializer(BaseSerializer):
    class Meta:
        model = Grade
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    gender = serializers.CharField()
    grade_name = serializers.CharField(source='grade.name', read_only=True)  # Fetch the grade's name directly

    class Meta:
        model = Student
        exclude = ['school', 'updated_at']
        extra_fields = ['grade_name']


    def validate_gender(self, value):
        if value in dict(Student.Gender.choices):
            return value
        raise serializers.ValidationError()
    
class FeeSerializer(serializers.ModelSerializer):
    from_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M")
    to_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M")

    class Meta:
        model = Fee
        fields = '__all__'

    def validate(self, data):
        """
        Ensure that 'to_date' is after 'from_date'.
        """
        from_date = data.get('from_date')
        to_date = data.get('to_date')

        if to_date and from_date and to_date <= from_date:
            raise serializers.ValidationError(
                {'to_date': 'Expiration date must be after the start date.'}
            )
        return data
    


class PaymentSerializer(BaseSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    date_paid = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'student', 'student_name', 'fee', 'amount', 'date_paid', 'payment_method', 'reference_number']

