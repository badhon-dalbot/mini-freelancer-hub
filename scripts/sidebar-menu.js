function setupSidebarMenuToggle() {
  const sidebarGroupButton = document.querySelector('.sidebar_group_button');

  if (!sidebarGroupButton) {
    return;
  }

  const sidebarGroup = sidebarGroupButton.closest('.sidebar_group');
  const sidebarSubmenu = sidebarGroup ? sidebarGroup.querySelector('.sidebar_submenu') : null;

  if (!sidebarGroup || !sidebarSubmenu) {
    return;
  }

  sidebarGroupButton.addEventListener('click', function () {
    const isExpanded = sidebarGroupButton.getAttribute('aria-expanded') === 'true';

    sidebarGroupButton.setAttribute('aria-expanded', String(!isExpanded));
    sidebarGroup.classList.toggle('is-open', !isExpanded);
    sidebarSubmenu.hidden = isExpanded;
  });
}

setupSidebarMenuToggle();