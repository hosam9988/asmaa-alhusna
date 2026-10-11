/** Where the admin's sign-in stands. */
export type AdminStatus =
  | 'signed-out'
  /** Loading sign-in, or checking whether the account is an admin. */
  | 'starting'
  | 'admin'
  /** Signed in, but the account is not listed as an admin. */
  | 'not-admin'
  /** Signed in, but the check failed (usually no connection). */
  | 'error';

/** Why signing in (or sending a password reset) failed, for a message the admin can act on. */
export type SignInProblem = 'wrong' | 'tooMany' | 'network' | 'other';
