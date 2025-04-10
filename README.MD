# A todo to do

This is a study project for me to get to know the new tech stack better.
A simple TODO app you make after the hello world yeh.


### What's Under the hood?

This is a monorepo with everything.

|    | Tech            | Dev            | Prod              |
|----|-----------------|----------------|-------------------|
| BE | Node.js/Express | docker-compose | GCP Cloud Run     |
| FE | React           | docker-compose | GCP Cloud Storage |
| DB | MongoDB         | docker-compose | MongoDB Atlas     |


# Features

- User authentication (signup/login)
- Create, update, and delete todos
- Mark todos as complete/incomplete
- Goofy sound effects for actions
- API documentation with Swagger


## Project Structure

```
todotodo/
├── api/                 # Backend Node.js/Express API
│   ├── src/
│   │   ├── routes/     # API routes
│   │   ├── models/     # MongoDB models
│   │   ├── middleware/ # Express middleware
│   │   └── utils/      # Utility functions
│   └── Dockerfile      # Backend container config
├── web/                # Frontend React application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── services/   # API services
│   │   └── assets/     # Static assets
│   └── Dockerfile      # Frontend container config
└── docker-compose.yml  # Local d
```

## Local development

Spin up that docker-compose, stuff will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs
## Deploy

TBD

## TODO

There are todos in todo apps too haha  

 - Auth is not secure crap. We just forget the token on FE, while it still functioning. I tried to add refresh token and proper logout but decided not to spend too much time on it.
 - Linting.
 - CI/CD. Explore Github workflows and GCP build configuration more.

## Things learned
 - Basics of Node
 - Some basic docker stuff
 - Testing with jest/vitest. Nice stuff, some BDD vibes
 - Some Google Cloud Platform
 - Some code generation with more advanced multi-model context aware tools

## Lessons learned
 - Even if you have the monorepo with both BE and FE in same language, it is pain and doesn't make sense to try to manage it together like provide global linting. Just treat them as separate kingdoms.
 - AI is far from silver bullet. Stuff gets a bit bigger and more complicated - it start to struggle with context alot.