from .models import School, Grade, Student, Fee, Payment, Term
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
    '''
    SchoolSerializer is a class that serializes the School model.
    '''
    class Meta:
        model = School
        fields = '__all__'

class GradeSerializer(BaseSerializer):
    '''
    GradeSerializer is a class that serial
    '''
    class Meta:
        model = Grade
        fields = '__all__'

class StudentSerializer(BaseSerializer):
    '''
    StudentSerializer is a class that serializes the Student model.
    '''
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
    
class FeeSerializer(BaseSerializer):
    ''' 
    FeeSerializer is a class that serial fee model
    '''
    class Meta:
        model = Fee
        fields = '__all__'

class TermSerializer(BaseSerializer):
    '''
    TermSerializer is a class that serial term model
    '''
    class Meta:
        model = Term
        exclude = ['school']

    def validate(self, data):
        """
        Ensure that 'to_date' is after 'from_date'.
        """
        if data['end_date'] < data['start_date']:
            raise serializers.ValidationError("End date must be after start date.")
        return data
    


class PaymentSerializer(BaseSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)
    date_paid = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'student', 'student_name', 'fee', 'amount', 'date_paid', 'payment_method', 'reference_number']

