# Architecture & Rules Specification

## Data Invariants
1. `users/{userId}`: Users can create/update their own profile. `role` is immutable or can't be set to admin by a non-admin. We will bootstrap the email `sbolotnikov@gmail.com` as admin directly within rules if needed, or by manual db intervention. Better yet: rules-based bootstrapping of admin email. Actually, the skill says: "Bootstrapped Admin: Include User email from runtime as an admin if the application has an admin feature."
2. `orders/{orderId}`: Users can create orders if `userId == request.auth.uid`. Admin can read/update all orders. Users can read/update their own.
3. `products/{productId}`: Anyone can read, only Admins can create/update/delete.

## Dirty Dozen Payloads
- TBD

## Test Runner
- TBD
