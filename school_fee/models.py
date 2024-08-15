from django.db import models
import uuid


class BaseModel(models.Model):
    """
    BaseModel is an abstract base class that provides common fields for other models.
    Attributes:
        id (UUIDField): A unique identifier for the model instance.
        created_at (DateTimeField): The timestamp when the instance was created.
        updated_at (DateTimeField): The timestamp when the instance was last updated.

    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        '''
        Table wont be created in th database
        '''
        abstract = True


class Student(BaseModel):
    """
    Student represents a student entity in the system,
                inheriting common fields from BaseModel.
    Attributes:
        name (CharField): The name of the student, limited to 200 characters.
        date_of_birth (DateField): The birth date of the student.
        gender (CharField): The gender of the student,
                            which can be either 'male' or 'female'.
        grade (ForeignKey): A reference to the Grade model,
                            allowing for a relationship with the student's grade
    """

    class Gender(models.TextChoices):
        MALE = 'male'
        FEMALE = 'female'
    name = models.CharField(max_length=200)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=7)
    grade = models.ForeignKey(
        'Grade',
        on_delete=models.SET_NULL,
        related_name='students',
        null=True)


class Grade(BaseModel):
    """
    Grade represents an academic grade in the system,

    Attributes:
        name (CharField): The unique name of the grade, limited to 100 characters.
        description (TextField): An optional description of the grade,
                                which can be left blank or set to null.

    Methods:
        __str__(): Returns the name of the grade as its string representation.
    """

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Fee(BaseModel):
    """
    Model to represent the Fee structure for different Grades.
    """
    name = models.CharField(max_length=100, unique=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    total_paid = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.0)
    students = models.ManyToManyField(Student, related_name='fees')


class Payment(BaseModel):
    """    Payment represents a financial transaction made by a student for a specific fee.
    Attributes:
        student (ForeignKey): A reference to the Student model,
                            indicating which student made the payment.
        fee (ForeignKey): A reference to the Fee model,
                            indicating which fee is being paid.
        amount (DecimalField): The amount of money paid,
                                with a maximum of 10 digits and 2 decimal places.
        date_paid (DateTimeField): The timestamp when the payment was made,
                                    automatically set to the current time.
        payment_method (CharField): The method used for the payment,
                                    limited to 50 characters.
        reference_number (CharField): A unique identifier for the payment,
                                    limited to 100 characters.

    """
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='payments')
    fee = models.ForeignKey(
        Fee,
        on_delete=models.CASCADE,
        related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date_paid = models.DateTimeField(auto_now=True)
    payment_method = models.CharField(max_length=50)
    reference_number = models.CharField(max_length=100, unique=True, null=True)


class Schoolterm(BaseModel):
    name = models.CharField(max_length=30)
    start_date = models.DateField()
    end_date = models.DateField()
    student = models.OneToOneField(
        Student,
        on_delete=models.CASCADE,
        related_name='term')
