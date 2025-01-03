from django.db import models
import uuid
from school_users.models import User
from django.utils import timezone
from rest_framework.exceptions import ValidationError


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

class School(BaseModel):
    """
    School represents an educational institution within the system.

    Attributes:
        name (CharField): The unique name of the school, limited to 100 characters.
        address (TextField): The physical address of the school.
        owner (ForeignKey): A reference to the User model,
    """
    name =  models.CharField(max_length=100, unique=True)
    address = models.TextField()
    owner = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='schools'
    )

class Term(BaseModel):
    """
    Term represents an academic term within the system.

    Attributes:
        name (CharField): The unique name of the term, limited to 100 characters.
        start_date (DateField): The starting date of the term.
        end_date (DateField): The ending date of the term.
    """
    name = models.CharField(max_length=100, unique=True)
    start_date = models.DateField()
    end_date = models.DateField()
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='terms')
    is_current = models.BooleanField(default=True)

    def update_is_current(self):
        today = timezone.now().date()
        self.is_current = self.end_date >= today >= self.start_date
        

    def save(self, *args, **kwargs):
        if self.end_date < self.start_date:
            raise ValueError('End date must be greater than start date')
        self.update_is_current()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

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
    gender = models.CharField(max_length=7,
                              choices=Gender.choices)
    grade = models.ForeignKey(
        'Grade',
        on_delete=models.SET_NULL,
        related_name='students',
        null=True)
    school = models.ForeignKey(
        School, on_delete=models.CASCADE,
        related_name='students'
    )

    class Meta:
        unique_together = ('name', 'date_of_birth') 


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
    school = models.ForeignKey(
        School, on_delete=models.CASCADE,
        related_name='grade'
    )

    def __str__(self):
        return self.name


class FeeType(models.TextChoices):
    ADMISSION = 'ADMISSION', 'Admission Fee'
    TERM = 'TERM', 'Term Fee'
    ONCE = 'ONCE', 'One-time Fee'
    DAILY = 'DAILY', 'Daily Fee'

class Fee(BaseModel):
    """
    Model to represent the Fee structure for different Grades.
    """
    name = models.CharField(
        max_length=100, 
        unique=True, 
        help_text="Unique name for the fee structure (e.g., 'Term 1 Fees')."
    )
    total_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        default=0.00,
        help_text="Total fee amount for the grade."
    )
    total_paid = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0.00, 
        help_text="Amount that has been paid towards the total fee."
    )
    students = models.ManyToManyField(
        'Student', 
        related_name='fees', 
        blank=True, 
        help_text="Students associated with this fee."
    )
    term = models.ForeignKey(
        Term,
        on_delete=models.SET_NULL, 
        related_name='fees', 
        null=True, 
        help_text="Term this fee structure applies to."
    )
    description = models.TextField(null=True)
    fee_type = models.CharField(
        max_length=50, 
        choices=FeeType.choices, 
        default=FeeType.TERM,
        help_text="Type of fee structure."
    )
    is_active = models.BooleanField(default=True)
    grade = models.ForeignKey(
        'Grade',
        on_delete=models.SET_NULL,
        related_name='fees',
        null=True,
        blank=True,
        help_text="Grade this fee structure applies to."
    )

    def update_is_active(self):
        if self.term:
            today = timezone.now().date()
            self.is_active = self.term.end_date >= today >= self.term.start_date
            self.save()

    def set_name(self):
        year = timezone.now().year
        today = timezone.now().date()
        if self.fee_type == "ADMISSION":
            self.name = f'{self.fee_type}-{year}-{self.total_amount} Fee'
        elif self.fee_type == "DAILY":
            self.name = f'{self.name} {self.grade.name} - {self.term.name} {today} Fee'
        else:            
            self.name = f'{self.grade.name} - {self.term.name} - {self.fee_type} Fee'
            
    def save(self, *args, **kwargs):
        self.set_name()

        if self.term is None and self.fee_type != "ADMISSION":
            raise ValidationError('A term is required for fee types other than ADMISSION.')

        super().save(*args, **kwargs)

    @classmethod
    def bulk_create_with_names(cls, fees):
        for fee in fees:
            fee.set_name()
        return cls.objects.bulk_create(fees)


    def __str__(self) -> str:
        return f'{self.name}'
    




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

    class Meta:
        ordering = ['-date_paid']
