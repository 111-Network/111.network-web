# Contributing Guide

## Development Workflow

### Spec-Driven Development

1. **Read the spec** - Before implementing, read the relevant specification in `docs/specs/`
2. **Review ADRs** - Check `docs/adr/` for architectural decisions
3. **Implement** - Build the feature according to the spec
4. **Test** - Write tests to verify the implementation matches the spec
5. **Document** - Update documentation if needed

### Git Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Submit a pull request

### Code Standards

- Follow TypeScript best practices
- Use ESLint and Prettier (configuration TBD)
- Write self-documenting code
- Add comments for complex logic
- Keep components small and focused
- **shadcn/ui**: When using shadcn/ui components, refer to [shadcnblocks.com](https://docs.shadcnblocks.com/) for block patterns

### Pull Request Process

1. Ensure your code follows the project's code standards
2. Update documentation if your changes affect it
3. Write a clear PR description
4. Reference related issues or specs
5. Request review from maintainers

## Before You Start

- Read the main project README
- Review the architecture documentation
- Understand the spec-driven development approach
- Check existing ADRs for relevant decisions

## Getting Help

- Open an issue for questions or problems
- Check existing documentation first
- Review closed issues for similar questions

## Security & Safety Practices

### Code Safety
- **No secrets in code**: Never commit API keys, tokens, passwords, or credentials
- **Environment variables**: Use `.env.local` for sensitive data (already in `.gitignore`)
- **Input validation**: Always validate and sanitize user inputs
- **Dependency security**: Review dependencies before adding, run `npm audit` regularly

### Contribution Safety
- **Security review**: All PRs require security-focused code review
- **Vulnerability reporting**: Report security issues via GitHub Security Advisories (private)
- **Public code assumption**: Assume all code is public - no hardcoded secrets
- **Secure defaults**: Use secure configurations and practices by default