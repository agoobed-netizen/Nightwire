# Claude


Readme · MD
Nightwire
Move like a shadow. Strike like a storm. Leave no captive behind.

An original 2D action-stealth platformer that runs in the browser. You play Ren Kaida, a grapple ninja crossing the rain-soaked city of Kurogane. This repository contains the playable Mission 1 slice (Lantern District) from the Nightwire Product Requirements Document.

Play
After deploying to GitHub Pages: https://<your-username>.github.io/<repo-name>/

Locally, open index.html in a browser, or run a static server:

bash
python3 -m http.server 8000
# then visit http://localhost:8000
No build step and no dependencies.

Controls
Action	Input
Move / crouch	A, D / S
Jump, wall-jump	Space
Dash	Left Shift
Grapple and swing	Hold right mouse, release to keep momentum
Sword	Left mouse
Shuriken (breaks lamps, distracts guards)	Q
Smoke bomb	R
Rescue / takedown from behind	E
Pause	Esc
Objectives
Rescue three couriers, reach the signal roof, and defeat Sable. Stealth and combat are both viable; ranks (C, B, A, S) reward rescues, few alerts, varied techniques, and speed. Your best rank is saved in this browser only (localStorage).

Project layout
index.html   page shell
style.css    layout
app.js       game: input, physics, stealth AI, boss, rendering, save
.github/workflows/pages.yml   GitHub Pages deployment
Roadmap (from the PRD)
 Prologue and Jiro's tutorial
 Floodline Foundry and Garran
 Skyneedle Citadel and Kuroha
 Gamepad support and input remapping
 Parry, Focus, Insight upgrades, difficulty modes
 Subtitles and accessibility settings
 Remaining enemy classes (Gunner, Hound Drone, Shade, Bulwark)
 Original art, adaptive music, and character reveal videos
License
MIT. All characters, names, and code are original.



Claude finished the response
