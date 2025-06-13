# RepoGuardian

RepoGuardian is a comprehensive security scanning tool that helps identify vulnerabilities, secrets, and security issues in your codebase. It integrates multiple security tools and provides AI-powered analysis of the findings.

## Features

### Security Scanning Tools

1. **Static Analysis Security Testing (SAST)**
   - Semgrep: Advanced static analysis for finding security vulnerabilities
   - SonarQube: Code quality and security analysis with detailed metrics

2. **Secret Scanning**
   - Gitleaks: Detects hardcoded secrets and credentials in code

3. **Vulnerability Scanning**
   - Trivy: Comprehensive vulnerability scanner for containers and dependencies
   - Snyk: Dependency and container scanning with detailed remediation advice

4. **Web Security**
   - Nikto: Web server scanner for identifying web vulnerabilities

5. **Container Security**
   - Clair: Container image analysis for vulnerabilities
   - Anchore: Deep container security analysis with policy enforcement

### AI-Powered Analysis

- Automated vulnerability analysis using GPT-3.5
- Risk level assessment (Critical/High/Medium/Low)
- Detailed impact analysis
- Step-by-step remediation recommendations

### Database Integration

- PostgreSQL database for storing scan results
- Detailed tracking of scan status and tool runs
- Historical analysis of security findings

## Prerequisites

- Node.js 16+
- PostgreSQL
- Docker (for container scanning)
- The following security tools installed:
  - Semgrep
  - Trivy
  - Gitleaks
  - SonarQube Scanner
  - Nikto
  - Snyk CLI
  - Clair Scanner
  - Anchore CLI

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/repoguardian

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# SonarQube
SONAR_HOST_URL=http://localhost:9000
SONAR_TOKEN=your_sonar_token

# Web Scanning
TARGET_URL=http://localhost:8080

# Container Scanning
CLAIR_HOST_IP=localhost
ANCHORE_ENGINE_URL=http://localhost:8228
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/repo-guardian.git
   cd repo-guardian
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## Usage

1. Start the server:
   ```bash
   npm start
   ```

2. Run a full security scan:
   ```bash
   curl -X POST http://localhost:3000/api/scan \
     -H "Content-Type: application/json" \
     -d '{"targetPath": "/path/to/your/repo"}'
   ```

3. Check scan status:
   ```bash
   curl http://localhost:3000/api/scan/{scanId}
   ```

## API Endpoints

- `POST /api/scan`: Start a new security scan
- `GET /api/scan/{scanId}`: Get scan results
- `GET /api/scan/{scanId}/tools`: Get individual tool results
- `GET /api/scan/{scanId}/analysis`: Get AI analysis of findings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- All the security tools and their maintainers
- OpenAI for providing the AI analysis capabilities
- The open-source community for their contributions
