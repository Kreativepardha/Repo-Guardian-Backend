# RepoGuardian Backend

RepoGuardian is a security scanning tool for GitHub repositories that helps identify potential security vulnerabilities and code quality issues.

## Features

- Repository scanning with multiple security tools
- Asynchronous scanning process
- Tool execution tracking
- RESTful API endpoints
- Rate limiting and security headers
- Logging and error handling
- AI-powered vulnerability analysis
- Interactive security chatbot

## Tech Stack

- **Runtime**: Bun.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston
- **Validation**: Zod
- **AI Integration**: OpenAI

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── db/            # Database related code
├── middlewares/   # Express middlewares
├── routes/        # API routes
├── runners/       # Tool execution runners
├── services/      # Business logic
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── validations/   # Request validation schemas
├── app.ts         # Express app configuration
└── server.ts      # Server entry point
```

## Prerequisites

- Bun.js
- PostgreSQL
- Docker (optional)
- Security Tools:
  - Semgrep
  - Trivy
  - Gitleaks
  - Bandit
  - Safety
  - Dependency-Check
  - SonarQube

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Set up the database:
   ```bash
   bun run prisma:migrate
   ```
5. Generate Prisma client:
   ```bash
   bun run prisma:generate
   ```
6. Start the development server:
   ```bash
   bun run dev
   ```

## API Endpoints

- `POST /api/scan`: Initiate a new repository scan
- `GET /api/scan/:id`: Get scan results
- `GET /api/scan`: List all scans
- `POST /api/chat`: Interact with the security chatbot

## Security Tools

### Current Tools
1. **Semgrep**: Static analysis tool for finding bugs and security issues
2. **Trivy**: Comprehensive security scanner for containers and dependencies
3. **Gitleaks**: Detect hardcoded secrets and credentials

### Additional Tools to Implement
1. **Bandit**: Python security linter
2. **Safety**: Python dependency vulnerability checker
3. **Dependency-Check**: OWASP dependency vulnerability scanner
4. **SonarQube**: Code quality and security analysis
5. **Snyk**: Dependency vulnerability scanning
6. **CodeQL**: Semantic code analysis
7. **ZAP**: Web application security scanner
8. **TruffleHog**: Advanced secrets scanning
9. **npm audit**: Node.js dependency audit
10. **cargo audit**: Rust dependency audit

## AI Integration

### Current Features
1. **Vulnerability Analysis**: AI-powered analysis of scan results
2. **Result Summarization**: Concise summaries of security findings
3. **Risk Assessment**: AI-based risk scoring and prioritization

### Planned AI Features
1. **Security Chatbot**
   - Interactive Q&A about security findings
   - Tool recommendations
   - Vulnerability explanations
   - Best practice suggestions

2. **Code Review Assistant**
   - Automated code review suggestions
   - Security pattern detection
   - Code improvement recommendations
   - Architecture analysis

3. **Threat Intelligence**
   - Real-time vulnerability database integration
   - CVE correlation
   - Exploit probability assessment
   - Remediation guidance

4. **Anomaly Detection**
   - Unusual code patterns
   - Suspicious dependency changes
   - Security configuration drift
   - Access pattern analysis

### AI Chatbot Implementation

The security chatbot can be implemented using the following prompt template:

```
You are a security expert assistant for the RepoGuardian tool. Your role is to:

1. Explain security vulnerabilities and their implications
2. Provide remediation guidance
3. Recommend relevant security tools
4. Answer questions about security best practices
5. Help interpret scan results

When responding:
- Be clear and concise
- Provide code examples when relevant
- Reference security standards and best practices
- Include links to official documentation
- Prioritize practical, actionable advice

Context: {scan_results}
Question: {user_question}
```

## Current Inefficiencies and Improvement Suggestions

### Code Improvements

1. **Error Handling**
   - Implement more specific error types
   - Add better error messages and codes
   - Create a centralized error handling system

2. **Database**
   - Add database indexes for frequently queried fields
   - Implement database connection pooling
   - Add database migration rollback support

3. **Performance**
   - Implement caching for scan results
   - Add request compression
   - Optimize database queries

4. **Testing**
   - Add unit tests
   - Implement integration tests
   - Add API endpoint tests
   - Set up CI/CD pipeline

5. **Security**
   - Implement API key authentication
   - Add request validation for all endpoints
   - Implement rate limiting per user/IP
   - Add input sanitization

### Future Features

1. **Enhanced Scanning**
   - Support for more security tools
   - Custom tool configuration
   - Parallel tool execution
   - Real-time scan progress updates

2. **User Management**
   - User authentication and authorization
   - User roles and permissions
   - Team management
   - API key management

3. **Reporting**
   - Detailed scan reports
   - Export functionality (PDF, CSV)
   - Historical trend analysis
   - Custom report templates

4. **Integration**
   - GitHub webhook integration
   - CI/CD pipeline integration
   - Slack/Teams notifications
   - Email notifications

5. **Monitoring**
   - System health monitoring
   - Performance metrics
   - Usage statistics
   - Alert system

6. **UI/UX**
   - Web dashboard
   - Real-time scan visualization
   - Interactive reports
   - Custom dashboard widgets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Add your license here]

## Support

[Add support information here]
