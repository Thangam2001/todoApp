# Security Spec: Premium Todo Pro

## 1. Data Invariants
- A Todo must have a `title` (string, max 255 chars).
- A Todo must have a `userId` that matches the authenticated user.
- A User profile can only be created/updated by the user themselves.
- `createdAt` is immutable.
- `updatedAt` must match `request.time`.

## 2. The "Dirty Dozen" Payloads (Deny cases)
1. Create Todo with someone else's `userId`.
2. Update `userId` of an existing Todo.
3. Update `createdAt` of a Todo.
4. Create Todo without a `title`.
5. Create Todo with a `title` > 255 characters.
6. Delete a Todo that doesn't belong to the user.
7. Read a Todo that doesn't belong to the user (list or get).
8. Create a User profile with a different `uid` than the auth.
9. Update a User profile's `email` (if we want it immutable).
10. Inject a massive string into a Todo `id`.
11. Update Todo status to finished and then try to update other fields (State locking).
12. Anonymous user trying to create a Todo.

## 3. Test Runner (Conceptual)
We would verify these by attempting the operations and expecting failure.
Since I don't have a full local test environment for rules here, I will rely on rigorous rule writing and the ESLint tool.
