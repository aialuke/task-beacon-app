# Documentation Contributing Guidelines

**Last Updated**: December 2024  
**Review Date**: March 2025

## 📋 Overview

This document provides guidelines for contributing to and maintaining the Task Beacon App
documentation. Following these standards ensures consistency, accuracy, and maintainability across
all project documentation.

## 🗂️ Documentation Structure

### **Directory Organization**

```
docs/
├── CONTRIBUTING.md          # This file - documentation guidelines
├── documentation-review-summary.md  # Documentation audit history
├── ai-rules.md             # AI assistant behavior rules
├── architecture/           # Architecture documentation
│   ├── error-handling-patterns.md
│   └── data-access-layer-design.md
├── adr/                    # Architecture Decision Records (empty - ready for use)
└── performance/            # Performance documentation
    ├── bundle-analysis.md
    ├── profiling-guide.md
    ├── optimization-guidelines.md
    └── code-review-standards.md
```

### **File Naming Conventions**

- Use **kebab-case** for file names: `error-handling-patterns.md`
- Use **descriptive names** that clearly indicate content: `optimization-guidelines.md`
- Include **version numbers** for versioned docs: `api-v2-reference.md`
- Use **date prefixes** for time-sensitive reports: `2024-12-performance-audit.md`

## ✍️ Writing Standards

### **Document Structure**

Every documentation file should include:

```markdown
# Document Title

**Last Updated**: [Date]  
**Next Review**: [Date]  
**Status**: [Active/Draft/Deprecated]

## Overview

Brief description of the document's purpose and scope.

## Content Sections

Organized sections with clear headings.

## Maintenance Notes

Information about when and how to update this document.
```

### **Content Guidelines**

1. **Accuracy First**: All information must be verified against the current codebase
2. **Clear Language**: Use simple, direct language avoiding jargon when possible
3. **Actionable Content**: Provide specific, actionable guidance rather than abstract concepts
4. **Current Examples**: Use examples from the actual codebase, not hypothetical scenarios
5. **Consistent Formatting**: Follow the established markdown formatting patterns

### **Code Examples**

- Use **actual file paths** from the project: `src/components/ui/Button.tsx`
- Include **line numbers** for specific references: `lines 25-30`
- Provide **complete examples** that can be copy-pasted when appropriate
- Use **syntax highlighting** with proper language tags

## 🔄 Review and Update Process

### **Regular Review Schedule**

- **Monthly**: Performance documentation (metrics may change)
- **Quarterly**: Architecture documentation (structural changes)
- **Yearly**: Contribution guidelines (process improvements)

### **Triggered Updates**

Documentation must be updated when:

- **Major refactoring** affects documented patterns
- **New features** are added that require documentation
- **Dependencies change** that affect documented procedures
- **Performance metrics** change significantly

### **Update Checklist**

Before submitting documentation changes:

- [ ] Verify all code examples compile and run
- [ ] Check all file paths and references are current
- [ ] Update the "Last Updated" date
- [ ] Remove any completed TODO items
- [ ] Validate external links are still active
- [ ] Test any documented procedures

## 📝 Adding New Documentation

### **Before Creating New Docs**

1. **Check existing documentation** - avoid duplication
2. **Determine proper location** - follow directory structure
3. **Consider audience** - developer vs. user documentation
4. **Plan maintenance** - who will keep it updated?

### **Documentation Types**

- **Architecture**: Place in `docs/architecture/`
- **Performance**: Place in `docs/performance/`
- **Decisions**: Place in `docs/adr/` (Architecture Decision Records)
- **Processes**: Place in root `docs/`

### **Required Elements**

Every new document must include:

- **Clear title** and purpose statement
- **Last updated date** and review schedule
- **Prerequisites** or context needed
- **Maintenance notes** for future updates
- **Contact information** for questions

## 🚫 Common Mistakes to Avoid

1. **Outdated Examples**: Using code examples that no longer exist
2. **Incorrect Metrics**: Documenting performance claims without verification
3. **Incomplete TODOs**: Leaving completed work marked as TODO
4. **Broken Links**: Internal references to moved or deleted files
5. **Inconsistent Formatting**: Not following established markdown patterns

## 🔧 Tools and Validation

### **Required Checks**

Before submitting documentation:

- **Markdown linting**: Ensure proper markdown syntax
- **Link validation**: Verify all internal and external links work
- **Code example testing**: Confirm all code examples are valid
- **Spell checking**: Use proper spelling and grammar

### **Recommended Tools**

- **markdownlint**: For markdown syntax validation
- **markdown-link-check**: For link validation
- **Vale**: For prose linting and style consistency

## 📊 Quality Standards

### **Acceptance Criteria**

Documentation is considered complete when:

- **Accuracy**: All information verified against current codebase
- **Completeness**: All required sections included
- **Clarity**: Clear, actionable guidance provided
- **Maintainability**: Update process and schedule defined
- **Consistency**: Follows established formatting and style

### **Review Process**

1. **Self-review**: Creator validates against this checklist
2. **Peer review**: Another team member reviews for accuracy
3. **Integration testing**: Verify documentation works with actual code
4. **Approval**: Final approval before merging

## 📞 Support

For questions about documentation:

- **Process questions**: Refer to this contributing guide
- **Technical questions**: Ask in team channels
- **Style questions**: Follow existing documentation patterns
- **Tool questions**: Check the validation tools section

---

**Remember**: Good documentation is an investment in the project's future. Take time to write
clearly, accurately, and maintainably.
