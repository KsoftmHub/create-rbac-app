import { SetMetadata } from '@nestjs/common';
import { ResourceType } from '../types';

export const CHECK_POLICIES_KEY = 'check_policies';

export interface PolicyHandlerParams {
  action: string;
  resource: ResourceType;
  // Function to extract data from request for ABAC checks
  // e.g., (req) => req.body or req.params.id
  getData?: (req: any) => any;
}

export const CheckPermissions = (action: string, resource: ResourceType, getData?: (req: any) => any) =>
  SetMetadata(CHECK_POLICIES_KEY, { action, resource, getData } as PolicyHandlerParams);
