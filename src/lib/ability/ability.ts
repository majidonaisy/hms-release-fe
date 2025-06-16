import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';
import { Role } from '../../context/CASLContext';
import { ACTIONS } from './actions';
import { SUBJECTS } from './subjects';



// Make the ability more flexible to accept strings
export type AppAbility = MongoAbility<[string, string]>;

export const createAbility = (role: Role): AppAbility => {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  switch (role) {
    case 'admin':
      can(ACTIONS.MANAGE, SUBJECTS.ALL);
      break;

    case 'manager':
      can(ACTIONS.READ, SUBJECTS.DASHBOARD);
      can([ACTIONS.READ, ACTIONS.CREATE, ACTIONS.UPDATE], SUBJECTS.ROOM);
      can([ACTIONS.READ, ACTIONS.CREATE, ACTIONS.UPDATE], SUBJECTS.GUEST);
      can([ACTIONS.READ, ACTIONS.CREATE, ACTIONS.UPDATE], SUBJECTS.RESERVATION);
      can([ACTIONS.READ, ACTIONS.CREATE], SUBJECTS.BILLING);
      cannot(ACTIONS.DELETE, SUBJECTS.ALL);
      break;

    case 'receptionist':
      can(ACTIONS.READ, SUBJECTS.DASHBOARD);
      can([ACTIONS.READ, ACTIONS.UPDATE], SUBJECTS.ROOM);
      can([ACTIONS.READ, ACTIONS.CREATE, ACTIONS.UPDATE], SUBJECTS.GUEST);
      can([ACTIONS.READ, ACTIONS.CREATE, ACTIONS.UPDATE], SUBJECTS.RESERVATION);
      can(ACTIONS.READ, SUBJECTS.BILLING);
      cannot([ACTIONS.CREATE, ACTIONS.DELETE], SUBJECTS.BILLING);
      cannot(ACTIONS.DELETE, SUBJECTS.ALL);
      break;

    case 'guest':
      can(ACTIONS.READ, SUBJECTS.DASHBOARD);
      cannot([ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE], SUBJECTS.ALL);
      break;

    default:
      // No permissions by default
      break;
  }

  return build();
};

// Helper function to get role permissions summary
export const getRolePermissions = (role: Role) => {
  const ability = createAbility(role);
  return {
    role,
    permissions: ability.rules,
  };
};

// Helper function to check if a role can perform an action on a subject
export const canAccess = (role: Role, action: string, subject: string): boolean => {
  const ability = createAbility(role);
  return ability.can(action, subject);
};

// Export default ability for guest users
export const defaultAbility = createAbility('guest');