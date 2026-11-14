# CosmoLog change log

## Current release

CosmoLog contains 15 numbered challenges and four optional side stories. The original seven web exercises retain 1,550 points. Seven forensic cases and the final operations review add separate completion tracks.

The community includes 12 fictional profiles, 92 additional posts, 39 replies, everyday station conversations, social interactions, evidence downloads, a mission journal, and a responsive operations workspace. The Docker workflow remains touch database.sqlite followed by docker-compose up -d.

## Documentation separation

| File | Change and reason |
|---|---|
| README.md | Replace mixed overview/solutions with the current release structure, startup, features, tools, and documentation access model. |
| DOCUMENTATION.md | Explain staff vault handling, source/history exposure, repository access, and deployment boundaries. |
| Guides/Player Guide.md | Provide navigation, evidence handling, completion, and session instructions without staff answers. |
| Guides/CosmoLog Setup Guide.docx, Guides/CosmoLog Hint Book.docx, Guides/CosmoLog Staff Guide.docx | Remove ordinary copies from the current repository after preserving the complete versions in an encrypted offline staff package. |
| Guides/Setup.md, Guides/Hint Book.md, Guides/Staff Guide.md | Remove answer-bearing Markdown equivalents from the current repository. |
| Dockerfile | Copy an explicit runtime allowlist, keeping documentation and organizer files out of the application image. |
| .dockerignore and .gitignore | Exclude private vaults, keys, decrypted staff files, and local organizer artifacts from build/version-control inputs. |
| .github/workflows/lab-validation.yml | Verify the running container has no staff guides, documentation tree, tests, or staff vault/key copies in its app directory. |
| tests/regression.cjs | Check removed staff-document paths are unavailable through ordinary web/static requests while keeping challenge regression coverage. |

Full historical technical notes are preserved in the offline staff package. This current-branch cleanup does not erase public Git history or copies already downloaded elsewhere. See DOCUMENTATION.md.

## Download VM and support documentation

| File | Change and reason |
|---|---|
| README.md | Lead with download/start instructions, correct login distinctions, recommended VM layouts, and links to setup/help. |
| docs/README.md | Add a wiki-style documentation hub with task-based links. |
| docs/Setup.md | Add Linux Docker/Compose preparation, Git/ZIP download, startup, tool checks, and troubleshooting. |
| docs/Virtual Machine.md | Document Parrot/Kali practice VMs, Ubuntu targets, VirtualBox plus Docker, networking, export/handoff checks, and source-access limitations. |
| docs/Access.md | Explain app, VM, GitHub, and staff-vault access separately; describe local vault opening and private access requests. |
| SUPPORT.md | Add setup questions, bug reporting, maintainer contact, and private staff-access guidance without publishing credentials. |
| .github/ISSUE_TEMPLATE/config.yml | Route general questions to Discussions and setup documentation. |
| .github/ISSUE_TEMPLATE/setup-help.yml and bug-report.yml | Add structured support forms that request useful diagnostics and exclude secrets/answers. |
| scripts/check-setup.sh | Add a non-mutating Docker/Compose/app-health and optional analysis-tool availability check. |
| CHANGELOG.md | Record the onboarding and support changes. |

No challenge, flag, point value, application dependency, or Docker startup command changed. No prebuilt OVA is shipped or claimed; VM preparation remains an organizer procedure.
