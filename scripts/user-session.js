(function () {
  if (window.MFHUserSession) {
    return;
  }

  function safeParseUser(value) {
    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  function getUserFromStorage() {
    const storedUser = safeParseUser(localStorage.getItem('user')) || safeParseUser(localStorage.getItem('currentUser'));

    return storedUser || null;
  }

  function getDisplayName(user) {
    if (!user) {
      return 'Sayed Hasan Sami';
    }

    if (typeof user === 'string') {
      const trimmedUser = user.trim();
      return trimmedUser || 'Sayed Hasan Sami';
    }

    const firstName = String(user.firstname || user.firstName || '').trim();
    const lastName = String(user.lastname || user.lastName || '').trim();
    const fullName = String(user.name || user.fullName || '').trim();

    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }

    if (fullName) {
      return fullName;
    }

    if (user.email) {
      return String(user.email).split('@')[0];
    }

    return 'Sayed Hasan Sami';
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

  function getCurrentUser() {
    const storedUser = getUserFromStorage();
    const fallbackName = new URLSearchParams(window.location.search).get('name') || 'Sayed Hasan Sami';

    if (storedUser) {
      return {
        raw: storedUser,
        displayName: getDisplayName(storedUser)
      };
    }

    return {
      raw: null,
      displayName: fallbackName
    };
  }

  window.MFHUserSession = {
    getCurrentUser: getCurrentUser,
    getDisplayName: getDisplayName,
    getInitials: getInitials
  };
})();