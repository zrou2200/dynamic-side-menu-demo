export interface MenuItem {
  id: number;
  parent_name?: string;
  route: string;
  label: string;
  sort_order: number;
  object_url?: string;
  color?: string;
  type: 'menu' | 'submenu' | 'group'
  children?: MenuItem[];
}

export interface SYSPAR_Object {
  syspar: string;
  param_value: string;
  description: string;
  mapped_to: string;
  can_opco_change_it: string;
  config_help_text: string;
  sequence: number;
}


export interface SWMS_Object {
  object_name: string;
  count: number;
  object_link?: string;
}


export interface DOC_Object {
  type_code: string;
  value_code: string;
  description: string;
  mapped_to: string;
  create_user: string;
  create_date: string;
  sequence: number;
}


export interface ColumnData {
  id: string;
  cells: ColumnCell[];
}

export interface SubmenuGroup {
  id: string;
  title: string;
  lines: string[];
  maxVisible?: number;
}

export interface ColumnCell {
  id: string;
  title: string;
  color?: string;
  groups: SubmenuGroup[];
}
