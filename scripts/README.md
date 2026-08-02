# Scripts Directory

This directory contains utility scripts and automation tools for the AIVOA-CMS project.

## Overview

The `scripts/` directory provides automation scripts for development, deployment, and maintenance tasks. These scripts help streamline common operations and ensure consistency across the project.

## Directory Structure

```
scripts/
├── src/               # TypeScript script source files
│   └── hello.ts       # Example/utility script
├── post-merge.sh      # Git post-merge hook
├── package.json       # Package configuration
└── tsconfig.json      # TypeScript configuration
```

## Available Scripts

### NPM Scripts

#### `pnpm run hello`
Runs the example hello world script.

```bash
cd scripts
pnpm run hello
```

**Output**: `Hello from @workspace/scripts`

**Purpose**: Demonstrates the script execution setup and serves as a template for new scripts.

#### `pnpm run typecheck`
Performs TypeScript type checking on all scripts.

```bash
cd scripts
pnpm run typecheck
```

**Purpose**: Ensures type safety and catches compilation errors before runtime.

### Git Hooks

#### post-merge.sh
Git post-merge hook that runs automatically after a git merge operation.

**What it does**:
1. Installs dependencies with frozen lockfile (`pnpm install --frozen-lockfile`)
2. Pushes database schema changes (`pnpm --filter db push`)

**When it runs**:
- After `git merge` command completes
- After `git pull` that results in a merge
- Automatically triggered by Git

**Purpose**: Ensures dependencies are up-to-date and database schema is synchronized after merging changes.

**Installation**:
```bash
# Make the script executable
chmod +x scripts/post-merge.sh

# Create symlink in .git/hooks/
ln -s ../../scripts/post-merge.sh .git/hooks/post-merge
```

## Script Development

### Creating New Scripts

1. Create TypeScript file in `src/` directory
2. Add script to `package.json` scripts section
3. Use `tsx` for execution (TypeScript runtime)
4. Follow existing patterns

**Example**:
```typescript
// src/new-script.ts
console.log("Running new script");
// Your script logic here
```

**Add to package.json**:
```json
{
  "scripts": {
    "new-script": "tsx ./src/new-script.ts"
  }
}
```

**Run**:
```bash
pnpm run new-script
```

### Script Guidelines

1. **Type Safety**: Use TypeScript for all scripts
2. **Error Handling**: Implement proper error handling
3. **Logging**: Provide clear console output
4. **Dependencies**: Keep dependencies minimal
5. **Documentation**: Add comments explaining script purpose

## Technology Stack

- **TypeScript**: Type-safe script development
- **tsx**: TypeScript execution engine (no build step required)
- **Node.js**: Runtime environment

## Package Configuration

### package.json

```json
{
  "name": "@workspace/scripts",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "hello": "tsx ./src/hello.ts",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "devDependencies": {
    "@types/node": "catalog:",
    "tsx": "catalog:"
  }
}
```

**Key Points**:
- Workspace package for monorepo integration
- ES modules (`"type": "module"`)
- Uses catalog dependencies for consistency
- No production dependencies (scripts only)

### tsconfig.json

TypeScript configuration for script development:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## Use Cases

### Development Automation

Scripts can automate common development tasks:

- **Dependency Management**: Install/update dependencies
- **Database Operations**: Migrations, seeding, schema updates
- **Build Processes**: Custom build steps
- **Code Quality**: Linting, formatting, type checking
- **Testing**: Test execution, coverage reports

### Deployment Automation

Scripts can streamline deployment:

- **Environment Setup**: Configure production environments
- **Asset Optimization**: Build and optimize assets
- **Database Deployments**: Run production migrations
- **Service Restarting**: Restart services after deployment
- **Health Checks**: Verify deployment success

### Maintenance Tasks

Scripts can help with maintenance:

- **Log Rotation**: Clean up old log files
- **Cache Clearing**: Clear application caches
- **Backup Operations**: Database backups, file backups
- **Monitoring**: Health checks, uptime monitoring
- **Cleanup**: Remove temporary files, old data

## Future Script Ideas

### Development Scripts

```bash
# Setup development environment
pnpm run setup:dev

# Run all linting and formatting
pnpm run lint:all

# Run type checking across all packages
pnpm run typecheck:all

# Generate API documentation
pnpm run docs:generate
```

### Database Scripts

```bash
# Reset database to clean state
pnpm run db:reset

# Seed database with test data
pnpm run db:seed

# Create database backup
pnpm run db:backup

# Restore database from backup
pnpm run db:restore
```

### Deployment Scripts

```bash
# Build all packages for production
pnpm run build:all

# Deploy to staging environment
pnpm run deploy:staging

# Deploy to production environment
pnpm run deploy:production

# Rollback deployment
pnpm run deploy:rollback
```

### Git Hooks

Additional git hooks that could be added:

- **pre-commit**: Run linting and tests before commit
- **pre-push**: Run full test suite before push
- **commit-msg**: Validate commit message format
- **pre-rebase**: Ensure clean working directory before rebase

## Execution Environment

### Running Scripts

Scripts can be run from any directory in the project:

```bash
# From scripts directory
cd scripts
pnpm run script-name

# From project root using workspace filter
pnpm --filter scripts run script-name

# From project root with full path
pnpm run --filter @workspace/scripts script-name
```

### Environment Variables

Scripts can access environment variables:

```typescript
// src/env-script.ts
const apiKey = process.env.API_KEY;
const dbUrl = process.env.DATABASE_URL;

console.log(`API Key: ${apiKey ? 'set' : 'not set'}`);
console.log(`Database URL: ${dbUrl ? 'set' : 'not set'}`);
```

### Workspace Integration

Scripts can interact with other workspace packages:

```typescript
// src/workspace-script.ts
import { exec } from 'child_process';

// Run commands in other packages
exec('pnpm --filter backend run build');
exec('pnpm --filter complaint-intake run test');
```

## Error Handling

### Best Practices

1. **Try-Catch Blocks**: Wrap operations in try-catch
2. **Exit Codes**: Use appropriate exit codes (0 for success, non-zero for failure)
3. **Error Messages**: Provide clear, actionable error messages
4. **Logging**: Log errors for debugging

**Example**:
```typescript
// src/robust-script.ts
try {
  console.log('Starting operation...');
  // Perform operation
  console.log('Operation completed successfully');
  process.exit(0);
} catch (error) {
  console.error('Operation failed:', error);
  process.exit(1);
}
```

## Testing Scripts

### Manual Testing

Test scripts manually before adding to the project:

```bash
cd scripts
pnpm run script-name
# Verify output
# Check for errors
```

### Automated Testing

Future enhancement: Add script tests

```bash
# TODO: Add script testing framework
pnpm test scripts/
```

## Troubleshooting

### Common Issues

1. **Permission Denied (post-merge.sh)**
   ```bash
   chmod +x scripts/post-merge.sh
   ```

2. **tsx Not Found**
   ```bash
   pnpm install
   ```

3. **TypeScript Errors**
   ```bash
   pnpm run typecheck
   ```

4. **Git Hook Not Running**
   - Verify symlink exists in `.git/hooks/`
   - Check script is executable
   - Ensure git hooks are enabled

## Maintenance

### Regular Updates

- Review scripts quarterly for relevance
- Update dependencies as needed
- Remove unused scripts
- Document new scripts

### Documentation

- Add comments to complex scripts
- Update this README when adding scripts
- Document script dependencies
- Provide usage examples

## Security Considerations

- **Sensitive Data**: Never hardcode API keys or passwords
- **Environment Variables**: Use environment variables for secrets
- **File Permissions**: Ensure scripts have appropriate permissions
- **Input Validation**: Validate user input in scripts
- **Error Messages**: Don't expose sensitive information in errors

## Performance Considerations

- **Execution Time**: Keep scripts fast and efficient
- **Dependencies**: Minimize external dependencies
- **Caching**: Cache results when appropriate
- **Parallelization**: Use parallel processing for independent tasks
- **Resource Usage**: Monitor memory and CPU usage

## Examples

### Environment Setup Script

```typescript
// src/setup-env.ts
import { execSync } from 'child_process';

console.log('Setting up development environment...');

try {
  execSync('pnpm install', { stdio: 'inherit' });
  execSync('pnpm --filter backend run setup', { stdio: 'inherit' });
  execSync('pnpm --filter complaint-intake run setup', { stdio: 'inherit' });
  
  console.log('Development environment setup complete!');
  process.exit(0);
} catch (error) {
  console.error('Setup failed:', error);
  process.exit(1);
}
```

### Database Migration Script

```typescript
// src/migrate-db.ts
import { execSync } from 'child_process';

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Please provide a migration name');
  process.exit(1);
}

console.log(`Running migration: ${migrationName}`);

try {
  execSync(`pnpm --filter db migrate:run ${migrationName}`, { stdio: 'inherit' });
  console.log('Migration completed successfully');
  process.exit(0);
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
```

## Related Documentation

- Main project README.md
- Package.json scripts documentation
- Git hooks documentation
- Workspace package documentation
