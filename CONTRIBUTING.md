# Contributing to Indian Tax Calculator

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## 📜 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) for details.

## 🤔 How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates.

**When filing a bug report, include:**
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots (if applicable)
- Your browser and OS version
- Any relevant console errors

### Suggesting Features

Feature suggestions are welcome! Please:
- Check if the feature has already been suggested
- Provide a clear description of the feature
- Explain why it would be useful
- Include mockups or examples if possible

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** with clear, descriptive commits
3. **Add tests** for new functionality
4. **Update documentation** if needed
5. **Run the test suite** to ensure all tests pass
6. **Submit a pull request** with a clear description

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/tax-calculator.git
cd tax-calculator

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 🎨 Coding Standards

### Code Style
- Use meaningful variable and function names
- Follow the existing code structure and patterns
- Keep components small and focused
- Use Tailwind CSS for styling

### Commit Messages
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor" not "Moves cursor")
- Limit the first line to 72 characters
- Reference issues and pull requests when relevant

**Format:**
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Branch Naming
- `feature/your-feature-name` - for new features
- `fix/your-bug-fix` - for bug fixes
- `docs/your-doc-change` - for documentation

## 📁 Project Structure

```
src/
├── components/       # React components
│   ├── Charts/      # Data visualization
│   ├── InputPanel/  # User input forms
│   ├── shared/      # Reusable components
│   └── ...
├── constants/        # Static configuration (tax slabs, PT rates)
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── utils/            # Calculation functions
└── __tests__/        # Unit tests
```

## ✅ Testing

- Write unit tests for new utility functions
- Test edge cases (boundary conditions, invalid inputs)
- Maintain test coverage above 70%

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm test -- --coverage
```

## 📖 Documentation

- Update README.md if you change public APIs
- Add JSDoc comments for complex functions
- Keep PROMPT.md updated for major feature additions

## 🔍 Pull Request Checklist

- [ ] Code follows the project's style guidelines
- [ ] Tests pass locally (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation updated (if applicable)
- [ ] Commit messages are clear and descriptive
- [ ] PR description explains the changes

## ❓ Questions?

Feel free to [open a discussion](https://github.com/vinitkumar/tax-calculator/discussions) for general questions.

---

Thank you for contributing! 🙌