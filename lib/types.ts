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


export interface SWMS_Object {
  object_name: string;
  count: number;
  object_link?: string;
}


export interface ColumnData {
  id: string;
  cells: ColumnCell[];
}

export interface SubmenuGroup {
  id: string;
  title: string;
  lines: string[];
}

export interface ColumnCell {
  id: string;
  title: string;
  color?: string;
  groups: SubmenuGroup[];
}
