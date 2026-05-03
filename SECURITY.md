# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 0.1.x   | ✅        |

## Reporting a Vulnerability

If you discover a security vulnerability, please email [security concern] to the project maintainers instead of using the issue tracker. This allows us to address the issue privately before public disclosure.

Please include the following information:

- Description of the vulnerability
- Steps to reproduce (if applicable)
- Potential impact
- Suggested fix (if you have one)

## Security Considerations

This library is designed to be minimal and dependency-light. It performs basic validation on inputs and outputs serializable objects. However:

- Always validate and sanitize user input in your application layer
- Use HTTPS in production
- Keep Node.js and dependencies up to date
- Review the types and payload structures for your use case

## Dependency Security

We regularly audit dependencies for security vulnerabilities. You can check for vulnerabilities in your dependencies using:

```bash
npm audit
```

## Best Practices

When using api-response-kit:

1. **Never include sensitive information** in response payloads (passwords, tokens, PII)
2. **Validate input** before passing to response builders
3. **Use appropriate HTTP status codes** to communicate error conditions
4. **Implement rate limiting** on your API endpoints
5. **Use HTTPS** in production
6. **Keep error messages generic** to avoid leaking implementation details

## License

This security policy is provided under the MIT License.
