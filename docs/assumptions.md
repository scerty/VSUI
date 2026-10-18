# Assumptions and Limitations

## Assumptions

- Angular 21 standalone APIs and the generated Vitest integration are the repository toolchain.
- Features are trusted, in-process TypeScript code. The registry is not a sandbox and does not load arbitrary remote code.
- Contribution IDs are lowercase dot or dash segments and are unique within their contribution category. Feature IDs are also unique while registered.
- Browser local storage is an acceptable default for the small workspace snapshot. Applications with sensitive or multi-user state should provide their own `WorkspaceStorage`.
- Workspace restoration is best effort. Unknown editor descriptors are skipped; malformed snapshots are removed and the application starts with an empty editor area.
- Layout restoration is best effort. Layout snapshots are versioned and scoped to the application/workspace pair; malformed snapshots are removed, and disabled configured regions always remain hidden.
- Layout persistence and editor persistence use separate storage records. The layout service stores only serializable layout and selection IDs, not feature or domain data.
- Theme preference is a separate browser-local setting. It defaults to dark, can be switched to light from the shell, and does not affect feature or domain state.
- The consuming application owns domain state, authorization, server data, and data-changing confirmation rules.

## Known Limitations

- Editor groups, split layouts, pinned tabs, and preview tabs are not implemented yet. The editor request/descriptor split leaves room to add them without changing feature registration.
- The shell supports selecting among registered bottom panels, but full panel lifecycle and global context-menu rendering are deferred.
- Layout keybindings have a shell dispatcher, but duplicate-key conflict resolution remains deferred. Command registration still owns the authoritative shortcut metadata.
- Search integration points are represented by the command palette only. Global search and Quick Open need separate provider contracts.
- AI is an optional future capability. No external provider, API key, network request, or model execution is included.
- The initial design is a professional desktop workbench. On narrow screens the primary sidebar becomes an overlay and remains resizable, while the secondary sidebar and its splitter are hidden; this is responsive adaptation rather than a mobile-first page layout.

## Verification Record

Commands run in this workspace:

```text
npm run test -- --watch=false
  5 files passed; 17 tests passed

npm run build
  exit status 0; production build succeeded; no warnings
```

The Angular component style budget is 15 kB warning / 16 kB error to account for the complete shell styling, both color palettes, the grouped sidebar wrapper, and optional-region responsive rules.