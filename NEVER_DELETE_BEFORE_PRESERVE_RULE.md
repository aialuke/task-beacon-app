# CRITICAL WORKFLOW RULE: NEVER DELETE BEFORE PRESERVE

## ⚠️ MANDATORY RULE - NO EXCEPTIONS

**NEVER delete, edit, or reduce ANY existing file content until NEW files containing that content have been successfully created and verified.**

This rule applies to ALL content reorganization, refactoring, or "streamlining" operations.

---

## The Strict Sequence - ALWAYS Follow This Order

### STEP 1: PRESERVE FIRST (ALWAYS)
✅ **Create NEW files** with the content to be moved  
✅ **Verify NEW files** contain ALL original information  
✅ **Test NEW files** can be read and accessed  
✅ **Confirm NOTHING is lost** in the new structure  

### STEP 2: REFERENCE SECOND  
✅ **Update references** to point to new files  
✅ **Test all references** work correctly  
✅ **Verify accessibility** of all preserved content  

### STEP 3: MODIFY ORIGINAL LAST (ONLY AFTER STEPS 1-2)
✅ **ONLY THEN** edit/reduce/streamline the original file  
✅ **Maintain references** to the new preserved files  
✅ **Never lose any information** from the original analysis  

---

## What This Rule Prevents

### ❌ NEVER DO THIS:
1. Edit main document to "streamline" it
2. ~~Create supporting documents afterward~~
3. ~~Lose original detailed content~~

### ✅ ALWAYS DO THIS:
1. **First**: Create comprehensive supporting documents with ALL original content
2. **Second**: Verify supporting documents are complete and accessible  
3. **Third**: Create streamlined main document that references supporting docs
4. **Last**: Only then modify/reduce original if needed

---

## Enforcement Mechanisms

### Before ANY Content Reduction/Refactoring:
```bash
# 1. MANDATORY: Create backup
cp ORIGINAL_FILE.md ORIGINAL_FILE_BACKUP_$(date +%Y%m%d_%H%M%S).md

# 2. MANDATORY: Create new supporting files FIRST
# - Create ALL new files
# - Verify ALL content preserved
# - Test ALL references work

# 3. MANDATORY: Verification checklist
echo "☐ All original content preserved in new files"
echo "☐ All new files tested and accessible" 
echo "☐ All references verified working"
echo "☐ Zero information lost in transition"

# 4. ONLY AFTER ALL ABOVE: Modify original
```

### Verification Questions (ALL must be YES):
- [ ] **Have I created ALL new files with the content I plan to remove?**
- [ ] **Have I verified ALL original information is preserved?**
- [ ] **Have I tested that ALL new files are accessible and complete?**
- [ ] **Am I certain ZERO content will be lost in this change?**
- [ ] **Are ALL references to new content working correctly?**

**If ANY answer is NO, STOP immediately and complete preservation first.**

---

## Examples of What This Rule Covers

### Document Reorganization
❌ **WRONG**: Edit main report to be "streamlined" then create supporting docs  
✅ **RIGHT**: Create complete supporting docs first, then streamline main report  

### Code Refactoring  
❌ **WRONG**: Delete old components while creating new consolidated ones  
✅ **RIGHT**: Create new consolidated components, verify they work, then remove old ones  

### File Structure Changes
❌ **WRONG**: Move/rename files while reorganizing structure  
✅ **RIGHT**: Copy to new structure, verify completeness, then remove from old structure  

### Content Extraction
❌ **WRONG**: Cut content from one file to move to another  
✅ **RIGHT**: Copy content to new file, verify it's complete, then remove from original  

---

## Consequences of Violating This Rule

- **Lost work**: Hours of valuable analysis and findings destroyed
- **Wasted time**: Having to reconstruct content from scratch  
- **Incomplete results**: Missing details that were in original work
- **User frustration**: Legitimate expectation that work is preserved
- **Quality degradation**: New content may miss nuances from original

---

## Exception Handling

**There are NO exceptions to this rule.**

Even for "simple" reorganizations or "obvious" improvements:
- **ALWAYS preserve first**
- **ALWAYS verify completeness** 
- **ALWAYS follow the strict sequence**

---

## Implementation Commitment

I commit to:
1. **Never again** delete or reduce content before preserving it completely
2. **Always follow** the PRESERVE → VERIFY → REFERENCE → MODIFY sequence
3. **Always ask** for confirmation before ANY content reduction operations
4. **Always create** backups before ANY refactoring operations
5. **Always verify** ALL content is preserved before making changes

This rule is now a **mandatory part of my workflow** with no exceptions.

---

**This mistake cost hours of valuable work and will never happen again.**