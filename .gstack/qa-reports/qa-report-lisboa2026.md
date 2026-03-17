# QA Report: Lisboa2026 Presentation
**URL:** https://www.martinmexia.com/Lisboa2026
**Date:** 2026-03-17
**Total Slides:** 11
**Console Errors:** 0
**Health Score:** 62/100

---

## 🔴 Critical Issues (Fix Before Presenting)

### 1. Slide 7 — Flowchart text breaking mid-word
Words split across lines inside SVG boxes: "Com mercial Requ est", "Developm ent", "Approv al", "B locker Reso lution". Box widths too narrow for text.
**Fix:** Increase SVG box widths or reduce font size in the integrations flow.

### 2. Slide 8 — Bottom cards clipped by viewport/nav
The three info cards ("Mandatory Milestones", "Mid-Cycle Flexibility", "Always Open to Inject") are cut off at the bottom. Descriptions truncated mid-sentence.
**Fix:** Reduce card padding/font size, or restructure layout to fit above the nav bar.

### 3. Slide 10 — Strategic Projects table overflows
The "Hotels" row is partially hidden. Possible additional rows completely invisible. No scroll indicator.
**Fix:** Reduce row height/font size, or split across two slides if content doesn't fit.

### 4. Slide 9 — Legend overlaps navigation controls
The cycle view legend ("📅 2-month cycles", "◆ Mid-cycle review") competes with the ← X/11 → nav bar at the bottom.
**Fix:** Move legend above the cycle rows or increase bottom padding.

---

## 🟡 Major Issues

### 5. Slide 6 — Matrix has no key for cell fills
Colored cells have no legend explaining what fill/opacity means. Audience can't interpret the data.
**Fix:** Add a brief key (e.g., "Filled = team owns this area").

### 6. Slide 6 — Column headers too small
Sub-column headers ("Card Payments & Integrations", "Banking Tech / WhiteLabel", etc.) are illegible at presentation scale.
**Fix:** Increase font size or abbreviate labels.

### 7. Slide 7 — Flow status labels nearly illegible
"Ready for dev", "Ready for UAT", "Passed", "AC Failed", "Released" labels are tiny colored text, hard to read.
**Fix:** Increase font size and ensure sufficient contrast.

### 8. Bold/emphasis color inconsistency
Slide 5 uses white bold for emphasis, while the same slide uses blue bold for equivalent content. Slide 8 does the same. Should pick one style.
**Fix:** Standardize — use white bold for inline emphasis within gray text.

### 9. Slide 3 — Quote mark styling
Opening/closing quotation marks appear awkwardly positioned relative to the text. "accountable" orphaned on its own line.
**Fix:** Adjust line breaks to keep "Keep each other accountable" on one line; fine-tune quote mark positioning.

---

## 🟢 Minor Issues

### 10. Top-left corner artifact
A small blue element bleeds into the top-left corner on every slide. Likely a CSS overflow from a progress bar or background orb.
**Fix:** Add `overflow: hidden` to the parent container.

### 11. Background gradient introduces non-brand colors
Subtle teal/green radial gradient visible in lower-left quadrant. Introduces colors outside the brand palette.
**Fix:** Change background orbs to brand blues only.

### 12. Emoji icons on slides 2 & 4
System-rendered emojis (🚀💎🛡️🔑⚡🎯) will display differently across platforms (Mac/Windows/projector).
**Recommendation:** Acceptable for now; consider SVG replacements for final version.

### 13. Slide 11 — No CTA or Q&A prompt
Closing slide has logo + "Thank You" + tagline only. No contact info, next steps, or "Questions?" prompt.
**Recommendation:** Add "Questions?" or a link to resources.

### 14. Navigation dots close to right edge
May clip on projectors with overscan.

---

## Score Breakdown

| Category | Score | Weight | Notes |
|----------|-------|--------|-------|
| Console | 100 | 15% | Zero errors |
| Links | 100 | 10% | Both external links work |
| Visual | 45 | 10% | Text overflow, clipping, inconsistent styling |
| Functional | 70 | 20% | Navigation works, keyboard/scroll works |
| UX | 50 | 15% | Content clipped, no legends, readability issues |
| Content | 65 | 15% | Good messaging, some grammar/orphan issues |
| Performance | 90 | 15% | Fast load, smooth animations |

**Weighted Score: 62/100**

---

## Top 3 Priorities
1. **Fix text overflow on slides 7, 8, 10** — content is literally invisible
2. **Add legends to slides 6 and 10** — data slides are uninterpretable without them
3. **Fix quote styling on slide 3** — orphaned word and quote mark positioning
