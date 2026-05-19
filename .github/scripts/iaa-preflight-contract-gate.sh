#!/bin/bash
# IAA Pre-Flight Contract Gate
# Authority: IAA_PRE_BRIEF_PROTOCOL.md, foreman-v2-agent HALT-008

set -euo pipefail

WAVE_TASKS_PATH="${WAVE_TASKS_PATH:-.agent-workspace/foreman-v2/personal/wave-current-tasks.md}"
ASSURANCE_DIR="${ASSURANCE_DIR:-.agent-admin/assurance}"
PR_NUMBER="${PR_NUMBER:-}"
BASE_SHA="${BASE_SHA:-}"
HEAD_SHA="${HEAD_SHA:-}"
FAIL=false

fail() {
  echo "❌ $1"
  FAIL=true
}

has_field() {
  local key="$1"
  local file="$2"
  grep -Eq "^${key}[[:space:]]*:" "$file" 2>/dev/null
}

field_value() {
  local key="$1"
  local file="$2"
  grep -E "^${key}[[:space:]]*:" "$file" 2>/dev/null | head -1 | sed -E 's/^[^:]+:[[:space:]]*//'
}

field_equals() {
  local key="$1"
  local expected="$2"
  local file="$3"
  local actual
  actual="$(field_value "$key" "$file")"
  [ "$actual" = "$expected" ]
}

section_items_count() {
  local section="$1"
  local file="$2"
  awk -v section="$section" '
    $0 ~ "^" section ":" { in_section=1; next }
    in_section && $0 ~ "^[A-Z0-9_]+:[[:space:]]*" { in_section=0 }
    in_section && $0 ~ "^[[:space:]]*-[[:space:]]+" { count++ }
    END { print count+0 }
  ' "$file"
}

is_impl_or_build_file() {
  local file="$1"
  [[ "$file" =~ ^(modules|apps|packages)/ ]] || \
  [[ "$file" =~ ^supabase/ ]] || \
  [[ "$file" =~ ^\.github/workflows/ ]] || \
  [[ "$file" =~ ^\.github/scripts/ ]]
}

echo "=== IAA Pre-Flight Contract Gate ==="
echo "Wave tasks : $WAVE_TASKS_PATH"
echo "Assurance  : $ASSURANCE_DIR"
echo ""

if [ ! -f "$WAVE_TASKS_PATH" ]; then
  fail "Missing wave-current-tasks.md: $WAVE_TASKS_PATH"
fi

ACTIVE_PREBRIEF_PATH=""
if [ -f "$WAVE_TASKS_PATH" ]; then
  PREBRIEF_FIELD=$(grep -E "^(iaa_prebrief_path|iaa_wave_record_path):" "$WAVE_TASKS_PATH" | head -1 || true)
  if [ -z "$PREBRIEF_FIELD" ]; then
    fail "Neither iaa_prebrief_path nor iaa_wave_record_path is declared in wave-current-tasks.md"
  else
    ACTIVE_PREBRIEF_PATH=$(echo "$PREBRIEF_FIELD" | sed -E 's/^[^:]+:[[:space:]]*//')
    if [ -z "$ACTIVE_PREBRIEF_PATH" ] || [[ "$ACTIVE_PREBRIEF_PATH" =~ ^PENDING$ ]]; then
      fail "Active pre-flight path is empty or PENDING in wave-current-tasks.md"
    elif [ ! -f "$ACTIVE_PREBRIEF_PATH" ]; then
      fail "Active pre-flight path does not exist: $ACTIVE_PREBRIEF_PATH"
    elif [[ "$ACTIVE_PREBRIEF_PATH" == *"/archive/"* ]]; then
      fail "Active pre-flight path points to archived evidence: $ACTIVE_PREBRIEF_PATH"
    fi
  fi
fi

if [ -n "$ACTIVE_PREBRIEF_PATH" ] && [ -f "$ACTIVE_PREBRIEF_PATH" ]; then
  if grep -qi "SUPERSEDED" "$ACTIVE_PREBRIEF_PATH" 2>/dev/null; then
    fail "Active pre-flight artifact is marked SUPERSEDED: $ACTIVE_PREBRIEF_PATH"
  fi
  if [[ ! "$ACTIVE_PREBRIEF_PATH" =~ ^\.agent-admin/assurance/iaa-(prebrief|wave-record)- ]]; then
    fail "Active pre-flight artifact must be in .agent-admin/assurance and named iaa-prebrief-* or iaa-wave-record-*"
  fi

  # Pre-flight contract section and required keys
  grep -Eq "^IAA_PREFLIGHT_BRIEF([[:space:]]*|:)" "$ACTIVE_PREBRIEF_PATH" || fail "Missing IAA_PREFLIGHT_BRIEF section marker"
  has_field "EXPECTED_QA_SCOPE" "$ACTIVE_PREBRIEF_PATH" || fail "Missing EXPECTED_QA_SCOPE in active pre-flight brief"
  has_field "EXPECTED_FAILURE_MODES" "$ACTIVE_PREBRIEF_PATH" || fail "Missing EXPECTED_FAILURE_MODES in active pre-flight brief"
  has_field "FOREMAN_INSTRUCTIONS" "$ACTIVE_PREBRIEF_PATH" || fail "Missing FOREMAN_INSTRUCTIONS in active pre-flight brief"
  has_field "IAA_WILL_QA" "$ACTIVE_PREBRIEF_PATH" || fail "Missing IAA_WILL_QA in active pre-flight brief"
  grep -Eq "^RESULT:[[:space:]]*PREFLIGHT_BRIEF_COMPLETE([[:space:]]*)$" "$ACTIVE_PREBRIEF_PATH" || fail "Missing RESULT: PREFLIGHT_BRIEF_COMPLETE"

  # Section substance checks (avoid thin/generic stubs)
  for section in EXPECTED_QA_SCOPE EXPECTED_FAILURE_MODES FOREMAN_INSTRUCTIONS IAA_WILL_QA; do
    count="$(section_items_count "$section" "$ACTIVE_PREBRIEF_PATH")"
    if [ "${count}" -lt 1 ]; then
      fail "${section} must include at least one bullet item"
    fi
  done

  # Relevance checks
  if [ -n "$PR_NUMBER" ]; then
    grep -Eq "^PR:[[:space:]]*(#)?${PR_NUMBER}([[:space:]]|$)" "$ACTIVE_PREBRIEF_PATH" || fail "Pre-flight brief PR field does not match PR #${PR_NUMBER}"
  fi
  if [ -n "$HEAD_SHA" ]; then
    grep -Eq "^CURRENT_HEAD_SHA:[[:space:]]*(${HEAD_SHA}|${HEAD_SHA:0:12}|CURRENT_HEAD)([[:space:]]|$)" "$ACTIVE_PREBRIEF_PATH" || fail "Pre-flight brief CURRENT_HEAD_SHA is not current-head relevant"
  fi
  grep -Eq "^WAVE:[[:space:]]*[^[:space:]].*$" "$ACTIVE_PREBRIEF_PATH" || fail "Pre-flight brief WAVE field is missing/empty"
  if ! field_equals "WAVE_TASKS_PATH" "$WAVE_TASKS_PATH" "$ACTIVE_PREBRIEF_PATH"; then
    fail "Pre-flight brief WAVE_TASKS_PATH does not match active wave-current-tasks path"
  fi

  # Foreman pre-flight consumption evidence (wave-current-tasks)
  if [ -f "$WAVE_TASKS_PATH" ]; then
    grep -Eq "^IAA_PREFLIGHT_BRIEF_REVIEWED:[[:space:]]*yes$" "$WAVE_TASKS_PATH" || fail "wave-current-tasks.md must declare IAA_PREFLIGHT_BRIEF_REVIEWED: yes"
    if ! field_equals "IAA_PREFLIGHT_BRIEF_PATH" "$ACTIVE_PREBRIEF_PATH" "$WAVE_TASKS_PATH"; then
      fail "wave-current-tasks.md IAA_PREFLIGHT_BRIEF_PATH must match active pre-flight artifact"
    fi
    PREFLIGHT_SHA_OR_TS="$(field_value "IAA_PREFLIGHT_BRIEF_SHA_OR_TIMESTAMP" "$WAVE_TASKS_PATH")"
    if [ -z "$PREFLIGHT_SHA_OR_TS" ] || [[ "$PREFLIGHT_SHA_OR_TS" =~ ^(PENDING|TBD|N/A)$ ]]; then
      fail "wave-current-tasks.md must provide IAA_PREFLIGHT_BRIEF_SHA_OR_TIMESTAMP"
    fi
    grep -Eq "^FOREMAN_CONSUMED_PREFLIGHT_BEFORE_IMPLEMENTATION:[[:space:]]*yes$" "$WAVE_TASKS_PATH" || fail "wave-current-tasks.md must declare FOREMAN_CONSUMED_PREFLIGHT_BEFORE_IMPLEMENTATION: yes"
    if ! grep -Eq "^BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE:[[:space:]]*(yes|no|not_required)$" "$WAVE_TASKS_PATH"; then
      fail "wave-current-tasks.md BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE must be yes|no|not_required"
    fi
  fi
fi

# Pre-flight before implementation/build changes (where determinable)
if [ -n "$BASE_SHA" ] && [ -n "$HEAD_SHA" ] && [ -n "$ACTIVE_PREBRIEF_PATH" ] && [ -f "$ACTIVE_PREBRIEF_PATH" ]; then
  if ! CHANGED_FILES="$(git diff --name-only "$BASE_SHA...$HEAD_SHA" 2>/dev/null)"; then
    if ! CHANGED_FILES="$(git diff --name-only "$BASE_SHA" "$HEAD_SHA" 2>/dev/null)"; then
      fail "Cannot compute changed files for BASE_SHA=${BASE_SHA} HEAD_SHA=${HEAD_SHA}"
    fi
  fi
  HAS_IMPL_OR_BUILD=false
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    if is_impl_or_build_file "$f"; then
      HAS_IMPL_OR_BUILD=true
      break
    fi
  done <<< "$CHANGED_FILES"

  if [ "$HAS_IMPL_OR_BUILD" = true ]; then
    if [ -f "$WAVE_TASKS_PATH" ]; then
      if grep -Eq "^BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE:[[:space:]]*not_required$" "$WAVE_TASKS_PATH"; then
        fail "BUILDER_DELEGATION_INCLUDES_PREFLIGHT_SCOPE cannot be not_required when implementation/build files changed"
      fi
    else
      fail "wave-current-tasks.md is required to evaluate builder delegation pre-flight scope"
    fi

    PREBRIEF_FIRST_TOUCH_IN_RANGE_TS="$(git log --reverse --format='%ct' "$BASE_SHA..$HEAD_SHA" -- "$ACTIVE_PREBRIEF_PATH" 2>/dev/null | head -1 || true)"
    PREBRIEF_LAST_BEFORE_RANGE_TS="$(git log -1 --format='%ct' "$BASE_SHA" -- "$ACTIVE_PREBRIEF_PATH" 2>/dev/null || true)"
    [ -z "$PREBRIEF_FIRST_TOUCH_IN_RANGE_TS" ] && PREBRIEF_FIRST_TOUCH_IN_RANGE_TS="$PREBRIEF_LAST_BEFORE_RANGE_TS"

    mapfile -t IMPL_OR_BUILD_FILES < <(while IFS= read -r f; do [ -n "$f" ] && is_impl_or_build_file "$f" && echo "$f"; done <<< "$CHANGED_FILES")
    FIRST_IMPL_TS=""
    if [ "${#IMPL_OR_BUILD_FILES[@]}" -gt 0 ]; then
      FIRST_IMPL_TS="$(git log --reverse --format='%ct' "$BASE_SHA..$HEAD_SHA" -- "${IMPL_OR_BUILD_FILES[@]}" 2>/dev/null | head -1 || true)"
    fi

    if [ -n "$PREBRIEF_FIRST_TOUCH_IN_RANGE_TS" ] && [ -n "$FIRST_IMPL_TS" ] && [ "$PREBRIEF_FIRST_TOUCH_IN_RANGE_TS" -gt "$FIRST_IMPL_TS" ]; then
      fail "Active pre-flight brief appears to be committed after implementation/build changes began"
    fi
  fi
fi

echo ""
if [ "$FAIL" = true ]; then
  echo "❌ FAIL — IAA Pre-Flight Contract Gate"
  exit 1
fi

echo "✅ PASS — IAA Pre-Flight Contract Gate"
