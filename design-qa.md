**Comparison Target**

- Source visual truth: `/var/folders/n5/_dk53kqn0k37zy6ld30_yvf00000gn/T/codex-file-preview-5gdPqM/кейс.png` and `/var/folders/n5/_dk53kqn0k37zy6ld30_yvf00000gn/T/codex-file-preview-abVsIE/image(7).png`.
- Implementation: `http://127.0.0.1:4173/projects/open-gorod-new.html`.
- Browser-rendered screenshots: `/Users/aleksandragrisina/Documents/Codex/2026-10-29/referenced-chatgpt-conversation-this-is-an/work/open-gorod-top-final.png`, `/Users/aleksandragrisina/Documents/Codex/2026-10-29/referenced-chatgpt-conversation-this-is-an/work/open-gorod-problem-final.png`, and `/Users/aleksandragrisina/Documents/Codex/2026-10-29/referenced-chatgpt-conversation-this-is-an/work/open-gorod-mobile-analysis.png`.
- Comparison boards: `/Users/aleksandragrisina/Documents/Codex/2026-10-29/referenced-chatgpt-conversation-this-is-an/work/comparison-top-final.png` and `/Users/aleksandragrisina/Documents/Codex/2026-10-29/referenced-chatgpt-conversation-this-is-an/work/comparison-problem-final.png`.
- Desktop viewport: 1344 × 1000 CSS px at 1× density. Source images are 1343 × 2048 px and 1332 × 1290 px; both were normalized to 1344 px width and cropped to the same 1344 × 1000 comparison region.
- Mobile viewport: 390 × 844 CSS px at 1× density. Implementation screenshot is 390 × 844 px.
- States: top of case, scrolled “Проблема и цель” state, active scrollspy navigation, and mobile “Анализ и гипотезы” fallback.

**Findings**

- No actionable P0, P1, or P2 differences remain.
- Fonts and typography: Montserrat weights, hierarchy, line height, and muted metadata styling closely match the source. Copy wraps naturally at desktop and mobile widths.
- Spacing and layout rhythm: the two-column frame, sidebar-to-content ratio, rounded white gallery card, cover crop, and sticky section rhythm match the source. The implementation intentionally keeps the existing case section cards within the new right column.
- Colors and visual tokens: the gray gallery background, white frame, purple active state, muted gray metadata, and existing green case imagery remain consistent with the source and the portfolio palette.
- Image quality and asset fidelity: all visible imagery uses the existing source assets; crops remain sharp and no placeholders or code-drawn substitutes were introduced.
- Copy and content: project category, title, description, role, year, tools, section labels, problem, goal, and existing case content are present and ordered to match the references.
- Focused comparison was required for the sidebar transition and problem/goal ordering; both are verified in the scrolled comparison board.

**Comparison History**

- Iteration 1: a tall viewport caused the section navigation to appear before the user had left the cover. The switch condition was changed from a viewport-relative threshold to the cover’s actual exit position. Post-fix evidence shows project details at the top and the navigation only after scrolling.
- Iteration 2: the problem text inherited the older narrow two-column layout. The section was changed to a full-width editorial stack inside the right column. Post-fix evidence shows readable line lengths aligned with the reference.
- Iteration 3: the goal originally appeared after the image. It was moved directly below the problem statement, matching the source reading order.
- Iteration 4: the inherited mobile analysis layout created horizontal overflow and empty space. It was changed to a vertical image-and-notes stack. The final mobile page has a 390 px scroll width in a 390 px viewport.
- Iteration 5: the desktop project summary ended 91.9 px below the cover. The sidebar height now follows the rendered cover height; the two bottom edges align exactly at the 1344 × 1000 verification viewport.
- Iteration 6: the first case section started 200.5 px above the sticky navigation. Its desktop top spacing now follows the measured first navigation item position; the two top edges differ by only 0.1 px. Mobile keeps the original 32 px section padding.
- Iteration 7: hypotheses, solution, and result content used an extra horizontal inset compared with the user-flow block. Their desktop left edges now share the same measured coordinate, with no horizontal overflow.
- Iteration 8: solution-card images inherited a fixed-height `cover` crop. Both green-card images now preserve their full source aspect ratio, while the final hand-and-phone mockup is larger and ends with 105.6 px of breathing room above the section edge.
- Iteration 9: the analysis screenshot was limited to 388 px by a legacy global image rule. The limit is removed for this case; the screenshot renders at 88% of the analysis stage, while callouts use smaller 11.2 px type and narrower cards.
- Iteration 10: the result card inherited the zero horizontal padding used to align white sections, leaving its text flush against the green edge. The card now has an 80 px desktop inset and uses the same 20 px heading and 17.28 px body scale as the surrounding case narrative.
- Iteration 11: both solution-card images now open in an accessible native-dialog lightbox. Mouse click, Enter/Space, close button, backdrop click, and Escape are supported; desktop and 390 px mobile views have no horizontal overflow.

**Primary Interactions Tested**

- Sidebar details transition to sticky section navigation after the cover.
- Scrollspy updates the active section while scrolling.
- Navigation links smoothly move to the requested section.
- Mobile navigation becomes a horizontally scrollable fixed bar.
- Desktop and mobile pages have no horizontal viewport overflow.
- Browser console warnings and errors: none.

**Follow-up Polish**

- P3: the back control is a pill rather than the source’s text-and-arrow treatment, keeping it consistent with the portfolio’s existing rounded controls.
- P3: the cover is slightly shorter in the normalized desktop crop, preserving the existing image aspect ratio and showing the next section sooner.

**Implementation Checklist**

- [x] First-screen project metadata sidebar.
- [x] Large right-side cover.
- [x] Sticky scrollspy navigation after the cover.
- [x] Existing case sections retained in the right column.
- [x] Mobile fallback verified.
- [x] No other case templates changed.

final result: passed
