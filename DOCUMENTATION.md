# Documentation and organizer access

## Separate audiences

| Material | Intended location | Audience |
|---|---|---|
| README and Player Guide | Current checkout; participant handout if desired | Players and organizers |
| Full Word guides and technical solutions | Encrypted offline staff vault, outside the lab | Authorized staff |
| Unlock key | Separate trusted device or password manager | Authorized staff |
| Decrypted staff documents | Trusted organizer device outside the app | Authorized staff |
| Source, tests, builders, history and CI evidence | Access-restricted organizer repository | Authorized staff |

The player-facing application does not host the staff vault or implement a staff-document login. The original lab intentionally permits file reading and command execution, so storing protected answers on that host would defeat an app-level document password.

## Staff workflow

1. Keep the encrypted vault on organizer-only encrypted storage or USB.
2. Keep its unlock key separately. Do not commit either file or copy it into the app checkout.
3. Open the vault locally and verify/unlock with the separate passphrase. It requires no CosmoLog or website login.
4. Download and extract staff documents only on a trusted organizer device outside the lab directory.
5. Lock/close the vault after use and handle downloaded plaintext copies separately. Locking the page does not erase those files.
6. Verify a second protected backup before removing any working copy. Lost keys cannot be recovered from the encrypted vault.

## GitHub exposure

A visibility change is an administrator action in repository Settings, General, Danger Zone, Change repository visibility. Keep the repository private and grant access only to authorized organizers. The GitHub connector used for file changes cannot perform that administrator action directly.

Deleting files from the current branch does not erase old commits, old branches, downloaded archives, clones, screenshots, or cached copies. Private visibility restricts access to the repository; it cannot recall material already obtained by someone else. Ordinary deletion and history rewriting do not guarantee permanent erasure.

Before an event, review repository visibility, collaborators, branches, releases, workflow logs/artifacts, old handouts, and shared links. Provide competitors the app URL and Player Guide. Do not provide source or host access when the event depends on answer secrecy. The original fixed flags remain unchanged in this version.

## Deployment boundary

The Dockerfile copies only the runtime modules, public challenge assets, configuration challenge directory, and required flag file after installing dependencies. It does not copy documentation, tests, source-control history, workflows, offline staff vaults, or keys. The public directory remains a bind mount; never place private files there on the host.

The runtime still contains challenge flags needed by the application, and its intentional vulnerabilities remain. This change protects staff documentation through separation; it does not turn the lab into an isolated secret store.

## References

- GitHub visibility: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility
- GitHub sensitive-data/history handling: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
