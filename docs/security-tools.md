# Security Tools Integration Guide

This document outlines various security tools that can be integrated into RepoGuardian for comprehensive security scanning.

## Static Analysis Tools (SAST)

### Current Tools
1. **Semgrep**
   - Purpose: Static analysis for bugs and security issues
   - Command: `semgrep --config auto --json --quiet -o - ${targetPath}`
   - Output: JSON with findings and locations

2. **Trivy**
   - Purpose: Comprehensive security scanner
   - Command: `trivy fs --quiet --format json ${targetPath}`
   - Output: JSON with vulnerabilities and dependencies

3. **Gitleaks**
   - Purpose: Secret detection
   - Command: `gitleaks detect --source=${targetPath} --report-format json`
   - Output: JSON with detected secrets

### Additional SAST Tools

1. **Bandit** (Python)
   - Purpose: Python security linter
   - Command: `bandit -r -f json -o - ${targetPath}`
   - Features:
     - Security checks for Python code
     - Plugin system for custom rules
     - Integration with CI/CD

2. **Safety** (Python)
   - Purpose: Python dependency checker
   - Command: `safety check --json`
   - Features:
     - Checks against known vulnerabilities
     - Supports requirements.txt and Pipfile
     - Real-time vulnerability database

3. **Dependency-Check** (OWASP)
   - Purpose: Dependency vulnerability scanner
   - Command: `dependency-check --scan ${targetPath} --format JSON --out ${outputPath}`
   - Features:
     - Supports multiple languages
     - CVE database integration
     - False positive suppression

4. **SonarQube**
   - Purpose: Code quality and security
   - Command: `sonar-scanner -Dsonar.projectKey=${projectKey} -Dsonar.sources=${targetPath}`
   - Features:
     - Code quality metrics
     - Security hotspots
     - Technical debt analysis

5. **CodeQL**
   - Purpose: Semantic code analysis
   - Command: `codeql database analyze ${dbPath} ${language} --format=json`
   - Features:
     - Deep semantic analysis
     - Custom query support
     - Multiple language support

## Dynamic Analysis Tools (DAST)

1. **OWASP ZAP**
   - Purpose: Web application security scanner
   - Command: `zap-cli quick-scan --self-contained --start-options "-config api.disablekey=true" ${targetUrl}`
   - Features:
     - Active and passive scanning
     - API security testing
     - Automated scanning

2. **Nikto**
   - Purpose: Web server scanner
   - Command: `nikto -h ${targetUrl} -Format json -o ${outputFile}`
   - Features:
     - Server misconfiguration detection
     - Outdated software detection
     - Multiple server checks

## Dependency Analysis

1. **npm audit**
   - Purpose: Node.js dependency audit
   - Command: `npm audit --json`
   - Features:
     - Real-time vulnerability checks
     - Fix recommendations
     - Dependency tree analysis

2. **cargo audit**
   - Purpose: Rust dependency audit
   - Command: `cargo audit --json`
   - Features:
     - Rust crate vulnerability checking
     - Advisory database integration
     - Fix recommendations

3. **Snyk**
   - Purpose: Multi-language dependency scanning
   - Command: `snyk test --json`
   - Features:
     - Multiple language support
     - Container scanning
     - Infrastructure as Code scanning

## Container Security

1. **Clair**
   - Purpose: Container vulnerability scanner
   - Command: `clair-scanner --ip ${hostIP} --report ${reportFile} ${image}`
   - Features:
     - Layer-by-layer analysis
     - CVE database integration
     - Multiple container format support

2. **Anchore**
   - Purpose: Container image scanner
   - Command: `anchore-cli image analyze ${image}`
   - Features:
     - Policy-based scanning
     - Custom rules
     - CI/CD integration

## Infrastructure as Code (IaC)

1. **Terrascan**
   - Purpose: IaC security scanner
   - Command: `terrascan scan -i terraform -f ${targetPath} -o json`
   - Features:
     - Multiple IaC tool support
     - Policy as code
     - Compliance checking

2. **Checkov**
   - Purpose: IaC security scanner
   - Command: `checkov -d ${targetPath} -o json`
   - Features:
     - Cloud provider specific checks
     - Custom policy support
     - Graph-based analysis

## Secret Management

1. **TruffleHog**
   - Purpose: Advanced secret scanning
   - Command: `trufflehog --json ${targetPath}`
   - Features:
     - Entropy-based detection
     - Regex pattern matching
     - Git history scanning

2. **GitGuardian**
   - Purpose: Secret detection and monitoring
   - Command: `ggshield scan path ${targetPath} --json`
   - Features:
     - Real-time monitoring
     - Custom pattern support
     - Incident response

## Implementation Steps

1. **Tool Integration**
   ```typescript
   interface SecurityTool {
     name: string;
     command: string;
     parseOutput: (output: string) => any;
     validateOutput: (output: any) => boolean;
   }
   ```

2. **Configuration**
   ```typescript
   interface ToolConfig {
     enabled: boolean;
     timeout: number;
     maxOutputSize: number;
     customRules?: string[];
   }
   ```

3. **Result Processing**
   ```typescript
   interface ScanResult {
     tool: string;
     findings: any[];
     metadata: {
       scanTime: number;
       version: string;
       errors?: string[];
     };
   }
   ```

4. **Error Handling**
   ```typescript
   interface ToolError {
     tool: string;
     error: string;
     command: string;
     output?: string;
   }
   ```

## Best Practices

1. **Tool Selection**
   - Choose tools based on project requirements
   - Consider language support
   - Evaluate false positive rates
   - Check maintenance status

2. **Performance**
   - Run tools in parallel when possible
   - Implement caching for results
   - Use appropriate timeouts
   - Monitor resource usage

3. **Security**
   - Validate tool outputs
   - Sanitize command inputs
   - Implement rate limiting
   - Monitor tool updates

4. **Maintenance**
   - Regular tool updates
   - Rule set maintenance
   - Performance monitoring
   - Error tracking

## Integration Example

```typescript
async function runSecurityScan(targetPath: string, tools: SecurityTool[]) {
  const results: ScanResult[] = [];
  
  for (const tool of tools) {
    try {
      logger.info(`Starting ${tool.name} scan`, { targetPath });
      
      const output = await runCommand(tool.command);
      const parsed = tool.parseOutput(output);
      
      if (tool.validateOutput(parsed)) {
        results.push({
          tool: tool.name,
          findings: parsed,
          metadata: {
            scanTime: Date.now(),
            version: await getToolVersion(tool.name)
          }
        });
      }
    } catch (error) {
      logger.error(`${tool.name} scan failed`, { error });
    }
  }
  
  return results;
} 