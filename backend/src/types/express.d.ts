declare global {
  namespace Express {
    interface Request {
      authUser?: { id: string; email: string; name: string };
      website?: { _id: unknown; name: unknown; slug: unknown; databaseName: unknown; mediaBucket: unknown; active: unknown };
      membershipRole?: "owner" | "admin" | "editor" | "viewer";
    }
  }
}
export {};
