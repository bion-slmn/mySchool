import os
from .base import *

ENVIRONMENT = os.getenv('DJANGO_ENVIRONMENT', 'development')
print(f"Current environment: {ENVIRONMENT}")

if ENVIRONMENT == 'production':
    from .production import *
elif ENVIRONMENT == 'testing':
    from .testing import *
else:
    from .development import *