# Control Efficacy Model v0.1

## Formula
Efficacy % =  
min(  
  (design_factor × implementation_factor × hierarchy_factor × remote_assurance_factor),  
  0.90  
)

Design factor (1–5 → normalized)  
Implementation factor (1–3 → normalized)  
Hierarchy factor (Elimination highest, PPE lowest)  
Remote assurance factor (0–1 availability)

---

## Output
- Efficacy % (0–90)
- Updated likelihood = L × (1 – efficacy)
- Updated impact if control reduces severity
