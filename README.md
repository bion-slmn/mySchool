## CREATE AN ADMIN

curl localhost:8000/api/user/register-admin/ -X POST -H 'Content-Type: application/json' -d '{"email": "bonfire@gmail.com", "role": "admin", "password": "newpassword123"}'
{"id":"dbc6ba6f-79f5-4da2-9988-fa7de14e9d91","date_joined":"2024-08-19","last_login":null,"role":"admin","is_superuser":false,"first_name":"","last_name":"","is_staff":false,}

## LOGIN

curl localhost:8000/api/user/login/ -H 'Content-Type: application/json' -d '{"email": "bonfire@gmail.com", "password": "newpassword123"}'

{
"refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyNDE1OTQ5MCwiaWF0IjoxNzI0MDczMDkwLCJqdGkiOiJiMDYxNzgwOGUxY2Q0YmZiYTYyOWVkMzFlYTYxMjljZiIsInVzZXJfaWQiOiJkYmM2YmE2Zi03OWY1LTRkYTItOTk4OC1mYTdkZTE0ZTlkOTEifQ.B_kjg1JaUGeNtHWKK0rrb2F_vlshtbWWthQOzY16k0c",
"access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI0MDc2NjkwLCJpYXQiOjE3MjQwNzMwOTAsImp0aSI6Ijg5ZmRmN2ZkNjNjNzQzOTA5OGUyZGNjMDlmZTMwZWZiIiwidXNlcl9pZCI6ImRiYzZiYTZmLTc5ZjUtNGRhMi05OTg4LWZhN2RlMTRlOWQ5MSJ9.SpJEpZ6qsdb4y6gQySSh7yWPKL-\_5jC-7L1eTEgxBtg"
}

## Register Teacher

curl localhost:8000/api/user/register-teacher/ \
-X POST \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI0MDc2NjkwLCJpYXQiOjE3MjQwNzMwOTAsImp0aSI6Ijg5ZmRmN2ZkNjNjNzQzOTA5OGUyZGNjMDlmZTMwZWZiIiwidXNlcl9pZCI6ImRiYzZiYTZmLTc5ZjUtNGRhMi05OTg4LWZhN2RlMTRlOWQ5MSJ9.SpJEpZ6qsdb4y6gQySSh7yWPKL-\_5jC-7L1eTEgxBtg" \
-d '{"email": "bonfire12@gmail.com", "role": "admin", "password": "newpassword123"}'

## CREATE A SCHOOL

curl localhost:8000/api/school/create-school/ -H 'Content-Type: application/json' -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI0MDc2NjkwLCJpYXQiOjE3MjQwNzMwOTAsImp0aSI6Ijg5ZmRmN2ZkNjNjNzQzOTA5OGUyZGNjMDlmZTMwZWZiIiwidXNlcl9pZCI6ImRiYzZiYTZmLTc5ZjUtNGRhMi05OTg4LWZhN2RlMTRlOWQ5MSJ9.SpJEpZ6qsdb4y6gQySSh7yWPKL-\_5jC-7L1eTEgxBtg" \-d '{"name": "bonfire school", "address": "my first school"}'

{"id":"056c3c3c-6a9d-4d82-924e-7f81533639bd","created_at":"2024-08-19","updated_at":"2024-08-19T13:47:24.243793Z","name":"bonfire school","address":"my first school","owner":"dbc6ba6f-79f5-4da2-9988-fa7de14e9d91"}

curl localhost:8000/api/school/create-grade/ -H 'Content-Type: application/json' -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI0MDc2NjkwLCJpYXQiOjE3MjQwNzMwOTAsImp0aSI6Ijg5ZmRmN2ZkNjNjNzQzOTA5OGUyZGNjMDlmZTMwZWZiIiwidXNlcl9pZCI6ImRiYzZiYTZmLTc5ZjUtNGRhMi05OTg4LWZhN2RlMTRlOWQ5MSJ9.SpJEpZ6qsdb4y6gQySSh7yWPKL-\_5jC-7L1eTEgxBtg" -d '{"name": "Grade 4", "description": "Grade 4 lead by me"}'

{"id":"a0a8be7f-c96e-4c95-853d-c41f5ec19635","created_at":"2024-08-19","updated_at":"2024-08-19T14:04:31.289046Z","name":"Grade 4","description":"Grade 4 lead by me","school":"056c3c3c-6a9d-4d82-924e-7f81533639bd"}

### CREATE A FEE

curl "http://localhost:8000/api/school/create-fee/2cb7351f-e606-4ada-a2c5-1286e9399188/" -H 'Content-Type: application/json' -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI0MDgxMDE4LCJpYXQiOjE3MjQwNzMwOTAsImp0aSI6IjdiZThjMWUyMTFiMzRhYTk5MTA4YTQ5YTA2NGVmNzgzIiwidXNlcl9pZCI6ImRiYzZiYTZmLTc5ZjUtNGRhMi05OTg4LWZhN2RlMTRlOWQ5MSJ9.Yn5qiFdQxvLdxY1VyZR68fjuHL3txCI34jf3C95VDVo" -d '{"name": "Grade 3 Sc fee", "total_amount": 12000,
"from_date": "2024-06-06", "to_date": "2024-07-05"}'

{
"id": "4690e9c3-724a-4b1c-bafe-1b618a52a5f9",
"from_date": "2024-06-06 00:00",
"to_date": "2024-07-05 00:00",
"created_at": "2024-08-19T14:27:45.621455Z",
"updated_at": "2024-08-19T14:27:45.621491Z",
"name": "Grade 3 Sc fee",
"total_amount": "12000.00",
"total_paid": "0.00",
"grade": "2cb7351f-e606-4ada-a2c5-1286e9399188",
"students": []
}


# make a payment
 curl -X POST http://localhost:8000/api/school/create-payment/ -H "Content-Type: application/json" -d '{"student": "83c33d8a-456b-4f83-81fa-ebf6361218ea", "fee": "aa048e34-9602-4712-871d-165a6b2cc960", "amount": "210.00", "date_paid": "2024-08-29", "payment_method": "mpesa", "reference_number": "1234"}

 