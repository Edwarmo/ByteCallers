import { services } from '../../ServiceContainer';

export const useRepository = () => {
  return {
    users: services.repositories.users,
    calls: services.repositories.calls,
  };
};
