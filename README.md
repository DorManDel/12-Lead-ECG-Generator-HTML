# ECG 12 Lead Generator

Educational 12-lead ECG simulator built with HTML, CSS, and JavaScript.

> ⚠️ This project is for educational and visual simulation purposes only.  
> It is not a medical device and must not be used for diagnosis.

---

## Project Goal

The goal of this project is to generate printable ECG-style sheets with:

- 12-lead ECG layout
- Rhythm profiles
- Adjustable heart rate
- Adjustable noise
- Page settings
- Dark mode
- Print support
- Local preference saving
- Future support for more ECG conditions

---

## Folder Structure

```txt
ECG_Generator/
│
├── index.html
├── style.css
├── script.js
│
├── assets/
│   ├── favicon.svg
│   └── preview.svg
│
├── data/
│   └── rhythm-profiles.js
│
└── js/
    ├── ecg-grid.js
    ├── ecg-leads.js
    ├── ecg-wave.js
    ├── ecg-rhythms.js
    ├── ecg-renderer.js
    └── ecg-print.js

```

---

## Main FIles

```
index.html
```

Holds the page structure:

```
Controls card
ECG canvas
Settings popup
Script loading order
style.css
```

Holds the full visual design:

```
Layout
Dark mode
Responsive behavior
Settings modal
Print mode
script.js
```

Main controller:

```
DOM references
Preferences
ECG drawing
UI events
LocalStorage
Watermark
data/rhythm-profiles.js
```

Stores ECG rhythm profiles.

Examples:

```
Normal Sinus Rhythm
Bradycardia
Tachycardia
AFib
PVC
Hyperkalemia look
Anterior STEMI look
Current Features
Live ECG redraw
Settings popup
Dark mode
Page scale slider
Signal height slider
Grid opacity slider
LocalStorage preferences
Reset to default
Print support
Watermark
Roadmap
Add real ECG sample-based profiles
Add Inferior MI
Add Anterior MI
Add LBBB / RBBB
Add LVH / RVH
Add WPW
Add AV blocks
Add VT / VF / Asystole
Add PDF export
Add debugger panel
```

---


# ECG Sample Notes

This file tracks the real ECG examples used as references.

### reference list includes the following rhythm/condition labels:

```
1. Sinus 120
2. Sinus 80
3. Sinus 50
4. Inferior MI 80
5. Inferior MI 80
6. Inferior MI 80
7. Anterior MI 80
8. Anterior MI 80
9. Anterior MI 80
10. Anterior MI late 80
11. LBBB 75
12. RBBB 100
13. LVH 90
14. WPW 70
15. WPW 100
16. Sinus + R.A.D 60
17. RVH 90
18. Prolong QT 70
19. 1° AV block 70
20. 2° AV block type 1 (Wenckebach) 3:2 60
21. 2° AV block type 1 4:3 60
22. 2° AV block type 1 5:4 60
23. 2° AV block type 2 (Mobitz type 2)
24. 2° AV block type 2
25. 2° AV block type 2
26. 3° Complete AV block
27. SVT 120
28. Atrial Tachycardia + Wandering Pacemaker
29. Atrial Flutter 4:1
30. Atrial Flutter 3:1
31. Atrial Flutter 2:1
32. Atrial Fibrillation
33. Atrial Fibrillation
34. Junctional Rhythm 60
35. Junctional Rhythm 150
36. Idioventricular
37. VT 140
38. VT 200
39. Torsades de Pointes
40. High Amplitude VF
41. Medium Amplitude VF
42. Low Amplitude VF / Fine VF
43. Asystole
44. Sinus 60 + Unifocal PVC
45. Sinus 60 + Coupled PVC
```

---

