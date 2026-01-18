# 111 Network

The 111 Network is a decentralized, global messaging network that provides free, secure communication for everyone, independent of companies, governments, or infrastructure. The project enables people-powered mesh networking with features including daily public broadcast messages, private end-to-end encrypted conversations, multi-transport flexibility (Bluetooth, Wi-Fi, radios, email, satellites), and optional hardware boosters for network resilience.

## Multi-Repository Structure

This project is organized as a **multi-repository monorepo** where each repository is completely self-contained in its own subfolder. Each repository operates independently with its own:

- Technology stack (Next.js, React Native, Rust, Python, etc.)
- Programming languages (TypeScript, JavaScript, Rust, Python, etc.)
- Dependencies and package management
- Build systems and tooling
- Documentation and development practices

### ⚠️ CRITICAL FOR AI AGENTS

**Each repository in this project uses DIFFERENT technology stacks, programming languages, and coding practices. Before making any changes:**

1. **Identify which repository you are working in** - Check the current directory path
2. **Understand that repository's specific tech stack** - Read that repository's README and documentation
3. **DO NOT mix code patterns, dependencies, or practices from other repositories**
4. **Each repository is isolated** - Changes in one repository should NOT affect others
5. **Respect repository boundaries** - If you need shared code, it should be in a dedicated shared repository

**Example:** The website repository uses Next.js/TypeScript, but a future mobile repository might use React Native/Kotlin/Swift, and a hardware repository might use Rust/C. These are completely separate and should never be mixed.

## Current Repositories

- **111.network-website** - Next.js website for the project (MVP in development)

## Future Repositories

As the project grows, additional repositories will be added as subfolders:
- Protocol implementation
- Mobile applications
- Desktop applications  
- Hardware specifications
- Shared types/utilities

Each will maintain complete independence while contributing to the overall 111 Network ecosystem.

## Security & Open Source Best Practices

### Security
- **Never commit secrets**: API keys, passwords, tokens, or credentials must never be in code
- **Use environment variables**: All sensitive data via `.env` files (never committed)
- **Dependency security**: Keep dependencies updated, scan for vulnerabilities (`npm audit`)
- **Vulnerability reporting**: Report security issues responsibly via GitHub Security Advisories
- **Input validation**: Sanitize and validate all user inputs and external data

### Open Source Safety
- **Public code assumption**: Assume all code is visible - no secrets, no hardcoded credentials
- **Secure defaults**: Use secure configurations by default
- **Code review**: All contributions require security-focused code review
- **Dependency review**: Review dependencies before adding, prefer well-maintained packages

### Community Safety
- **Responsible disclosure**: Report vulnerabilities privately before public disclosure
- **Respectful communication**: Maintain professional and inclusive communication
- **Documentation**: Document security considerations in code and specs