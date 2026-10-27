# Onyx SDK

Use `lib/onyx/client.ts` and `lib/onyx/tasks.ts`; see `docs/onyx.md`.
Keep all SDK use server-only and lazy, with no browser credentials or logging of
raw SDK errors. Validate input and stored records; bound calls and pagination.
Use insert for creation and filtered affected counts for update/delete.
Do not claim transactions/CAS, retry mutations, or auto-publish schemas.
Authorize before private reads and every mutation in an application endpoint.
