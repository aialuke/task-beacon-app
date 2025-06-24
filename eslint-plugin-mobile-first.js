/**
 * ESLint Plugin: Mobile-First Interactive Feedback
 *
 * Custom ESLint plugin to prevent hover-only interaction patterns that create
 * accessibility gaps for touch device users.
 *
 * Validates that hover: states are accompanied by corresponding active: and
 * focus-visible: states for mobile-first compliance.
 */

const hoverWithoutActiveRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require active and focus-visible states for mobile users when using hover states',
      category: 'Accessibility',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          allowExceptions: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of hover patterns to exclude from checking',
          },
          requireFocusVisible: {
            type: 'boolean',
            default: true,
            description: 'Require focus-visible states for keyboard navigation',
          },
          requireActive: {
            type: 'boolean',
            default: true,
            description: 'Require active states for touch feedback',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingActiveState:
        'Hover state "{{hoverClass}}" requires corresponding "{{suggestedActive}}" for touch feedback',
      missingFocusState:
        'Hover state "{{hoverClass}}" requires corresponding "{{suggestedFocus}}" for keyboard navigation',
      missingBothStates:
        'Hover state "{{hoverClass}}" requires corresponding "{{suggestedActive}}" and "{{suggestedFocus}}" for mobile accessibility',
      hoverOnlyPattern:
        'Add corresponding active: and focus-visible: states for mobile users',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const allowExceptions = options.allowExceptions || [];
    const requireFocusVisible = options.requireFocusVisible !== false;
    const requireActive = options.requireActive !== false;

    /**
     * Extract Tailwind classes from className string
     */
    function extractClasses(classNameValue) {
      if (!classNameValue || typeof classNameValue !== 'string') {
        return [];
      }

      // Handle template literals and expressions
      const classString = classNameValue.replace(/\$\{[^}]*\}/g, '');

      return classString
        .split(/\s+/)
        .map(cls => cls.trim())
        .filter(cls => cls.length > 0);
    }

    /**
     * Check if a class is a hover state
     */
    function isHoverClass(className) {
      return (
        className.startsWith('hover:') && !className.includes('group-hover:')
      );
    }

    /**
     * Generate suggested active and focus-visible states
     */
    function generateSuggestions(hoverClass) {
      const property = hoverClass.replace('hover:', '');

      // Special cases for common patterns
      const suggestions = {
        active: `active:${property}`,
        focusVisible: `focus-visible:${property}`,
      };

      // Handle focus-within for containers
      if (property.includes('bg-') || property.includes('border-')) {
        suggestions.focusWithin = `focus-within:${property}`;
      }

      return suggestions;
    }

    /**
     * Check if required states are present
     */
    function hasRequiredStates(classes, hoverClass) {
      const suggestions = generateSuggestions(hoverClass);

      const hasActive = requireActive
        ? classes.some(
            cls => cls === suggestions.active || cls.startsWith('active:'),
          )
        : true;

      const hasFocusVisible = requireFocusVisible
        ? classes.some(
            cls =>
              cls === suggestions.focusVisible ||
              cls === suggestions.focusWithin ||
              cls.startsWith('focus-visible:') ||
              cls.startsWith('focus-within:'),
          )
        : true;

      return { hasActive, hasFocusVisible, suggestions };
    }

    /**
     * Check if hover class is in exceptions list
     */
    function isException(hoverClass) {
      return allowExceptions.some(exception => {
        if (exception.includes('*')) {
          const pattern = exception.replace(/\*/g, '.*');
          return new RegExp(`^${pattern}$`).test(hoverClass);
        }
        return hoverClass === exception;
      });
    }

    /**
     * Validate className attribute
     */
    function validateClassName(node, classNameValue) {
      const classes = extractClasses(classNameValue);
      const hoverClasses = classes.filter(isHoverClass);

      for (const hoverClass of hoverClasses) {
        if (isException(hoverClass)) {
          continue;
        }

        const { hasActive, hasFocusVisible, suggestions } = hasRequiredStates(
          classes,
          hoverClass,
        );

        if (!hasActive && !hasFocusVisible) {
          context.report({
            node,
            messageId: 'missingBothStates',
            data: {
              hoverClass,
              suggestedActive: suggestions.active,
              suggestedFocus: suggestions.focusVisible,
            },
            fix(fixer) {
              const newClasses = [
                ...classes,
                suggestions.active,
                suggestions.focusVisible,
              ].join(' ');

              // Find the className attribute and replace its value
              const classNameAttr = node.attributes.find(
                attr => attr.name && attr.name.name === 'className',
              );

              if (classNameAttr && classNameAttr.value) {
                return fixer.replaceText(
                  classNameAttr.value,
                  `"${newClasses}"`,
                );
              }
            },
          });
        } else if (!hasActive) {
          context.report({
            node,
            messageId: 'missingActiveState',
            data: {
              hoverClass,
              suggestedActive: suggestions.active,
            },
          });
        } else if (!hasFocusVisible) {
          context.report({
            node,
            messageId: 'missingFocusState',
            data: {
              hoverClass,
              suggestedFocus: suggestions.focusVisible,
            },
          });
        }
      }
    }

    return {
      JSXOpeningElement(node) {
        const classNameAttr = node.attributes.find(
          attr =>
            attr.name &&
            attr.name.name === 'className' &&
            attr.value &&
            attr.value.type === 'Literal',
        );

        if (classNameAttr) {
          validateClassName(node, classNameAttr.value.value);
        }

        // Handle template literals
        const templateClassNameAttr = node.attributes.find(
          attr =>
            attr.name &&
            attr.name.name === 'className' &&
            attr.value &&
            attr.value.type === 'JSXExpressionContainer' &&
            attr.value.expression.type === 'TemplateLiteral',
        );

        if (templateClassNameAttr) {
          const templateLiteral = templateClassNameAttr.value.expression;
          const staticParts = templateLiteral.quasis
            .map(quasi => quasi.value.raw)
            .join(' ');
          validateClassName(node, staticParts);
        }
      },
    };
  },
};

export default {
  rules: {
    'hover-without-active': hoverWithoutActiveRule,
  },
  configs: {
    recommended: {
      plugins: ['mobile-first'],
      rules: {
        'mobile-first/hover-without-active': [
          'error',
          {
            requireFocusVisible: true,
            requireActive: true,
            allowExceptions: [
              'hover:scale-*', // Scale transformations might not need active states
              'hover:rotate-*', // Rotation transformations might not need active states
            ],
          },
        ],
      },
    },
  },
};
