# Reference Type Entities and Repositories

## ✅ Files Created

### Entities (2 files)

1. **RefProviderType.kt**
   - Maps to `ref_provider_type` table
   - Fields:
     - `id: Long?` - Primary key (auto-generated)
     - `typeName: String` - Type name (e.g., "General Practitioner", "Cardiologist")

2. **RefWorkerType.kt**
   - Maps to `ref_worker_type` table
   - Fields:
     - `id: Long?` - Primary key (auto-generated)
     - `typeName: String` - Type name (e.g., "Nurse", "Receptionist")

### Repositories (2 files)

1. **RefProviderTypeRepository.kt**
   - Extends `JpaRepository<RefProviderType, Long>`
   - No custom methods (as per standard pattern)

2. **RefWorkerTypeRepository.kt**
   - Extends `JpaRepository<RefWorkerType, Long>`
   - No custom methods (as per standard pattern)

## Database Tables

These entities map to the reference tables created in `V1_0_2__refrence_type.sql`:

### ref_provider_type
Contains 8 predefined provider types:
1. General Practitioner
2. Pediatrician
3. Cardiologist
4. Dermatologist
5. Orthopedic Surgeon
6. Psychiatrist
7. Dentist
8. Ophthalmologist

### ref_worker_type
Contains 8 predefined worker types:
1. Nurse
2. Receptionist
3. Medical Assistant
4. Lab Technician
5. Pharmacist
6. Physical Therapist
7. Administrative Staff
8. Billing Specialist

## File Locations

```
api/src/main/kotlin/com/sc/clinic/
├── entity/
│   ├── RefProviderType.kt
│   └── RefWorkerType.kt
└── repository/
    ├── RefProviderTypeRepository.kt
    └── RefWorkerTypeRepository.kt
```

## Build Status

✅ **BUILD SUCCESSFUL** - All files compile without errors

## Usage Example

### Fetching all provider types:
```kotlin
@Autowired
lateinit var refProviderTypeRepository: RefProviderTypeRepository

fun getAllProviderTypes(): List<RefProviderType> {
    return refProviderTypeRepository.findAll()
}
```

### Fetching all worker types:
```kotlin
@Autowired
lateinit var refWorkerTypeRepository: RefWorkerTypeRepository

fun getAllWorkerTypes(): List<RefWorkerType> {
    return refWorkerTypeRepository.findAll()
}
```

## Notes

- These are reference/lookup tables with predefined values
- The data is inserted via the Flyway migration script
- IDs are auto-generated starting from 1
- Additional types can be added via custom repository methods or directly in the database

