(function () {
  function safeParse(value) {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  function getStoredProfile() {
    return safeParse(localStorage.getItem('user')) || safeParse(localStorage.getItem('currentUser')) || null;
  }

  function getDisplayName(profile) {
    if (!profile) return 'User';
    if (typeof profile === 'string') {
      return profile.trim() || 'User';
    }
    const firstName = String(profile.firstName || profile.firstname || '').trim();
    const lastName = String(profile.lastName || profile.lastname || '').trim();
    const fullName = String(profile.name || profile.fullName || '').trim();

    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    if (fullName) {
      return fullName;
    }
    if (profile.email) {
      return String(profile.email).split('@')[0];
    }
    return 'User';
  }

  function getInitials(displayName) {
    const parts = String(displayName || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (!parts.length) {
      return 'MF';
    }

    return parts
      .slice(0, 3)
      .map(function (part) {
        return part.charAt(0);
      })
      .join('')
      .toUpperCase();
  }

  function syncProfileDisplay() {
    const profile = getStoredProfile();
    const displayName = getDisplayName(profile);
    const initials = getInitials(displayName);

    const sidebarAvatar = document.getElementById('sidebarAvatar');
    const sidebarName = document.getElementById('sidebarName');
    const topbarProfile = document.getElementById('topbarProfile');

    if (sidebarAvatar) {
      sidebarAvatar.textContent = initials;
    }
    if (sidebarName) {
      sidebarName.textContent = displayName;
    }
    if (topbarProfile) {
      topbarProfile.textContent = initials;
    }

    // Update greeting with first name
    const greetingTitle = document.getElementById('greetingTitle');
    if (greetingTitle) {
      const firstName = (profile && (profile.firstName || profile.firstname)) || displayName.split(/\s+/)[0] || 'there';
      greetingTitle.textContent = `Good morning, ${firstName}`;
    }
  }

  function setupProfileMenuToggle() {
    const profileMenuToggle = document.getElementById('profileMenuToggle');
    const profileSubmenu = document.getElementById('profileSubmenu');
    const profileChevron = document.getElementById('profileChevron');

    if (!profileMenuToggle || !profileSubmenu) return;

    profileMenuToggle.addEventListener('click', function () {
      const isHidden = profileSubmenu.hidden;
      profileSubmenu.hidden = !isHidden;

      if (!isHidden && profileChevron) {
        profileChevron.style.transform = 'rotate(0deg)';
      } else if (profileChevron) {
        profileChevron.style.transform = 'rotate(-180deg)';
      }
    });
  }

  // Sync on page load
  document.addEventListener('DOMContentLoaded', function () {
    syncProfileDisplay();
    setupProfileMenuToggle();
  });

  // Listen for storage changes (when settings page saves)
  window.addEventListener('storage', function (event) {
    if (event.key === 'user' || event.key === 'currentUser') {
      syncProfileDisplay();
    }
  });

  // Also check on page focus in case user was in another tab
  window.addEventListener('focus', function () {
    syncProfileDisplay();
  });

  // Expose for manual sync if needed
  window.syncProfileDisplay = syncProfileDisplay;
})();
