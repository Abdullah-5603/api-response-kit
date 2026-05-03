# Contributing to api-response-kit

Thank you for your interest in contributing! This document provides guidelines and instructions for getting started.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md). We are committed to providing a welcoming and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 11

### Local Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/api-response-kit.git
   cd api-response-kit
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development Workflow

1. Create a feature branch:

   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes and run tests:

   ```bash
   npm run test:watch
   ```

3. Format and lint your code:

   ```bash
   npm run format
   npm run lint
   npm run typecheck
   ```

4. Run the full test suite before committing:

   ```bash
   npm run test
   npm run build
   ```

5. Commit with a clear message:

   ```bash
   git commit -m "feat: add new feature"
   ```

6. Push to your fork and open a Pull Request

## Pull Request Guidelines

- Keep PRs focused on a single concern
- Include a clear description of what the PR does
- Reference related issues (e.g., "Closes #42")
- All tests must pass before merging
- Code must pass linting and type checking
- Add tests for new functionality
- Update documentation if needed

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation changes
- `refactor:` Code refactoring without feature changes
- `test:` Adding or updating tests
- `chore:` Dependency updates, build config, etc.

Example:

```
feat: add custom response builder

Implement a new custom() function that allows fine-grained control
over response payloads, addressing the use cases discussed in #123.
```

## Testing

- Write tests for all new features and bug fixes
- Maintain test coverage at existing levels
- Run `npm run test` to execute the full suite
- Run `npm run test:watch` for interactive development

## Available Scripts

- `npm run clean` - Remove build artifacts
- `npm run build` - Build the project
- `npm run test` - Run tests once
- `npm run test:watch` - Watch mode for development
- `npm run lint` - Check code formatting
- `npm run format` - Auto-format code
- `npm run typecheck` - TypeScript type checking

## Reporting Issues

When reporting bugs, please include:

- A clear title and description
- Steps to reproduce
- Expected vs. actual behavior
- Node.js and npm versions
- Any error messages or logs

## Questions?

Feel free to open an issue or reach out to the maintainers. We welcome all levels of contribution!

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.
