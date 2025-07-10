/**
 * 递归查找菜单项名称
 * @param menus 菜单数据数组  : MenuItem[]
 * @param index 需要查找的菜单项 index: string
 * @returns 返回对应 index 的菜单项名称，未找到则返回 null
 */
export function findMenuTitleByIndex(menus, index) {
    for (const menu of menus) {
        // 如果当前菜单项的 index 匹配，返回其 title
        if (menu.index === index) return { path: menu.index, title: menu.title, icon: menu.icon };
        // 如果有 groups，遍历每个 group
        if (menu.groups) {
            for (const group of menu.groups) {
                // 在 group.items 中查找 index 匹配的项，找到则返回其 title
                const found = group.items.find(item => item.index === index);
                if (found) return { path: found.index, title: found.title, icon: found.icon };
            }
        }
        // 如果有 subMenus，遍历每个 subMenu
        if (menu.subMenus) {
            for (const subMenu of menu.subMenus) {
                // 如果 subMenu 的 index 匹配，返回其 title
                if (subMenu.index === index) return { path: subMenu.index, title: subMenu.title, icon: subMenu.icon };
                // 在 subMenu.items 中查找 index 匹配的项，找到则返回其 title
                const found = subMenu.items.find(item => item.index === index);
                if (found) return { path: found.index, title: found.title, icon: found.icon };
            }
        }
        // 如果有 items，遍历 items 查找 index 匹配的项，找到则返回其 title
        if (menu.items) {
            const found = menu.items.find(item => item.index === index);
            if (found) return { path: found.index, title: found.title, icon: found.icon };
        }
    }
    return null;
}

/**
 * 查找指定 index 的上一级菜单 title
 * @param menus 菜单数据数组: MenuItem[]
 * @param index 需要查找的菜单项 index: string
 * @param parentTitle 当前递归的父级 title: string | null = null: string | null
 * @returns 返回上一级菜单的 title，未找到则返回 null
 */
export function findParentTitleByIndex(menus, index, parentTitle = null) {
    for (const menu of menus) {
        // 直接子项
        if (menu.index === index) return parentTitle;
        // groups
        if (menu.groups) {
            for (const group of menu.groups) {
                for (const item of group.items) {
                    if (item.index === index) return menu.title;
                }
            }
        }
        // subMenus
        if (menu.subMenus) {
            for (const subMenu of menu.subMenus) {
                if (subMenu.index === index) return menu.title;
                for (const item of subMenu.items) {
                    if (item.index === index) return subMenu.title;
                }
            }
        }
        // items
        if (menu.items) {
            for (const item of menu.items) {
                if (item.index === index) return menu.title;
            }
        }
        // 递归查找更深层级
        if (menu.groups) {
            for (const group of menu.groups) {
                const found = findParentTitleByIndex(group.items, index, menu.title);
                if (found) return found;
            }
        }
        if (menu.subMenus) {
            for (const subMenu of menu.subMenus) {
                const found = findParentTitleByIndex(subMenu.items, index, subMenu.title);
                if (found) return found;
            }
        }
        if (menu.items) {
            const found = findParentTitleByIndex(menu.items, index, menu.title);
            if (found) return found;
        }
    }
    return null;
}