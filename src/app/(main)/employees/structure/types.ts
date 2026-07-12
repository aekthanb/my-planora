export type OrgMember = {
  id: string;
  name: string;
  position: string;
  department: string;
  children?: OrgMember[];
};
