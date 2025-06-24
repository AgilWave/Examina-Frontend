# Exam Participants and Answers API

This module provides NestJS controllers and services for managing exam participants and their answers in an online examination system.

## Features

- **Exam Participation Management**: Join exams, track connection status, and manage participant sessions
- **Answer Submission**: Submit individual and bulk exam answers with validation
- **Real-time Statistics**: Get comprehensive statistics for exams and questions
- **Role-based Access Control**: Secure endpoints with JWT authentication and role-based permissions

## API Endpoints

### Exam Participants

#### Join Exam
```http
POST /exam-participants/join
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "examId": 1,
  "studentId": 123
}
```

**Response:**
```json
{
  "isSuccessful": true,
  "message": "Successfully joined exam",
  "content": {
    "id": 1,
    "exam": { "id": 1 },
    "student": { "id": 123 },
    "isConnected": true,
    "joinedAt": "2024-01-15T10:30:00.000Z",
    "disconnectedAt": null
  }
}
```

#### Update Connection Status
```http
PATCH /exam-participants/connection-status
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "examId": 1,
  "studentId": 123,
  "isConnected": false
}
```

#### Get Participant Status
```http
GET /exam-participants/status/{examId}/{studentId}
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "isSuccessful": true,
  "content": {
    "hasJoined": true,
    "joinedAt": "2024-01-15T10:30:00.000Z",
    "isConnected": true,
    "disconnectedAt": null
  }
}
```

#### Get Exam Participants
```http
GET /exam-participants/{examId}/participants
Authorization: Bearer <jwt_token>
```

#### Get Connected Participants
```http
GET /exam-participants/{examId}/connected-participants
Authorization: Bearer <jwt_token>
```

#### Get Participant Count
```http
GET /exam-participants/{examId}/participant-count
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "isSuccessful": true,
  "content": {
    "total": 25,
    "connected": 18
  }
}
```

### Exam Answers

#### Submit Exam Answers
```http
POST /exam-answers/submit
Authorization: Bearer <jwt_token>
Content-Type: application/json

[
  {
    "examId": 1,
    "questionId": 5,
    "answer": "The answer is B",
    "timeTaken": 120,
    "isCorrect": true
  },
  {
    "examId": 1,
    "questionId": 6,
    "answer": "JSON stringified answer",
    "timeTaken": 180
  }
]
```

#### Bulk Submit Answers
```http
POST /exam-answers/bulk-submit
Authorization: Bearer <jwt_token>
Content-Type: application/json

[
  {
    "examId": 1,
    "questionId": 5,
    "answer": "Answer 1",
    "timeTaken": 120
  },
  {
    "examId": 1,
    "questionId": 6,
    "answer": "Answer 2",
    "timeTaken": 180
  }
]
```

#### Get Exam Answers
```http
GET /exam-answers/exam/{examId}
Authorization: Bearer <jwt_token>
```

#### Get Student Exam Answers
```http
GET /exam-answers/exam/{examId}/student/{studentId}
Authorization: Bearer <jwt_token>
```

#### Get Question Answers
```http
GET /exam-answers/question/{questionId}
Authorization: Bearer <jwt_token>
```

#### Get Exam Statistics
```http
GET /exam-answers/statistics/exam/{examId}
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "isSuccessful": true,
  "content": {
    "totalAnswers": 150,
    "correctAnswers": 120,
    "averageTimeTaken": 145.5,
    "questionBreakdown": [
      {
        "questionId": 1,
        "questionText": "What is the capital of France?",
        "totalAnswers": 25,
        "correctAnswers": 20,
        "averageTimeTaken": 120.5
      }
    ]
  }
}
```

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- NestJS framework
- TypeORM
- PostgreSQL/MySQL database

### Installation

1. Install dependencies:
```bash
npm install @nestjs/common @nestjs/typeorm typeorm class-validator class-transformer
```

2. Import the module in your app module:
```typescript
import { ExamParticipantsModule } from './exam-participants/exam-participants.module';

@Module({
  imports: [
    ExamParticipantsModule,
    // ... other modules
  ],
})
export class AppModule {}
```

3. Configure TypeORM entities in your database configuration:
```typescript
// database.config.ts
export const databaseConfig = {
  entities: [
    ExamParticipant,
    ExamAnswer,
    Exams,
    Student,
    ExamQuestion,
  ],
  // ... other config
};
```

## Entity Relationships

### ExamParticipant Entity
```typescript
@Entity('exam_participants')
export class ExamParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Exams, (exam) => exam.examParticipants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'examId' })
  exam: Exams;

  @ManyToOne(() => Student, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ default: true })
  isConnected: boolean;

  @CreateDateColumn()
  joinedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  disconnectedAt: Date;
}
```

### ExamAnswer Entity
```typescript
@Entity('exam_answers')
export class ExamAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Exams, (exam) => exam.examAnswers, { onDelete: 'CASCADE' })
  exam: Exams;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  student: Student;

  @ManyToOne(() => ExamQuestion, (question) => question.examAnswers, {
    onDelete: 'CASCADE',
  })
  question: ExamQuestion;

  @Column('text')
  answer: string;

  @Column({ nullable: true })
  timeTaken: number;

  @Column({ nullable: true })
  isCorrect: boolean;

  @CreateDateColumn()
  submittedAt: Date;
}
```

## Authentication and Authorization

All endpoints require JWT authentication and role-based authorization:

- **STUDENT**: Can join exams, submit answers, and view their own answers
- **LECTURER**: Can view exam statistics and participant information
- **ADMIN**: Full access to all endpoints

## Error Handling

The API returns consistent error responses:

```json
{
  "isSuccessful": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing JWT)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

## Validation

All input data is validated using class-validator decorators:

- `@IsNumber()`: Ensures numeric values
- `@IsPositive()`: Ensures positive numbers
- `@IsString()`: Ensures string values
- `@IsBoolean()`: Ensures boolean values
- `@IsOptional()`: Makes fields optional
- `@Min(0)`: Ensures minimum value

## Usage Examples

### Frontend Integration

```typescript
// Join exam
const joinExam = async (examId: number, studentId: number) => {
  const response = await fetch('/exam-participants/join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ examId, studentId }),
  });
  return response.json();
};

// Submit answers
const submitAnswers = async (answers: ExamAnswerSubmission[]) => {
  const response = await fetch('/exam-answers/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`,
    },
    body: JSON.stringify(answers),
  });
  return response.json();
};

// Check participant status
const checkStatus = async (examId: number, studentId: number) => {
  const response = await fetch(`/exam-participants/status/${examId}/${studentId}`, {
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
    },
  });
  return response.json();
};
```

## Testing

Run the tests:
```bash
npm run test
npm run test:e2e
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
