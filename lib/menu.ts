import { MenuItem } from "./types";

export function buildMenuTree(items: MenuItem[]): MenuItem[] { 
  //console.log('Building menu tree from items:', items); 
  const map = new Map<number, MenuItem>(); 
  const roots: MenuItem[] = []; 
  
  items.forEach(item => map.set(item.id, { ...item, type: "menu", children: [] })); 
  //console.log('Menu item map:', map);
  
  map.forEach(item => { 
    if (item.parent_name === "SYSCO_MENU") { 
      roots.push(item); 
    } else { 
      const parentItem = Array.from(map.values()).find(m => m.route === item.parent_name); 
      parentItem?.children?.push(item); 
    } 
  });

  const sortTree = (nodes: MenuItem[]) => { 
    nodes.sort((a, b) => a.sort_order - b.sort_order); 
    nodes.forEach(n => n.children && sortTree(n.children)); 
  };

  sortTree(Array.from(roots.values()));

  // Return roots sorted alphabetically or by custom logic
  return Array.from(roots.values());
}
