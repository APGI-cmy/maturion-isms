# QA-to-Red — Criteria Deferred Routing Wave

Date: 2026-05-28

## Red tests defined

1. `T-MMM-S6-CRIT-201`  
   Given AI reply includes wrapper text + JSON array, criteria parser must still extract array and render generated list.

2. `T-MMM-S6-CRIT-202`  
   Given user-added criterion semantically maps to another MPS, save must persist into deferred target MPS.

3. `T-MMM-S6-CRIT-203`  
   Given multiple accepted criteria across MPS rows, modal-level `Accept / Submit` must persist all accepted rows and close modal.

4. `T-MMM-S6-CRIT-204`  
   Generated criteria row must display source tag (`uploaded_source|ai_completion|subject_knowledge|user_added|deferred_user`).

5. `T-MMM-S6-CRIT-205`  
   In `VERBATIM` mode, if no processed mode-source document exists (completed + chunked), intent/criteria generation must block with an explicit source-readiness notification.

6. `T-MMM-S6-CRIT-206`  
   In `VERBATIM` mode, intent generation must resolve from `mmm_proposed_mps.intent_statement` for the matching domain/MPS; generic AI/fallback wording is not allowed when verbatim source exists.

## Green criteria

- All four tests pass in B4 criteria workflow suite.
- No generic fallback shown when parse-only formatting variance occurs.
- Verbatim source-readiness is now a hard gate for Intent/Criteria generation.
- Verbatim intent generation now prioritizes harvested framework-proposed intent statements.
