# Contributing to Nurse-D

Thank you for your interest in contributing to Nurse-D! This document provides guidelines and instructions for contributing.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please treat all contributors with respect.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/hermz580/nurse-d/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, versions)

### Suggesting Features

1. Check existing [Issues](https://github.com/hermz580/nurse-d/issues) for similar suggestions
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Potential implementation approach

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow the code style guidelines
   - Add tests for new functionality
   - Update documentation as needed
4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**
   - Provide a clear description of changes
   - Reference related issues
   - Include screenshots for UI changes

## Development Setup

### Prerequisites
- Node.js 20+
- Python 3.11+
- PostgreSQL 15+
- Docker (optional but recommended)

### Setup Instructions

1. Clone the repository
   ```bash
   git clone https://github.com/hermz580/nurse-d.git
   cd nurse-d
   ```

2. Install dependencies
   ```bash
   # Backend
   cd backend && npm install

   # Frontend
   cd ../frontend && npm install

   # AI Service
   cd ../ai-service && pip install -r requirements.txt
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run with Docker
   ```bash
   docker-compose up -d
   ```

## Code Style

### JavaScript/TypeScript
- Use ESLint and Prettier configurations
- Follow Airbnb style guide
- Use TypeScript for type safety
- Write meaningful variable and function names

### Python
- Follow PEP 8
- Use type hints
- Document functions with docstrings

### Git Commit Messages
- Use present tense ("Add feature" not "Added feature")
- First line: brief summary (50 chars or less)
- Add detailed description if needed
- Reference issues and PRs

## Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

### AI Service
```bash
cd ai-service
pytest
```

## Documentation

- Update README.md for significant changes
- Add JSDoc/docstrings for new functions
- Update API documentation for endpoint changes
- Include inline comments for complex logic

## Review Process

1. Automated checks must pass (CI/CD)
2. Code review by maintainers
3. Address feedback and requested changes
4. Approval from at least one maintainer
5. Merge to main branch

## Community

- [GitHub Discussions](https://github.com/hermz580/nurse-d/discussions) - Questions and discussions
- [Issues](https://github.com/hermz580/nurse-d/issues) - Bug reports and feature requests

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to reach out via GitHub Issues or Discussions if you have any questions!

---

**Thank you for contributing to Nurse-D!**
