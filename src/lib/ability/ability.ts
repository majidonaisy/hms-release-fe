import { AbilityBuilder, createAliasResolver, createMongoAbility } from "@casl/ability";

export interface Permission {
  subject: string;
  action: string;
}

export type AppAbility = ReturnType<typeof createAbility>;

// Create ability resolver for subject aliases
const resolveAction = createAliasResolver({
  modify: ["create", "update", "delete"],
  read: ["list", "show"],
});

export const createAbility = (permissions: Permission[]) => {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  // If no permissions, user is guest with no permissions
  if (!permissions || permissions.length === 0) {
    // Guest has no permissions by default
    return build({ resolveAction });
  }

  // Add permissions based on the actual permissions array
  permissions.forEach((permission) => {
    const { action, subject } = permission;
    can(action, subject);
  });

  return build({ resolveAction });
};

export const isAdminPermissions = (permissions: Permission[]): boolean => {
  return permissions.some((permission) => permission.action === "manage" && permission.subject === "all");
};

// Helper function to get all subjects user has access to
export const getAccessibleSubjects = (permissions: Permission[]): string[] => {
  const subjects = new Set<string>();

  permissions.forEach((permission) => {
    if (permission.subject === "all") {
      subjects.add("all");
    } else {
      subjects.add(permission.subject);
    }
  });

  return Array.from(subjects);
};

// Helper function to get all actions user can perform on a subject
export const getActionsForSubject = (permissions: Permission[], subject: string): string[] => {
  const actions = new Set<string>();

  permissions.forEach((permission) => {
    if (permission.subject === subject || permission.subject === "all") {
      if (permission.action === "manage") {
        actions.add("create");
        actions.add("read");
        actions.add("update");
        actions.add("delete");
      } else {
        actions.add(permission.action);
      }
    }
  });

  return Array.from(actions);
};
