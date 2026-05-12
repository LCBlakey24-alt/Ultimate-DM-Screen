# Full Run Overview (2026-05-12)

## Scope
- Repository health review for backend + frontend.
- Test/build smoke run in current environment.

## Commands Run
1. `cd backend && pytest -q`
2. `cd frontend && npm run -s test -- --watchAll=false`
3. `cd frontend && npm run -s build`

## Result Snapshot
- Backend tests are currently blocked in this environment by missing Python dependency resolution (`ModuleNotFoundError: No module named 'requests'`).
- Frontend unit tests passed.
- Frontend production build passed.

## Minimal Fix List (merge-ready, not implementing all prior suggestions)

### Must-do now
1. **Unblock backend tests reproducibly**
   - Ensure backend virtualenv/bootstrap installs `backend/requirements.txt` before running pytest.
2. **Add one standard verify command**
   - Provide a single project command/script for: backend tests + frontend tests + frontend build.
3. **Add CI gate to run the same verify command**
   - Keep local/CI behavior aligned.

### Nice-to-have later (deferred)
- Expand frontend tests to critical flows.
- Add bundle-size budgets.
- Add vulnerability scanning (`pip-audit`, `npm audit`/OSV).
- Refactor larger frontend/backend modules opportunistically.

## Practical To-Do (short)
- [ ] Add/update bootstrap steps so backend deps install consistently.
- [ ] Add `scripts/verify.sh` (or equivalent npm/make command).
- [ ] Wire CI to run verify command on PRs.
- [ ] Re-run full verify and record results.

## Note
This version intentionally narrows the previous larger recommendation set so we can merge and execute a small, high-impact plan first.
