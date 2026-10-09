# Phase A: isolated extraction evidence

The approved landing is prepared as an independent repository, without modifying or deploying the source portfolio. This is source-and-media preservation proof, not a claim of identical production rendering.

## Preservation method

- Copy current working bytes, not a historical commit or built output.
- The only landing TSX change is the literal asset namespace replacement: /professional-services/ to /agentejota-profesionales/.
- Preserve the entire component stylesheet, including every cumulative override; no pruning or redesign.
- Extract global CSS source lines 1-29 (fonts, Tailwind preflight, baseline), 64-78 (scrollbars), and 452-459 (reduced motion). Preserve each line and terminator, with one LF separator between ranges.
- Copy TypeScript and lint configuration unchanged. Their existing includes already cover only src and the new minimal Vite configuration.
- Render ProfessionalServicesLanding directly under StrictMode. No portfolio App, LanguageProvider, routes, shared components, backend, analytics, or source deployment configuration.
- HTML preserves approved Spanish title, description, keywords, Open Graph/Twitter copy, and structured data. Only favicon and social-image asset URLs become local namespaced paths. Its /src/main.tsx entry already exists and now resolves to the independent entry.
- The logo link / means this standalone home. The original external portfolio, WhatsApp draft, public contact address, Google Fonts, and schema.org references remain intentional.
- Before extraction, source eyebrow section numbers were explicitly removed by the user-authorized root task. That is the only authorized source exception; this extraction worker writes no source files. Numbered benefit/process content remains unchanged.

## Source-only import and copy allowlist

| Source path | Purpose |
| --- | --- |
| src/components/professional-services/ProfessionalServicesLanding.tsx | Component; imports React and its own stylesheet only |
| src/components/professional-services/professional-services.css | Complete page CSS |
| src/index.css | Only the three exact baseline ranges above |
| servicios-profesionales.html | HTML metadata and root shell |
| tsconfig.json, tsconfig.app.json, tsconfig.node.json | Compile settings |
| .oxlintrc.json | Lint settings |
| public/professional-services/<seven runtime files below> | Exact page media |
| public/favicon.svg | Namespaced favicon copy |
| public/agents/jota-ochoa-preview-card.png | Namespaced social-image copy |

No unused channel logos, sculpture, motion studies, local-services assets, generic images/videos folders, shared dist/node_modules, source Vite production configuration, .vercel, vercel.json, workflows, environments, or credentials are copied.

## Exact file proof

SHA-256 is recorded for both sides. The verifier also compares source and extracted bytes directly after the TSX namespace replacement. CSS and four configuration files must compare exactly.

| Target | Transformation | Source SHA-256 | Target SHA-256 |
| --- | --- | --- | --- |
| src/components/professional-services/ProfessionalServicesLanding.tsx | asset-namespace-only | a152dc2a53a85ef6e00c50d6fdcf905ec4991ddd6906eff056a47c2f3a1e9de6 | 451c0b581471655f27bd25b7e60b1f3ab403e8ff5cf9194bc09090bfdde0237a |
| src/components/professional-services/professional-services.css | exact | 3b28cd6d887eb59d57fcb2fbe7eeff1abeafb9809f9a1852109c5b49a439508b | 3b28cd6d887eb59d57fcb2fbe7eeff1abeafb9809f9a1852109c5b49a439508b |
| tsconfig.json | exact | 770b4140bbb581e2dfd9ea9946ffc9c75a1d86ba7d2db5f77c83e37cbdf9d808 | 770b4140bbb581e2dfd9ea9946ffc9c75a1d86ba7d2db5f77c83e37cbdf9d808 |
| tsconfig.app.json | exact | 8e5d12ba330e7d86409edec74b95451e0db22ee09b9426c94b5bf817571eddb0 | 8e5d12ba330e7d86409edec74b95451e0db22ee09b9426c94b5bf817571eddb0 |
| tsconfig.node.json | exact | d366cc0827139db39c61815f22491bbfda56c654354a42ad7795143d314e45e8 | d366cc0827139db39c61815f22491bbfda56c654354a42ad7795143d314e45e8 |
| .oxlintrc.json | exact | b4d344818a1e1bf43997e4744a9153c8eef770c98b58229cd86363dabb85ded4 | b4d344818a1e1bf43997e4744a9153c8eef770c98b58229cd86363dabb85ded4 |

Global baseline SHA-256: 0cbd21b5cb91e1cf48ccf2fe68626e7f5c62aa58d23ff569f96a20955af93277.

HTML target SHA-256: 82ed90d20f6a48a1423c5002940b5486c95ed1365d79407387413d5c423bf658.

## Asset size and hash manifest

Seven runtime assets total **4462831 bytes** (4.463 MB). All nine namespaced assets total **4634953 bytes**. Each source/destination hash matches; no asset is recompressed.

| Target | Bytes | SHA-256 (same on source and destination) |
| --- | ---: | --- |
| public/agentejota-profesionales/jota-growth-partner-logo.png | 130611 | cd34dbed50725fd3e0b20c0363211f529877a7e308144a5dc59897a68b82cd72 |
| public/agentejota-profesionales/professional-presence-portrait.png | 1922931 | 5f90838fdf8c6798c85255faa36515df17449593e617f6e2fa63595bd28814f8 |
| public/agentejota-profesionales/recognition-editorial-studio.png | 1658112 | 5f340e3190be6f6761ce05934f905553cd29c3d7fd5131aeecf9d7f3ef7facd1 |
| public/agentejota-profesionales/own-center/desktop.mp4 | 274325 | 3a918acd09406fadbcc81a19ec07fd4e6738a60c3770f5f6c66c46975f58f081 |
| public/agentejota-profesionales/own-center/mobile.mp4 | 257935 | fde7887f7708b41c28eab3b93197f0b965f55db52bee003c75e429b508c5de11 |
| public/agentejota-profesionales/own-center/desktop-7.30.png | 106397 | 08209f1c7252575b046be53ee999318769a7fbd38f1da72c7cb3aa87255be0e6 |
| public/agentejota-profesionales/own-center/mobile-7.30.png | 112520 | 7582dfa12f736a014b2aa821c0105a74af169cf1f3303d3ed652b90cbb7b744a |
| public/agentejota-profesionales/favicon.svg | 9522 | 61bc9a161de58248288e6905425d7180f0624c2865007b97d763fdac12043a66 |
| public/agentejota-profesionales/jota-ochoa-preview-card.png | 162600 | 7af3e8bb2d8d57a073414506267ef27c0d1a1e00b4f390c5c208063f0f58dbdc |

## Reproduce verification

~~~sh
npm ci
npm run build
npm run typecheck
npm run lint
npm run verify:isolation
npm run verify:isolation -- --source <read-only-source-repository>
~~~

The JSON manifest records hashes of all 17 source inputs. The optional source comparison proves those inputs stayed unchanged, exact CSS/config bytes, exact TSX modulo namespace, global CSS ranges, and HTML modulo media paths. Standalone verification checks all asset hashes and existence, mobile/desktop variants, import boundaries, direct entry, dependency pins, namespace exclusivity, and absence of deployment configuration.

Browser/localhost access was not attempted. Build/typecheck/lint and static source/media checks do not replace visual, keyboard, playback, WhatsApp, network, or production HTTP testing. Responsive, focus-visible, and reduced-motion logic is preserved, not newly certified.

## Production boundary and next work

The production HTTP/routing baseline belongs to Phase C and has NOT been audited or changed. No deployment, domain/DNS change, rewrite, redirect, production setting, or shared hosting linkage exists in Phase A. Canonical/page metadata does not enact routing. Final absolute social-image metadata needs a separately authorized deployment target.

The presentation video is pending. Phases B, C, and D each require separate authorization. Rollback is deletion of this independent repository only; no source files or existing production behavior need reverting.

## Verification results

- npm install --ignore-scripts --no-audit --no-fund: passed; 48 packages installed independently and package-lock.json generated.
- npm run build: passed with Vite 8.1.5; 17 modules transformed. Output: index.html 2.94 kB, CSS 173.79 kB (gzip 28.01 kB), JavaScript 211.61 kB (gzip 65.88 kB).
- npm run typecheck: passed.
- npm run lint: passed, with --deny-warnings.
- npm run verify:isolation -- --source <read-only-source-repository>: passed all preserved-file, exact-byte, reference, namespace, and source-input invariants.
- npm ls --depth=0: passed; all eleven declared package versions match the approved pins. npm also lists six optional WASM/transitive support packages as extraneous; they are confined to ignored node_modules and not upload content.
- Upload-content scan: all 27 intended files are below 10 MiB; largest is 1,922,931 bytes (portrait). No credential-pattern or private host-path match was found. This pattern scan is bounded evidence, not a comprehensive security audit.
- No browser/localhost request, Git operation, GitHub write, deployment, domain, DNS, redirect, or rewrite was performed by the extraction worker.

The first static reference check rejected the allowed local component import because its directory contains professional-services. The check was narrowed to absolute media URLs, then rerun successfully. No landing code, styling, or assets changed to satisfy this tooling fix.

## Byte-preserving Git packaging

The repository's .gitattributes uses `* -text` to disable automatic text/EOL conversion for every tracked file. This preserves the manifest's exact bytes when staging and cloning, independently of a contributor's global core.autocrlf setting. No page, CSS, media, or source bytes were changed for this packaging safeguard. Both standalone and source-comparison isolation checks passed again after adding the attribute.
