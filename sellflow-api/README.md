app/
├── Http/
│   ├── Controllers/
│   │   └── Api/
│   │       └── Auth/
│   │           ├── AuthController.php
│   │           └── ProfileController.php
│   │
│   ├── Requests/
│   │   └── Auth/
│   │       ├── RegisterRequest.php
│   │       ├── LoginRequest.php
│   │       ├── UpdateProfileRequest.php
│   │       └── UpdatePasswordRequest.php
│   │
│   └── Resources/
│       └── UserResource.php
│
├── Models/
│   └── User.php
│
├── Services/
│   └── Auth/
│       └── AuthService.php
│
routes/
└── api.php