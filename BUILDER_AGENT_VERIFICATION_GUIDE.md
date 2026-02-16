# Builder Agent Copilot Discovery - Verification Guide

**Purpose**: Manual verification guide to confirm all 5 builder agents appear in GitHub Copilot's custom agent picker after cache refresh.

**Issue**: APGI-cmy/maturion-isms#231  
**Priority**: CRITICAL (ui-builder blocks MAT frontend)  
**Estimated Cache Refresh Time**: 5-10 minutes after PR merge

---

## Pre-Verification Checklist

- [x] All 5 builder agent files fixed (frontmatter 107-127 lines → 13 lines)
- [x] ID consistency verified (filename = frontmatter.id = agent.id)
- [x] Changes committed and pushed to PR
- [ ] PR merged to main branch (required for Copilot to pick up changes)
- [ ] Wait 5-10 minutes for Copilot agent cache refresh

---

## Verification Steps

### Step 1: Access GitHub Copilot Agent Picker

**Via VS Code:**
1. Open VS Code with GitHub Copilot extension installed
2. Open a file in the maturion-isms repository
3. Type `@` in the chat or editor
4. Look for custom agents in the dropdown list

**Via GitHub UI:**
1. Navigate to https://github.com/APGI-cmy/maturion-isms
2. Click on "Code" tab
3. Look for Copilot agent options (if available in UI)

### Step 2: Verify All 5 Builders Appear

Check for the following agents in the custom agent picker:

#### CRITICAL Priority
- [ ] `@ui-builder` - UI Builder for Maturion ISMS modules

#### High Priority
- [ ] `@api-builder` - API Builder for Maturion ISMS modules
- [ ] `@qa-builder` - QA Builder for Maturion ISMS modules
- [ ] `@integration-builder` - Integration Builder for Maturion ISMS modules
- [ ] `@schema-builder` - Schema Builder for Maturion ISMS modules

### Step 3: Test Invocation (ui-builder - CRITICAL)

Try invoking the ui-builder agent:

```
@ui-builder help
```

**Expected Response**:
- Agent responds with its mission and capabilities
- No errors or "agent not found" messages

### Step 4: Quick Functionality Test

Ask ui-builder a simple question:

```
@ui-builder What are your responsibilities for MAT frontend implementation?
```

**Expected Response**:
- Agent describes its role in React frontend components
- Mentions WCAG 2.1 AA compliance
- References Shadcn/UI + Tailwind CSS stack
- Confirms understanding of Wave 1-4 tasks

### Step 5: Verify Other Builders (If Time Permits)

Test each of the other 4 builders with simple invocations:

```
@api-builder What is your role in MAT implementation?
@qa-builder What testing responsibilities do you have?
@integration-builder What integration tasks are you responsible for?
@schema-builder What database work do you handle?
```

---

## Verification Results Template

### Discovery Status

| Agent | Appears in Picker | Invokable | Functioning | Notes |
|-------|-------------------|-----------|-------------|-------|
| `@ui-builder` | ⬜ YES / ⬜ NO | ⬜ YES / ⬜ NO | ⬜ YES / ⬜ NO | |
| `@api-builder` | ⬜ YES / ⬜ NO | ⬜ YES / ⬜ NO | ⬜ YES / ⬜ NO | |
| `@qa-builder` | ⬜ YES / ⬜ NO | ⬜ YES / ⬜ NO | ⬜ YES / ⬜ NO | |
| `@integration-builder` | ⬜ YES / ⬜ NO | ⬜ YES / ⬜ NO | ⬜ YES / ⬜ NO | |
| `@schema-builder` | ⬜ YES / ⬜ NO | ⬜ YES / ⬜ NO | ⬜ YES / ⬜ NO | |

### Overall Status

⬜ **SUCCESS**: All 5 builders discovered, invokable, and functioning  
⬜ **PARTIAL**: Some builders discovered, others missing  
⬜ **FAILURE**: No builders discovered or not functioning

### Notes

*Document any issues, error messages, or unexpected behavior here.*

---

## Troubleshooting

### Issue: Agents Still Not Appearing

**Possible Causes:**
1. Cache not yet refreshed (wait another 5-10 minutes)
2. PR not yet merged to main branch
3. GitHub Copilot not updated to latest version
4. Repository permissions issue

**Actions:**
1. Verify PR is merged: https://github.com/APGI-cmy/maturion-isms/pulls
2. Check Copilot version: VS Code > Extensions > GitHub Copilot > Check for updates
3. Restart VS Code / GitHub UI
4. Clear Copilot cache (if option available)
5. Check GitHub Copilot logs for errors

### Issue: Agents Appear But Not Invokable

**Possible Causes:**
1. Malformed agent file (YAML parsing error)
2. Missing required fields in frontmatter
3. Encoding issues (non-UTF8 characters)

**Actions:**
1. Validate YAML frontmatter: https://www.yamllint.com/
2. Check for blank lines before `---` opening delimiter
3. Verify file encoding is UTF-8
4. Review agent file for syntax errors

### Issue: Agents Invokable But Not Functioning

**Possible Causes:**
1. Missing or incorrect agent configuration in markdown body
2. Broken references to governance files
3. Invalid scope or capabilities configuration

**Actions:**
1. Review "## Extended Agent Configuration" section
2. Verify governance file paths exist and are accessible
3. Check for typos in capability declarations
4. Compare against working foreman-isms-agent.md

---

## Success Criteria

### Minimum Success (Unblock Issue #220)
- ✅ `@ui-builder` appears in Copilot agent picker
- ✅ `@ui-builder` is invokable
- ✅ `@ui-builder` responds correctly to basic queries

### Full Success (Complete Issue #231)
- ✅ All 5 builders appear in Copilot agent picker
- ✅ All 5 builders are invokable
- ✅ All 5 builders respond correctly to basic queries
- ✅ No errors or warnings in Copilot logs

---

## Post-Verification Actions

### If Verification Successful

1. Update `BUILDER_AGENT_COPILOT_DISCOVERY_FIX_EVIDENCE.md` with verification results
2. Close Issue #231 with confirmation comment
3. Unblock Issue #220 (MAT Frontend Remediation)
4. Notify CS2 of successful agent discovery restoration

### If Verification Fails

1. Document exact failure symptoms in this guide
2. Capture screenshots of Copilot agent picker (with/without builders)
3. Collect Copilot logs if available
4. Create escalation report for CS2
5. Consider additional debugging:
   - Check GitHub Copilot service status
   - Verify repository settings
   - Test with alternate Copilot clients
   - Review GitHub Copilot agent registration logs (if accessible)

---

## Reference

**Working Example**: foreman-isms-agent.md (Issue #229)  
**Pattern Applied**: Minimal frontmatter (<20 lines), extended config in markdown body  
**Authority**: LIVING_AGENT_SYSTEM.md v6.2.0, CodexAdvisor-agent  
**Evidence Report**: BUILDER_AGENT_COPILOT_DISCOVERY_FIX_EVIDENCE.md

---

**Status**: Ready for manual verification after PR merge + cache refresh  
**Next Step**: Wait for PR merge, then execute verification steps above  
**Contact**: Escalate to CS2 if verification fails
