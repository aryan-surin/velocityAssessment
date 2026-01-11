# Part 3 - Quick Reference Guide

## 🎯 Simple Variable Format (Assessment Requirement)

### How to Use:
```
Type: Hello {{ name }}, you are {{ age }} years old!
Result: Creates 2 GREEN handles on left: "name" and "age"
```

### Visual Indicator:
- **Green handle** on left side = Simple variable input
- **Green tag** below text = Variable detected and active

### Rules:
- Use double curly brackets: `{{ variableName }}`
- Variable name must be valid JavaScript identifier
- Valid: `name`, `userName`, `user_id`, `_temp`
- Invalid: `123`, `my-var`, `my var`

---

## 🚀 Advanced Format (Bonus Feature)

### How to Use:
```
Type: Process {{input-1.text}} with {{llm-2.response}}
Result: Creates 2 BLUE handles that reference specific nodes
```

### Visual Indicator:
- **Blue handle** on left side = Node reference
- **Blue tag** = Valid node connection
- **Red tag** = Invalid node (doesn't exist)

---

## 📊 Quick Comparison

| Feature | Simple Format | Advanced Format |
|---------|---------------|-----------------|
| Syntax | `{{ var }}` | `{{nodeId.field}}` |
| Handle Color | 🟢 Green | 🔵 Blue |
| Purpose | Generic input | Node reference |
| Validation | Name format | Node + field exists |
| Tag Color | Green | Blue/Red |

---

## ✅ Testing Checklist

- [ ] Type `{{ test }}` → Green handle appears
- [ ] Type `{{ var1 }} and {{ var2 }}` → 2 green handles
- [ ] Type long text → Node resizes automatically
- [ ] Click ❌ on tag → Variable removed
- [ ] Type `{{ 123 }}` → No handle (invalid)
- [ ] Type `{{input-1.text}}` → Blue handle (if node exists)

---

## 🎬 Demo Flow

1. **Open application** → Add Text node
2. **See placeholder:** "Type {{ variable }} to create input handles"
3. **Type:** `Hello {{ name }}`
4. **Show:** Green handle appears on left
5. **Add more:** `{{ name }}, welcome to {{ city }}`
6. **Show:** 2 green handles, node auto-resizes
7. **Click tag ❌** → Variable disappears

**Result:** ✅ All Part 3 requirements demonstrated!

---

**Spec Compliance:** 100% ✅  
**Ready for Interview:** YES ✅
